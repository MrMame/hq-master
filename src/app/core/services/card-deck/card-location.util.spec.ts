import { CardLocation } from '../../models/card-location.model';
import { DeckState } from '../../models/deck-state.model';
import { createMoveState, deck1Ref, HAND_CARDS, ORIGINS } from '../../testing/card-move.fixtures';
import { findCard, isSameLocation, locateCard } from './card-location.util';

describe('card location', () => {
  let s: DeckState;

  beforeEach(() => {
    s = createMoveState();
  });

  it.each(ORIGINS)('locates card $cardId at $location.kind', ({ cardId, location }) => {
    expect(locateCard(s, deck1Ref(cardId))).toEqual(location);
  });

  it('tells cards with the same id from two deck instances apart', () => {
    expect(locateCard(s, { deckId: 'deck-2', cardId: 'h1' })).toEqual({ kind: 'drawPile' });
    expect(locateCard(s, { deckId: 'deck-2', cardId: 'h5' })).toEqual({
      kind: 'equipped',
      characterId: 'b',
      slot: 'rightHand',
    });
  });

  it('returns null for an unknown card or a deck that is not on the table', () => {
    expect(locateCard(s, deck1Ref('unknown'))).toBeNull();
    expect(locateCard(s, { deckId: 'deck-3', cardId: 'h2' })).toBeNull();
    // Zuweisung auf ein entferntes Deck: ohne Deck auf dem Tisch ist die Karte unbekannt.
    expect(locateCard({ ...s, decks: [s.decks[1]] }, deck1Ref('h1'))).toBeNull();
  });

  it('finds the card itself', () => {
    expect(findCard(s, deck1Ref('h5'))).toBe(HAND_CARDS[4]);
    expect(findCard(s, deck1Ref('unknown'))).toBeUndefined();
  });

  it('compares locations by kind and, for slots, by character and slot', () => {
    const slot: (characterId: string, left: boolean) => CardLocation = (characterId, left) => ({
      kind: 'equipped',
      characterId,
      slot: left ? 'leftHand' : 'rightHand',
    });
    expect(isSameLocation({ kind: 'bank' }, { kind: 'bank' })).toBe(true);
    expect(isSameLocation({ kind: 'bank' }, { kind: 'drawPile' })).toBe(false);
    expect(isSameLocation(slot('a', true), slot('a', true))).toBe(true);
    expect(isSameLocation(slot('a', true), slot('a', false))).toBe(false);
    expect(isSameLocation(slot('a', true), slot('b', true))).toBe(false);
    expect(isSameLocation(slot('a', true), { kind: 'active' })).toBe(false);
    expect(isSameLocation({ kind: 'active' }, slot('a', true))).toBe(false);
  });
});
