import { applyDamage } from './damage.util';
import { DamageTypes } from '../../core/models/damage-types.model';
import { CharacterInfo } from '../../core/models/character-info.model';

function makeCharacter(Leben: number, Ruestung: number): CharacterInfo {
  return {
    id: 'test-1',
    name: 'Test Hero',
    Leben,
    Ruestung,
    Tempo: 5,
    image: '',
    description: '',
    conditions: [],
    movedThisRound: false,
  };
}

describe('applyDamage', () => {
  describe('Normal damage', () => {
    it('absorbs damage fully into Ruestung when Ruestung >= damage', () => {
      const result: CharacterInfo = applyDamage(makeCharacter(100, 20), DamageTypes.Normal, 10);
      expect(result.Ruestung).toBe(10);
      expect(result.Leben).toBe(100);
    });

    it('reduces Ruestung to 0 and applies remainder to Leben', () => {
      const result: CharacterInfo = applyDamage(makeCharacter(100, 5), DamageTypes.Normal, 15);
      expect(result.Ruestung).toBe(0);
      expect(result.Leben).toBe(90);
    });

    it('does not reduce Leben below 0', () => {
      expect(applyDamage(makeCharacter(5, 0), DamageTypes.Normal, 100).Leben).toBe(0);
    });

    it('ignores zero damage', () => {
      const character: CharacterInfo = makeCharacter(100, 20);
      expect(applyDamage(character, DamageTypes.Normal, 0)).toBe(character);
    });
  });

  describe('Critical damage', () => {
    it('bypasses Ruestung and applies damage directly to Leben', () => {
      const result: CharacterInfo = applyDamage(makeCharacter(100, 50), DamageTypes.Critical, 30);
      expect(result.Ruestung).toBe(50);
      expect(result.Leben).toBe(70);
    });

    it('does not reduce Leben below 0', () => {
      expect(applyDamage(makeCharacter(10, 50), DamageTypes.Critical, 100).Leben).toBe(0);
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
