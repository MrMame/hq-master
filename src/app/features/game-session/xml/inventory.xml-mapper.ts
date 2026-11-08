import { InventoryCard } from '../../../core/models/deck-state.model';
import {
  appendElement,
  childElements,
  firstChild,
  readString,
  setAttributes,
} from '../../../shared/utils/xml.util';
import { readCard, writeCard } from './card.xml-mapper';

/** Karten, die Charaktere mitführen (Inventar, Gürtel): `<name><item deckId characterId><card …/></item></name>` */
export function writeCarriedCards(parent: Element, name: string, cards: InventoryCard[]): void {
  const list: Element = appendElement(parent, name);
  cards.forEach(({ deckId, card, characterId }) => {
    const el: Element = appendElement(list, 'item');
    setAttributes(el, { deckId, characterId });
    writeCard(el, card);
  });
}

/**
 * Fehlt die Liste (ältere Spielstände), ist sie leer; Einträge ohne Karte oder Besitzer werden verworfen.
 * Fehlende Decks verwirft der Aufrufer, fehlende Besitzer räumt der `EquipmentSyncService` ab.
 */
export function readCarriedCards(parent: Element, name: string): InventoryCard[] {
  const list: Element | null = firstChild(parent, name);
  return list ? childElements(list, 'item').flatMap(readItem) : [];
}

/** `<inventory>`; fehlend → leer. */
export function writeInventory(parent: Element, inventory: InventoryCard[]): void {
  writeCarriedCards(parent, 'inventory', inventory);
}

export function readInventory(parent: Element): InventoryCard[] {
  return readCarriedCards(parent, 'inventory');
}

function readItem(el: Element): InventoryCard[] {
  const cardEl: Element | null = firstChild(el, 'card');
  const characterId: string = readString(el, 'characterId');
  if (!cardEl || !characterId) return [];
  return [{ deckId: readString(el, 'deckId'), card: readCard(cardEl), characterId }];
}
