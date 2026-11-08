import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { MockInstance } from 'vitest';

import { DeckXmlLoaderService } from './deck-xml-loader.service';
import { Card } from '../../models/card.model';

const deckXml: (card: string) => string = (card) =>
  `<deck id="d1" name="Testdeck" backImage="back.svg" type="basic">${card}</deck>`;

describe('DeckXmlLoaderService – properties', () => {
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

  const parseCard: (card: string) => Card = (card) => service.parseXml(deckXml(card)).cards[0];

  it('reads the properties of a card and ignores old type and slot', () => {
    const card: Card = parseCard(`
      <card id="e1" name="Runenrüstung" image="rune.svg" type="equipment" slot="body">
        <description>Leicht</description>
        <property name="Ruestung" value="+2"/>
        <property name="Tempo" value="-1"/>
      </card>`);

    expect(card).toEqual({
      id: 'e1',
      name: 'Runenrüstung',
      imagePath: 'rune.svg',
      backImagePath: 'back.svg',
      description: 'Leicht',
      properties: [
        { name: 'Ruestung', value: 2 },
        { name: 'Tempo', value: -1 },
      ],
    });
    expect(warn).not.toHaveBeenCalled();
  });

  it('reads properties of every card and keeps unknown names, trimmed', () => {
    const card: Card = parseCard(
      '<card id="w" name="Wirbelattacke"><property name=" Blitzschaden " value="2"/></card>',
    );
    expect(card.properties).toEqual([{ name: 'Blitzschaden', value: 2 }]);
  });

  it('loads a card without properties with an empty list and ignores <modifier>', () => {
    const card: Card = parseCard(
      '<card id="e2" name="Helm" type="equipment" slot="head"><modifier stat="armor" value="2"/></card>',
    );
    expect(card.properties).toEqual([]);
    expect(warn).not.toHaveBeenCalled();
  });

  it.each<[string, string]>([
    ['an empty name', '<property name=" " value="1"/>'],
    ['no name', '<property value="1"/>'],
    ['no value', '<property name="Tempo"/>'],
    ['a text value', '<property name="Tempo" value="x"/>'],
    ['a fraction', '<property name="Tempo" value="1.5"/>'],
  ])('loads the card without a property with %s and warns with the card id', (_case, property) => {
    const card: Card = parseCard(
      `<card id="x" name="Kaputt">${property}<property name="Angriff" value="3"/></card>`,
    );
    expect(card.properties).toEqual([{ name: 'Angriff', value: 3 }]);
    expect(warn).toHaveBeenCalledExactlyOnceWith(expect.stringContaining('„x“'));
  });
});
