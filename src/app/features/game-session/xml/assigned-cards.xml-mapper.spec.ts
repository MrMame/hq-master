import { readDeck, writeDeck } from './deck.xml-mapper';
import { readAssignedCards } from './assigned-cards.xml-mapper';
import { DeckState } from '../../../core/models/deck-state.model';
import { createEquipmentDeckState, RUNE_ARMOR } from '../../../core/testing/deck.fixtures';

function parse(xml: string): Element {
  return new DOMParser().parseFromString(xml, 'application/xml').documentElement;
}

describe('assigned-cards.xml-mapper', () => {
  it('keeps equipment cards and their assignments in a round trip', () => {
    // Runenrüstung aktiv, Turmschild in der linken Hand von „a“.
    const deck: DeckState = createEquipmentDeckState('a');
    const doc: XMLDocument = document.implementation.createDocument(null, null);
    const el: Element = writeDeck(doc, deck);

    expect(el.querySelector('assigned > assignment')?.getAttribute('slot')).toBe('leftHand');
    expect(readDeck(parse(new XMLSerializer().serializeToString(el)))).toEqual(deck);
  });

  it('reads older saves without <assigned> with an empty list', () => {
    expect(readDeck(parse('<cardDeck><config/></cardDeck>'))?.assigned).toEqual([]);
  });

  it('drops assignments without valid slot or equipment card', () => {
    const xml: string = `<cardDeck><assigned>
      <assignment characterId="a" slot="tail">
        <card id="e1" type="equipment" slot="body"/>
      </assignment>
      <assignment characterId="a" slot="body"><card id="b1" type="basic"/></assignment>
      <assignment characterId="a" slot="body"/>
      <assignment characterId="a" slot="body">
        <card id="e1" name="Runenrüstung" image="cards/e1.svg" type="equipment" slot="body">
          <description>Runenrüstung &lt;&amp;&gt;</description>
          <modifier stat="maxArmor" value="2"/>
          <modifier stat="speed" value="-1"/>
        </card>
      </assignment>
    </assigned></cardDeck>`;
    expect(readAssignedCards(parse(xml))).toEqual([
      { card: RUNE_ARMOR, characterId: 'a', slot: 'body' },
    ]);
  });

  it('reads an invalid equipment card as basic card', () => {
    const deck: DeckState | null = readDeck(
      parse('<cardDeck><config/><bank><card id="x" type="equipment"/></bank></cardDeck>'),
    );
    expect(deck?.bank[0].cardType).toBe('basic');
  });
});
