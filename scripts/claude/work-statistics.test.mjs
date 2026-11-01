import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, it } from 'node:test';
import { readLog } from './statistics-log.mjs';

const SESSION = 'abcdef12-0000-0000-0000-000000000000';
const dir = mkdtempSync(join(tmpdir(), 'work-statistics-'));
const statistics = join(dir, 'harness-statistics.md');
const state = join(dir, 'harness-statistics.state.json');
const activity = join(dir, 'activity.log');
writeFileSync(
  activity,
  [
    '2026-11-01 10:00:00  abcdef12  PROMPT /implement-refactor beispiel',
    '2026-11-01 10:01:00  abcdef12  Read src/main.ts',
    '2026-11-01 10:02:00  abcdef12  AskUserQuestion Freigabe?',
  ].join('\n'),
);

function run(...args) {
  const result = spawnSync(
    process.execPath,
    ['scripts/claude/work-statistics.mjs', '--statistics', statistics, '--state', state, ...args],
    {
      encoding: 'utf8',
      env: { ...process.env, CLAUDE_CODE_SESSION_ID: SESSION, CLAUDE_CONFIG_DIR: dir },
    },
  );
  return { code: result.status, out: result.stdout, err: result.stderr };
}

describe('work-statistics CLI', () => {
  it('rejects an unknown harness impact and invalid points', () => {
    assert.match(run('--harness-impact', 'egal').err, /--harness-impact muss/);
    const points = run('--skill', 'implement-refactor', '--points', 'zwei', '--log', activity);
    assert.equal(points.code, 1);
    assert.match(points.err, /--points muss eine Zahl sein/);
  });

  it('needs a slug to append and fails without a run in the log', () => {
    assert.match(run('--skill', 'implement-refactor', '--append', '--log', activity).err, /--slug/);
    assert.match(run('--skill', 'interview-me', '--log', activity).err, /Kein Lauf im Log/);
  });

  it('reports the run and a new harness stand without writing the log', () => {
    const { code, out } = run('--skill', 'implement-refactor', '--log', activity);
    assert.equal(code, 0);
    assert.match(out, /\| Runden \| 1 \| Rückfragen 1 \|/);
    assert.match(out, /Harness-Stand: neu [0-9a-f]{8} – Messbruch: erster Stand/);
    assert.match(out, /Zeile für das Statistiklog \(Vorschau\):\n\n\| Datum \| Skill \|/);
    assert.match(out, /\| implement-refactor \| – \| – \| \+\d+ \/ −\d+ \|/);
    assert.equal(existsSync(statistics), false);
  });

  it('appends a run with classification, then keeps the stand on the next run', () => {
    const args = ['--skill', 'implement-refactor', '--log', activity, '--slug', 'beispiel'];
    const first = run(...args, '--points', '2', '--append', '--harness-impact', 'wirkungsrelevant');
    assert.equal(first.code, 0, first.err);
    assert.match(first.out, /Statistiklog ergänzt/);
    assert.match(
      first.out,
      /Zeile im Statistiklog:\n\n\| Datum .*\n.*\n\| .* \| beispiel \| 2 \| .* \| – \| \d+ \|/,
    );
    const snapshot = JSON.parse(readFileSync(state, 'utf8'));
    assert.match(snapshot.stand, /^[0-9a-f]{8}$/);

    const second = run(...args, '--append');
    assert.match(second.out, /Harness-Stand: [0-9a-f]{8} \(unverändert\)/);
    const log = readLog(statistics);
    assert.deepEqual(
      log.runs.map((entry) => [entry.points, entry.questions, entry.stand]),
      [
        [2, 1, log.runs[0].stand],
        [null, 1, snapshot.stand],
      ],
    );
    assert.equal(log.stands.length, 1);
    assert.equal(log.stands[0].impact, 'wirkungsrelevant');
  });

  it('classifies the latest stand and regenerates the overview', () => {
    assert.equal(
      run('--harness-note', 'Neue Regel', '--harness-impact', 'nicht wirkungsrelevant').code,
      0,
    );
    assert.equal(readLog(statistics).stands[0].note, 'Neue Regel');
    writeFileSync(
      statistics,
      readFileSync(statistics, 'utf8').replace(/## Übersicht[\s\S]*?## Läufe/, '## Läufe'),
    );
    assert.equal(run('--overview').code, 0);
    assert.match(readFileSync(statistics, 'utf8'), /## Übersicht\n\nWerte je umgesetztem Punkt/);
  });

  it('refuses to import legacy runs into an existing log', () => {
    assert.match(run('--import-legacy').err, /existiert bereits/);
  });
});
