import { CharacterInfo } from '../../models/character-info.model';
import { createTestCharacter } from '../../testing/character.fixtures';
import {
  normalizedLimits,
  readLimit,
  withAddedEquipment,
  withinLimits,
} from './character-limits.util';
import { StatModifier } from '../../models/equipment.model';

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

describe('withinLimits with equipment', () => {
  const armor4: CharacterInfo = { ...createTestCharacter('a'), armor: 6, maxArmor: 4 };
  const runeArmor: StatModifier[] = [{ stat: 'maxArmor', value: 2 }];

  it('limits current values to the effective maximum', () => {
    expect(withinLimits(armor4, runeArmor).armor).toBe(6);
    expect(withinLimits({ ...armor4, armor: 9 }, runeArmor).armor).toBe(6);
    expect(withinLimits(armor4).armor).toBe(4);
  });

  it('never goes below 0 when a modifier lowers the maximum', () => {
    expect(withinLimits(armor4, [{ stat: 'maxArmor', value: -9 }]).armor).toBe(0);
  });
});

describe('withAddedEquipment', () => {
  const character: CharacterInfo = { ...createTestCharacter('a'), armor: 4, maxArmor: 4 };

  it('raises current health and armor by the bonus of the added card (4/4 → 6/6)', () => {
    const added: StatModifier[] = [
      { stat: 'maxArmor', value: 2 },
      { stat: 'speed', value: -1 },
    ];
    expect(withAddedEquipment(character, [], added)).toEqual({ ...character, armor: 6 });
  });

  it('keeps earlier modifiers in the limit and lowers values for a negative bonus', () => {
    const kept: StatModifier[] = [{ stat: 'maxHealth', value: 3 }];
    const hurt: CharacterInfo = { ...character, health: 14 };
    const result: CharacterInfo = withAddedEquipment(hurt, kept, [
      { stat: 'maxHealth', value: -1 },
    ]);
    expect(result.health).toBe(13);
  });
});

describe('normalizedLimits', () => {
  it('keeps values above the base maximum, raises negatives to 0 and makes maxima whole', () => {
    const stored: CharacterInfo = {
      ...createTestCharacter('a'),
      health: 20,
      maxHealth: 12.5,
      armor: -1,
      maxArmor: -3,
    };
    expect(normalizedLimits(stored)).toEqual({ ...stored, maxHealth: 12, armor: 0, maxArmor: 0 });
  });
});
