import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { analyze } from './efficiency-index.mjs';
import { formatOverview } from './format-overview.mjs';
import { createRun, createStand } from './testing/statistics.fixtures.mjs';

describe('formatOverview', () => {
  it('says so when there are no stands yet', () => {
    assert.equal(formatOverview(analyze([], [])), 'Noch keine Läufe.');
  });

  it('renders one table per measurement procedure with medians per point', () => {
    const stands = [
      createStand({ stand: 'a' }),
      createStand({ stand: 'b', breaks: true, since: '2026-11-02 09:00' }),
    ];
    const runs = [
      createRun({ stand: 'a', slug: 'eins' }),
      createRun({ stand: 'b', slug: 'zwei', minutes: 5 }),
      createRun({ stand: 'b', slug: 'drei', minutes: 5 }),
      createRun({ stand: 'b', slug: 'vier', minutes: 5 }),
    ];
    const text = formatOverview(analyze(runs, stands));
    assert.match(text, /### Messverfahren 1 \(ab a, 2026-11-01 09:00\)/);
    assert.match(text, /### Messverfahren 2 \(ab b, 2026-11-02 09:00\)/);
    assert.match(
      text,
      /\| a \| 2026-11-01 09:00 \| 1 \| 5 \| 20 \| 1\.000\.000 \| 10\.000 \| 1 \| 60 \| 100 \(vorläufig\) \|/,
    );
    assert.match(text, /\| b \| 2026-11-02 09:00 \| 3 \| 2,5 \| 20 \| .* \| 100 \|/);
  });

  it('shows dashes for stands without runs', () => {
    const text = formatOverview(analyze([], [createStand()]));
    assert.match(
      text,
      /\| aaaa1111 \| 2026-11-01 09:00 \| 0 \| – \| – \| – \| – \| – \| – \| – \|/,
    );
  });
});
