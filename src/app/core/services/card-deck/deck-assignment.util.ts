import { Card } from '../../models/card.model';
import { AssignedCard, DeckState } from '../../models/deck-state.model';
import { EquipmentSlot } from '../../models/equipment.model';

/** Alle Karten außer den zugewiesenen: Stapel, Ablage, aktive Karte, Bank. */
export function unassignedCards(s: DeckState): Card[] {
  const active: Card[] = s.activeCard ? [s.activeCard] : [];
  return [...s.drawPile, ...s.discardPile, ...active, ...s.bank];
}

/** Karte im Slot eines Charakters, falls belegt. */
export function slotOccupant(
  assigned: readonly AssignedCard[],
  characterId: string,
  slot: EquipmentSlot,
): AssignedCard | undefined {
  return assigned.find((entry) => entry.characterId === characterId && entry.slot === slot);
}

/**
 * Legt die aktive Ausrüstungskarte in den Slot; eine dort liegende Karte kommt in den Ablagestapel.
 * Danach ist keine Karte aktiv. Ohne aktive Ausrüstungskarte bleibt der Zustand unverändert.
 */
export function assignActiveCard(
  s: DeckState,
  characterId: string,
  slot: EquipmentSlot,
): DeckState {
  const card: Card | null = s.activeCard;
  if (card?.cardType !== 'equipment') return s;
  const previous: AssignedCard | undefined = slotOccupant(s.assigned, characterId, slot);
  return {
    ...s,
    activeCard: null,
    discardPile: previous ? [...s.discardPile, previous.card] : s.discardPile,
    assigned: [...s.assigned.filter((entry) => entry !== previous), { card, characterId, slot }],
  };
}

/** Nimmt die Karten aus ihren Slots und legt sie in den Ablagestapel; unbekannte IDs werden ignoriert. */
export function discardAssigned(s: DeckState, cardIds: readonly string[]): DeckState {
  const removed: AssignedCard[] = s.assigned.filter((entry) => cardIds.includes(entry.card.id));
  if (removed.length === 0) return s;
  return {
    ...s,
    assigned: s.assigned.filter((entry) => !removed.includes(entry)),
    discardPile: [...s.discardPile, ...removed.map((entry) => entry.card)],
  };
}

/** Karten, deren Besitzer nicht (mehr) in der Session ist. */
export function orphanedCardIds(
  assigned: readonly AssignedCard[],
  characterIds: readonly string[],
): string[] {
  return assigned
    .filter((entry) => !characterIds.includes(entry.characterId))
    .map((entry) => entry.card.id);
}
