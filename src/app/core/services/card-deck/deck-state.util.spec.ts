import { DeckState } from '../../models/deck-state.model';
import {
  assignedCard,
  BASIC_CARD,
  COMBAT_CARD,
  createDeckState,
  createTwoDeckState,
  TOWER_SHIELD,
} from '../../testing/deck.fixtures';
import {
  emptyDeckState,
  isSameCard,
  isSameRef,
  toCardRef,
  unassignedCards,
  updateDeck,
  withDiscarded,
  withoutDanglingRefs,
} from './deck-state.util';

describe('deck state', () => {
  it('starts without decks', () => {
    expect(emptyDeckState()).toEqual({ decks: [], hand: [], assigned: [] });
  });

  it('identifies a card by deck and card id', () => {
    const entry: { deckId: string; card: typeof BASIC_CARD } = {
      deckId: 'deck-1',
      card: BASIC_CARD,
    };
    expect(toCardRef(entry)).toEqual({ deckId: 'deck-1', cardId: 'b1' });
    expect(isSameCard(entry, { deckId: 'deck-1', cardId: 'b1' })).toBe(true);
    expect(isSameCard(entry, { deckId: 'deck-2', cardId: 'b1' })).toBe(false);
  });

  it('compares two addresses by deck and card', () => {
    expect(isSameRef({ deckId: 'd1', cardId: 'b1' }, { deckId: 'd1', cardId: 'b1' })).toBe(true);
    expect(isSameRef({ deckId: 'd1', cardId: 'b1' }, { deckId: 'd2', cardId: 'b1' })).toBe(false);
    expect(isSameRef({ deckId: 'd1', cardId: 'b1' }, { deckId: 'd1', cardId: 'c1' })).toBe(false);
  });

  it('returns the same state for an unknown or unchanged deck', () => {
    const s: DeckState = createTwoDeckState();
    expect(updateDeck(s, 'unknown', (d) => ({ ...d, name: 'x' }))).toBe(s);
    expect(updateDeck(s, 'deck-1', (d) => d)).toBe(s);
    expect(updateDeck(s, 'deck-2', (d) => ({ ...d, name: 'x' })).decks[1].name).toBe('x');
  });

  it('collects the free cards of one deck including its hand cards', () => {
    const s: DeckState = createDeckState();
    expect(unassignedCards(s, 'deck-1')).toEqual([BASIC_CARD, COMBAT_CARD]);
    expect(unassignedCards(s, 'unknown')).toEqual([]);
    expect(
      unassignedCards({ ...s, hand: [{ deckId: 'other', card: COMBAT_CARD }] }, 'deck-1'),
    ).toEqual([BASIC_CARD]);
  });

  it('discards every card into the pile of its own deck and drops cards of missing decks', () => {
    const next: DeckState = withDiscarded(createTwoDeckState(), [
      { deckId: 'deck-2', card: COMBAT_CARD },
      { deckId: 'gone', card: BASIC_CARD },
    ]);
    expect(next.decks[0].discardPile).toEqual([]);
    expect(next.decks[1].discardPile).toEqual([COMBAT_CARD]);
  });

  it('drops hand cards and assignments of missing decks', () => {
    const s: DeckState = {
      ...createTwoDeckState(),
      hand: [
        { deckId: 'gone', card: BASIC_CARD },
        { deckId: 'deck-1', card: COMBAT_CARD },
      ],
      assigned: [
        assignedCard(TOWER_SHIELD, 'a', 'leftHand', 'gone'),
        assignedCard(TOWER_SHIELD, 'a', 'rightHand'),
      ],
    };
    const next: DeckState = withoutDanglingRefs(s);
    expect(next.hand).toEqual([{ deckId: 'deck-1', card: COMBAT_CARD }]);
    expect(next.assigned).toEqual([assignedCard(TOWER_SHIELD, 'a', 'rightHand')]);
    expect(withoutDanglingRefs(createDeckState()).hand).toEqual(createDeckState().hand);
  });
});
