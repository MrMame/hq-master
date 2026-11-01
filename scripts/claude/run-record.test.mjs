import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { buildRun, classifyLatest, recordRun, stamp } from './run-record.mjs';
import { createRun, createStand } from './testing/statistics.fixtures.mjs';

const usage = (output, cacheRead) => ({ messages: 1, input: 1, cacheWrite: 0, cacheRead, output });
const stats = {
  activity: {
    start: new Date('2026-11-01T10:00:00'),
    prompts: 2,
    questions: 1,
    main: { total: 30, byName: {} },
    failures: { total: 2, byKind: {}, expected: 1 },
  },
  usage: { main: usage(100, 899), sub: usage(10, 89) },
  end: new Date('2026-11-01T10:25:00'),
};
const snapshot = { stand: 'aaaa1111', model: 'm', version: '1', files: { a: '1', b: '1' } };
const current = { stand: 'bbbb2222', model: 'm', version: '1', files: { a: '1', b: '2' } };

describe('buildRun', () => {
  it('takes all numbers from the statistics, including subagent tokens', () => {
    const run = buildRun({
      stats,
      skill: 'implement-refactor',
      slug: 'x',
      points: 3,
      diff: { added: 50, removed: 5 },
      model: { model: 'claude-opus-5-5', effort: 'high' },
    });
    assert.deepEqual(run, {
      ...createRun({ slug: 'x', points: 3, added: 50, removed: 5 }),
      date: '2026-11-01 10:25',
      minutes: 25,
      prompts: 2,
      tools: 30,
      failures: 2,
      expected: 1,
      output: 110,
      tokens: 1100,
      model: 'claude-opus-5-5 (high)',
      stand: '',
    });
  });

  it('leaves points empty for interview runs', () => {
    const run = buildRun({ stats, skill: 'interview-me', slug: 't', diff: {}, model: {} });
    assert.equal(run.points, null);
  });
});

describe('recordRun', () => {
  const log = { runs: [], stands: [createStand()] };
  const run = createRun({ stand: '' });

  it('keeps the stand when the harness is unchanged', () => {
    const result = recordRun(log, { run, snapshot, current: snapshot, changesHarness: true });
    assert.equal(result.newStand, null);
    assert.equal(result.log.runs[0].stand, 'aaaa1111');
    assert.equal(result.log.runs[0].changesHarness, false);
  });

  it('adds a new stand with the classification passed along', () => {
    const classification = {
      impact: 'wirkungsrelevant',
      note: 'Neue Regel',
      hypothesis: 'weniger Tools',
    };
    const result = recordRun(log, {
      run,
      snapshot,
      current,
      changesHarness: false,
      classification,
    });
    assert.equal(result.log.runs[0].stand, 'bbbb2222');
    assert.equal(result.log.stands.at(-1).note, 'Neue Regel');
    assert.equal(result.snapshot, current);
  });

  it('counts a run that changed the harness itself to the previous stand', () => {
    const result = recordRun(log, { run, snapshot, current, changesHarness: true });
    assert.equal(result.log.runs[0].stand, 'aaaa1111');
    assert.equal(result.log.runs[0].changesHarness, true);
    assert.equal(result.log.stands.at(-1).stand, 'bbbb2222');
  });

  it('uses the new stand when there is no previous one', () => {
    const empty = { runs: [], stands: [] };
    const result = recordRun(empty, { run, snapshot: null, current, changesHarness: true });
    assert.equal(result.log.runs[0].stand, 'bbbb2222');
  });
});

describe('classifyLatest', () => {
  it('updates only the given fields of the latest stand', () => {
    const log = {
      runs: [],
      stands: [createStand({ stand: 'a' }), createStand({ stand: 'b', impact: 'offen' })],
    };
    const updated = classifyLatest(log, { impact: 'nicht wirkungsrelevant' });
    assert.equal(updated.stands[0], log.stands[0]);
    assert.deepEqual(updated.stands[1], { ...log.stands[1], impact: 'nicht wirkungsrelevant' });
  });

  it('fails without any stand', () => {
    assert.throws(() => classifyLatest({ runs: [], stands: [] }, {}), /Kein Harness-Stand/);
  });
});

describe('stamp', () => {
  it('formats local time with leading zeros', () => {
    assert.equal(stamp(new Date('2026-01-02T03:04:00')), '2026-01-02 03:04');
  });
});
