import { DeckState } from '../../models/deck-state.model';
import { createMoveState, deck1Ref } from '../../testing/card-move.fixtures';
import { moveCard } from './card-move.util';

describe('moveCard – on top of the draw pile', () => {
  const state: DeckState = createMoveState();
  const drawPile: (s: DeckState) => string[] = (s) => s.decks[0].drawPile.map((card) => card.id);

  it('puts a card from any place on top of its own draw pile without shuffling', () => {
    const fromHand: DeckState = moveCard(state, deck1Ref('h1'), { kind: 'drawPile', top: true });
    expect(drawPile(fromHand)).toEqual(['h1', 'h2', 'b1']);
    expect(fromHand.hand).toEqual([]);
    expect(fromHand.decks[1]).toBe(state.decks[1]);

    const fromSlot: DeckState = moveCard(state, deck1Ref('h5'), { kind: 'drawPile', top: true });
    expect(drawPile(fromSlot)).toEqual(['h5', 'h2', 'b1']);
    expect(fromSlot.assigned.map((entry) => entry.deckId)).toEqual(['deck-2']);
  });

  it('moves a card from inside the draw pile to the top', () => {
    expect(drawPile(moveCard(state, deck1Ref('b1'), { kind: 'drawPile', top: true }))).toEqual([
      'b1',
      'h2',
    ]);
  });

  it('keeps the state when the card already lies on top', () => {
    expect(moveCard(state, deck1Ref('h2'), { kind: 'drawPile', top: true })).toBe(state);
  });
});
