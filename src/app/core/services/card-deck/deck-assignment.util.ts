import { ActiveCard, AssignedCard, CardRef, DeckState } from '../../models/deck-state.model';
import { EquipmentSlot } from '../../models/equipment.model';
import { isSameCard, toCardRef, withDiscarded } from './deck-state.util';

/** Karte im Slot eines Charakters, falls belegt. */
export function slotOccupant(
  assigned: readonly AssignedCard[],
  characterId: string,
  slot: EquipmentSlot,
): AssignedCard | undefined {
  return assigned.find((entry) => entry.characterId === characterId && entry.slot === slot);
}

/**
 * Legt die aktive Ausrüstungskarte in den Slot; eine dort liegende Karte kommt in den Ablagestapel ihrer
 * Instanz. Danach ist keine Karte aktiv. Ohne aktive Ausrüstungskarte bleibt der Zustand unverändert.
 */
export function assignActiveCard(
  s: DeckState,
  characterId: string,
  slot: EquipmentSlot,
): DeckState {
  const active: ActiveCard | null = s.activeCard;
  if (!active || active.card.cardType !== 'equipment') return s;
  const previous: AssignedCard | undefined = slotOccupant(s.assigned, characterId, slot);
  return {
    ...withDiscarded(s, previous ? [previous] : []),
    activeCard: null,
    assigned: [
      ...s.assigned.filter((entry) => entry !== previous),
      { deckId: active.deckId, card: active.card, characterId, slot },
    ],
  };
}

/** Nimmt Karten aus ihren Slots in den Ablagestapel ihrer Instanz; unbekannte werden ignoriert. */
export function discardAssigned(s: DeckState, refs: readonly CardRef[]): DeckState {
  const removed: AssignedCard[] = s.assigned.filter((entry) =>
    refs.some((ref) => isSameCard(entry, ref)),
  );
  if (removed.length === 0) return s;
  return {
    ...withDiscarded(s, removed),
    assigned: s.assigned.filter((entry) => !removed.includes(entry)),
  };
}

/** Karten, deren Besitzer nicht (mehr) in der Session ist. */
export function orphanedCards(
  assigned: readonly AssignedCard[],
  characterIds: readonly string[],
): CardRef[] {
  return assigned.filter((entry) => !characterIds.includes(entry.characterId)).map(toCardRef);
}
