import { Card } from '../models/card.model';
import { AssignedCard, DeckInstance, DeckState, InventoryCard } from '../models/deck-state.model';
import { CardProperty } from '../models/card-property.model';
import { EquipmentSlot } from '../models/equipment.model';

/** Rückseite des Testdecks; Karten ohne eigene Rückseite tragen sie. */
export const TEST_BACK: string = 'cards/back.svg';

/** Testdaten für Specs (wird nicht in den App-Code importiert). */
export const SWORD_CARD: Card = {
  id: 'c1',
  name: 'Schwert',
  imagePath: 'cards/sword.svg',
  backImagePath: TEST_BACK,
  description: 'Scharf',
  properties: [],
};

export const BASIC_CARD: Card = {
  id: 'b1',
  name: 'Fackel',
  imagePath: 'cards/torch.svg',
  backImagePath: TEST_BACK,
  description: '',
  properties: [],
};

/** Ausnahmekarte mit eigener Rückseite statt der des Decks. */
export const OWN_BACK_CARD: Card = {
  id: 's1',
  name: 'Sonderkarte',
  imagePath: 'cards/special.svg',
  backImagePath: 'cards/special-back.svg',
  description: '',
  properties: [],
};

/** Karte mit Eigenschaften; jede Karte passt in jeden Slot. */
export function createPropertyCard(id: string, name: string, properties: CardProperty[]): Card {
  return {
    id,
    name,
    imagePath: `cards/${id}.svg`,
    backImagePath: TEST_BACK,
    description: `${name} <&>`,
    properties,
  };
}

/** Runenrüstung: Ruestung +2, Tempo −1. */
export const RUNE_ARMOR: Card = createPropertyCard('e1', 'Runenrüstung', [
  { name: 'Ruestung', value: 2 },
  { name: 'Tempo', value: -1 },
]);

/** Turmschild: Abwehr +2. */
export const TOWER_SHIELD: Card = createPropertyCard('e2', 'Turmschild', [
  { name: 'Abwehr', value: 2 },
]);

/** Buckler: Abwehr +1. */
export const BUCKLER: Card = createPropertyCard('e3', 'Buckler', [{ name: 'Abwehr', value: 1 }]);

export function assignedCard(
  card: Card,
  characterId: string,
  slot: EquipmentSlot,
  deckId: string = 'deck-1',
): AssignedCard {
  return { deckId, card, characterId, slot };
}

export function inventoryCard(
  card: Card,
  characterId: string,
  deckId: string = 'deck-1',
): InventoryCard {
  return { deckId, card, characterId };
}

/** Instanz mit den Karten c1 + b1, alle Stapel leer; `overrides` setzt z. B. Stapel oder Namen. */
export function createDeckInstance(
  id: string = 'deck-1',
  overrides: Partial<DeckInstance> = {},
): DeckInstance {
  return {
    id,
    name: 'Testdeck',
    source: 'decks/test.xml',
    config: {
      id: 'test-deck',
      name: 'Testdeck',
      backImagePath: TEST_BACK,
      cards: [SWORD_CARD, BASIC_CARD],
    },
    drawPile: [],
    discardPile: [],
    bank: [],
    ...overrides,
  };
}

/** Ein Deck `deck-1` mit Karten c1 + b1, Ziehstapel [b1], c1 in der Hand, keine Zuweisungen. */
export function createDeckState(): DeckState {
  return {
    decks: [createDeckInstance('deck-1', { drawPile: [BASIC_CARD] })],
    hand: [{ deckId: 'deck-1', card: SWORD_CARD }],
    assigned: [],
    inventory: [],
    belt: [],
  };
}

/**
 * Deck mit Runenrüstung in der Hand und dem Turmschild in der linken Hand von `characterId`; Nachziehstapel
 * standardmäßig [b1, c1] (leer übergeben, wenn ein Test b1 oder c1 einem Charakter gibt).
 */
export function createEquipmentDeckState(
  characterId: string,
  drawPile: Card[] = [BASIC_CARD, SWORD_CARD],
): DeckState {
  const deck: DeckInstance = createDeckInstance('deck-1', { drawPile });
  return {
    decks: [
      {
        ...deck,
        config: { ...deck.config, cards: [...deck.config.cards, RUNE_ARMOR, TOWER_SHIELD] },
      },
    ],
    hand: [{ deckId: 'deck-1', card: RUNE_ARMOR }],
    assigned: [assignedCard(TOWER_SHIELD, characterId, 'leftHand')],
    inventory: [],
    belt: [],
  };
}

/** Zwei Instanzen derselben Deck-Datei (gleiche Karten-IDs): deck-1 zieht [b1], deck-2 zieht [b1, c1]. */
export function createTwoDeckState(): DeckState {
  return {
    decks: [
      createDeckInstance('deck-1', { drawPile: [BASIC_CARD] }),
      createDeckInstance('deck-2', { name: 'Testdeck (2)', drawPile: [BASIC_CARD, SWORD_CARD] }),
    ],
    hand: [],
    assigned: [],
    inventory: [],
    belt: [],
  };
}
