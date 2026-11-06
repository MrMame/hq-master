import { Card, EquipmentCard } from '../models/card.model';
import { AssignedCard, DeckState } from '../models/deck-state.model';
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
): AssignedCard {
  return { card, characterId, slot };
}

/** Karten c1 + b1, Ziehstapel [b1], aktive Karte c1, keine Zuweisungen. */
export function createDeckState(): DeckState {
  return {
    config: {
      id: 'deck-1',
      name: 'Testdeck',
      backImagePath: 'cards/back.svg',
      defaultCardType: 'basic',
      cards: [COMBAT_CARD, BASIC_CARD],
    },
    drawPile: [BASIC_CARD],
    discardPile: [],
    activeCard: COMBAT_CARD,
    bank: [],
    assigned: [],
  };
}

/** Deck mit Runenrüstung als aktiver Karte und dem Turmschild in der linken Hand von `characterId`. */
export function createEquipmentDeckState(characterId: string): DeckState {
  const deck: DeckState = createDeckState();
  return {
    ...deck,
    config: { ...deck.config, cards: [...deck.config.cards, RUNE_ARMOR, TOWER_SHIELD] },
    drawPile: [BASIC_CARD, COMBAT_CARD],
    activeCard: RUNE_ARMOR,
    assigned: [assignedCard(TOWER_SHIELD, characterId, 'leftHand')],
  };
}
