import { TestBed } from '@angular/core/testing';

import { CardManagerService } from './card-manager.service';
import { CardRef, DeckState } from '../../models/deck-state.model';
import { SESSION_KEYS } from '../../session-state/session-keys';
import {
  assignedCard,
  BUCKLER,
  createDeckInstance,
  createEquipmentDeckState,
  RUNE_ARMOR,
  TOWER_SHIELD,
} from '../../testing/deck.fixtures';

const RUNE_ARMOR_REF: CardRef = { deckId: 'deck-1', cardId: 'e1' };

const readStored: () => DeckState = (): DeckState =>
  JSON.parse(localStorage.getItem(SESSION_KEYS.deckState) ?? 'null') as DeckState;

describe('CardManagerService – equipment', () => {
  let service: CardManagerService;
  const state: () => DeckState = (): DeckState => service.state();

  beforeEach(() => {
    service = TestBed.inject(CardManagerService);
    // Runenrüstung in der Hand, Turmschild in der linken Hand von „a“.
    service.restore(createEquipmentDeckState('a'));
  });

  it('assigns a hand card with its deck and persists it', () => {
    service.moveCard(RUNE_ARMOR_REF, { kind: 'equipped', characterId: 'a', slot: 'body' });
    expect(state().hand).toEqual([]);
    expect(service.assigned()).toEqual([
      assignedCard(TOWER_SHIELD, 'a', 'leftHand'),
      assignedCard(RUNE_ARMOR, 'a', 'body'),
    ]);
    expect(readStored()).toEqual(state());
  });

  it('moves the previous card of an occupied slot onto the discard pile of its deck', () => {
    service.restore({
      ...createEquipmentDeckState('a'),
      hand: [{ deckId: 'deck-1', card: BUCKLER }],
    });
    service.moveCard(
      { deckId: 'deck-1', cardId: 'e3' },
      { kind: 'equipped', characterId: 'a', slot: 'leftHand' },
    );
    expect(state().decks[0].discardPile).toEqual([TOWER_SHIELD]);
    expect(service.assigned().map((entry) => entry.slot)).toEqual(['leftHand']);
  });

  it('discards an assigned card onto the discard pile of its deck', () => {
    service.discardOwnedCards([{ deckId: 'deck-1', cardId: 'e2' }]);
    expect(service.assigned()).toEqual([]);
    expect(state().decks[0].discardPile).toEqual([TOWER_SHIELD]);
    expect(readStored()).toEqual(state());
  });

  it('keeps cards with the same id from another deck when discarding', () => {
    service.discardOwnedCards([{ deckId: 'deck-2', cardId: 'e2' }]);
    expect(service.assigned()).toEqual([assignedCard(TOWER_SHIELD, 'a', 'leftHand')]);
  });

  it('keeps assigned cards with their owners on reset of their deck', () => {
    service.resetDeck('deck-1');
    expect(service.assigned().map((entry) => entry.card)).toEqual([TOWER_SHIELD]);
    expect(state().hand).toEqual([]);
    expect(
      state()
        .decks[0].drawPile.map((card) => card.id)
        .sort(),
    ).toEqual(['b1', 'c1', 'e1']);
  });

  it('takes an assigned card into the hand next to the earlier hand card and frees its slot', () => {
    service.moveCard({ deckId: 'deck-1', cardId: 'e2' }, { kind: 'hand' });
    expect(service.assigned()).toEqual([]);
    expect(state().hand.map((entry) => entry.card)).toEqual([RUNE_ARMOR, TOWER_SHIELD]);
    expect(state().decks[0].discardPile).toEqual([]);
  });

  it('removes the equipped cards of a removed deck, but not those of other decks', () => {
    service.restore({
      ...createEquipmentDeckState('a'),
      decks: [...createEquipmentDeckState('a').decks, createDeckInstance('deck-2')],
      assigned: [
        assignedCard(TOWER_SHIELD, 'a', 'leftHand'),
        assignedCard(TOWER_SHIELD, 'b', 'rightHand', 'deck-2'),
      ],
    });
    service.removeDeck('deck-1');
    expect(service.assigned()).toEqual([assignedCard(TOWER_SHIELD, 'b', 'rightHand', 'deck-2')]);
    expect(state().hand).toEqual([]);
  });
});
