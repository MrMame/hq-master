import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
  TestRequest,
} from '@angular/common/http/testing';

import { DeckXmlLoaderService } from './deck-xml-loader.service';
import { DeckConfig } from '../models/deck-config.model';
import { Card } from '../models/card.model';

const DECK_XML: string = `
  <deck id="d1" name="Testdeck" backImage="back.svg" type="combat">
    <card id="c1" name="Schwert" image="sword.svg">
      <description>  Scharf  </description>
      <attack>4</attack>
      <defense>2</defense>
    </card>
    <card id="b1" name="Fackel" image="torch.svg" type="basic" />
  </deck>`;

describe('DeckXmlLoaderService', () => {
  let service: DeckXmlLoaderService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(DeckXmlLoaderService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  describe('parseXml', () => {
    it('reads the deck attributes', () => {
      const deck: DeckConfig = service.parseXml(DECK_XML);

      expect(deck.id).toBe('d1');
      expect(deck.name).toBe('Testdeck');
      expect(deck.backImagePath).toBe('back.svg');
      expect(deck.defaultCardType).toBe('combat');
      expect(deck.cards.map((c: Card) => c.id)).toEqual(['c1', 'b1']);
    });

    it('parses combat cards with attack, defense and trimmed description', () => {
      const card: Card = service.parseXml(DECK_XML).cards[0];

      expect(card).toEqual({
        id: 'c1',
        name: 'Schwert',
        imagePath: 'sword.svg',
        description: 'Scharf',
        cardType: 'combat',
        attack: 4,
        defense: 2,
      });
    });

    it('lets a card override the deck type', () => {
      const card: Card = service.parseXml(DECK_XML).cards[1];

      expect(card.cardType).toBe('basic');
      expect('attack' in card).toBe(false);
    });

    it('defaults the deck type to basic', () => {
      const deck: DeckConfig = service.parseXml('<deck><card id="x" /></deck>');

      expect(deck.defaultCardType).toBe('basic');
      expect(deck.cards[0].cardType).toBe('basic');
    });

    it('falls back to empty strings and generated ids for missing attributes', () => {
      const deck: DeckConfig = service.parseXml('<deck><card /></deck>');
      const card: Card = deck.cards[0];

      expect(deck.id).toMatch(/.+/);
      expect(deck.name).toBe('');
      expect(deck.backImagePath).toBe('');
      expect(card.id).toMatch(/.+/);
      expect(card.id).not.toBe(deck.id);
      expect(card.name).toBe('');
      expect(card.imagePath).toBe('');
      expect(card.description).toBe('');
    });

    it('defaults missing attack and defense of combat cards to 0', () => {
      const card: Card = service.parseXml('<deck type="combat"><card id="c" /></deck>').cards[0];

      expect(card).toMatchObject({ cardType: 'combat', attack: 0, defense: 0 });
    });

    it('throws when the <deck> element is missing', () => {
      expect(() => service.parseXml('<cards><card /></cards>')).toThrowError(
        'Invalid deck XML: missing <deck> element',
      );
    });
  });

  describe('loadFromUrl', () => {
    it('fetches the XML as text and parses it', async () => {
      const result: Promise<DeckConfig> = service.loadFromUrl('/decks/test.xml');

      const req: TestRequest = http.expectOne('/decks/test.xml');
      expect(req.request.method).toBe('GET');
      expect(req.request.responseType).toBe('text');
      req.flush(DECK_XML);

      expect((await result).name).toBe('Testdeck');
    });

    it('rejects when the request fails', async () => {
      const result: Promise<DeckConfig> = service.loadFromUrl('/decks/missing.xml');

      http
        .expectOne('/decks/missing.xml')
        .flush('not found', { status: 404, statusText: 'Not Found' });

      await expect(result).rejects.toThrow();
    });
  });
});
