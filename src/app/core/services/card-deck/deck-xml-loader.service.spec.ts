import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
  TestRequest,
} from '@angular/common/http/testing';

import { DeckXmlLoaderService } from './deck-xml-loader.service';
import { DeckConfig } from '../../models/deck-config.model';
import { Card } from '../../models/card.model';

const DECK_XML: string = `
  <deck id="d1" name="Testdeck" backImage="back.svg" type="combat">
    <card id="c1" name="Schwert" image="sword.svg">
      <description>  Scharf  </description>
      <attack>4</attack>
      <defense>2</defense>
    </card>
    <card id="b1" name="Fackel" image="torch.svg" backImage="torch-back.svg" type="basic" />
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
      expect(deck.cards.map((c: Card) => c.id)).toEqual(['c1', 'b1']);
    });

    it('loads cards of decks with a type without type and without old values', () => {
      const deck: DeckConfig = service.parseXml(DECK_XML);

      expect(Object.keys(deck)).not.toContain('defaultCardType');
      expect(deck.cards[0]).toEqual({
        id: 'c1',
        name: 'Schwert',
        imagePath: 'sword.svg',
        backImagePath: 'back.svg',
        description: 'Scharf',
        properties: [],
      });
    });

    it('lets a card replace the deck back', () => {
      const card: Card = service.parseXml(DECK_XML).cards[1];

      expect(card.backImagePath).toBe('torch-back.svg');
      expect(Object.keys(card)).not.toContain('cardType');
    });

    it('loads an old equipment card with type and slot without errors as an ordinary card', () => {
      const card: Card = service.parseXml(
        '<deck type="equipment"><card id="h" type="equipment" slot="head"><property name="Ruestung" value="1"/></card></deck>',
      ).cards[0];

      expect(card).toEqual({
        id: 'h',
        name: '',
        imagePath: '',
        backImagePath: '',
        description: '',
        properties: [{ name: 'Ruestung', value: 1 }],
      });
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
      expect(card.backImagePath).toBe('');
      expect(card.description).toBe('');
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
