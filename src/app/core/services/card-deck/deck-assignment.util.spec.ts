import { DeckState } from '../../models/deck-state.model';
import {
  assignedCard,
  createDeckState,
  createEquipmentDeckState,
  RUNE_ARMOR,
  TOWER_SHIELD,
} from '../../testing/deck.fixtures';
import {
  assignActiveCard,
  discardAssigned,
  orphanedCardIds,
  slotOccupant,
  unassignedCards,
} from './deck-assignment.util';

// Runenrüstung aktiv, Turmschild in der linken Hand von „a“.
const deck: DeckState = createEquipmentDeckState('a');

describe('deck assignment', () => {
  it('lists all cards except assigned ones', () => {
    expect(unassignedCards(deck).map((card) => card.id)).toEqual(['b1', 'c1', 'e1']);
  });

  it('finds the card in a slot', () => {
    expect(slotOccupant(deck.assigned, 'a', 'leftHand')?.card).toBe(TOWER_SHIELD);
    expect(slotOccupant(deck.assigned, 'a', 'rightHand')).toBeUndefined();
    expect(slotOccupant(deck.assigned, 'b', 'leftHand')).toBeUndefined();
  });

  it('assigns the active equipment card and leaves no card active', () => {
    const next: DeckState = assignActiveCard(deck, 'a', 'body');
    expect(next.activeCard).toBeNull();
    expect(next.assigned).toEqual([...deck.assigned, assignedCard(RUNE_ARMOR, 'a', 'body')]);
    expect(next.discardPile).toEqual([]);
  });

  it('moves the card of an occupied slot onto the discard pile', () => {
    const shield: DeckState = { ...deck, activeCard: { ...TOWER_SHIELD, id: 'e9' } };
    const next: DeckState = assignActiveCard(shield, 'a', 'leftHand');
    expect(next.discardPile).toEqual([TOWER_SHIELD]);
    expect(next.assigned.map((entry) => entry.card.id)).toEqual(['e9']);
  });

  it('ignores assigning without an active equipment card', () => {
    const plain: DeckState = createDeckState();
    expect(assignActiveCard(plain, 'a', 'body')).toBe(plain);
    const none: DeckState = { ...deck, activeCard: null };
    expect(assignActiveCard(none, 'a', 'body')).toBe(none);
  });

  it('discards assigned cards onto the discard pile', () => {
    const next: DeckState = discardAssigned(deck, ['e2']);
    expect(next.assigned).toEqual([]);
    expect(next.discardPile).toEqual([TOWER_SHIELD]);
    expect(discardAssigned(deck, ['unknown'])).toBe(deck);
  });

  it('finds cards whose owner is no longer in the session', () => {
    expect(orphanedCardIds(deck.assigned, ['a'])).toEqual([]);
    expect(orphanedCardIds(deck.assigned, ['b'])).toEqual(['e2']);
  });
});
