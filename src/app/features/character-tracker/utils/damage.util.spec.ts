import { applyDamage } from './damage.util';
import { DamageTypes } from '../models/damage-types.model';
import { CharacterInfo } from '../../../core/models/character-info.model';
import { ElementalTypes } from '../../../core/models/elemental-types.model';

function makeCharacter(health: number, armor: number): CharacterInfo {
  return {
    id: 'test-1',
    name: 'Test Hero',
    type: ElementalTypes.FEUER,
    health,
    armor,
    attack: 10,
    defense: 5,
    speed: 5,
    abilities: [],
    image: '',
    description: '',
  };
}

describe('applyDamage', () => {
  describe('Normal damage', () => {
    it('absorbs damage fully into armor when armor >= damage', () => {
      const result: CharacterInfo = applyDamage(makeCharacter(100, 20), DamageTypes.Normal, 10);
      expect(result.armor).toBe(10);
      expect(result.health).toBe(100);
    });

    it('reduces armor to 0 and applies remainder to health', () => {
      const result: CharacterInfo = applyDamage(makeCharacter(100, 5), DamageTypes.Normal, 15);
      expect(result.armor).toBe(0);
      expect(result.health).toBe(90);
    });

    it('does not reduce health below 0', () => {
      expect(applyDamage(makeCharacter(5, 0), DamageTypes.Normal, 100).health).toBe(0);
    });

    it('ignores zero damage', () => {
      const character: CharacterInfo = makeCharacter(100, 20);
      expect(applyDamage(character, DamageTypes.Normal, 0)).toBe(character);
    });
  });

  describe('Critical damage', () => {
    it('bypasses armor and applies damage directly to health', () => {
      const result: CharacterInfo = applyDamage(makeCharacter(100, 50), DamageTypes.Critical, 30);
      expect(result.armor).toBe(50);
      expect(result.health).toBe(70);
    });

    it('does not reduce health below 0', () => {
      expect(applyDamage(makeCharacter(10, 50), DamageTypes.Critical, 100).health).toBe(0);
    });
  });

  it.each([DamageTypes.Normal, DamageTypes.Critical])(
    'returns a new object and leaves the original unchanged (%s)',
    (damageType) => {
      const character: CharacterInfo = makeCharacter(100, 5);
      const result: CharacterInfo = applyDamage(character, damageType, 15);
      expect(result).not.toBe(character);
      expect(character).toEqual(makeCharacter(100, 5));
    },
  );
});
