import { InventoryCard } from '../../../core/models/deck-state.model';
import {
  appendElement,
  childElements,
  firstChild,
  readString,
  setAttributes,
} from '../../../shared/utils/xml.util';
import { readCard, writeCard } from './card.xml-mapper';

/** `<inventory><item deckId characterId><card …/></item></inventory>` */
export function writeInventory(parent: Element, inventory: InventoryCard[]): void {
  const list: Element = appendElement(parent, 'inventory');
  inventory.forEach(({ deckId, card, characterId }) => {
    const el: Element = appendElement(list, 'item');
    setAttributes(el, { deckId, characterId });
    writeCard(el, card);
  });
}

/**
 * Ältere Spielstände ohne `<inventory>` → leeres Inventar; Einträge ohne Karte oder Besitzer werden
 * verworfen. Fehlende Decks verwirft der Aufrufer, fehlende Besitzer räumt der `EquipmentSyncService` ab.
 */
export function readInventory(parent: Element): InventoryCard[] {
  const list: Element | null = firstChild(parent, 'inventory');
  return list ? childElements(list, 'item').flatMap(readItem) : [];
}

function readItem(el: Element): InventoryCard[] {
  const cardEl: Element | null = firstChild(el, 'card');
  const characterId: string = readString(el, 'characterId');
  if (!cardEl || !characterId) return [];
  return [{ deckId: readString(el, 'deckId'), card: readCard(cardEl), characterId }];
}
