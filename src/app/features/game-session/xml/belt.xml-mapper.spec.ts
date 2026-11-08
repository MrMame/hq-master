import { readBelt, writeBelt } from './belt.xml-mapper';
import { readDeck, writeDeck } from './deck.xml-mapper';
import { DeckState } from '../../../core/models/deck-state.model';
import {
  BASIC_CARD,
  createEquipmentDeckState,
  inventoryCard,
  RUNE_ARMOR,
} from '../../../core/testing/deck.fixtures';

function parse(xml: string): Element {
  return new DOMParser().parseFromString(xml, 'application/xml').documentElement;
}

describe('belt.xml-mapper', () => {
  it('keeps the belt of every character in a round trip, order included', () => {
    const deck: DeckState = {
      ...createEquipmentDeckState('a'),
      belt: [inventoryCard(RUNE_ARMOR, 'a'), inventoryCard(BASIC_CARD, 'b')],
    };
    const doc: XMLDocument = document.implementation.createDocument(null, null);
    const el: Element = writeDeck(doc, deck);

    expect(el.querySelectorAll('belt > item')).toHaveLength(2);
    expect(readDeck(parse(new XMLSerializer().serializeToString(el)))).toEqual(deck);
  });

  it('reads saves without <belt> with an empty belt and drops entries without card or owner', () => {
    expect(readBelt(parse('<cardDeck/>'))).toEqual([]);
    const el: Element = parse(
      '<cardDeck><belt><item deckId="d" characterId="a"/><item deckId="d"><card id="x"/></item></belt></cardDeck>',
    );
    expect(readBelt(el)).toEqual([]);
  });

  it('writes an empty <belt> without cards', () => {
    const doc: XMLDocument = document.implementation.createDocument(null, 'cardDeck');
    writeBelt(doc.documentElement, []);
    expect(doc.documentElement.querySelector('belt')?.children).toHaveLength(0);
  });
});
