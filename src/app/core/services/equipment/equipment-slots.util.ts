import { AssignedCard } from '../../models/deck-state.model';
import { CardSlot, EquipmentSlot } from '../../models/equipment.model';

const SLOTS_FOR_CARD: Readonly<Record<CardSlot, readonly EquipmentSlot[]>> = {
  head: ['head'],
  body: ['body'],
  hand: ['leftHand', 'rightHand'],
  amulet: ['amulet'],
};

/** Slots am Charakter, in die eine Karte passt (Hand: links oder rechts). */
export function slotsForCard(cardSlot: CardSlot): readonly EquipmentSlot[] {
  return SLOTS_FOR_CARD[cardSlot];
}

/** Vorauswahl: der erste freie passende Slot des Charakters, sonst der erste passende. */
export function preferredSlot(
  cardSlot: CardSlot,
  assigned: readonly AssignedCard[],
  characterId: string,
): EquipmentSlot {
  const slots: readonly EquipmentSlot[] = slotsForCard(cardSlot);
  const isFree: (slot: EquipmentSlot) => boolean = (slot) =>
    !assigned.some((entry) => entry.characterId === characterId && entry.slot === slot);
  return slots.find(isFree) ?? slots[0];
}
