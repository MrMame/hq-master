import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { MockInstance } from 'vitest';

import { DeckXmlLoaderService } from './deck-xml-loader.service';
import { Card } from '../../models/card.model';

const deckXml: (card: string) => string = (card) =>
  `<deck id="d1" name="Testdeck" backImage="back.svg" type="basic">${card}</deck>`;

describe('DeckXmlLoaderService – equipment', () => {
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

  it('reads slot and modifiers of an equipment card', () => {
    const card: Card = parseCard(`
      <card id="e1" name="Runenrüstung" image="rune.svg" type="equipment" slot="body">
        <description>Leicht</description>
        <modifier stat="maxArmor" value="2"/>
        <modifier stat="speed" value="-1"/>
      </card>`);

    expect(card).toEqual({
      id: 'e1',
      name: 'Runenrüstung',
      imagePath: 'rune.svg',
      description: 'Leicht',
      cardType: 'equipment',
      slot: 'body',
      modifiers: [
        { stat: 'maxArmor', value: 2 },
        { stat: 'speed', value: -1 },
      ],
    });
    expect(warn).not.toHaveBeenCalled();
  });

  it('loads an equipment card without modifiers', () => {
    const card: Card = parseCard('<card id="e2" name="Helm" type="equipment" slot="head"/>');
    expect(card).toMatchObject({ cardType: 'equipment', slot: 'head', modifiers: [] });
  });

  it.each<[string, string]>([
    ['a missing slot', '<card id="x" name="Kaputt" type="equipment"/>'],
    ['an unknown slot', '<card id="x" name="Kaputt" type="equipment" slot="tail"/>'],
    [
      'an unknown stat',
      '<card id="x" name="Kaputt" type="equipment" slot="body"><modifier stat="luck" value="1"/></card>',
    ],
    [
      'a modifier without value',
      '<card id="x" name="Kaputt" type="equipment" slot="body"><modifier stat="speed"/></card>',
    ],
    [
      'a value that is no whole number',
      '<card id="x" name="Kaputt" type="equipment" slot="body"><modifier stat="speed" value="x"/></card>',
    ],
  ])('loads a card with %s as basic card and warns', (_case, xml) => {
    expect(parseCard(xml)).toMatchObject({ id: 'x', cardType: 'basic' });
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('Kaputt'));
  });
});
