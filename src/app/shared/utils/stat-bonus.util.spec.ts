import { Card } from '../../core/models/card.model';
import { statBonusView } from './stat-bonus.util';
import { CharacterInfo } from '../../core/models/character-info.model';
import { createTestCharacter } from '../../core/testing/character.fixtures';
import { createPropertyCard, RUNE_ARMOR, TOWER_SHIELD } from '../../core/testing/deck.fixtures';

const BOOTS: Card = createPropertyCard('e9', 'Stiefel', [{ name: 'Tempo', value: 2 }]);

// Grundwert: Tempo 5.
const character: CharacterInfo = createTestCharacter('a');
const cards: Card[] = [RUNE_ARMOR, TOWER_SHIELD];

describe('statBonusView', () => {
  it('shows a positive bonus with the effective value and its sources', () => {
    expect(statBonusView(character, [BOOTS], 'Tempo')).toEqual({
      bonus: '+2',
      effective: 7,
      sources: 'Stiefel +2',
      positive: true,
    });
  });

  it('marks a negative bonus', () => {
    expect(statBonusView(character, cards, 'Tempo')).toMatchObject({
      bonus: '−1',
      effective: 4,
      positive: false,
    });
  });

  it('shows nothing for stats without bonus and for Leben and Ruestung', () => {
    expect(statBonusView(character, [], 'Tempo')).toBeNull();
    expect(statBonusView(character, cards, 'Ruestung')).toBeNull();
    expect(statBonusView(character, cards, 'Leben')).toBeNull();
  });
});
