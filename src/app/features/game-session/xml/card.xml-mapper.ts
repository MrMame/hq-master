import {
  BaseCard,
  Card,
  CardType,
  EquipmentCard,
  toCardType,
} from '../../../core/models/card.model';
import {
  readEquipmentCard,
  writeEquipmentCard,
} from '../../../core/services/card-deck/equipment-card-xml.util';
import {
  appendElement,
  appendTextElement,
  childElements,
  firstChild,
  readString,
  setAttributes,
  textOf,
} from '../../../shared/utils/xml.util';

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
    backImage: card.backImagePath,
    type: card.cardType,
  });
  appendTextElement(el, 'description', card.description);
  if (card.cardType === 'equipment') writeEquipmentCard(el, card);
  return el;
}

/**
 * Eine ungültige Ausrüstungskarte wird wie im Deck-Loader als einfache Karte gelesen, ebenso `combat` (Werte
 * entfallen). Fehlt `backImage`, ergänzt `readDeck` die Rückseite des Decks.
 */
export function readCard(el: Element): Card {
  const base: BaseCard = {
    id: readString(el, 'id'),
    name: readString(el, 'name'),
    imagePath: readString(el, 'image'),
    backImagePath: readString(el, 'backImage'),
    description: textOf(firstChild(el, 'description')),
    cardType: readCardType(el, 'type'),
  };
  if (base.cardType === 'equipment') {
    const equipment: EquipmentCard | null = readEquipmentCard(el, base);
    if (equipment) return equipment;
  }
  return { ...base, cardType: 'basic' };
}

/** Unbekannte Kartentypen (auch `combat`) gelten als `basic`. */
export function readCardType(el: Element, name: string): CardType {
  return toCardType(el.getAttribute(name));
}
