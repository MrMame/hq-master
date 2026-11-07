import { Card } from '../../models/card.model';
import { CardLocation, PILE_KINDS } from '../../models/card-location.model';
import { CardRef, DeckState } from '../../models/deck-state.model';
import { isSameLocation, locateCard, ownerOf } from './card-location.util';
import { toCardRef } from './deck-state.util';

/** Eine Karte, die eine Aktion von `from` nach `to` bewegt hat. */
export interface MovedCard {
  ref: CardRef;
  card: Card;
  from: CardLocation;
  to: CardLocation;
}

/**
 * Alle Karten, deren Ort sich zwischen `before` und `after` geändert hat, auch eine aus einem Slot verdrängte.
 * Eine Umsortierung am selben Ort und verschwundene Karten zählen nicht.
 */
export function movedCards(before: DeckState, after: DeckState): MovedCard[] {
  return placedCards(before).flatMap(({ ref, card, location: from }) => {
    const to: CardLocation | null = locateCard(after, ref);
    return to && !isSameLocation(from, to) ? [{ ref, card, from, to }] : [];
  });
}

/**
 * Rücknehmbar, solange jede Karte noch an ihrem Ziel liegt und jeder frühere Besitzer noch in der Session ist.
 * Ohne Bewegungen nicht rücknehmbar.
 */
export function isRevertible(
  s: DeckState,
  moves: readonly MovedCard[],
  characterIds: readonly string[],
): boolean {
  return (
    moves.length > 0 &&
    moves.every(({ ref, from, to }) => {
      const current: CardLocation | null = locateCard(s, ref);
      const owner: string | undefined = ownerOf(from);
      return !!current && isSameLocation(current, to) && (!owner || characterIds.includes(owner));
    })
  );
}

/** Reihenfolge der Rückbewegung: Karten in Slots zuerst, damit der frühere Slot frei ist und nichts verdrängt. */
export function revertOrder(moves: readonly MovedCard[]): MovedCard[] {
  const inSlot: (move: MovedCard) => number = (move) => Number(move.to.kind === 'equipped');
  return [...moves].sort((a, b) => inSlot(b) - inSlot(a));
}

interface PlacedCard {
  ref: CardRef;
  card: Card;
  location: CardLocation;
}

function placedCards(s: DeckState): PlacedCard[] {
  const piles: PlacedCard[] = s.decks.flatMap((deck) =>
    PILE_KINDS.flatMap((kind) =>
      deck[kind].map((card) => ({
        ref: { deckId: deck.id, cardId: card.id },
        card,
        location: { kind },
      })),
    ),
  );
  return [
    ...s.hand.map((entry) => ({
      ref: toCardRef(entry),
      card: entry.card,
      location: { kind: 'hand' as const },
    })),
    ...piles,
    ...s.assigned.map((entry) => ({
      ref: toCardRef(entry),
      card: entry.card,
      location: { kind: 'equipped' as const, characterId: entry.characterId, slot: entry.slot },
    })),
    ...s.inventory.map((entry) => ({
      ref: toCardRef(entry),
      card: entry.card,
      location: { kind: 'inventory' as const, characterId: entry.characterId },
    })),
  ];
}
