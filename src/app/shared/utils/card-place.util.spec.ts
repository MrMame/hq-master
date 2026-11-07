import { CardRef, DeckState } from '../../core/models/deck-state.model';
import { createMoveState, deck1Ref } from '../../core/testing/card-move.fixtures';
import { cardAfterMove, cardsAtPlace, placePosition } from './card-place.util';

const ids: (refs: CardRef[]) => string[] = (refs) => refs.map((r) => `${r.deckId}/${r.cardId}`);

describe('cardsAtPlace', () => {
  const state: DeckState = {
    ...createMoveState(),
    hand: [
      { deckId: 'deck-1', card: createMoveState().hand[0].card },
      { deckId: 'deck-2', card: createMoveState().hand[0].card },
    ],
  };

  it('lists the hand of all decks and the piles and bank of the own deck', () => {
    expect(ids(cardsAtPlace(state, 'deck-2', { kind: 'hand' }))).toEqual([
      'deck-1/h1',
      'deck-2/h1',
    ]);
    expect(ids(cardsAtPlace(state, 'deck-1', { kind: 'drawPile' }))).toEqual([
      'deck-1/h2',
      'deck-1/b1',
    ]);
    expect(ids(cardsAtPlace(state, 'deck-2', { kind: 'bank' }))).toEqual(['deck-2/h4']);
    expect(cardsAtPlace(state, 'gone', { kind: 'discardPile' })).toEqual([]);
  });

  it('lists the slots of a character from head to amulet and his inventory', () => {
    const equipped: DeckState = {
      ...state,
      assigned: [
        { ...state.assigned[0], slot: 'rightHand' },
        { ...state.assigned[1], characterId: 'a', slot: 'leftHand' },
      ],
    };
    const slots: CardRef[] = cardsAtPlace(equipped, 'deck-1', {
      kind: 'equipped',
      characterId: 'a',
      slot: 'leftHand',
    });
    expect(ids(slots)).toEqual(['deck-2/h5', 'deck-1/h5']);
    expect(ids(cardsAtPlace(state, 'deck-1', { kind: 'inventory', characterId: 'b' }))).toEqual([
      'deck-2/h6',
    ]);
  });
});

describe('placePosition', () => {
  it('finds the index of the card, or nothing when it is not at the place', () => {
    const place: CardRef[] = [deck1Ref('a'), deck1Ref('b')];
    expect(placePosition(place, deck1Ref('b'))).toEqual({ index: 1, total: 2 });
    expect(placePosition(place, deck1Ref('x'))).toBeNull();
  });
});

describe('cardAfterMove', () => {
  const moved: CardRef = deck1Ref('m');

  it('shows the card that moved up into the place of the moved one, at the end the last one', () => {
    expect(cardAfterMove([deck1Ref('a'), deck1Ref('b')], 1, moved)).toEqual(deck1Ref('b'));
    expect(cardAfterMove([deck1Ref('a')], 1, moved)).toEqual(deck1Ref('a'));
  });

  it('stays on the moved card when it is still there or the place is empty', () => {
    expect(cardAfterMove([deck1Ref('a'), moved], 0, moved)).toEqual(moved);
    expect(cardAfterMove([], 0, moved)).toEqual(moved);
  });
});
