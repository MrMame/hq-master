import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { MockInstance } from 'vitest';

import { DeckXmlLoaderService } from './deck-xml-loader.service';
import { moveCard } from './card-move.util';
import { emptyDeckState } from './deck-state.util';
import { DeckConfig } from '../../models/deck-config.model';
import { DeckState } from '../../models/deck-state.model';
import { CardLocation } from '../../models/card-location.model';

const deckXml: (cards: string) => string = (cards) =>
  `<deck id="d1" name="Testdeck" backImage="back.svg">${cards}</deck>`;

const card: (id: string, attrs?: string) => string = (id, attrs = '') =>
  `<card id="${id}" name="Gold" image="gold.svg" ${attrs}><property name="Gold" value="5"/></card>`;

describe('DeckXmlLoaderService – unique ids and count', () => {
  let service: DeckXmlLoaderService;
  let warn: MockInstance<(...data: unknown[]) => void>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(DeckXmlLoaderService);
    warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
  });

  afterEach(() => vi.restoreAllMocks());

  const ids: (xml: string) => string[] = (xml) =>
    service.parseXml(deckXml(xml)).cards.map((c) => c.id);

  it('loads 5 cards with the same id as 5 cards with different ids and warns once', () => {
    expect(ids(card('gold').repeat(5))).toEqual(['gold', 'gold-2', 'gold-3', 'gold-4', 'gold-5']);
    expect(warn).toHaveBeenCalledOnce();
    expect(String(warn.mock.calls[0][0])).toContain('d1');
    expect(String(warn.mock.calls[0][0])).toContain('gold');
  });

  it('names every duplicated id in the warning', () => {
    ids(card('a') + card('b') + card('a') + card('b') + card('c'));
    const message: string = String(warn.mock.calls[0][0]);
    expect(message).toContain('IDs a, b –');
  });

  it('never gives a suffix that already stands in the XML', () => {
    expect(ids(card('a') + card('a') + card('a-2'))).toEqual(['a', 'a-3', 'a-2']);
  });

  it('loads a deck without duplicates and count unchanged and without warning', () => {
    expect(ids(card('x') + card('y') + card('z'))).toEqual(['x', 'y', 'z']);
    expect(warn).not.toHaveBeenCalled();
  });

  it('creates count copies with all fields and unique ids, without duplicate warning', () => {
    const deck: DeckConfig = service.parseXml(deckXml(card('gold', 'count="3"') + card('x')));

    expect(deck.cards.map((c) => c.id)).toEqual(['gold', 'gold-2', 'gold-3', 'x']);
    expect(deck.cards[2]).toEqual({ ...deck.cards[0], id: 'gold-3' });
    expect(deck.cards[2].properties).toEqual([{ name: 'Gold', value: 5 }]);
    expect(warn).not.toHaveBeenCalled();
  });

  it.each([
    ['missing', ''],
    ['invalid', 'count="viele"'],
    ['too small', 'count="0"'],
  ])('loads one card for a %s count', (_label, attrs) => {
    expect(ids(card('gold', attrs))).toEqual(['gold']);
  });

  it('warns about a duplicate id that also has a count', () => {
    expect(ids(card('a', 'count="2"') + card('a'))).toEqual(['a', 'a-2', 'a-3']);
    expect(warn).toHaveBeenCalledOnce();
  });

  describe('moving one of several equal cards', () => {
    const targets: [string, CardLocation][] = [
      ['belt', { kind: 'belt', characterId: 'hero' }],
      ['hand', { kind: 'hand' }],
      ['slot', { kind: 'equipped', characterId: 'hero', slot: 'body' }],
      ['discard pile', { kind: 'discardPile' }],
      ['bank', { kind: 'bank' }],
    ];

    it.each(targets)('to the %s takes exactly one card from the draw pile', (_label, target) => {
      const config: DeckConfig = service.parseXml(deckXml(card('gold').repeat(5)));
      const state: DeckState = {
        ...emptyDeckState(),
        decks: [
          {
            id: 'deck-1',
            name: 'Gold',
            source: '',
            config,
            drawPile: config.cards,
            discardPile: [],
            bank: [],
          },
        ],
      };

      const moved: DeckState = moveCard(state, { deckId: 'deck-1', cardId: 'gold-3' }, target);

      expect(moved.decks[0].drawPile.map((c) => c.id)).toEqual([
        'gold',
        'gold-2',
        'gold-4',
        'gold-5',
      ]);
      const everywhere: string[] = [
        ...moved.decks[0].discardPile,
        ...moved.decks[0].bank,
        ...[...moved.hand, ...moved.assigned, ...moved.belt].map((entry) => entry.card),
      ].map((c) => c.id);
      expect(everywhere).toEqual(['gold-3']);
    });
  });
});
