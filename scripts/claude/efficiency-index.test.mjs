import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { analyze, efficiencyIndex, perPoint, reworkGroups } from './efficiency-index.mjs';
import { createRun, createStand } from './testing/statistics.fixtures.mjs';

describe('perPoint', () => {
  it('divides metrics by points and offsets failures and interactions', () => {
    const metrics = perPoint({ lead: createRun({ prompts: 2, questions: 3 }), members: [] });
    assert.deepEqual(metrics, {
      minutes: 5,
      tools: 20,
      tokens: 1000000,
      output: 10000,
      failures: 1,
      interactions: 2,
      diff: 60,
    });
  });

  it('never lets the interaction term drop below one', () => {
    const metrics = perPoint({
      lead: createRun({ points: 1, prompts: 1, questions: 0 }),
      members: [],
    });
    assert.equal(metrics.interactions, 1);
  });

  it('sums rework runs but keeps the points of the first run', () => {
    const metrics = perPoint({
      lead: createRun(),
      members: [createRun({ points: 1, added: null })],
    });
    assert.equal(metrics.tools, 40);
    assert.equal(metrics.diff, null);
  });
});

describe('efficiencyIndex', () => {
  const reference = { tokens: 100, tools: 10, minutes: 10, failures: 1, interactions: 1 };

  it('is 100 at the median and higher for cheaper runs', () => {
    assert.equal(efficiencyIndex(reference, reference), 100);
    assert.ok(efficiencyIndex({ ...reference, tokens: 50 }, reference) > 100);
    assert.equal(
      efficiencyIndex({ ...reference, tokens: 50 }, reference),
      Math.round(100 * 2 ** 0.3),
    );
  });

  it('skips metrics without a positive value', () => {
    assert.equal(efficiencyIndex({ ...reference, minutes: 0 }, reference), 100);
  });
});

describe('reworkGroups / analyze', () => {
  const stands = [createStand({ stand: 'a' }), createStand({ stand: 'b' })];
  const first = createRun({ slug: 'x', date: '2026-11-01 08:00', stand: 'a' });
  const rework = createRun({ slug: 'x', date: '2026-11-02 08:00', stand: 'b', points: 1 });
  const other = createRun({ slug: 'y', stand: 'b', tools: 80 });
  const interview = createRun({ skill: 'interview-me', slug: 'z', points: null, stand: 'b' });
  const runs = [first, other, rework, interview];

  it('groups later runs with the same slug under the first run and skips runs without points', () => {
    const groups = reworkGroups(runs);
    assert.equal(groups.length, 2);
    assert.deepEqual(groups[0].members, [rework]);
  });

  it('labels rework on both runs and shows the index only on the leading run', () => {
    const analysis = analyze(runs, stands);
    assert.equal(analysis.reworkLabel(first), 'ja (2026-11-02 08:00)');
    assert.equal(analysis.reworkLabel(rework), 'zu 2026-11-01 08:00');
    assert.equal(analysis.reworkLabel(other), '–');
    assert.equal(analysis.indexLabel(rework), '–');
    assert.equal(analysis.indexLabel(interview), '–');
  });

  it('rates a run with rework less efficient than a comparable run without', () => {
    const analysis = analyze(runs, stands);
    assert.ok(Number(analysis.indexLabel(first)) < Number(analysis.indexLabel(other)));
  });

  it('counts the rework in the stand of the earlier run', () => {
    const { summaries } = analyze(runs, stands);
    assert.deepEqual(
      summaries.map((summary) => [summary.stand.stand, summary.count]),
      [
        ['a', 1],
        ['b', 1],
      ],
    );
  });

  it('compares only runs of the same measurement procedure', () => {
    const broken = [createStand({ stand: 'a' }), createStand({ stand: 'b', breaks: true })];
    const { summaries } = analyze([first, other], broken);
    assert.deepEqual(
      summaries.map((summary) => [summary.epoch, summary.index]),
      [
        [0, 100],
        [1, 100],
      ],
    );
  });

  it('reports stands without runs without an index', () => {
    const { summaries } = analyze([], stands);
    assert.deepEqual(
      summaries.map((summary) => summary.index),
      [null, null],
    );
  });
});
