import { CharacterInfo } from '../../models/character-info.model';
import { CardProperty } from '../../models/card-property.model';
import { createTestCharacter } from '../../testing/character.fixtures';
import { wholeNonNegative, withEquipmentChange, withinLimits } from './character-limits.util';

describe('wholeNonNegative', () => {
  it.each<[number, number]>([
    [7, 7],
    [0, 0],
    [12.7, 12],
    [-3, 0],
    [Number.NaN, 0],
    [Number.POSITIVE_INFINITY, 0],
  ])('turns %s into %s', (value, expected) => {
    expect(wholeNonNegative(value)).toBe(expected);
  });
});

describe('withinLimits', () => {
  const character: CharacterInfo = createTestCharacter('a');

  it('leaves whole values of at least 0 unchanged, without an upper limit', () => {
    const strong: CharacterInfo = { ...character, Leben: 500, Ruestung: 90 };
    expect(withinLimits(strong)).toEqual(strong);
  });

  it('raises negative values to 0 and cuts off fractions', () => {
    expect(withinLimits({ ...character, Leben: -3, Ruestung: 2.9 })).toEqual({
      ...character,
      Leben: 0,
      Ruestung: 2,
    });
  });

  it('returns a new object', () => {
    expect(withinLimits(character)).not.toBe(character);
  });
});

describe('withEquipmentChange', () => {
  const character: CharacterInfo = { ...createTestCharacter('a'), Leben: 20, Ruestung: 4 };
  const runeArmor: CardProperty[] = [
    { name: 'Ruestung', value: 2 },
    { name: 'Leben', value: 30 },
    { name: 'Tempo', value: -1 },
  ];

  it('raises Leben and Ruestung by the values of a card that starts to work', () => {
    expect(withEquipmentChange(character, runeArmor, 1)).toEqual({
      ...character,
      Leben: 50,
      Ruestung: 6,
    });
  });

  it('lowers them again when the card stops working', () => {
    expect(withEquipmentChange({ ...character, Leben: 50, Ruestung: 6 }, runeArmor, -1)).toEqual(
      character,
    );
  });

  it('never goes below 0, so taking off a card can kill', () => {
    const hurt: CharacterInfo = { ...character, Leben: 10, Ruestung: 1 };
    expect(withEquipmentChange(hurt, runeArmor, -1)).toMatchObject({ Leben: 0, Ruestung: 0 });
  });

  it('leaves the other values unchanged', () => {
    expect(withEquipmentChange(character, runeArmor, 1).Tempo).toBe(character.Tempo);
  });
});
