import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, it } from 'node:test';
import { formatModel, modelOfFiles, sessionModel, UNKNOWN_MODEL } from './transcript-model.mjs';

const line = (timestamp, model, extra = {}) =>
  JSON.stringify({ timestamp, message: { model }, ...extra });
const TRANSCRIPT = [
  line('2026-11-01T06:00:00Z', 'alt-modell', { effort: 'low', version: '1.0.0' }),
  line('2026-11-01T07:00:00Z', 'claude-opus-5-5', { effort: 'medium', version: '2.1.300' }),
  line('2026-11-01T07:01:00Z', '<synthetic>'),
  line('2026-11-01T07:02:00Z', '<synthetic>'),
  line('2026-11-01T07:03:00Z', 'claude-haiku-5-5'),
  line('2026-11-01T07:04:00Z', 'claude-opus-5-5', { effort: 'high', version: '2.1.314' }),
  'kein json',
  JSON.stringify({ message: { model: 'ohne-zeit' } }),
].join('\n');
const SINCE = new Date('2026-11-01T07:00:00Z');

describe('sessionModel', () => {
  it('takes the most frequent real model and the latest effort and version since the start', () => {
    assert.deepEqual(sessionModel([TRANSCRIPT], SINCE), {
      model: 'claude-opus-5-5',
      effort: 'high',
      version: '2.1.314',
    });
  });

  it('reports unknown values without entries', () => {
    assert.deepEqual(sessionModel([], SINCE), { ...UNKNOWN_MODEL });
  });
});

describe('modelOfFiles / formatModel', () => {
  it('reads transcripts from disk', () => {
    const path = join(mkdtempSync(join(tmpdir(), 'transcript-model-')), 's.jsonl');
    writeFileSync(path, TRANSCRIPT);
    assert.equal(modelOfFiles([path], SINCE).model, 'claude-opus-5-5');
  });

  it('appends the effort when known', () => {
    assert.equal(formatModel({ model: 'm', effort: 'high' }), 'm (high)');
    assert.equal(formatModel({ model: 'm', effort: null }), 'm');
  });
});
