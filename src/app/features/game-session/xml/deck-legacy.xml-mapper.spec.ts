import { readDeck, writeDeck } from './deck.xml-mapper';
import { DeckState } from '../../../core/models/deck-state.model';
import { Card } from '../../../core/models/card.model';
import {
  BASIC_CARD,
  createEquipmentDeckState,
  createTwoDeckState,
} from '../../../core/testing/deck.fixtures';

function parse(xml: string): Element {
  return new DOMParser().parseFromString(xml, 'application/xml').documentElement;
}

function roundTrip(state: DeckState): DeckState {
  const doc: XMLDocument = document.implementation.createDocument(null, null);
  return readDeck(parse(new XMLSerializer().serializeToString(writeDeck(doc, state))));
}

describe('deck.xml-mapper – older saves with one deck', () => {
  it('reads one deck with its active card as the only hand card and its assignments', () => {
    const xml: string = `<cardDeck>
      <config id="old" name="Altes Deck"/>
      <drawPile><card id="b1" name="Fackel"/></drawPile>
      <activeCard><card id="c1" type="combat" attack="3" defense="1"/></activeCard>
      <assigned><assignment characterId="a" slot="leftHand">
        <card id="e2" type="equipment" slot="hand"><property name="Abwehr" value="2"/></card>
      </assignment></assigned>
    </cardDeck>`;
    const state: DeckState = readDeck(parse(xml));
    expect(state.decks).toHaveLength(1);
    expect(state.decks[0]).toMatchObject({ id: 'old', name: 'Altes Deck', source: '' });
    expect(state.decks[0].drawPile.map((card) => card.id)).toEqual(['b1']);
    expect(state.hand.map((entry) => [entry.deckId, entry.card.id])).toEqual([['old', 'c1']]);
    expect(state.assigned.map((entry) => [entry.deckId, entry.card.id])).toEqual([['old', 'e2']]);
  });

  it('reads missing lists as empty and a missing active card as an empty hand', () => {
    expect(readDeck(parse('<cardDeck><config/></cardDeck>'))).toEqual({
      decks: [
        {
          id: 'deck-1',
          name: '',
          source: '',
          config: { id: '', name: '', backImagePath: '', cards: [] },
          drawPile: [],
          discardPile: [],
          bank: [],
        },
      ],
      hand: [],
      assigned: [],
      inventory: [],
      belt: [],
    });
  });

  it.each<[string, string, Card]>([
    [
      'card without attributes and description',
      '<card/>',
      {
        id: '',
        name: '',
        imagePath: '',
        backImagePath: 'back.svg',
        description: '',
        properties: [],
      },
    ],
    [
      'card with an old type',
      '<card id="x" type="magic"><description>D</description></card>',
      {
        id: 'x',
        name: '',
        imagePath: '',
        backImagePath: 'back.svg',
        description: 'D',
        properties: [],
      },
    ],
    [
      'former combat card without values',
      '<card id="k" type="combat" attack="4" defense="3" backImage="own.svg"/>',
      {
        id: 'k',
        name: '',
        imagePath: '',
        backImagePath: 'own.svg',
        description: '',
        properties: [],
      },
    ],
  ])('reads a %s with fallback values', (_case, cardXml, expected) => {
    const state: DeckState = readDeck(
      parse(`<cardDeck><config backImage="back.svg"/><bank>${cardXml}</bank></cardDeck>`),
    );
    expect(state.decks[0].bank).toEqual([expected]);
  });

  it('neither writes a type nor a slot', () => {
    const doc: XMLDocument = document.implementation.createDocument(null, null);
    const el: Element = writeDeck(doc, createEquipmentDeckState('a'));
    expect(el.querySelector('card[type], card[slot], config[defaultCardType]')).toBeNull();
  });

  it('keeps a card without properties unchanged', () => {
    expect(roundTrip(createTwoDeckState()).decks[0].drawPile).toEqual([BASIC_CARD]);
  });
});
