import { DeckState } from '../../models/deck-state.model';
import {
  assignedCard,
  BASIC_CARD,
  createDeckInstance,
  createEquipmentDeckState,
  inventoryCard,
  TOWER_SHIELD,
} from '../../testing/deck.fixtures';
import { orphanedCards, slotOccupant } from './deck-assignment.util';

/** Turmschild aus deck-1 bei „a“ links, aus deck-2 bei „b“ links. */
function twoDeckEquipment(): DeckState {
  const base: DeckState = createEquipmentDeckState('a');
  return {
    ...base,
    decks: [...base.decks, createDeckInstance('deck-2')],
    assigned: [...base.assigned, assignedCard(TOWER_SHIELD, 'b', 'leftHand', 'deck-2')],
  };
}

describe('deck assignment', () => {
  it('finds the occupant of a slot', () => {
    const s: DeckState = twoDeckEquipment();
    expect(slotOccupant(s.assigned, 'b', 'leftHand')?.deckId).toBe('deck-2');
    expect(slotOccupant(s.assigned, 'a', 'rightHand')).toBeUndefined();
  });

  it('lists the slot and inventory cards of missing owners with their deck', () => {
    const s: DeckState = {
      ...twoDeckEquipment(),
      inventory: [inventoryCard(BASIC_CARD, 'a'), inventoryCard(BASIC_CARD, 'b', 'deck-2')],
    };
    expect(orphanedCards(s, ['a'])).toEqual([
      { deckId: 'deck-2', cardId: 'e2' },
      { deckId: 'deck-2', cardId: 'b1' },
    ]);
  });
});
