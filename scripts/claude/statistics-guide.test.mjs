// Die Erläuterungen im Statistiklog nennen Zahlen und Listen aus dem Code; dieser Test hält sie synchron.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, it } from 'node:test';
import {
  efficiencyIndex,
  median,
  perPoint,
  PROVISIONAL_BELOW,
  WEIGHTS,
} from './efficiency-index.mjs';
import { MEASUREMENT_FILES } from './harness-files.mjs';
import { renderLog } from './statistics-log.mjs';
import { createRun } from './testing/statistics.fixtures.mjs';

const guide = readFileSync(new URL('./statistics-guide.md', import.meta.url), 'utf8');
const reference = { tokens: 600000, tools: 12, minutes: 2.5, failures: 0.5, interactions: 0.25 };
const runA = createRun({
  points: 4,
  minutes: 8,
  prompts: 1,
  questions: 1,
  tools: 40,
  failures: 1,
  tokens: 2000000,
});

describe('statistics guide', () => {
  it('is rendered as the last section of the statistics log', () => {
    const text = renderLog({ runs: [], stands: [] });
    assert.ok(text.indexOf('## Erläuterungen') > text.indexOf('## Harness-Stände'));
    assert.ok(text.includes(guide.trim()));
  });

  it('computes the worked examples A and B like the index code', () => {
    const metricsA = perPoint({ lead: runA, members: [] });
    assert.deepEqual(
      [metricsA.tokens, metricsA.tools, metricsA.minutes, metricsA.failures, metricsA.interactions],
      [500000, 10, 2, 0.5, 0.25],
    );
    assert.equal(efficiencyIndex(metricsA, reference), 115);
    const metricsB = perPoint({ lead: { ...runA, failures: 3 }, members: [] });
    assert.equal(efficiencyIndex(metricsB, reference), 103);
    assert.match(guide, /≈ \*\*115\*\*/);
    assert.match(guide, /≈ \*\*103\*\*/);
  });

  it('computes the rework and median examples like the code', () => {
    const rework = perPoint({ lead: runA, members: [createRun({ tools: 20 })] });
    assert.equal(rework.tools, 15);
    assert.equal(median([8, 10, 15]), 10);
    assert.equal(median([8, 10, 12, 40]), 11);
  });

  it('names the weights, the provisional threshold and all measurement files', () => {
    for (const weight of Object.values(WEIGHTS)) {
      assert.match(guide, new RegExp(`\\| ${Math.round(weight * 100)} %`));
    }
    assert.match(guide, new RegExp(`weniger als ${PROVISIONAL_BELOW} Läufe`));
    for (const path of MEASUREMENT_FILES) {
      assert.ok(guide.includes(path.split('/').at(-1)), path);
    }
  });
});
