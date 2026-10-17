import { TestBed } from '@angular/core/testing';
import { Mock } from 'vitest';

import { CardManagerService } from './card-manager.service';
import { DeckXmlLoaderService } from './deck-xml-loader.service';
import { Card } from '../models/card.model';
import { DeckConfig } from '../models/deck-config.model';
import { DeckState } from '../models/deck-state.model';
import { createDeckState } from '../../game-session/testing/session.fixtures';
import { describePersistedState } from '../../../core/session-state/testing/describe-persisted-state';
import { SESSION_KEYS } from '../../../core/session-state/session-keys';

const KEY: string = SESSION_KEYS.deckState;

const readStored: () => DeckState | null = (): DeckState | null =>
  JSON.parse(localStorage.getItem(KEY) ?? 'null') as DeckState | null;

const ids: (cards: Card[]) => string[] = (cards: Card[]): string[] => cards.map((c) => c.id).sort();

describe('CardManagerService', () => {
  let service: CardManagerService;
  let loadFromUrl: Mock<(url: string) => Promise<DeckConfig>>;
  // Fixture: Karten c1 + b1, Ziehstapel [b1], aktive Karte c1.
  const deck: DeckState = createDeckState();

  const createService: () => CardManagerService = (): CardManagerService =>
    TestBed.inject(CardManagerService);

  const state: () => DeckState = (): DeckState => service.state() as DeckState;

  beforeEach(() => {
    loadFromUrl = vi.fn();
    TestBed.configureTestingModule({
      providers: [{ provide: DeckXmlLoaderService, useValue: { loadFromUrl } }],
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describePersistedState('state', {
    key: SESSION_KEYS.deckState,
    create: createService,
    read: (s: CardManagerService) => s.state(),
    fallback: null,
    stored: { raw: deck, expected: deck },
    mutate: (s: CardManagerService) => s.loadDeckConfig(deck.config),
  });

  describe('mutations', () => {
    beforeEach(() => {
      service = createService();
      service.restore(deck);
    });

    it('should load a deck config with all cards on the draw pile', () => {
      service.loadDeckConfig(deck.config);
      expect(ids(state().drawPile)).toEqual(['b1', 'c1']);
      expect(state().activeCard).toBeNull();
      expect(readStored()).toEqual(state());
    });

    it('should load a deck from url via the loader', async () => {
      loadFromUrl.mockResolvedValue(deck.config);
      await service.loadDeck('decks/test.xml');
      expect(loadFromUrl).toHaveBeenCalledWith('decks/test.xml');
      expect(state().config).toEqual(deck.config);
      expect(readStored()).toEqual(state());
    });

    it('should shuffle the draw pile without losing cards', () => {
      service.shuffle();
      expect(ids(state().drawPile)).toEqual(['b1']);
      expect(readStored()).toEqual(state());
    });

    it('should draw the top card as active card', () => {
      service.restore({ ...deck, activeCard: null });
      service.draw();
      expect(state().activeCard?.id).toBe('b1');
      expect(state().drawPile).toEqual([]);
      expect(readStored()).toEqual(state());
    });

    it('should discard the active card', () => {
      service.discardActiveCard();
      expect(ids(state().discardPile)).toEqual(['c1']);
      expect(state().activeCard).toBeNull();
      expect(readStored()).toEqual(state());
    });

    it('should shuffle the active card into the draw pile', () => {
      service.shuffleActiveCardIntoDrawPile();
      expect(ids(state().drawPile)).toEqual(['b1', 'c1']);
      expect(state().activeCard).toBeNull();
      expect(readStored()).toEqual(state());
    });

    it('should drop the active card into the bank', () => {
      service.dropActiveCardIntoBank();
      expect(ids(state().bank)).toEqual(['c1']);
      expect(state().activeCard).toBeNull();
      expect(readStored()).toEqual(state());
    });

    it('should make a card active and discard the previous one', () => {
      service.makeCardActive('b1');
      expect(state().activeCard?.id).toBe('b1');
      expect(state().drawPile).toEqual([]);
      expect(ids(state().discardPile)).toEqual(['c1']);
      expect(readStored()).toEqual(state());
    });

    it('should reshuffle all cards back onto the draw pile', () => {
      service.dropActiveCardIntoBank();
      service.reshuffleAll();
      expect(ids(state().drawPile)).toEqual(['b1', 'c1']);
      expect(state().bank).toEqual([]);
      expect(state().activeCard).toBeNull();
      expect(readStored()).toEqual(state());
    });

    it('should ignore deck operations without a deck', () => {
      service.restore(null);
      service.shuffle();
      service.draw();
      service.discardActiveCard();
      service.reshuffleAll();
      service.makeCardActive('c1');
      expect(service.state()).toBeNull();
      expect(readStored()).toBeNull();
    });

    it('should restore the deck state in signal, sessionState and storage', () => {
      expect(service.sessionState()).toEqual(deck);
      expect(readStored()).toEqual(deck);
      service.restore(null);
      expect(service.state()).toBeNull();
      expect(readStored()).toBeNull();
    });

    it('should drop the deck on reset (new session)', () => {
      service.reset();
      expect(service.sessionState()).toBeNull();
      expect(readStored()).toBeNull();
    });
  });
});
