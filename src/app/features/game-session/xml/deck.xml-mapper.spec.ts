import { readDeck, writeDeck } from './deck.xml-mapper';
import { DeckState } from '../../../core/models/deck-state.model';
import {
  assignedCard,
  SWORD_CARD,
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
        { deckId: 'deck-2', card: SWORD_CARD },
        { deckId: 'deck-1', card: SWORD_CARD },
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
    const empty: DeckState = { decks: [], hand: [], assigned: [], inventory: [], belt: [] };
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
      belt: [],
    });
  });
});
