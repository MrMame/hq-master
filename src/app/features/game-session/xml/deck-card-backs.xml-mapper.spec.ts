import { readDeck, writeDeck } from './deck.xml-mapper';
import { DeckState } from '../../../core/models/deck-state.model';
import {
  BASIC_CARD,
  createDeckInstance,
  inventoryCard,
  OWN_BACK_CARD,
  TEST_BACK,
} from '../../../core/testing/deck.fixtures';

function parse(xml: string): Element {
  return new DOMParser().parseFromString(xml, 'application/xml').documentElement;
}

describe('deck.xml-mapper – card backs', () => {
  it('keeps the own back of a card and the deck back of the others', () => {
    const state: DeckState = {
      decks: [createDeckInstance('deck-1', { drawPile: [OWN_BACK_CARD, BASIC_CARD] })],
      hand: [{ deckId: 'deck-1', card: OWN_BACK_CARD }],
      assigned: [],
      inventory: [inventoryCard(BASIC_CARD, 'a')],
      belt: [],
    };
    const doc: XMLDocument = document.implementation.createDocument(null, null);
    const xml: string = new XMLSerializer().serializeToString(writeDeck(doc, state));

    expect(xml).toContain('backImage="cards/special-back.svg"');
    expect(readDeck(parse(xml))).toEqual(state);
  });

  it('gives cards of older save games without backImage the back of their deck', () => {
    const state: DeckState = readDeck(
      parse(`<cardDeck>
        <deck id="d1"><config backImage="${TEST_BACK}"/><drawPile><card id="a"/></drawPile></deck>
        <hand><handCard deckId="d1"><card id="b" type="combat" attack="2"/></handCard></hand>
        <inventory><item deckId="d1" characterId="x"><card id="c"/></item></inventory>
      </cardDeck>`),
    );

    expect(state.decks[0].drawPile[0].backImagePath).toBe(TEST_BACK);
    expect(state.hand[0].card).toMatchObject({ backImagePath: TEST_BACK });
    expect('cardType' in state.hand[0].card).toBe(false);
    expect('attack' in state.hand[0].card).toBe(false);
    expect(state.inventory[0].card.backImagePath).toBe(TEST_BACK);
  });
});
