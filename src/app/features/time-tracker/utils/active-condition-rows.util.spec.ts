import { ActiveCondition } from '../../../core/models/character-condition.model';
import { activeConditionRows } from './active-condition-rows.util';
import { ActiveConditionRow } from '../models/active-condition-row.model';
import {
  afterStart,
  createConditionedCharacter,
  createTestCondition,
} from '../../../core/testing/condition.fixtures';
import { createTestCharacter } from '../../../core/testing/character.fixtures';

const blind: (durationSeconds: number) => ActiveCondition = (
  durationSeconds: number,
): ActiveCondition =>
  createTestCondition({ id: 'blind', intervalSeconds: 0, damagePerTick: 0, durationSeconds });

describe('activeConditionRows', () => {
  it('builds one row per active condition with next tick and remaining time', () => {
    const rows: ActiveConditionRow[] = activeConditionRows(
      [{ ...createConditionedCharacter('a'), name: 'Ork' }],
      afterStart(30),
    );

    expect(rows).toEqual([
      {
        characterId: 'a',
        characterName: 'Ork',
        conditionId: 'poison',
        label: 'Gift',
        icon: './img/conditions/poison.svg',
        damagePerTick: 1,
        nextTick: '12:01:00',
        remaining: '9:30',
      },
    ]);
  });

  it('sorts by the next tick, then conditions without tick by remaining time', () => {
    const rows: ActiveConditionRow[] = activeConditionRows(
      [
        createConditionedCharacter('a', [blind(0), createTestCondition()]),
        createConditionedCharacter('b', [
          blind(60),
          createTestCondition({ lastTickAt: afterStart(-30).toISOString() }),
        ]),
        createConditionedCharacter('c', [blind(20)]),
      ],
      afterStart(10),
    );

    expect(rows.map((row) => [row.characterId, row.nextTick, row.remaining])).toEqual([
      ['b', '12:00:30', '9:50'],
      ['a', '12:01:00', '9:50'],
      ['c', '–', '0:10'],
      ['b', '–', '0:50'],
      ['a', '–', 'unbegrenzt'],
    ]);
  });

  it('returns no rows for characters without conditions', () => {
    expect(activeConditionRows([createTestCharacter('a')], afterStart(0))).toEqual([]);
  });
});
