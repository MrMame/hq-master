import { conditionChangeEntries, conditionEventEntry, damageEntry } from './game-log-entries.util';
import { DamageTypes } from '../../core/models/damage-types.model';
import {
  afterStart,
  createConditionedCharacter,
  createTestCondition,
} from '../../core/testing/condition.fixtures';

describe('game-log-entries.util', () => {
  it('turns a damage tick into a condition-damage entry at the tick moment', () => {
    const gameTime: string = afterStart(60).toISOString();
    expect(
      conditionEventEntry(
        { type: 'damage', characterId: 'a', conditionId: 'poison', gameTime, damage: 1 },
        'Ork',
      ),
    ).toEqual({
      type: 'condition-damage',
      gameTime,
      characterId: 'a',
      characterName: 'Ork',
      conditionId: 'poison',
      value: 1,
      text: 'Ork: 1 Schaden durch Gift',
    });
  });

  it('turns an expiry into a condition-expired entry without value', () => {
    const entry: ReturnType<typeof conditionEventEntry> = conditionEventEntry(
      { type: 'expired', characterId: 'a', conditionId: 'blind', gameTime: 'x' },
      undefined,
    );
    expect(entry.type).toBe('condition-expired');
    expect(entry).not.toHaveProperty('value');
    expect(entry.text).toBe('Blind bei Unbenannt abgelaufen');
  });

  it('lists set conditions first, then removed ones, and ignores kept ones', () => {
    const before: ReturnType<typeof createTestCondition>[] = [
      createTestCondition(),
      createTestCondition({ id: 'dazed' }),
    ];
    const after: ReturnType<typeof createConditionedCharacter> = {
      ...createConditionedCharacter('a', [
        createTestCondition({ damagePerTick: 5 }),
        createTestCondition({ id: 'blind' }),
      ]),
      name: 'Ork',
    };

    const entries: ReturnType<typeof conditionChangeEntries> = conditionChangeEntries(
      before,
      after,
      afterStart(5),
    );

    expect(entries.map((entry) => [entry.type, entry.conditionId, entry.text])).toEqual([
      ['condition-set', 'blind', 'Blind bei Ork gesetzt'],
      ['condition-removed', 'dazed', 'Benommen bei Ork entfernt'],
    ]);
    expect(entries[0]).toMatchObject({ gameTime: afterStart(5).toISOString(), characterId: 'a' });
  });

  it('describes manual damage with value and damage type', () => {
    const character: ReturnType<typeof createConditionedCharacter> = {
      ...createConditionedCharacter('a', []),
      name: 'Lyra',
    };
    expect(damageEntry(character, DamageTypes.Critical, 4, afterStart(0))).toEqual({
      type: 'damage',
      gameTime: afterStart(0).toISOString(),
      characterId: 'a',
      characterName: 'Lyra',
      value: 4,
      damageType: DamageTypes.Critical,
      text: 'Lyra: 4 Schaden auf Leben',
    });
  });
});
