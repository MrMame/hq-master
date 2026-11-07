import { DeckState } from '../../models/deck-state.model';
import { BASIC_CARD, COMBAT_CARD, createTwoDeckState } from '../../testing/deck.fixtures';
import { drawCard } from './deck-draw.util';

describe('deck draw', () => {
  it('draws the top card of the chosen deck into the hand', () => {
    const next: DeckState = drawCard(createTwoDeckState(), 'deck-2');
    expect(next.hand).toEqual([{ deckId: 'deck-2', card: BASIC_CARD }]);
    expect(next.decks[1].drawPile).toEqual([COMBAT_CARD]);
    expect(next.decks[0].drawPile).toEqual([BASIC_CARD]);
  });

  it('keeps earlier hand cards and puts the newest card at the end', () => {
    const first: DeckState = drawCard(createTwoDeckState(), 'deck-1');
    const next: DeckState = drawCard(drawCard(first, 'deck-2'), 'deck-2');
    expect(next.hand.map((entry) => [entry.deckId, entry.card.id])).toEqual([
      ['deck-1', 'b1'],
      ['deck-2', 'b1'],
      ['deck-2', 'c1'],
    ]);
    expect(next.decks.map((deck) => deck.discardPile)).toEqual([[], []]);
  });

  it('keeps the state for an empty draw pile or an unknown deck', () => {
    const empty: DeckState = drawCard(createTwoDeckState(), 'deck-1');
    expect(drawCard(empty, 'deck-1')).toBe(empty);
    expect(drawCard(empty, 'unknown')).toBe(empty);
  });
});
