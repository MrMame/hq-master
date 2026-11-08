import { AssignedCard, CardRef, DeckState } from '../../models/deck-state.model';
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

/** Slot-, Inventar- und Gürtelkarten, deren Besitzer nicht (mehr) in der Session ist. */
export function orphanedCards(
  s: Pick<DeckState, 'assigned' | 'inventory' | 'belt'>,
  characterIds: readonly string[],
): CardRef[] {
  return [...s.assigned, ...s.inventory, ...s.belt]
    .filter((entry) => !characterIds.includes(entry.characterId))
    .map(toCardRef);
}
