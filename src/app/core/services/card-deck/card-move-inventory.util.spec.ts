import { DeckState } from '../../models/deck-state.model';
import { createMoveState, deck1Ref, HAND_CARDS } from '../../testing/card-move.fixtures';
import { BASIC_CARD, inventoryCard } from '../../testing/deck.fixtures';
import { discardOwned, moveCard } from './card-move.util';

const [, H2, H3, , H5, H6] = HAND_CARDS;

describe('moveCard – inventory', () => {
  let s: DeckState;

  beforeEach(() => {
    s = createMoveState();
  });

  it('takes every kind of card into an inventory, newest last', () => {
    const next: DeckState = moveCard(s, deck1Ref('b1'), { kind: 'inventory', characterId: 'a' });
    expect(next.inventory).toEqual([...s.inventory, inventoryCard(BASIC_CARD, 'a')]);
    expect(next.decks[0].drawPile).toEqual([H2]);
  });

  it('stows a slot card in the inventory of its owner and frees the slot', () => {
    const next: DeckState = moveCard(s, deck1Ref('h5'), { kind: 'inventory', characterId: 'a' });
    expect(next.assigned).toEqual([s.assigned[1]]);
    expect(next.inventory.at(-1)).toEqual(inventoryCard(H5, 'a'));
  });

  it('equips an inventory card and hands it on to another inventory', () => {
    const equipped: DeckState = moveCard(s, deck1Ref('h6'), {
      kind: 'equipped',
      characterId: 'a',
      slot: 'rightHand',
    });
    expect(equipped.inventory).toEqual([s.inventory[1]]);
    expect(equipped.assigned.at(-1)?.card).toBe(H6);

    const handedOn: DeckState = moveCard(s, deck1Ref('h6'), {
      kind: 'inventory',
      characterId: 'b',
    });
    expect(handedOn.inventory).toEqual([s.inventory[1], inventoryCard(H6, 'b')]);
  });

  it('keeps the same state when the card already is in that inventory', () => {
    expect(moveCard(s, deck1Ref('h6'), { kind: 'inventory', characterId: 'a' })).toBe(s);
  });
});

describe('discardOwned – inventory', () => {
  it('discards slot cards first, then inventory cards, each only in its own deck', () => {
    const s: DeckState = createMoveState();
    const next: DeckState = discardOwned(s, [deck1Ref('h6'), deck1Ref('h5')]);
    expect(next.decks[0].discardPile).toEqual([H3, H5, H6]);
    expect(next.inventory).toEqual([s.inventory[1]]);
    expect(next.decks[1]).toBe(s.decks[1]);
  });
});
