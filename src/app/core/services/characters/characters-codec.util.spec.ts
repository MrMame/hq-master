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
