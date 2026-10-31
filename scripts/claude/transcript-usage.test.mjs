import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, it } from 'node:test';
import {
  EMPTY_USAGE,
  findTranscripts,
  sumUsage,
  totalTokens,
  usageOfFiles,
} from './transcript-usage.mjs';

const usage = (output) => ({
  input_tokens: 1,
  cache_creation_input_tokens: 10,
  cache_read_input_tokens: 100,
  output_tokens: output,
});
const entry = (id, timestamp, output) =>
  JSON.stringify({ timestamp, message: { id, usage: usage(output) } });

const TRANSCRIPT = [
  entry('msg_old', '2026-10-31T06:00:00Z', 999),
  entry('msg_a', '2026-10-31T07:00:01Z', 5),
  entry('msg_a', '2026-10-31T07:00:02Z', 5),
  JSON.stringify({ timestamp: '2026-10-31T07:00:03Z', message: { role: 'user', content: 'ja' } }),
  'kein json',
  '',
  entry('msg_b', '2026-10-31T07:01:00Z', 7),
].join('\n');
const SINCE = new Date('2026-10-31T07:00:00Z');

describe('sumUsage', () => {
  it('counts each message once and ignores messages before the start', () => {
    assert.deepEqual(sumUsage(TRANSCRIPT, SINCE), {
      messages: 2,
      input: 2,
      cacheWrite: 20,
      cacheRead: 200,
      output: 12,
    });
  });

  it('treats missing usage fields as zero', () => {
    const line = JSON.stringify({
      timestamp: '2026-10-31T07:00:01Z',
      message: { id: 'x', usage: {} },
    });
    assert.deepEqual(sumUsage(line, SINCE), { ...EMPTY_USAGE, messages: 1 });
  });

  it('adds all token kinds to the total', () => {
    assert.equal(totalTokens(sumUsage(TRANSCRIPT, SINCE)), 234);
  });
});

describe('findTranscripts / usageOfFiles', () => {
  const projects = mkdtempSync(join(tmpdir(), 'work-stats-'));
  const project = join(projects, 'f--Projekte---Web-hq-master');
  mkdirSync(join(project, 'abc', 'subagents'), { recursive: true });
  mkdirSync(join(projects, 'anderes-projekt'));
  writeFileSync(join(project, 'abc.jsonl'), TRANSCRIPT);
  writeFileSync(join(project, 'abc', 'subagents', 'agent-1.jsonl'), entry('s1', SINCE, 3));
  writeFileSync(join(project, 'abc', 'subagents', 'agent-1.meta.json'), '{}');

  it('finds the main transcript and the subagent transcripts of the session', () => {
    const found = findTranscripts('abc', projects);
    assert.deepEqual(found.main, [join(project, 'abc.jsonl')]);
    assert.deepEqual(found.sub, [join(project, 'abc', 'subagents', 'agent-1.jsonl')]);
  });

  it('returns no transcripts for an unknown session or a missing folder', () => {
    assert.deepEqual(findTranscripts('xyz', projects), { main: [], sub: [] });
    assert.deepEqual(findTranscripts('abc', join(projects, 'fehlt')), { main: [], sub: [] });
  });

  it('sums the usage of several files', () => {
    const found = findTranscripts('abc', projects);
    assert.equal(usageOfFiles([...found.main, ...found.sub], SINCE).output, 15);
    assert.deepEqual(usageOfFiles([], SINCE), EMPTY_USAGE);
  });
});
