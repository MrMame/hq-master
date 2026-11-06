import { CharacterInfo } from '../../models/character-info.model';
import { createTestCharacter } from '../../testing/character.fixtures';
import { readLimit, withinLimits } from './character-limits.util';

describe('readLimit', () => {
  it('keeps a stored whole number of at least 0', () => {
    expect(readLimit(10, 3)).toBe(10);
    expect(readLimit(0, 3)).toBe(0);
  });

  it.each<[string, unknown]>([
    ['missing', undefined],
    ['a text', '10'],
    ['negative', -1],
    ['a fraction', 2.5],
    ['not finite', Number.NaN],
  ])('uses the current value when the maximum is %s', (_case, stored) => {
    expect(readLimit(stored, 7)).toBe(7);
  });
});

describe('withinLimits', () => {
  const character: CharacterInfo = createTestCharacter('a');

  it('leaves values within their maximum unchanged', () => {
    expect(withinLimits(character)).toEqual(character);
  });

  it('lowers current values above their maximum to the maximum', () => {
    const above: CharacterInfo = { ...character, health: 15, maxHealth: 10, armor: 9, maxArmor: 4 };
    expect(withinLimits(above)).toEqual({ ...above, health: 10, armor: 4 });
  });

  it('raises negative current values to 0', () => {
    expect(withinLimits({ ...character, health: -3, armor: -1 })).toEqual({
      ...character,
      health: 0,
      armor: 0,
    });
  });

  it('turns maxima into whole numbers of at least 0', () => {
    expect(withinLimits({ ...character, maxHealth: 12.7, maxArmor: -2 })).toEqual({
      ...character,
      maxHealth: 12,
      maxArmor: 0,
      armor: 0,
    });
  });

  it('returns a new object', () => {
    expect(withinLimits(character)).not.toBe(character);
  });
});
