import { TestBed } from '@angular/core/testing';
import { Mock } from 'vitest';

import { CardManagerService } from './card-manager.service';
import { DeckXmlLoaderService } from './deck-xml-loader.service';
import { Card } from '../../models/card.model';
import { DeckConfig } from '../../models/deck-config.model';
import { DeckInstance, DeckState } from '../../models/deck-state.model';
import {
  createDeckInstance,
  createDeckState,
  createTwoDeckState,
} from '../../testing/deck.fixtures';
import { describePersistedState } from '../../session-state/testing/describe-persisted-state';
import { SESSION_KEYS } from '../../session-state/session-keys';

const KEY: string = SESSION_KEYS.deckState;
const EMPTY: DeckState = { decks: [], activeCard: null, assigned: [] };

const readStored: () => DeckState = (): DeckState =>
  JSON.parse(localStorage.getItem(KEY) ?? 'null') as DeckState;

const ids: (cards: Card[]) => string[] = (cards: Card[]): string[] => cards.map((c) => c.id).sort();

describe('CardManagerService', () => {
  let service: CardManagerService;
  let loadFromUrl: Mock<(url: string) => Promise<DeckConfig>>;
  const config: DeckConfig = createDeckInstance().config;

  const createService: () => CardManagerService = (): CardManagerService =>
    TestBed.inject(CardManagerService);
  const deck: (index: number) => DeckInstance = (index) => service.decks()[index];

  beforeEach(() => {
    loadFromUrl = vi.fn();
    TestBed.configureTestingModule({
      providers: [{ provide: DeckXmlLoaderService, useValue: { loadFromUrl } }],
    });
  });

  describePersistedState('state', {
    key: SESSION_KEYS.deckState,
    create: createService,
    read: (s: CardManagerService) => s.state(),
    fallback: EMPTY,
    stored: { raw: createDeckState(), expected: createDeckState() },
    mutate: (s: CardManagerService) => s.addDeckConfig(config, 'decks/test.xml'),
  });

  describe('deck management', () => {
    beforeEach(() => {
      service = createService();
    });

    it('should add a loaded deck file as a new deck and keep the existing ones', async () => {
      service.restore(createDeckState());
      loadFromUrl.mockResolvedValue(config);
      await service.addDeck('decks/test.xml');
      expect(loadFromUrl).toHaveBeenCalledWith('decks/test.xml');
      expect(service.decks().map((d) => d.name)).toEqual(['Testdeck', 'Testdeck (2)']);
      expect(deck(1).source).toBe('decks/test.xml');
      expect(ids(deck(1).drawPile)).toEqual(['b1', 'c1']);
      expect(deck(0)).toEqual(createDeckState().decks[0]);
      expect(readStored()).toEqual(service.state());
    });

    it('should give every added deck its own id', () => {
      service.addDeckConfig(config, '');
      service.addDeckConfig(config, '');
      expect(new Set(service.decks().map((d) => d.id)).size).toBe(2);
    });

    it('should rename, reorder and remove a deck', () => {
      service.restore(createTwoDeckState());
      service.renameDeck('deck-2', 'Monster');
      service.moveDeck('deck-2', -1);
      expect(service.decks().map((d) => d.name)).toEqual(['Monster', 'Testdeck']);
      service.removeDeck('deck-1');
      expect(service.decks().map((d) => d.id)).toEqual(['deck-2']);
      expect(readStored()).toEqual(service.state());
    });

    it('should shuffle and reset only the chosen deck', () => {
      service.restore(createTwoDeckState());
      service.draw('deck-2');
      service.dropActiveCardIntoBank();
      service.shuffle('deck-2');
      service.resetDeck('deck-2');
      expect(ids(deck(1).drawPile)).toEqual(['b1', 'c1']);
      expect(deck(1).bank).toEqual([]);
      expect(deck(0)).toEqual(createTwoDeckState().decks[0]);
    });
  });

  describe('active card', () => {
    beforeEach(() => {
      service = createService();
      service.restore(createTwoDeckState());
    });

    it('should draw from any deck and discard the previous active card into its own deck', () => {
      service.draw('deck-1');
      expect(service.state().activeCard).toEqual({
        deckId: 'deck-1',
        card: deck(0).config.cards[1],
      });
      service.draw('deck-2');
      expect(service.state().activeCard?.deckId).toBe('deck-2');
      expect(ids(deck(0).discardPile)).toEqual(['b1']);
      expect(deck(1).discardPile).toEqual([]);
      expect(readStored()).toEqual(service.state());
    });

    it('should make a card active, shuffle it back and drop it into the bank of its deck', () => {
      service.makeCardActive('deck-2', 'c1');
      service.shuffleActiveCardIntoDrawPile();
      expect(ids(deck(1).drawPile)).toEqual(['b1', 'c1']);
      service.makeCardActive('deck-2', 'c1');
      service.dropActiveCardIntoBank();
      expect(ids(deck(1).bank)).toEqual(['c1']);
      service.makeCardActive('deck-2', 'c1');
      service.discardActiveCard();
      expect(ids(deck(1).discardPile)).toEqual(['c1']);
      expect(service.state().activeCard).toBeNull();
    });

    it('should not write when nothing changes', () => {
      const before: DeckState = service.state();
      service.discardActiveCard();
      service.draw('unknown');
      expect(service.state()).toBe(before);
    });
  });
});
