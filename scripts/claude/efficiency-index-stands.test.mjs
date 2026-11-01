import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { median, resolveStands } from './efficiency-index.mjs';
import { createStand } from './testing/statistics.fixtures.mjs';

describe('median', () => {
  it('handles odd and even counts and ignores missing values', () => {
    assert.equal(median([3, 1, 2]), 2);
    assert.equal(median([4, 1, null, 2, 3]), 2.5);
    assert.equal(median([null]), null);
  });
});

describe('resolveStands', () => {
  it('starts a new epoch at a measurement break and merges irrelevant stands', () => {
    const stands = [
      createStand({ stand: 'a' }),
      createStand({ stand: 'b', impact: 'nicht wirkungsrelevant' }),
      createStand({ stand: 'c', breaks: true, impact: 'nicht wirkungsrelevant' }),
      createStand({ stand: 'd', impact: 'offen' }),
    ];
    const resolved = resolveStands(stands);
    assert.deepEqual(
      ['a', 'b', 'c', 'd'].map((name) => [
        resolved.get(name).epoch,
        resolved.get(name).group.stand,
      ]),
      [
        [0, 'a'],
        [0, 'a'],
        [1, 'c'],
        [1, 'd'],
      ],
    );
  });
});
