import { EquippedLocation } from '../../models/card-location.model';
import { DeckState } from '../../models/deck-state.model';
import { createMoveState, deck1Ref, HAND_CARDS } from '../../testing/card-move.fixtures';
import { assignedCard, BASIC_CARD, RUNE_ARMOR } from '../../testing/deck.fixtures';
import { discardAssigned, moveCard } from './card-move.util';

const [H1, H2, H3, H4, H5] = HAND_CARDS;

describe('moveCard – rules', () => {
  let s: DeckState;

  beforeEach(() => {
    s = createMoveState();
  });

  it('puts a card only into the piles and bank of its own deck', () => {
    const next: DeckState = moveCard(s, { deckId: 'deck-2', cardId: 'h2' }, { kind: 'bank' });
    expect(next.decks[1].bank).toEqual([H4, H2]);
    expect(next.decks[1].drawPile).toEqual([H1]);
    expect(next.decks[0]).toBe(s.decks[0]);
  });

  it('activates a card of the second instance and discards the active card into its own deck', () => {
    const next: DeckState = moveCard(s, { deckId: 'deck-2', cardId: 'h1' }, { kind: 'active' });
    expect(next.activeCard).toEqual({ deckId: 'deck-2', card: H1 });
    expect(next.decks[0].discardPile).toEqual([H3, H1]);
    expect(next.decks[1].discardPile).toEqual([H3]);
  });

  it('shuffles a card into the draw pile', () => {
    const next: DeckState = moveCard(s, deck1Ref('h4'), { kind: 'drawPile' });
    expect(next.decks[0].drawPile).toHaveLength(3);
    expect(next.decks[0].drawPile).toEqual(expect.arrayContaining([H2, BASIC_CARD, H4]));
  });

  it('puts the occupant of a slot into the discard pile of its own deck', () => {
    const target: EquippedLocation = { kind: 'equipped', characterId: 'b', slot: 'rightHand' };
    const next: DeckState = moveCard(s, deck1Ref('h4'), target);
    expect(next.decks[1].discardPile).toEqual([H3, H5]);
    expect(next.decks[0].discardPile).toEqual([H3]);
    expect(next.assigned).toEqual([
      assignedCard(H5, 'a', 'leftHand', 'deck-1'),
      assignedCard(H4, 'b', 'rightHand', 'deck-1'),
    ]);
  });

  it('keeps the same state for invalid moves', () => {
    const slot: EquippedLocation = { kind: 'equipped', characterId: 'a', slot: 'head' };
    expect(moveCard(s, deck1Ref('unknown'), { kind: 'bank' })).toBe(s);
    expect(moveCard(s, { deckId: 'deck-3', cardId: 'h2' }, { kind: 'bank' })).toBe(s);
    expect(moveCard(s, deck1Ref('b1'), { ...slot, slot: 'leftHand' })).toBe(s);
    // Eine Handkarte passt nicht auf den Kopf.
    expect(moveCard(s, deck1Ref('h2'), slot)).toBe(s);
  });

  it('puts body armor only into the body slot', () => {
    const armor: DeckState = {
      ...s,
      decks: [{ ...s.decks[0], bank: [RUNE_ARMOR] }, s.decks[1]],
    };
    const body: EquippedLocation = { kind: 'equipped', characterId: 'a', slot: 'body' };
    expect(moveCard(armor, deck1Ref('e1'), { ...body, slot: 'leftHand' })).toBe(armor);
    expect(moveCard(armor, deck1Ref('e1'), body).assigned.at(-1)).toEqual(
      assignedCard(RUNE_ARMOR, 'a', 'body'),
    );
  });
});

describe('discardAssigned', () => {
  let s: DeckState;

  beforeEach(() => {
    s = createMoveState();
  });

  it('discards only the card of the addressed deck, although both have the same id', () => {
    const next: DeckState = discardAssigned(s, [{ deckId: 'deck-2', cardId: 'h5' }]);
    expect(next.assigned).toEqual([s.assigned[0]]);
    expect(next.decks[1].discardPile).toEqual([H3, H5]);
    expect(next.decks[0].discardPile).toEqual([H3]);
  });

  it('discards in the order of the assignments and ignores unknown or unassigned cards', () => {
    const two: DeckState = moveCard(s, deck1Ref('h2'), {
      kind: 'equipped',
      characterId: 'a',
      slot: 'rightHand',
    });
    const next: DeckState = discardAssigned(two, [deck1Ref('h2'), deck1Ref('h1'), deck1Ref('h5')]);
    expect(next.decks[0].discardPile).toEqual([H3, H5, H2]);
    expect(next.activeCard).toEqual(s.activeCard);
    expect(discardAssigned(s, [{ deckId: 'deck-3', cardId: 'h5' }])).toBe(s);
  });
});
