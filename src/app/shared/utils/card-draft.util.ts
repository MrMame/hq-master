import { CardLocation } from '../../core/models/card-location.model';
import {
  AssignedCard,
  BeltCard,
  CardRef,
  DeckState,
  InventoryCard,
} from '../../core/models/deck-state.model';
import { isSameCard, isSameRef } from '../../core/services/card-deck/deck-state.util';
import { DraftMove, DraftTarget } from '../models/card-action.model';

/** Karten des bearbeiteten Charakters laut Entwurf. */
export interface DraftCards {
  equipped: AssignedCard[];
  inventory: InventoryCard[];
  belt: BeltCard[];
}

/** Ort, den ein Entwurfsziel beim Übernehmen bedeutet. */
export function draftTargetLocation(characterId: string, target: DraftTarget): CardLocation {
  switch (target.kind) {
    case 'discardPile':
      return target;
    case 'inventory':
    case 'belt':
      return { kind: target.kind, characterId };
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
 * Slot-, Inventar- und Gürtelkarten des Charakters, wie sie nach dem Übernehmen lägen; abgelegte Karten fehlen.
 */
export function draftCards(
  characterId: string,
  s: Pick<DeckState, 'assigned' | 'inventory' | 'belt'>,
  moves: readonly DraftMove[],
): DraftCards {
  const mine: <T extends { characterId: string }>(list: readonly T[]) => T[] = (list) =>
    list.filter((entry) => entry.characterId === characterId);
  const result: DraftCards = { equipped: [], inventory: [], belt: [] };
  const place: (entry: InventoryCard, target: DraftTarget) => void = (entry, target) => {
    const { deckId, card } = entry;
    if (target.kind === 'inventory' || target.kind === 'belt') {
      result[target.kind].push({ deckId, card, characterId });
    }
    if (target.kind === 'equipped')
      result.equipped.push({ deckId, card, characterId, slot: target.slot });
  };
  const visit: (entry: InventoryCard, unmoved: () => void) => void = (entry, unmoved) => {
    const move: DraftMove | undefined = moves.find((m) => isSameCard(entry, m.ref));
    if (move) place(entry, move.target);
    else unmoved();
  };
  mine(s.assigned).forEach((entry) => visit(entry, () => result.equipped.push(entry)));
  mine(s.inventory).forEach((entry) => visit(entry, () => result.inventory.push(entry)));
  mine(s.belt).forEach((entry) => visit(entry, () => result.belt.push(entry)));
  return result;
}
