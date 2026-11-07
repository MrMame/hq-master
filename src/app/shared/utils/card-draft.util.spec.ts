import { AssignedCard, CardRef, InventoryCard } from '../../core/models/deck-state.model';
import {
  assignedCard,
  BASIC_CARD,
  BUCKLER,
  inventoryCard,
  RUNE_ARMOR,
  TOWER_SHIELD,
} from '../../core/testing/deck.fixtures';
import { DraftMove } from '../models/card-action.model';
import {
  DraftCards,
  draftCards,
  draftMoveOf,
  draftTargetLocation,
  locationInDraft,
  withDraftMove,
} from './card-draft.util';

const ref: (cardId: string) => CardRef = (cardId) => ({ deckId: 'deck-1', cardId });

describe('card draft', () => {
  // Barbar „a“: Turmschild links, Runenrüstung und Fackel im Inventar; Zwerg „b“: Buckler links.
  const assigned: AssignedCard[] = [
    assignedCard(TOWER_SHIELD, 'a', 'leftHand'),
    assignedCard(BUCKLER, 'b', 'leftHand'),
  ];
  const inventory: InventoryCard[] = [
    inventoryCard(RUNE_ARMOR, 'a'),
    inventoryCard(BASIC_CARD, 'a'),
    inventoryCard(BUCKLER, 'b', 'deck-2'),
  ];

  it('translates draft targets into locations of the edited character', () => {
    expect(draftTargetLocation('a', { kind: 'discardPile' })).toEqual({ kind: 'discardPile' });
    expect(draftTargetLocation('a', { kind: 'inventory' })).toEqual({
      kind: 'inventory',
      characterId: 'a',
    });
    expect(draftTargetLocation('a', { kind: 'equipped', slot: 'body' })).toEqual({
      kind: 'equipped',
      characterId: 'a',
      slot: 'body',
    });
  });

  it('keeps only the latest move of a card and puts it last', () => {
    const moves: DraftMove[] = withDraftMove(
      withDraftMove(withDraftMove([], ref('e2'), { kind: 'inventory' }), ref('e1'), {
        kind: 'equipped',
        slot: 'body',
      }),
      ref('e2'),
      { kind: 'discardPile' },
    );
    expect(moves).toEqual([
      { ref: ref('e1'), target: { kind: 'equipped', slot: 'body' } },
      { ref: ref('e2'), target: { kind: 'discardPile' } },
    ]);
    expect(draftMoveOf(moves, ref('e2'))?.target.kind).toBe('discardPile');
    expect(draftMoveOf(moves, ref('b1'))).toBeUndefined();
    expect(locationInDraft('a', moves, ref('e1'), { kind: 'inventory', characterId: 'a' })).toEqual(
      { kind: 'equipped', characterId: 'a', slot: 'body' },
    );
    expect(locationInDraft('a', moves, ref('b1'), { kind: 'bank' })).toEqual({ kind: 'bank' });
  });

  it('shows the live cards of the character without moves', () => {
    const cards: DraftCards = draftCards('a', assigned, inventory, []);
    expect(cards.equipped).toEqual([assigned[0]]);
    expect(cards.equipped[0]).toBe(assigned[0]);
    expect(cards.inventory).toEqual([inventory[0], inventory[1]]);
  });

  it('applies stowing, equipping and discarding to the draft cards', () => {
    const moves: DraftMove[] = [
      { ref: ref('e2'), target: { kind: 'inventory' } },
      { ref: ref('e1'), target: { kind: 'equipped', slot: 'body' } },
      { ref: ref('b1'), target: { kind: 'discardPile' } },
    ];
    const cards: DraftCards = draftCards('a', assigned, inventory, moves);
    expect(cards.equipped).toEqual([assignedCard(RUNE_ARMOR, 'a', 'body')]);
    expect(cards.inventory).toEqual([inventoryCard(TOWER_SHIELD, 'a')]);
  });

  it('never puts a card that is no equipment into a slot', () => {
    const moves: DraftMove[] = [{ ref: ref('b1'), target: { kind: 'equipped', slot: 'head' } }];
    expect(draftCards('a', assigned, inventory, moves).equipped).toEqual([assigned[0]]);
  });
});
