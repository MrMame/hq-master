import { readDeck, writeDeck } from './deck.xml-mapper';
import { readAssignedCards } from './assigned-cards.xml-mapper';
import { DeckState } from '../../../core/models/deck-state.model';
import {
  assignedCard,
  createEquipmentDeckState,
  RUNE_ARMOR,
} from '../../../core/testing/deck.fixtures';

function parse(xml: string): Element {
  return new DOMParser().parseFromString(xml, 'application/xml').documentElement;
}

const RUNE_ARMOR_XML: string = `
  <card id="e1" name="Runenrüstung" image="cards/e1.svg" backImage="cards/back.svg" type="equipment" slot="body">
    <description>Runenrüstung &lt;&amp;&gt;</description>
    <modifier stat="maxArmor" value="2"/>
    <modifier stat="speed" value="-1"/>
  </card>`;

describe('assigned-cards.xml-mapper', () => {
  it('keeps equipment cards, their decks and their assignments in a round trip', () => {
    // Runenrüstung aktiv, Turmschild in der linken Hand von „a“.
    const deck: DeckState = createEquipmentDeckState('a');
    const doc: XMLDocument = document.implementation.createDocument(null, null);
    const el: Element = writeDeck(doc, deck);

    const assignment: Element | null = el.querySelector('assigned > assignment');
    expect(assignment?.getAttribute('slot')).toBe('leftHand');
    expect(assignment?.getAttribute('deckId')).toBe('deck-1');
    expect(readDeck(parse(new XMLSerializer().serializeToString(el)))).toEqual(deck);
  });

  it('reads saves without <assigned> with an empty list', () => {
    expect(readAssignedCards(parse('<cardDeck/>'))).toEqual([]);
  });

  it('drops assignments without valid slot or equipment card and reads a missing deck as empty', () => {
    const xml: string = `<cardDeck><assigned>
      <assignment characterId="a" slot="tail">
        <card id="e1" type="equipment" slot="body"/>
      </assignment>
      <assignment characterId="a" slot="body"><card id="b1" type="basic"/></assignment>
      <assignment characterId="a" slot="body"/>
      <assignment characterId="a" slot="body">${RUNE_ARMOR_XML}</assignment>
      <assignment deckId="d2" characterId="b" slot="body">${RUNE_ARMOR_XML}</assignment>
    </assigned></cardDeck>`;
    expect(readAssignedCards(parse(xml))).toEqual([
      assignedCard(RUNE_ARMOR, 'a', 'body', ''),
      assignedCard(RUNE_ARMOR, 'b', 'body', 'd2'),
    ]);
  });

  it('reads an invalid equipment card as basic card', () => {
    const deck: DeckState = readDeck(
      parse(
        '<cardDeck><deck id="d"><bank><card id="x" type="equipment"/></bank></deck></cardDeck>',
      ),
    );
    expect(deck.decks[0].bank[0].cardType).toBe('basic');
  });
});
