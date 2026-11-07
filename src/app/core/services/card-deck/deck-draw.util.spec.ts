import { DeckState } from '../../models/deck-state.model';
import { BASIC_CARD, COMBAT_CARD, createTwoDeckState } from '../../testing/deck.fixtures';
import { discardActive, drawCard } from './deck-draw.util';

describe('deck draw', () => {
  it('draws the top card of the chosen deck as active card', () => {
    const next: DeckState = drawCard(createTwoDeckState(), 'deck-2');
    expect(next.activeCard).toEqual({ deckId: 'deck-2', card: BASIC_CARD });
    expect(next.decks[1].drawPile).toEqual([COMBAT_CARD]);
    expect(next.decks[0].drawPile).toEqual([BASIC_CARD]);
  });

  it('discards the previous active card into its own deck when drawing from another one', () => {
    const first: DeckState = drawCard(createTwoDeckState(), 'deck-1');
    const next: DeckState = drawCard(first, 'deck-2');
    expect(next.activeCard?.deckId).toBe('deck-2');
    expect(next.decks[0].discardPile).toEqual([BASIC_CARD]);
    expect(next.decks[1].discardPile).toEqual([]);
  });

  it('keeps the state for an empty draw pile or an unknown deck', () => {
    const empty: DeckState = drawCard(createTwoDeckState(), 'deck-1');
    expect(drawCard(empty, 'deck-1')).toBe(empty);
    expect(drawCard(empty, 'unknown')).toBe(empty);
  });

  it('discards the active card into its own deck', () => {
    const active: DeckState = drawCard(createTwoDeckState(), 'deck-2');
    const next: DeckState = discardActive(active);
    expect(next.decks[1].discardPile).toEqual([BASIC_CARD]);
    expect(next.decks[0].discardPile).toEqual([]);
    expect(next.activeCard).toBeNull();
  });

  it('keeps the state without an active card', () => {
    const s: DeckState = createTwoDeckState();
    expect(discardActive(s)).toBe(s);
  });
});
