import { MockInstance } from 'vitest';
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

  it('drops the type and the abilities of older sessions', () => {
    const older: unknown = [
      { ...createTestCharacter('a'), type: 'Feuer', abilities: ['Erdbeben'] },
    ];
    const [decoded]: CharacterInfo[] = CHARACTERS_CODEC.decode(older) ?? [];

    expect(decoded).toEqual(createTestCharacter('a'));
    expect(Object.keys(decoded)).not.toContain('type');
    expect(Object.keys(decoded)).not.toContain('abilities');
  });

  it('keeps a stored round flag', () => {
    const moved: CharacterInfo = { ...createTestCharacter('a'), movedThisRound: true };
    expect(CHARACTERS_CODEC.decode([moved])).toEqual([moved]);
  });

  it('drops the maxima, attack and defense of older sessions', () => {
    const older: unknown = [
      { ...createTestCharacter('a'), maxHealth: 10, maxArmor: 4, attack: 3, defense: 4 },
    ];
    const [decoded]: CharacterInfo[] = CHARACTERS_CODEC.decode(older) ?? [];

    expect(decoded).toEqual(createTestCharacter('a'));
    expect(Object.keys(decoded)).not.toContain('maxHealth');
    expect(Object.keys(decoded)).not.toContain('maxArmor');
    expect(Object.keys(decoded)).not.toContain('attack');
    expect(Object.keys(decoded)).not.toContain('defense');
  });

  it('keeps high current values and makes negative ones and fractions whole numbers of at least 0', () => {
    const stored: CharacterInfo = { ...createTestCharacter('a'), Leben: 300, Ruestung: -2 };
    expect(CHARACTERS_CODEC.decode([{ ...stored, Leben: 300.5 }])).toEqual([
      { ...stored, Ruestung: 0 },
    ]);
  });

  it.each<[string, Record<string, unknown>]>([
    ['only the old names', { health: 7, armor: 3, speed: 5 }],
    ['no Tempo', { Leben: 7, Ruestung: 3 }],
    ['a text in Leben', { Leben: '7', Ruestung: 3, Tempo: 5 }],
    ['an infinite Ruestung', { Leben: 7, Ruestung: Infinity, Tempo: 5 }],
  ])('drops a character with %s and warns', (_case, values) => {
    const warn: MockInstance<(...data: unknown[]) => void> = vi
      .spyOn(console, 'warn')
      .mockImplementation(() => undefined);
    const { Leben, Ruestung, Tempo, ...rest } = createTestCharacter('old');
    const stored: unknown[] = [{ ...rest, ...values }, createTestCharacter('b')];

    expect(CHARACTERS_CODEC.decode(stored)).toEqual([createTestCharacter('b')]);
    expect(warn).toHaveBeenCalledExactlyOnceWith(expect.stringContaining('„old“'));
    expect([Leben, Ruestung, Tempo]).toEqual([12, 2, 5]);
    warn.mockRestore();
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
