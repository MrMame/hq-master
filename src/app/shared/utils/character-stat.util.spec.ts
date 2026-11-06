import { CharacterInfo } from '../../core/models/character-info.model';
import { createTestCharacter } from '../../core/testing/character.fixtures';
import { CharacterStat, withStat } from './character-stat.util';

describe('withStat', () => {
  const character: CharacterInfo = createTestCharacter('a');

  it.each<CharacterStat>(['health', 'maxHealth', 'armor', 'maxArmor', 'attack'])(
    'sets only %s when editing an existing character',
    (stat) => {
      expect(withStat(character, stat, 9, false)).toEqual({ ...character, [stat]: 9 });
    },
  );

  it.each<[CharacterStat, CharacterStat]>([
    ['health', 'maxHealth'],
    ['armor', 'maxArmor'],
  ])('lets the maximum follow %s for a new character', (stat, maximum) => {
    expect(withStat(character, stat, 9, true)).toEqual({ ...character, [stat]: 9, [maximum]: 9 });
  });

  it('changes a maximum of a new character without touching the current value', () => {
    expect(withStat(character, 'maxHealth', 20, true)).toEqual({ ...character, maxHealth: 20 });
  });

  it('keeps the other maximum for stats without one', () => {
    expect(withStat(character, 'speed', 1, true)).toEqual({ ...character, speed: 1 });
  });

  it('returns a new object', () => {
    expect(withStat(character, 'health', 12, false)).not.toBe(character);
  });
});
