import { CardLocation } from '../../core/models/card-location.model';
import { AssignedCard, CardRef, InventoryCard } from '../../core/models/deck-state.model';
import { isSameCard, isSameRef } from '../../core/services/card-deck/deck-state.util';
import { DraftMove, DraftTarget } from '../models/card-action.model';

/** Karten des bearbeiteten Charakters laut Entwurf. */
export interface DraftCards {
  equipped: AssignedCard[];
  inventory: InventoryCard[];
}

/** Ort, den ein Entwurfsziel beim Übernehmen bedeutet. */
export function draftTargetLocation(characterId: string, target: DraftTarget): CardLocation {
  switch (target.kind) {
    case 'discardPile':
      return target;
    case 'inventory':
      return { kind: 'inventory', characterId };
    case 'equipped':
      return { kind: 'equipped', characterId, slot: target.slot };
  }
}

/** Vorgemerkte Bewegung einer Karte, falls vorhanden. */
export function draftMoveOf(moves: readonly DraftMove[], ref: CardRef): DraftMove | undefined {
  return moves.find((move) => isSameRef(move.ref, ref));
}

/** Ort im Entwurf: das vorgemerkte Ziel, sonst der Ort in der Session. */
export function locationInDraft(
  characterId: string,
  moves: readonly DraftMove[],
  ref: CardRef,
  live: CardLocation,
): CardLocation {
  const move: DraftMove | undefined = draftMoveOf(moves, ref);
  return move ? draftTargetLocation(characterId, move.target) : live;
}

/** Merkt eine Bewegung vor; eine frühere Bewegung derselben Karte entfällt, die neue kommt ans Ende. */
export function withDraftMove(
  moves: readonly DraftMove[],
  ref: CardRef,
  target: DraftTarget,
): DraftMove[] {
  return [...moves.filter((move) => !isSameRef(move.ref, ref)), { ref, target }];
}

/**
 * Slot- und Inventarkarten des Charakters, wie sie nach dem Übernehmen lägen; abgelegte Karten fehlen.
 * Nur Ausrüstungskarten kommen in Slots.
 */
export function draftCards(
  characterId: string,
  assigned: readonly AssignedCard[],
  inventory: readonly InventoryCard[],
  moves: readonly DraftMove[],
): DraftCards {
  const own: InventoryCard[] = [...assigned, ...inventory].filter(
    (entry) => entry.characterId === characterId,
  );
  const result: DraftCards = { equipped: [], inventory: [] };
  own.forEach((entry) => {
    const move: DraftMove | undefined = moves.find((m) => isSameCard(entry, m.ref));
    const slotted: AssignedCard | undefined = assigned.find((a) => a === entry);
    if (!move) {
      if (slotted) result.equipped.push(slotted);
      else result.inventory.push(entry);
      return;
    }
    const { target } = move;
    const { deckId, card } = entry;
    if (target.kind === 'inventory') result.inventory.push({ deckId, card, characterId });
    if (target.kind === 'equipped' && card.cardType === 'equipment') {
      result.equipped.push({ deckId, card, characterId, slot: target.slot });
    }
  });
  return result;
}
