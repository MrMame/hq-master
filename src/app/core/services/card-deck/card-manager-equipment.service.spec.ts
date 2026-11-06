import { TestBed } from '@angular/core/testing';

import { CardManagerService } from './card-manager.service';
import { DeckState } from '../../models/deck-state.model';
import { SESSION_KEYS } from '../../session-state/session-keys';
import { createEquipmentDeckState, RUNE_ARMOR, TOWER_SHIELD } from '../../testing/deck.fixtures';

const readStored: () => DeckState = (): DeckState =>
  JSON.parse(localStorage.getItem(SESSION_KEYS.deckState) ?? 'null') as DeckState;

describe('CardManagerService – equipment', () => {
  let service: CardManagerService;
  const state: () => DeckState = (): DeckState => service.state() as DeckState;

  beforeEach(() => {
    service = TestBed.inject(CardManagerService);
    // Runenrüstung aktiv, Turmschild in der linken Hand von „a“.
    service.restore(createEquipmentDeckState('a'));
  });

  it('exposes the assigned cards and an empty list without deck', () => {
    expect(service.assigned().map((entry) => entry.card)).toEqual([TOWER_SHIELD]);
    service.restore(null);
    expect(service.assigned()).toEqual([]);
  });

  it('assigns the active card and persists it', () => {
    service.assignActiveCard('a', 'body');
    expect(state().activeCard).toBeNull();
    expect(service.assigned().map((entry) => entry.card)).toEqual([TOWER_SHIELD, RUNE_ARMOR]);
    expect(readStored()).toEqual(state());
  });

  it('moves the previous card of an occupied slot onto the discard pile', () => {
    service.assignActiveCard('a', 'leftHand');
    expect(state().discardPile).toEqual([TOWER_SHIELD]);
    expect(service.assigned().map((entry) => entry.slot)).toEqual(['leftHand']);
  });

  it('discards an assigned card onto the discard pile', () => {
    service.discardAssignedCards(['e2']);
    expect(service.assigned()).toEqual([]);
    expect(state().discardPile).toEqual([TOWER_SHIELD]);
    expect(readStored()).toEqual(state());
  });

  it('keeps assigned cards with their owners on reshuffle all', () => {
    service.reshuffleAll();
    expect(service.assigned().map((entry) => entry.card)).toEqual([TOWER_SHIELD]);
    expect(
      state()
        .drawPile.map((card) => card.id)
        .sort(),
    ).toEqual(['b1', 'c1', 'e1']);
  });

  it('does not make an assigned card active', () => {
    service.makeCardActive('e2');
    expect(service.assigned().map((entry) => entry.card)).toEqual([TOWER_SHIELD]);
    expect(state().activeCard).toBeNull();
  });

  it('drops all assignments when a new deck is loaded', () => {
    service.loadDeckConfig(state().config);
    expect(service.assigned()).toEqual([]);
    expect(state().drawPile).toHaveLength(4);
  });

  it('changes nothing for moves without an active card or with an empty draw pile', () => {
    service.restore({ ...createEquipmentDeckState('a'), activeCard: null, drawPile: [] });
    const before: DeckState = state();
    service.draw();
    service.discardActiveCard();
    service.shuffleActiveCardIntoDrawPile();
    service.dropActiveCardIntoBank();
    expect(state()).toBe(before);
  });
});
