import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  countPoints,
  gitDiffOf,
  importLegacyRuns,
  LEGACY_STANDS,
  parseStatistics,
} from './legacy-import.mjs';

const AI_LOG = [
  '## Letzte Änderungen',
  '',
  '### (2026-11-01 08:28) - Refactoring: Leiste (quick-access-bar #1–#6)',
  '',
  '- **Was wurde gemacht:** …',
  '- **Statistik:** 10 min · 1 Runden · 1 Rückfragen · 52 Tools · Dateien 6 neu / 7 geändert · ' +
    '5 Fehlschläge · Tokens 3.803.996 (Output 28.301)',
  '',
  '### (2026-10-31 21:33) - Feature: Tokens (Zellgröße) (grid-sized-character-models #1–#7)',
  '',
  '- **Statistik:** 20 min · 1 Runden · 1 Rückfragen · 117 Tools · Dateien 3 neu / 24 geändert · ' +
    '4 Fehlschläge (+1 erwartet) · Tokens 8.567.528 (Output 47.456) · Subagenten 1 (Tokens 1.000)',
  '',
  '### (2026-10-28 17:30) - Feature: Ohne Statistik (sidebar-collapsible-sections #1–#9)',
  '',
  '- **Was wurde gemacht:** …',
  '',
  '### (2026-10-31 08:15) - Refactoring: Header (responsive-app-header #1–#4)',
  '- **Statistik:** 8 min · 2 Runden · 0 Rückfragen · 28 Tools · Dateien 0 neu / 4 geändert · ' +
    '1 Fehlschläge · Tokens 1.736.458 (Output 10.579)',
].join('\n');

describe('countPoints', () => {
  it('counts ranges, single points and lists', () => {
    assert.equal(countPoints('#1–#6'), 6);
    assert.equal(countPoints('#1–#6, #8, #9'), 8);
    assert.equal(countPoints('#2'), 1);
    assert.equal(countPoints('#10 Teil 1'), 1);
    assert.equal(countPoints('ohne'), 0);
  });
});

describe('parseStatistics', () => {
  it('reads expected failures and adds subagent tokens', () => {
    const parsed = parseStatistics(
      '20 min · 1 Runden · 1 Rückfragen · 117 Tools · 4 Fehlschläge (+1 erwartet) · ' +
        'Tokens 8.567.528 (Output 47.456) · Subagenten 1 (Tokens 1.000)',
    );
    assert.deepEqual(parsed, {
      minutes: 20,
      prompts: 1,
      questions: 1,
      tools: 117,
      failures: 4,
      expected: 1,
      output: 47456,
      tokens: 8568528,
    });
  });
});

describe('importLegacyRuns', () => {
  const diffs = { 'quick-access-bar': { added: 366, removed: 136 } };
  const diffOf = (heading) => diffs[/\(([a-z-]+) #/.exec(heading)[1]] ?? null;
  const runs = importLegacyRuns(AI_LOG, diffOf);

  it('takes over only entries with statistics, oldest first', () => {
    assert.deepEqual(
      runs.map((run) => run.slug),
      ['responsive-app-header', 'grid-sized-character-models', 'quick-access-bar'],
    );
  });

  it('derives skill, points, diff and the stand before or after the measurement break', () => {
    const [header, grid, bar] = runs;
    assert.equal(header.skill, 'implement-refactor');
    assert.equal(header.stand, 'alt-1');
    assert.equal(grid.skill, 'implement-feature');
    assert.equal(grid.stand, 'alt-2');
    assert.equal(grid.points, 7);
    assert.equal(grid.added, null);
    assert.deepEqual([bar.added, bar.removed, bar.points, bar.tools], [366, 136, 6, 52]);
    assert.equal(bar.model, 'unbekannt');
  });

  it('marks the second legacy stand as a measurement break', () => {
    assert.deepEqual(
      LEGACY_STANDS.map((stand) => [stand.stand, stand.breaks]),
      [
        ['alt-1', false],
        ['alt-2', true],
      ],
    );
  });
});

describe('gitDiffOf', () => {
  it('finds the implementation commit of a heading in this repository', () => {
    const heading =
      '### (2026-10-31 08:15) - Refactoring: Navigationsleiste von links nach rechts, umbrechend ' +
      'statt über den Bildschirmrand (responsive-app-header #1–#4)';
    assert.deepEqual(gitDiffOf(heading), { added: 30, removed: 22 });
    assert.equal(gitDiffOf('### gibt es nicht'), null);
  });
});
