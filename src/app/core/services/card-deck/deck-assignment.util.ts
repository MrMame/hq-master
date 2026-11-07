import { AssignedCard, CardRef } from '../../models/deck-state.model';
import { EquipmentSlot } from '../../models/equipment.model';
import { toCardRef } from './deck-state.util';

/** Karte im Slot eines Charakters, falls belegt. */
export function slotOccupant(
  assigned: readonly AssignedCard[],
  characterId: string,
  slot: EquipmentSlot,
): AssignedCard | undefined {
  return assigned.find((entry) => entry.characterId === characterId && entry.slot === slot);
}

/** Karten, deren Besitzer nicht (mehr) in der Session ist. */
export function orphanedCards(
  assigned: readonly AssignedCard[],
  characterIds: readonly string[],
): CardRef[] {
  return assigned.filter((entry) => !characterIds.includes(entry.characterId)).map(toCardRef);
}
