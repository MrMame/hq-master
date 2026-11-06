import { BaseCard, EquipmentCard } from '../../models/card.model';
import {
  CARD_SLOTS,
  CardSlot,
  MODIFIABLE_STATS,
  ModifiableStat,
  StatModifier,
} from '../../models/equipment.model';

function isCardSlot(value: string | null): value is CardSlot {
  return CARD_SLOTS.some((slot) => slot === value);
}

function isModifiableStat(value: string | null): value is ModifiableStat {
  return MODIFIABLE_STATS.some((stat) => stat === value);
}

function readModifier(el: Element): StatModifier | null {
  const stat: string | null = el.getAttribute('stat');
  const value: number = Number(el.getAttribute('value') ?? NaN);
  return isModifiableStat(stat) && Number.isInteger(value) ? { stat, value } : null;
}

/**
 * Liest `slot` und die `<modifier stat="…" value="…"/>`-Kinder einer Ausrüstungskarte (Deck-XML und Spielstand).
 * Fehlt der Slot oder ist ein Modifikator ungültig, kommt `null`; der Aufrufer lädt die Karte dann als `basic`.
 */
export function readEquipmentCard(el: Element, base: BaseCard): EquipmentCard | null {
  const slot: string | null = el.getAttribute('slot');
  const modifiers: (StatModifier | null)[] = Array.from(el.children)
    .filter((child) => child.tagName === 'modifier')
    .map(readModifier);
  if (!isCardSlot(slot) || modifiers.includes(null)) return null;
  return { ...base, cardType: 'equipment', slot, modifiers: modifiers as StatModifier[] };
}

/** Schreibt Slot und Modifikatoren in dasselbe Format, das `readEquipmentCard` liest. */
export function writeEquipmentCard(el: Element, card: EquipmentCard): void {
  el.setAttribute('slot', card.slot);
  card.modifiers.forEach((modifier) => {
    const child: Element = el.ownerDocument.createElement('modifier');
    child.setAttribute('stat', modifier.stat);
    child.setAttribute('value', String(modifier.value));
    el.appendChild(child);
  });
}
