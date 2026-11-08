import {
  CharacterInfo,
  FIXED_PROPERTIES,
  FixedProperty,
} from '../../core/models/character-info.model';
import { createTestCharacter } from '../../core/testing/character.fixtures';
import { CardProperty } from '../../core/models/card-property.model';
import { withDraftChange, withStat } from './character-stat.util';

describe('withStat', () => {
  const character: CharacterInfo = createTestCharacter('a');

  it('offers exactly the fixed properties Leben, Ruestung and Tempo', () => {
    expect(FIXED_PROPERTIES).toEqual(['Leben', 'Ruestung', 'Tempo']);
  });

  it.each<FixedProperty>([...FIXED_PROPERTIES])('sets only %s', (stat) => {
    expect(withStat(character, stat, 9)).toEqual({ ...character, [stat]: 9 });
  });

  it('returns a new object', () => {
    expect(withStat(character, 'Leben', 12)).not.toBe(character);
  });

  it('stores Leben and Ruestung without the change of pending card moves', () => {
    const change: CardProperty[] = [
      { name: 'Leben', value: 30 },
      { name: 'Tempo', value: 5 },
    ];
    expect(withStat(character, 'Leben', 50, change).Leben).toBe(20);
    expect(withStat(character, 'Tempo', 7, change).Tempo).toBe(7);
  });

  it('keeps an invalid input such as an empty field', () => {
    const empty: number = null as unknown as number;
    expect(withStat(character, 'Leben', empty, [{ name: 'Leben', value: 3 }]).Leben).toBeNull();
  });
});

describe('withDraftChange', () => {
  const character: CharacterInfo = { ...createTestCharacter('a'), Leben: 20, Ruestung: 4 };

  it('adds Leben and Ruestung of pending moves, never below 0', () => {
    expect(
      withDraftChange(character, [
        { name: 'Leben', value: 30 },
        { name: 'Ruestung', value: -9 },
      ]),
    ).toEqual({ ...character, Leben: 50, Ruestung: 0 });
  });

  it('returns the character itself without change and keeps invalid inputs', () => {
    expect(withDraftChange(character, [])).toBe(character);
    const empty: CharacterInfo = { ...character, Leben: null as unknown as number };
    expect(withDraftChange(empty, [{ name: 'Leben', value: 3 }]).Leben).toBeNull();
  });
});
