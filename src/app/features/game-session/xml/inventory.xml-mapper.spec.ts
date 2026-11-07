import { readDeck, writeDeck } from './deck.xml-mapper';
import { readInventory } from './inventory.xml-mapper';
import { DeckState } from '../../../core/models/deck-state.model';
import {
  BASIC_CARD,
  COMBAT_CARD,
  createEquipmentDeckState,
  createTwoDeckState,
  inventoryCard,
  RUNE_ARMOR,
} from '../../../core/testing/deck.fixtures';

function parse(xml: string): Element {
  return new DOMParser().parseFromString(xml, 'application/xml').documentElement;
}

function roundTrip(state: DeckState): DeckState {
  const doc: XMLDocument = document.implementation.createDocument(null, null);
  return readDeck(parse(new XMLSerializer().serializeToString(writeDeck(doc, state))));
}

describe('inventory.xml-mapper', () => {
  it('keeps every kind of inventory card with its deck and owner in a round trip', () => {
    const state: DeckState = {
      ...createEquipmentDeckState('a'),
      inventory: [
        inventoryCard(BASIC_CARD, 'a'),
        inventoryCard(COMBAT_CARD, 'b'),
        inventoryCard(RUNE_ARMOR, 'a'),
      ],
    };
    expect(roundTrip(state)).toEqual(state);
  });

  it('tells inventory cards with the same id from two instances apart', () => {
    const state: DeckState = {
      ...createTwoDeckState(),
      inventory: [inventoryCard(BASIC_CARD, 'a'), inventoryCard(BASIC_CARD, 'a', 'deck-2')],
    };
    expect(roundTrip(state).inventory).toEqual(state.inventory);
  });

  it('reads older saves without <inventory> with an empty inventory', () => {
    expect(readInventory(parse('<cardDeck/>'))).toEqual([]);
    expect(readDeck(parse('<cardDeck><config id="x" name="Alt"/></cardDeck>')).inventory).toEqual(
      [],
    );
  });

  it('drops items without card or owner and those of missing decks', () => {
    const xml: string = `<cardDeck><deck id="d1" name="A"/><inventory>
      <item deckId="d1" characterId="a"/>
      <item deckId="d1"><card id="b1" type="basic"/></item>
      <item deckId="gone" characterId="a"><card id="b1" type="basic"/></item>
      <item deckId="d1" characterId="a"><card id="b1" name="Fackel" type="basic"/></item>
    </inventory></cardDeck>`;
    const inventory: DeckState['inventory'] = readDeck(parse(xml)).inventory;
    expect(inventory.map((entry) => [entry.deckId, entry.characterId, entry.card.id])).toEqual([
      ['d1', 'a', 'b1'],
    ]);
  });
});
