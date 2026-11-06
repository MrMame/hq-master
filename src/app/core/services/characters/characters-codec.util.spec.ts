import { CharacterInfo } from '../../models/character-info.model';
import { CHARACTERS_CODEC, readConditions } from './characters-codec.util';
import { createTestCharacter } from '../../testing/character.fixtures';
import { createConditionedCharacter, createTestCondition } from '../../testing/condition.fixtures';

describe('CHARACTERS_CODEC', () => {
  it('stores the characters unchanged', () => {
    const characters: ReturnType<typeof createConditionedCharacter>[] = [
      createConditionedCharacter('a'),
    ];
    expect(CHARACTERS_CODEC.encode(characters)).toBe(characters);
  });

  it('keeps stored characters with their conditions', () => {
    const stored: unknown = JSON.parse(JSON.stringify([createConditionedCharacter('a')]));
    expect(CHARACTERS_CODEC.decode(stored)).toEqual([createConditionedCharacter('a')]);
  });

  it('gives characters of older sessions without conditions an empty list', () => {
    const older: Partial<CharacterInfo> = createTestCharacter('a');
    delete older.conditions;
    expect(CHARACTERS_CODEC.decode([older])).toEqual([createTestCharacter('a')]);
  });

  it('loads characters of older sessions without the round flag as not moved', () => {
    const older: Partial<CharacterInfo> = { ...createTestCharacter('a'), movedThisRound: true };
    delete older.movedThisRound;
    expect(CHARACTERS_CODEC.decode([older])).toEqual([createTestCharacter('a')]);
  });

  it('keeps a stored round flag', () => {
    const moved: CharacterInfo = { ...createTestCharacter('a'), movedThisRound: true };
    expect(CHARACTERS_CODEC.decode([moved])).toEqual([moved]);
  });

  it('uses the stored current values as maxima for characters of older sessions', () => {
    const older: Partial<CharacterInfo> = createTestCharacter('a');
    delete older.maxHealth;
    delete older.maxArmor;
    expect(CHARACTERS_CODEC.decode([older])).toEqual([
      { ...createTestCharacter('a'), maxHealth: 12, maxArmor: 2 },
    ]);
  });

  it('replaces invalid maxima with the current value', () => {
    const invalid: unknown = { ...createTestCharacter('a'), maxHealth: '20', maxArmor: -1 };
    expect(CHARACTERS_CODEC.decode([invalid])).toEqual([
      { ...createTestCharacter('a'), maxHealth: 12, maxArmor: 2 },
    ]);
  });

  // Über dem Grundmaximum ist erlaubt (Ausrüstungsbonus); begrenzt wird mit den Modifikatoren im EquipmentSyncService.
  it('keeps stored current values above the base maximum and raises negative ones to 0', () => {
    const above: CharacterInfo = { ...createTestCharacter('a'), health: 30, armor: -2 };
    expect(CHARACTERS_CODEC.decode([above])).toEqual([{ ...above, armor: 0 }]);
  });

  it('drops entries that are no objects', () => {
    expect(CHARACTERS_CODEC.decode([null, 'x', [1], createTestCharacter('a')])).toEqual([
      createTestCharacter('a'),
    ]);
  });

  it.each<[string, unknown]>([
    ['an object', { a: 1 }],
    ['a text', 'kaputt'],
  ])('falls back when the stored value is %s', (_case, stored) => {
    expect(CHARACTERS_CODEC.decode(stored)).toBeNull();
  });
});

describe('readConditions', () => {
  it('keeps valid conditions and drops invalid ones', () => {
    const valid: ReturnType<typeof createTestCondition> = createTestCondition();
    expect(
      readConditions([
        valid,
        null,
        { ...valid, id: 'frozen' },
        { ...valid, damagePerTick: '1' },
        { ...valid, startedAt: 5 },
      ]),
    ).toEqual([valid]);
  });

  it('returns an empty list when no list is stored', () => {
    expect(readConditions(undefined)).toEqual([]);
    expect(readConditions({})).toEqual([]);
  });
});
