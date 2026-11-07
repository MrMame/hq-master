import { Card } from '../../models/card.model';
import { CardLocation, PILE_KINDS } from '../../models/card-location.model';
import {
  AssignedCard,
  CardRef,
  DeckInstance,
  DeckState,
  HandCard,
  InventoryCard,
} from '../../models/deck-state.model';
import { findDeck, isSameCard } from './deck-state.util';

/** Eine Karte mit ihrem Ort; Ergebnis von `findCardAt`. */
export interface LocatedCard {
  card: Card;
  location: CardLocation;
}

/**
 * Sucht eine Karte über ihre `CardRef`: Hand, Stapel und Bank ihres Decks, Slots und Inventar der Charaktere.
 * Unbekannte Karte oder Deck nicht (mehr) auf dem Tisch → `null`.
 */
export function findCardAt(s: DeckState, ref: CardRef): LocatedCard | null {
  const deck: DeckInstance | undefined = findDeck(s, ref.deckId);
  if (!deck) return null;
  const inHand: HandCard | undefined = s.hand.find((entry) => isSameCard(entry, ref));
  if (inHand) return { card: inHand.card, location: { kind: 'hand' } };
  for (const kind of PILE_KINDS) {
    const card: Card | undefined = deck[kind].find((c) => c.id === ref.cardId);
    if (card) return { card, location: { kind } };
  }
  const assigned: AssignedCard | undefined = s.assigned.find((entry) => isSameCard(entry, ref));
  if (assigned) {
    const { card, characterId, slot } = assigned;
    return { card, location: { kind: 'equipped', characterId, slot } };
  }
  const carried: InventoryCard | undefined = s.inventory.find((entry) => isSameCard(entry, ref));
  return carried
    ? { card: carried.card, location: { kind: 'inventory', characterId: carried.characterId } }
    : null;
}

/** Ort einer Karte; unbekannte Karte → `null`. */
export function locateCard(s: DeckState, ref: CardRef): CardLocation | null {
  return findCardAt(s, ref)?.location ?? null;
}

/** Die Karte selbst; unbekannte Karte → `undefined`. */
export function findCard(s: DeckState, ref: CardRef): Card | undefined {
  return findCardAt(s, ref)?.card;
}

/** Besitzer einer Karte in Slot oder Inventar; sonst `undefined`. */
export function ownerOf(location: CardLocation): string | undefined {
  return location.kind === 'equipped' || location.kind === 'inventory'
    ? location.characterId
    : undefined;
}

/** Gleicher Ort: gleiche Art, bei Slots und Inventar auch gleicher Charakter, bei Slots gleicher Slot. */
export function isSameLocation(a: CardLocation, b: CardLocation): boolean {
  if (a.kind !== b.kind || ownerOf(a) !== ownerOf(b)) return false;
  return a.kind !== 'equipped' || b.kind !== 'equipped' || a.slot === b.slot;
}
