import { Card, EquipmentCard } from '../models/card.model';
import { AssignedCard, DeckInstance, DeckState, InventoryCard } from '../models/deck-state.model';
import { CardSlot, EquipmentSlot, StatModifier } from '../models/equipment.model';

/** Rückseite des Testdecks; Karten ohne eigene Rückseite tragen sie. */
export const TEST_BACK: string = 'cards/back.svg';

/** Testdaten für Specs (wird nicht in den App-Code importiert). */
export const SWORD_CARD: Card = {
  id: 'c1',
  name: 'Schwert',
  imagePath: 'cards/sword.svg',
  backImagePath: TEST_BACK,
  description: 'Scharf',
  cardType: 'basic',
};

export const BASIC_CARD: Card = {
  id: 'b1',
  name: 'Fackel',
  imagePath: 'cards/torch.svg',
  backImagePath: TEST_BACK,
  description: '',
  cardType: 'basic',
};

/** Ausnahmekarte mit eigener Rückseite statt der des Decks. */
export const OWN_BACK_CARD: Card = {
  id: 's1',
  name: 'Sonderkarte',
  imagePath: 'cards/special.svg',
  backImagePath: 'cards/special-back.svg',
  description: '',
  cardType: 'basic',
};

export function createEquipmentCard(
  id: string,
  name: string,
  slot: CardSlot,
  modifiers: StatModifier[],
): EquipmentCard {
  return {
    id,
    name,
    imagePath: `cards/${id}.svg`,
    backImagePath: TEST_BACK,
    description: `${name} <&>`,
    cardType: 'equipment',
    slot,
    modifiers,
  };
}

/** Runenrüstung: Körper, Rüstung +2, Tempo −1. */
export const RUNE_ARMOR: EquipmentCard = createEquipmentCard('e1', 'Runenrüstung', 'body', [
  { stat: 'maxArmor', value: 2 },
  { stat: 'speed', value: -1 },
]);

/** Turmschild: Hand, Abwehr +2. */
export const TOWER_SHIELD: EquipmentCard = createEquipmentCard('e2', 'Turmschild', 'hand', [
  { stat: 'defense', value: 2 },
]);

/** Buckler: Hand, Abwehr +1; als aktive Handkarte für belegte Hand-Slots. */
export const BUCKLER: EquipmentCard = createEquipmentCard('e3', 'Buckler', 'hand', [
  { stat: 'defense', value: 1 },
]);

export function assignedCard(
  card: EquipmentCard,
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
      defaultCardType: 'basic',
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
  };
}

/** Deck mit Runenrüstung in der Hand und dem Turmschild in der linken Hand von `characterId`. */
export function createEquipmentDeckState(characterId: string): DeckState {
  const deck: DeckInstance = createDeckInstance('deck-1', { drawPile: [BASIC_CARD, SWORD_CARD] });
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
  };
}
