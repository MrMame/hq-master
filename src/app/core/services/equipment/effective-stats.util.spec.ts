import { CharacterInfo } from '../../models/character-info.model';
import { AssignedCard } from '../../models/deck-state.model';
import { createTestCharacter } from '../../testing/character.fixtures';
import {
  assignedCard,
  createEquipmentCard,
  RUNE_ARMOR,
  TOWER_SHIELD,
} from '../../testing/deck.fixtures';
import {
  bonusOf,
  bonusSources,
  cardsOf,
  effectiveStats,
  EffectiveStats,
  modifiersOf,
} from './effective-stats.util';

// Grundwerte: attack 3, defense 4, speed 5, maxHealth 12, maxArmor 4.
const character: CharacterInfo = createTestCharacter('a');

describe('effectiveStats', () => {
  it('equals the base values without cards', () => {
    expect(effectiveStats(character, [])).toEqual({
      attack: 3,
      defense: 4,
      speed: 5,
      maxHealth: 12,
      maxArmor: 4,
    });
  });

  it('adds the modifiers of several cards, negative values included', () => {
    const stats: EffectiveStats = effectiveStats(
      character,
      modifiersOf([
        assignedCard(RUNE_ARMOR, 'a', 'body'),
        assignedCard(TOWER_SHIELD, 'a', 'leftHand'),
      ]),
    );
    expect(stats).toEqual({ attack: 3, defense: 6, speed: 4, maxHealth: 12, maxArmor: 6 });
  });

  it('never goes below 0', () => {
    expect(effectiveStats(character, [{ stat: 'speed', value: -9 }]).speed).toBe(0);
  });

  it('leaves the base values of the character unchanged', () => {
    const before: CharacterInfo = { ...character };
    effectiveStats(character, RUNE_ARMOR.modifiers);
    expect(character).toEqual(before);
  });
});

describe('equipment helpers', () => {
  const amulet: AssignedCard = assignedCard(
    createEquipmentCard('e3', 'Schutzamulett', 'amulet', [{ stat: 'defense', value: 1 }]),
    'a',
    'amulet',
  );
  const assigned: AssignedCard[] = [
    assignedCard(TOWER_SHIELD, 'a', 'leftHand'),
    assignedCard(RUNE_ARMOR, 'b', 'body'),
    amulet,
  ];

  it('finds the cards of one character', () => {
    expect(cardsOf(assigned, 'a').map((entry) => entry.card.id)).toEqual(['e2', 'e3']);
    expect(cardsOf(assigned, 'x')).toEqual([]);
  });

  it('sums the modifiers per stat', () => {
    expect(bonusOf(modifiersOf(cardsOf(assigned, 'a')), 'defense')).toBe(3);
    expect(bonusOf([], 'defense')).toBe(0);
  });

  it('names the cards that change a stat', () => {
    expect(bonusSources(cardsOf(assigned, 'a'), 'defense')).toEqual([
      { name: 'Turmschild', value: 2 },
      { name: 'Schutzamulett', value: 1 },
    ]);
    expect(bonusSources(cardsOf(assigned, 'a'), 'speed')).toEqual([]);
  });
});
