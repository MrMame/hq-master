import { Card } from '../../../core/models/card.model';
import { AssignedCard } from '../../../core/models/deck-state.model';
import { EQUIPMENT_SLOTS, EquipmentSlot } from '../../../core/models/equipment.model';
import {
  appendElement,
  childElements,
  firstChild,
  readString,
  setAttributes,
} from '../../../shared/utils/xml.util';
import { readCard, writeCard } from './card.xml-mapper';

/** `<assigned><assignment characterId slot><card …/></assignment></assigned>` */
export function writeAssignedCards(parent: Element, assigned: AssignedCard[]): void {
  const list: Element = appendElement(parent, 'assigned');
  assigned.forEach(({ card, characterId, slot }) => {
    const el: Element = appendElement(list, 'assignment');
    setAttributes(el, { characterId, slot });
    writeCard(el, card);
  });
}

/**
 * Ältere Spielstände ohne `<assigned>` → leere Liste. Einträge ohne gültigen Slot oder ohne
 * Ausrüstungskarte werden verworfen. Verwaiste Besitzer räumt der `EquipmentSyncService` ab.
 */
export function readAssignedCards(parent: Element): AssignedCard[] {
  const list: Element | null = firstChild(parent, 'assigned');
  return list ? childElements(list, 'assignment').flatMap(readAssignment) : [];
}

function readAssignment(el: Element): AssignedCard[] {
  const slot: string = readString(el, 'slot');
  const cardEl: Element | null = firstChild(el, 'card');
  const card: Card | null = cardEl ? readCard(cardEl) : null;
  if (!isEquipmentSlot(slot) || card?.cardType !== 'equipment') return [];
  return [{ card, characterId: readString(el, 'characterId'), slot }];
}

function isEquipmentSlot(value: string): value is EquipmentSlot {
  return EQUIPMENT_SLOTS.some((slot) => slot === value);
}
