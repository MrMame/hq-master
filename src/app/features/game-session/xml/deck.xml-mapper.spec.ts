import { readDeck, writeDeck } from './deck.xml-mapper';
import { DeckState } from '../../card-manager/models/deck-state.model';
import { Card } from '../../card-manager/models/card.model';

function parse(xml: string): Element {
  return new DOMParser().parseFromString(xml, 'application/xml').documentElement;
}

const basicCard: Card = {
  id: 'c1',
  name: 'Fackel',
  imagePath: 'fackel.svg',
  description: 'Licht',
  cardType: 'basic',
};

describe('deck.xml-mapper – fallbacks for old or hand-edited files', () => {
  it.each<[string, string]>([
    ['empty <cardDeck/>', '<cardDeck/>'],
    ['lists without <config>', '<cardDeck><drawPile/><bank/></cardDeck>'],
  ])('reads %s as "no deck loaded"', (_case, xml) => {
    expect(readDeck(parse(xml))).toBeNull();
  });

  it('reads missing lists as empty and a missing active card as null', () => {
    const deck: DeckState | null = readDeck(parse('<cardDeck><config/></cardDeck>'));
    expect(deck).toEqual({
      config: { id: '', name: '', backImagePath: '', defaultCardType: 'basic', cards: [] },
      drawPile: [],
      discardPile: [],
      activeCard: null,
      bank: [],
    });
  });

  it('reads an empty <activeCard/> as null', () => {
    const deck: DeckState | null = readDeck(parse('<cardDeck><config/><activeCard/></cardDeck>'));
    expect(deck?.activeCard).toBeNull();
  });

  it.each<[string, string, Card]>([
    [
      'card without attributes and description',
      '<card/>',
      { id: '', name: '', imagePath: '', description: '', cardType: 'basic' },
    ],
    [
      'unknown card type',
      '<card id="x" type="magic"><description>D</description></card>',
      { id: 'x', name: '', imagePath: '', description: 'D', cardType: 'basic' },
    ],
    [
      'combat card without values',
      '<card id="k" type="combat"/>',
      {
        id: 'k',
        name: '',
        imagePath: '',
        description: '',
        cardType: 'combat',
        attack: 0,
        defense: 0,
      },
    ],
    [
      'combat card with non-numeric values',
      '<card id="k" type="combat" attack="viel" defense="3"/>',
      {
        id: 'k',
        name: '',
        imagePath: '',
        description: '',
        cardType: 'combat',
        attack: 0,
        defense: 3,
      },
    ],
  ])('reads a %s with fallback values', (_case, cardXml, expected) => {
    const deck: DeckState | null = readDeck(
      parse(`<cardDeck><config/><bank>${cardXml}</bank></cardDeck>`),
    );
    expect(deck?.bank).toEqual([expected]);
  });
});

describe('deck.xml-mapper – writing', () => {
  it('writes an empty <cardDeck/> when no deck is loaded', () => {
    const doc: XMLDocument = document.implementation.createDocument(null, null);
    expect(writeDeck(doc, null).childNodes).toHaveLength(0);
  });

  it('writes an empty <activeCard/> when no card is active and reads it back', () => {
    const doc: XMLDocument = document.implementation.createDocument(null, null);
    const deck: DeckState = {
      config: {
        id: 'd',
        name: 'Deck',
        backImagePath: 'back.svg',
        defaultCardType: 'basic',
        cards: [basicCard],
      },
      drawPile: [basicCard],
      discardPile: [],
      activeCard: null,
      bank: [],
    };
    const el: Element = writeDeck(doc, deck);
    expect(el.querySelector('activeCard')?.children).toHaveLength(0);
    expect(readDeck(el)).toEqual(deck);
  });
});
