import { Card } from '../../models/card.model';
import { CardLocation, PILE_KINDS } from '../../models/card-location.model';
import { AssignedCard, CardRef, DeckInstance, DeckState } from '../../models/deck-state.model';
import { findDeck, isSameCard } from './deck-state.util';

/** Eine Karte mit ihrem Ort; Ergebnis von `findCardAt`. */
export interface LocatedCard {
  card: Card;
  location: CardLocation;
}

/**
 * Sucht eine Karte über ihre `CardRef`: aktive Karte, Stapel und Bank ihres Decks, Slots der Charaktere.
 * Unbekannte Karte oder Deck nicht (mehr) auf dem Tisch → `null`.
 */
export function findCardAt(s: DeckState, ref: CardRef): LocatedCard | null {
  const deck: DeckInstance | undefined = findDeck(s, ref.deckId);
  if (!deck) return null;
  if (s.activeCard && isSameCard(s.activeCard, ref)) {
    return { card: s.activeCard.card, location: { kind: 'active' } };
  }
  for (const kind of PILE_KINDS) {
    const card: Card | undefined = deck[kind].find((c) => c.id === ref.cardId);
    if (card) return { card, location: { kind } };
  }
  const assigned: AssignedCard | undefined = s.assigned.find((entry) => isSameCard(entry, ref));
  return assigned
    ? {
        card: assigned.card,
        location: { kind: 'equipped', characterId: assigned.characterId, slot: assigned.slot },
      }
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

/** Gleicher Ort: gleiche Art, bei Slots auch gleicher Charakter und Slot. */
export function isSameLocation(a: CardLocation, b: CardLocation): boolean {
  if (a.kind === 'equipped' || b.kind === 'equipped') {
    return (
      a.kind === 'equipped' &&
      b.kind === 'equipped' &&
      a.characterId === b.characterId &&
      a.slot === b.slot
    );
  }
  return a.kind === b.kind;
}
