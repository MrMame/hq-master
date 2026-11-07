import { TestBed } from '@angular/core/testing';

import { CardManagerService } from './card-manager.service';
import { DeckState } from '../../models/deck-state.model';
import { createDeckState } from '../../testing/deck.fixtures';
import { SESSION_KEYS } from '../../session-state/session-keys';

const EMPTY: DeckState = { decks: [], hand: [], assigned: [], inventory: [] };

const readStored: () => DeckState = (): DeckState =>
  JSON.parse(localStorage.getItem(SESSION_KEYS.deckState) ?? 'null') as DeckState;

describe('CardManagerService – session slice', () => {
  let service: CardManagerService;

  beforeEach(() => {
    service = TestBed.inject(CardManagerService);
  });

  it('should restore the deck state in signal, sessionState and storage', () => {
    service.restore(createDeckState());
    expect(service.sessionState()).toEqual(createDeckState());
    expect(readStored()).toEqual(createDeckState());
  });

  it('should remove all decks on reset (new session)', () => {
    service.restore(createDeckState());
    service.reset();
    expect(service.sessionState()).toEqual(EMPTY);
    expect(service.assigned()).toEqual([]);
    expect(readStored()).toEqual(EMPTY);
  });
});
