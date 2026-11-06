import { statBonusView } from './stat-bonus.util';
import { CharacterInfo } from '../../core/models/character-info.model';
import { AssignedCard } from '../../core/models/deck-state.model';
import { createTestCharacter } from '../../core/testing/character.fixtures';
import { assignedCard, RUNE_ARMOR, TOWER_SHIELD } from '../../core/testing/deck.fixtures';

// Grundwerte: defense 4, speed 5, maxArmor 4.
const character: CharacterInfo = createTestCharacter('a');
const cards: AssignedCard[] = [
  assignedCard(RUNE_ARMOR, 'a', 'body'),
  assignedCard(TOWER_SHIELD, 'a', 'leftHand'),
];

describe('statBonusView', () => {
  it('shows a positive bonus with the effective value and its sources', () => {
    expect(statBonusView(character, cards, 'defense')).toEqual({
      bonus: '+2',
      effective: 6,
      sources: 'Turmschild +2',
      positive: true,
    });
  });

  it('marks a negative bonus', () => {
    expect(statBonusView(character, cards, 'speed')).toMatchObject({
      bonus: '−1',
      effective: 4,
      positive: false,
    });
  });

  it('shows nothing for stats without bonus and for current values', () => {
    expect(statBonusView(character, cards, 'attack')).toBeNull();
    expect(statBonusView(character, cards, 'armor')).toBeNull();
    expect(statBonusView(character, [], 'maxArmor')).toBeNull();
  });
});
