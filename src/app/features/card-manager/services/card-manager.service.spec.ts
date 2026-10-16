import { TestBed } from '@angular/core/testing';

import { CardManagerService } from './card-manager.service';
import { DeckState } from '../models/deck-state.model';
import { createDeckState } from '../../game-session/services/session-test-data';

const readStored: () => DeckState | null = (): DeckState | null =>
  JSON.parse(localStorage.getItem('card_manager_deck_state') ?? 'null') as DeckState | null;

describe('CardManagerService', () => {
  let service: CardManagerService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(CardManagerService);
  });

  it('should set the deck state in signal and storage on restoreState', () => {
    const deck: DeckState = createDeckState();
    service.restoreState(deck);
    expect(service.state()).toEqual(deck);
    expect(readStored()).toEqual(deck);
  });

  it('should clear the deck state on restoreState(null)', () => {
    service.restoreState(createDeckState());
    service.restoreState(null);
    expect(service.state()).toBeNull();
    expect(readStored()).toBeNull();
  });
});
