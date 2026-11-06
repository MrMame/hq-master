import { Card, EquipmentCard } from '../models/card.model';
import { AssignedCard, DeckInstance, DeckState } from '../models/deck-state.model';
import { CardSlot, EquipmentSlot, StatModifier } from '../models/equipment.model';

/** Testdaten für Specs (wird nicht in den App-Code importiert). */
export const COMBAT_CARD: Card = {
  id: 'c1',
  name: 'Schwert',
  imagePath: 'cards/sword.svg',
  description: 'Scharf',
  cardType: 'combat',
  attack: 3,
  defense: 1,
};

export const BASIC_CARD: Card = {
  id: 'b1',
  name: 'Fackel',
  imagePath: 'cards/torch.svg',
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

export function assignedCard(
  card: EquipmentCard,
  characterId: string,
  slot: EquipmentSlot,
  deckId: string = 'deck-1',
): AssignedCard {
  return { deckId, card, characterId, slot };
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
      backImagePath: 'cards/back.svg',
      defaultCardType: 'basic',
      cards: [COMBAT_CARD, BASIC_CARD],
    },
    drawPile: [],
    discardPile: [],
    bank: [],
    ...overrides,
  };
}

/** Ein Deck `deck-1` mit Karten c1 + b1, Ziehstapel [b1], aktive Karte c1, keine Zuweisungen. */
export function createDeckState(): DeckState {
  return {
    decks: [createDeckInstance('deck-1', { drawPile: [BASIC_CARD] })],
    activeCard: { deckId: 'deck-1', card: COMBAT_CARD },
    assigned: [],
  };
}

/** Deck mit Runenrüstung als aktiver Karte und dem Turmschild in der linken Hand von `characterId`. */
export function createEquipmentDeckState(characterId: string): DeckState {
  const deck: DeckInstance = createDeckInstance('deck-1', { drawPile: [BASIC_CARD, COMBAT_CARD] });
  return {
    decks: [
      {
        ...deck,
        config: { ...deck.config, cards: [...deck.config.cards, RUNE_ARMOR, TOWER_SHIELD] },
      },
    ],
    activeCard: { deckId: 'deck-1', card: RUNE_ARMOR },
    assigned: [assignedCard(TOWER_SHIELD, characterId, 'leftHand')],
  };
}

/** Zwei Instanzen derselben Deck-Datei (gleiche Karten-IDs): deck-1 zieht [b1], deck-2 zieht [b1, c1]. */
export function createTwoDeckState(): DeckState {
  return {
    decks: [
      createDeckInstance('deck-1', { drawPile: [BASIC_CARD] }),
      createDeckInstance('deck-2', { name: 'Testdeck (2)', drawPile: [BASIC_CARD, COMBAT_CARD] }),
    ],
    activeCard: null,
    assigned: [],
  };
}
