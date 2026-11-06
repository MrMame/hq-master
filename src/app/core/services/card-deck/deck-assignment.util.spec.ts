import { DeckState } from '../../models/deck-state.model';
import {
  assignedCard,
  BASIC_CARD,
  createDeckInstance,
  createEquipmentDeckState,
  RUNE_ARMOR,
  TOWER_SHIELD,
} from '../../testing/deck.fixtures';
import {
  assignActiveCard,
  discardAssigned,
  orphanedCards,
  slotOccupant,
} from './deck-assignment.util';

/** Runenrüstung aktiv aus deck-1; Turmschild aus deck-1 bei „a“ links, aus deck-2 bei „b“ links. */
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

  it('assigns the active equipment card with its deck', () => {
    const next: DeckState = assignActiveCard(twoDeckEquipment(), 'b', 'body');
    expect(next.activeCard).toBeNull();
    expect(next.assigned.at(-1)).toEqual(assignedCard(RUNE_ARMOR, 'b', 'body', 'deck-1'));
  });

  it('puts the previous occupant into the discard pile of its own deck', () => {
    const s: DeckState = twoDeckEquipment();
    const next: DeckState = assignActiveCard(s, 'b', 'leftHand');
    expect(next.decks[1].discardPile).toEqual([TOWER_SHIELD]);
    expect(next.decks[0].discardPile).toEqual([]);
    expect(next.assigned.filter((entry) => entry.characterId === 'b')).toEqual([
      assignedCard(RUNE_ARMOR, 'b', 'leftHand', 'deck-1'),
    ]);
  });

  it('leaves the state unchanged without an active equipment card', () => {
    const s: DeckState = {
      ...twoDeckEquipment(),
      activeCard: { deckId: 'deck-1', card: BASIC_CARD },
    };
    expect(assignActiveCard(s, 'a', 'body')).toBe(s);
    const none: DeckState = { ...s, activeCard: null };
    expect(assignActiveCard(none, 'a', 'body')).toBe(none);
  });

  it('discards only the card of the addressed deck, although both have the same id', () => {
    const next: DeckState = discardAssigned(twoDeckEquipment(), [
      { deckId: 'deck-2', cardId: 'e2' },
    ]);
    expect(next.assigned).toEqual([assignedCard(TOWER_SHIELD, 'a', 'leftHand')]);
    expect(next.decks[1].discardPile).toEqual([TOWER_SHIELD]);
    expect(next.decks[0].discardPile).toEqual([]);
  });

  it('ignores unknown cards when discarding', () => {
    const s: DeckState = twoDeckEquipment();
    expect(discardAssigned(s, [{ deckId: 'deck-3', cardId: 'e2' }])).toBe(s);
  });

  it('lists the cards of missing owners with their deck', () => {
    expect(orphanedCards(twoDeckEquipment().assigned, ['a'])).toEqual([
      { deckId: 'deck-2', cardId: 'e2' },
    ]);
  });
});
