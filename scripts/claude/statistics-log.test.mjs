import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, it } from 'node:test';
import { formatRunRow, parseLog, readLog, renderLog, writeLog } from './statistics-log.mjs';
import { createRun, createStand } from './testing/statistics.fixtures.mjs';

const log = {
  runs: [
    createRun({ expected: 2, changesHarness: true }),
    createRun({ date: '2026-11-02 10:00', slug: 'neu', added: null, removed: null }),
    createRun({ skill: 'interview-me', slug: 'thema', points: null }),
  ],
  stands: [
    createStand({ note: 'Regel | mit Pipe' }),
    createStand({ stand: 'bbbb2222', breaks: true, impact: 'offen' }),
  ],
};

describe('renderLog', () => {
  const text = renderLog(log);

  it('puts the overview above the runs and the harness stands', () => {
    const order = ['## Übersicht', '## Läufe', '## Harness-Stände'].map((title) =>
      text.indexOf(title),
    );
    assert.deepEqual(
      [...order].sort((left, right) => left - right),
      order,
    );
    assert.ok(order[0] > 0);
  });

  it('writes one row per run with diff, expected failures and the harness mark', () => {
    assert.match(
      text,
      /\| 2 \| \+100 \/ −20 \| 10 \| 1 \| 1 \| 40 \| 1 \(\+2\) \| 20\.000 \| 2\.000\.000 \|/,
    );
    assert.match(text, /aaaa1111 \(ändert Harness\)/);
    assert.match(text, /\| neu \| 2 \| – \|/);
  });

  it('marks measurement breaks in the harness table', () => {
    assert.match(text, /\| bbbb2222 \| [^|]+ \| [^|]+ \| [^|]+ \| ja \| offen \|/);
  });
});

describe('formatRunRow', () => {
  it('renders the header and the row with rework and index from the whole log', () => {
    const lines = formatRunRow(log, log.runs[0]).split('\n');
    assert.equal(lines.length, 3);
    assert.match(lines[0], /^\| Datum \| Skill \| Slug \|.*\| Nacharbeit \| Index \|$/);
    assert.match(
      lines[2],
      /^\| 2026-11-01 10:00 \| implement-refactor \| beispiel \|.*\| – \| 100 \|$/,
    );
  });
});

describe('parseLog', () => {
  it('reads back runs and stands that renderLog wrote', () => {
    assert.deepEqual(parseLog(renderLog(log)), log);
  });

  it('returns empty lists for an empty document', () => {
    assert.deepEqual(parseLog(''), { runs: [], stands: [] });
  });
});

describe('writeLog / readLog', () => {
  it('writes a prettier-formatted file that reads back unchanged', async () => {
    const path = join(mkdtempSync(join(tmpdir(), 'statistics-log-')), 'harness-statistics.md');
    assert.deepEqual(readLog(path), { runs: [], stands: [] });
    await writeLog(path, log);
    const written = readFileSync(path, 'utf8');
    assert.match(written, /^# Harness-Statistik\n/);
    assert.deepEqual(readLog(path), log);
    await writeLog(path, readLog(path));
    assert.equal(readFileSync(path, 'utf8'), written);
  });
});
