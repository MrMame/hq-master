import { Card } from '../../models/card.model';
import { DeckState } from '../../models/deck-state.model';
import { BASIC_CARD, COMBAT_CARD, createTwoDeckState } from '../../testing/deck.fixtures';
import {
  activateCard,
  discardActive,
  drawCard,
  dropActiveIntoBank,
  shuffleActiveIntoDrawPile,
} from './deck-draw.util';

const ids: (cards: Card[]) => string[] = (cards) => cards.map((c) => c.id).sort();

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

  it('activates a card from the discard pile or the bank of its deck', () => {
    const s: DeckState = createTwoDeckState();
    const withPiles: DeckState = {
      ...s,
      decks: [
        s.decks[0],
        { ...s.decks[1], drawPile: [], discardPile: [BASIC_CARD], bank: [COMBAT_CARD] },
      ],
    };
    const fromBank: DeckState = activateCard(withPiles, 'deck-2', 'c1');
    expect(fromBank.activeCard).toEqual({ deckId: 'deck-2', card: COMBAT_CARD });
    expect(fromBank.decks[1].bank).toEqual([]);
    const fromDiscard: DeckState = activateCard(fromBank, 'deck-2', 'b1');
    expect(fromDiscard.activeCard?.card).toBe(BASIC_CARD);
    expect(fromDiscard.decks[1].discardPile).toEqual([COMBAT_CARD]);
  });

  it('keeps the state for an unknown card', () => {
    const s: DeckState = createTwoDeckState();
    expect(activateCard(s, 'deck-1', 'c1')).toBe(s);
    expect(activateCard(s, 'unknown', 'b1')).toBe(s);
  });

  it('moves the active card back into its own deck', () => {
    const active: DeckState = drawCard(createTwoDeckState(), 'deck-2');
    expect(ids(shuffleActiveIntoDrawPile(active).decks[1].drawPile)).toEqual(['b1', 'c1']);
    expect(dropActiveIntoBank(active).decks[1].bank).toEqual([BASIC_CARD]);
    expect(discardActive(active).decks[1].discardPile).toEqual([BASIC_CARD]);
    expect(dropActiveIntoBank(active).activeCard).toBeNull();
  });

  it('keeps the state without an active card', () => {
    const s: DeckState = createTwoDeckState();
    expect(discardActive(s)).toBe(s);
    expect(shuffleActiveIntoDrawPile(s)).toBe(s);
    expect(dropActiveIntoBank(s)).toBe(s);
  });
});
