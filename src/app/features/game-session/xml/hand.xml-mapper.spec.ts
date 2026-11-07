import { HandCard } from '../../../core/models/deck-state.model';
import { BASIC_CARD, COMBAT_CARD } from '../../../core/testing/deck.fixtures';
import { readHand, writeHand } from './hand.xml-mapper';

function parse(xml: string): Element {
  return new DOMParser().parseFromString(xml, 'application/xml').documentElement;
}

describe('hand.xml-mapper', () => {
  it('writes and reads the hand in its order', () => {
    const hand: HandCard[] = [
      { deckId: 'deck-2', card: COMBAT_CARD },
      { deckId: 'deck-1', card: BASIC_CARD },
    ];
    const doc: XMLDocument = document.implementation.createDocument(null, null);
    const root: Element = doc.createElement('cardDeck');
    writeHand(root, hand);
    expect(root.querySelectorAll('hand > handCard')).toHaveLength(2);
    expect(readHand(parse(new XMLSerializer().serializeToString(root)))).toEqual(hand);
  });

  it('reads an older <activeCard> as the only hand card', () => {
    const xml: string = '<cardDeck><activeCard deckId="d1"><card id="b1"/></activeCard></cardDeck>';
    expect(readHand(parse(xml)).map((entry) => [entry.deckId, entry.card.id])).toEqual([
      ['d1', 'b1'],
    ]);
  });

  it('prefers <hand> over an <activeCard> and drops entries without a card', () => {
    const xml: string = `<cardDeck>
      <hand><handCard deckId="d1"/><handCard deckId="d2"><card id="c1"/></handCard></hand>
      <activeCard deckId="d1"><card id="b1"/></activeCard>
    </cardDeck>`;
    expect(readHand(parse(xml)).map((entry) => entry.card.id)).toEqual(['c1']);
  });

  it('reads an empty <activeCard/> or no hand at all as an empty hand', () => {
    expect(readHand(parse('<cardDeck><activeCard/></cardDeck>'))).toEqual([]);
    expect(readHand(parse('<cardDeck/>'))).toEqual([]);
  });
});
