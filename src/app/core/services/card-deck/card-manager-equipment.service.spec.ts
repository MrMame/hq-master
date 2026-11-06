import { TestBed } from '@angular/core/testing';

import { CardManagerService } from './card-manager.service';
import { DeckState } from '../../models/deck-state.model';
import { SESSION_KEYS } from '../../session-state/session-keys';
import {
  assignedCard,
  createDeckInstance,
  createEquipmentDeckState,
  RUNE_ARMOR,
  TOWER_SHIELD,
} from '../../testing/deck.fixtures';

const readStored: () => DeckState = (): DeckState =>
  JSON.parse(localStorage.getItem(SESSION_KEYS.deckState) ?? 'null') as DeckState;

describe('CardManagerService – equipment', () => {
  let service: CardManagerService;
  const state: () => DeckState = (): DeckState => service.state();

  beforeEach(() => {
    service = TestBed.inject(CardManagerService);
    // Runenrüstung aktiv, Turmschild in der linken Hand von „a“.
    service.restore(createEquipmentDeckState('a'));
  });

  it('assigns the active card with its deck and persists it', () => {
    service.assignActiveCard('a', 'body');
    expect(state().activeCard).toBeNull();
    expect(service.assigned()).toEqual([
      assignedCard(TOWER_SHIELD, 'a', 'leftHand'),
      assignedCard(RUNE_ARMOR, 'a', 'body'),
    ]);
    expect(readStored()).toEqual(state());
  });

  it('moves the previous card of an occupied slot onto the discard pile of its deck', () => {
    service.assignActiveCard('a', 'leftHand');
    expect(state().decks[0].discardPile).toEqual([TOWER_SHIELD]);
    expect(service.assigned().map((entry) => entry.slot)).toEqual(['leftHand']);
  });

  it('discards an assigned card onto the discard pile of its deck', () => {
    service.discardAssignedCards([{ deckId: 'deck-1', cardId: 'e2' }]);
    expect(service.assigned()).toEqual([]);
    expect(state().decks[0].discardPile).toEqual([TOWER_SHIELD]);
    expect(readStored()).toEqual(state());
  });

  it('keeps cards with the same id from another deck when discarding', () => {
    service.discardAssignedCards([{ deckId: 'deck-2', cardId: 'e2' }]);
    expect(service.assigned()).toEqual([assignedCard(TOWER_SHIELD, 'a', 'leftHand')]);
  });

  it('keeps assigned cards with their owners on reset of their deck', () => {
    service.resetDeck('deck-1');
    expect(service.assigned().map((entry) => entry.card)).toEqual([TOWER_SHIELD]);
    expect(state().activeCard).toBeNull();
    expect(
      state()
        .decks[0].drawPile.map((card) => card.id)
        .sort(),
    ).toEqual(['b1', 'c1', 'e1']);
  });

  it('does not make an assigned card active', () => {
    service.discardActiveCard();
    service.makeCardActive('deck-1', 'e2');
    expect(service.assigned().map((entry) => entry.card)).toEqual([TOWER_SHIELD]);
    expect(state().activeCard).toBeNull();
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
    expect(state().activeCard).toBeNull();
  });
});
