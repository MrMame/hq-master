import { readDeckInstance, writeDeckInstance } from './deck-instance.xml-mapper';
import { DeckInstance } from '../../../core/models/deck-state.model';
import { BASIC_CARD, COMBAT_CARD, createDeckInstance } from '../../../core/testing/deck.fixtures';

function parse(xml: string): Element {
  return new DOMParser().parseFromString(xml, 'application/xml').documentElement;
}

describe('deck-instance.xml-mapper', () => {
  it('writes name, source, config and piles and reads them back', () => {
    const deck: DeckInstance = createDeckInstance('d1', {
      name: 'Monster (2)',
      drawPile: [BASIC_CARD],
      discardPile: [COMBAT_CARD],
    });
    const doc: XMLDocument = document.implementation.createDocument(null, 'cardDeck');
    writeDeckInstance(doc.documentElement, deck);
    const el: Element = doc.documentElement.querySelector('deck')!;

    expect(el.getAttribute('source')).toBe('decks/test.xml');
    expect(readDeckInstance(parse(new XMLSerializer().serializeToString(el)))).toEqual(deck);
  });

  it('takes the name from the config when the instance has none', () => {
    const deck: DeckInstance = readDeckInstance(
      parse('<deck id="d"><config id="c" name="Schätze"/></deck>'),
    );
    expect(deck.name).toBe('Schätze');
    expect(deck.source).toBe('');
  });

  it('reads a deck without <config> with an empty configuration', () => {
    const deck: DeckInstance = readDeckInstance(parse('<deck id="d" name="Leer"/>'));
    expect(deck.config).toEqual({
      id: '',
      name: '',
      backImagePath: '',
      defaultCardType: 'basic',
      cards: [],
    });
    expect(deck.drawPile).toEqual([]);
  });
});
