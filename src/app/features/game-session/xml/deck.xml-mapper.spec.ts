import { readDeck, writeDeck } from './deck.xml-mapper';
import { DeckState } from '../../../core/models/deck-state.model';
import { Card } from '../../../core/models/card.model';
import {
  assignedCard,
  BASIC_CARD,
  COMBAT_CARD,
  createTwoDeckState,
  TOWER_SHIELD,
} from '../../../core/testing/deck.fixtures';

function parse(xml: string): Element {
  return new DOMParser().parseFromString(xml, 'application/xml').documentElement;
}

function roundTrip(state: DeckState): DeckState {
  const doc: XMLDocument = document.implementation.createDocument(null, null);
  return readDeck(parse(new XMLSerializer().serializeToString(writeDeck(doc, state))));
}

describe('deck.xml-mapper – several decks', () => {
  it('keeps all decks, the hand and assignments of two instances of the same file', () => {
    const state: DeckState = {
      ...createTwoDeckState(),
      hand: [
        { deckId: 'deck-2', card: COMBAT_CARD },
        { deckId: 'deck-1', card: COMBAT_CARD },
      ],
      assigned: [
        assignedCard(TOWER_SHIELD, 'a', 'leftHand'),
        assignedCard(TOWER_SHIELD, 'b', 'leftHand', 'deck-2'),
      ],
    };
    expect(roundTrip(state)).toEqual(state);
  });

  it('writes an empty <hand/> without hand cards and no <deck> without decks', () => {
    const doc: XMLDocument = document.implementation.createDocument(null, null);
    const empty: DeckState = { decks: [], hand: [], assigned: [], inventory: [] };
    const el: Element = writeDeck(doc, empty);
    expect(el.querySelector('deck')).toBeNull();
    expect(el.querySelector('hand')?.children).toHaveLength(0);
    expect(readDeck(el)).toEqual(empty);
  });

  it('drops hand cards and assignments of missing decks', () => {
    const xml: string = `<cardDeck><deck id="d1" name="A"/>
      <hand><handCard deckId="gone"><card id="b1"/></handCard></hand>
      <assigned><assignment deckId="gone" characterId="a" slot="body">
        <card id="e1" type="equipment" slot="body"/>
      </assignment></assigned></cardDeck>`;
    const state: DeckState = readDeck(parse(xml));
    expect(state.decks.map((deck) => deck.id)).toEqual(['d1']);
    expect(state.hand).toEqual([]);
    expect(state.assigned).toEqual([]);
  });

  it('reads an empty <cardDeck/> as no decks', () => {
    expect(readDeck(parse('<cardDeck/>'))).toEqual({
      decks: [],
      hand: [],
      assigned: [],
      inventory: [],
    });
  });
});

describe('deck.xml-mapper – older saves with one deck', () => {
  it('reads one deck with its active card as the only hand card and its assignments', () => {
    const xml: string = `<cardDeck>
      <config id="old" name="Altes Deck"/>
      <drawPile><card id="b1" name="Fackel"/></drawPile>
      <activeCard><card id="c1" type="combat" attack="3" defense="1"/></activeCard>
      <assigned><assignment characterId="a" slot="leftHand">
        <card id="e2" type="equipment" slot="hand"><modifier stat="defense" value="2"/></card>
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
          config: { id: '', name: '', backImagePath: '', defaultCardType: 'basic', cards: [] },
          drawPile: [],
          discardPile: [],
          bank: [],
        },
      ],
      hand: [],
      assigned: [],
      inventory: [],
    });
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
    const state: DeckState = readDeck(
      parse(`<cardDeck><config/><bank>${cardXml}</bank></cardDeck>`),
    );
    expect(state.decks[0].bank).toEqual([expected]);
  });

  it('keeps a basic card unchanged', () => {
    expect(roundTrip(createTwoDeckState()).decks[0].drawPile).toEqual([BASIC_CARD]);
  });
});
