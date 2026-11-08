import { DeckState } from '../../models/deck-state.model';
import { createMoveState, deck1Ref } from '../../testing/card-move.fixtures';
import { moveCard } from './card-move.util';
import { isRevertible, MovedCard, movedCards, revertOrder } from './moved-cards.util';

describe('movedCards', () => {
  const before: DeckState = createMoveState();

  it('finds the moved card and a card displaced from the target slot', () => {
    // h1 aus der Hand in die linke Hand von „a“, dort lag h5.
    const after: DeckState = moveCard(before, deck1Ref('h1'), {
      kind: 'equipped',
      characterId: 'a',
      slot: 'leftHand',
    });
    const moves: MovedCard[] = movedCards(before, after);
    expect(moves.map(({ ref, from, to }) => [ref.cardId, from.kind, to.kind])).toEqual([
      ['h1', 'hand', 'equipped'],
      ['h5', 'equipped', 'discardPile'],
    ]);
    expect(moves[0].card.name).toBe('Schild 1');
  });

  it('ignores reordering at the same place and cards that disappeared', () => {
    const reordered: DeckState = moveCard(before, deck1Ref('b1'), { kind: 'drawPile', top: true });
    expect(movedCards(before, reordered)).toEqual([]);
    expect(
      movedCards(before, { ...before, decks: [], hand: [], assigned: [], inventory: [], belt: [] }),
    ).toEqual([]);
  });

  it('notices moves between inventories and from the bank', () => {
    const after: DeckState = moveCard(
      moveCard(before, deck1Ref('h6'), { kind: 'inventory', characterId: 'b' }),
      deck1Ref('h4'),
      { kind: 'hand' },
    );
    expect(movedCards(before, after).map((move) => move.ref.cardId)).toEqual(['h4', 'h6']);
  });
});

describe('isRevertible', () => {
  const before: DeckState = createMoveState();
  const after: DeckState = moveCard(before, deck1Ref('h5'), { kind: 'bank' });
  const moves: MovedCard[] = movedCards(before, after);

  it('is revertible while every card is still at its target and its former owner exists', () => {
    expect(isRevertible(after, moves, ['a'])).toBe(true);
    expect(isRevertible(after, moves, ['b'])).toBe(false);
    expect(isRevertible(moveCard(after, deck1Ref('h5'), { kind: 'hand' }), moves, ['a'])).toBe(
      false,
    );
    expect(isRevertible({ ...after, decks: [] }, moves, ['a'])).toBe(false);
  });

  it('is not revertible without moves', () => {
    expect(isRevertible(after, [], ['a'])).toBe(false);
  });
});

describe('revertOrder', () => {
  it('takes cards out of slots first so their former slot is free', () => {
    const before: DeckState = createMoveState();
    const after: DeckState = moveCard(before, deck1Ref('h1'), {
      kind: 'equipped',
      characterId: 'a',
      slot: 'leftHand',
    });
    const order: string[] = revertOrder(movedCards(before, after).reverse()).map(
      (m) => m.ref.cardId,
    );
    expect(order).toEqual(['h1', 'h5']);
  });
});
