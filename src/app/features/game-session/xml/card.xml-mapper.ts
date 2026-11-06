import { BaseCard, Card, CardType, EquipmentCard } from '../../../core/models/card.model';
import {
  readEquipmentCard,
  writeEquipmentCard,
} from '../../../core/services/card-deck/equipment-card-xml.util';
import {
  appendElement,
  appendTextElement,
  childElements,
  firstChild,
  readNumber,
  readString,
  setAttributes,
  textOf,
} from '../../../shared/utils/xml.util';

const CARD_TYPES: readonly CardType[] = ['basic', 'combat', 'equipment'];

export function writeCardList(parent: Element, name: string, cards: Card[]): void {
  const list: Element = appendElement(parent, name);
  cards.forEach((card) => writeCard(list, card));
}

export function readCardList(parent: Element, name: string): Card[] {
  const list: Element | null = firstChild(parent, name);
  return list ? childElements(list, 'card').map(readCard) : [];
}

export function writeCard(parent: Element, card: Card): Element {
  const el: Element = appendElement(parent, 'card');
  setAttributes(el, {
    id: card.id,
    name: card.name,
    image: card.imagePath,
    type: card.cardType,
    attack: card.cardType === 'combat' ? card.attack : null,
    defense: card.cardType === 'combat' ? card.defense : null,
  });
  appendTextElement(el, 'description', card.description);
  if (card.cardType === 'equipment') writeEquipmentCard(el, card);
  return el;
}

/** Eine ungültige Ausrüstungskarte wird wie im Deck-Loader als einfache Karte gelesen. */
export function readCard(el: Element): Card {
  const base: BaseCard = {
    id: readString(el, 'id'),
    name: readString(el, 'name'),
    imagePath: readString(el, 'image'),
    description: textOf(firstChild(el, 'description')),
    cardType: readCardType(el, 'type'),
  };
  if (base.cardType === 'combat') {
    return {
      ...base,
      cardType: 'combat',
      attack: readNumber(el, 'attack'),
      defense: readNumber(el, 'defense'),
    };
  }
  if (base.cardType === 'equipment') {
    const equipment: EquipmentCard | null = readEquipmentCard(el, base);
    if (equipment) return equipment;
  }
  return { ...base, cardType: 'basic' };
}

/** Unbekannte Kartentypen gelten als `basic`. */
export function readCardType(el: Element, name: string): CardType {
  return CARD_TYPES.find((type) => type === el.getAttribute(name)) ?? 'basic';
}
