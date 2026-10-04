import { TestBed } from '@angular/core/testing';
import { CombatCalculatorService } from './combat-calculator';
import { MovableCharacterItem } from '../models/MovableCharacterItem';
import { DamageTypes } from '../models/DamageTypes';
import { CharacterInfo } from '../models/CharacterInfo';
import { ElementalTypes } from '../models/ElementalTypes';

function makeItem(health: number, armor: number): MovableCharacterItem {
  const info: CharacterInfo = {
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
  return new MovableCharacterItem(1, 0, 0, info);
}

describe('CombatCalculatorService', () => {
  let service: CombatCalculatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CombatCalculatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Normal damage', () => {
    it('absorbs damage fully into armor when armor >= damage', () => {
      const item: MovableCharacterItem = makeItem(100, 20);
      service.applyDamage(item, DamageTypes.Normal, 10);
      expect(item.characterInfo.armor).toBe(10);
      expect(item.characterInfo.health).toBe(100);
    });

    it('reduces armor to 0 and applies remainder to health', () => {
      const item: MovableCharacterItem = makeItem(100, 5);
      service.applyDamage(item, DamageTypes.Normal, 15);
      expect(item.characterInfo.armor).toBe(0);
      expect(item.characterInfo.health).toBe(90);
    });

    it('does not reduce health below 0', () => {
      const item: MovableCharacterItem = makeItem(5, 0);
      service.applyDamage(item, DamageTypes.Normal, 100);
      expect(item.characterInfo.health).toBe(0);
    });

    it('ignores zero damage', () => {
      const item: MovableCharacterItem = makeItem(100, 20);
      service.applyDamage(item, DamageTypes.Normal, 0);
      expect(item.characterInfo.health).toBe(100);
      expect(item.characterInfo.armor).toBe(20);
    });
  });

  describe('Critical damage', () => {
    it('bypasses armor and applies damage directly to health', () => {
      const item: MovableCharacterItem = makeItem(100, 50);
      service.applyDamage(item, DamageTypes.Critical, 30);
      expect(item.characterInfo.armor).toBe(50);
      expect(item.characterInfo.health).toBe(70);
    });

    it('does not reduce health below 0', () => {
      const item: MovableCharacterItem = makeItem(10, 50);
      service.applyDamage(item, DamageTypes.Critical, 100);
      expect(item.characterInfo.health).toBe(0);
    });
  });
});
