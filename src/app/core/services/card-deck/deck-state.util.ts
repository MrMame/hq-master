import { Card } from '../../models/card.model';
import { CardRef, DeckInstance, DeckState } from '../../models/deck-state.model';

/** Eine Karte mit ihrer Deck-Instanz, z. B. die aktive oder eine zugewiesene Karte. */
export interface CardInDeck {
  deckId: string;
  card: Card;
}

/** Startzustand: keine Decks auf dem Tisch. */
export function emptyDeckState(): DeckState {
  return { decks: [], activeCard: null, assigned: [] };
}

/** Gleiche Karte, wenn Deck-Instanz und Karten-ID übereinstimmen. */
export function isSameCard(entry: CardInDeck, ref: CardRef): boolean {
  return entry.deckId === ref.deckId && entry.card.id === ref.cardId;
}

export function toCardRef(entry: CardInDeck): CardRef {
  return { deckId: entry.deckId, cardId: entry.card.id };
}

export function findDeck(s: DeckState, deckId: string): DeckInstance | undefined {
  return s.decks.find((deck) => deck.id === deckId);
}

/** Ändert eine Instanz; unbekannte ID oder unveränderte Instanz → derselbe Zustand. */
export function updateDeck(
  s: DeckState,
  deckId: string,
  change: (deck: DeckInstance) => DeckInstance,
): DeckState {
  const deck: DeckInstance | undefined = findDeck(s, deckId);
  if (!deck) return s;
  const next: DeckInstance = change(deck);
  return next === deck ? s : { ...s, decks: s.decks.map((d) => (d === deck ? next : d)) };
}

/** Karten einer Instanz außer den zugewiesenen: Stapel, Ablage, Bank und ihre aktive Karte. */
export function unassignedCards(s: DeckState, deckId: string): Card[] {
  const deck: DeckInstance | undefined = findDeck(s, deckId);
  if (!deck) return [];
  const active: Card[] = s.activeCard?.deckId === deckId ? [s.activeCard.card] : [];
  return [...deck.drawPile, ...deck.discardPile, ...active, ...deck.bank];
}

/** Legt jede Karte in den Ablagestapel ihrer Instanz; Karten fehlender Instanzen fallen weg. */
export function withDiscarded(s: DeckState, entries: readonly CardInDeck[]): DeckState {
  return entries.reduce(
    (state, { deckId, card }) =>
      updateDeck(state, deckId, (deck) => ({ ...deck, discardPile: [...deck.discardPile, card] })),
    s,
  );
}

/** Verwirft aktive Karte und Zuweisungen, deren Instanz nicht (mehr) auf dem Tisch liegt. */
export function withoutDanglingRefs(s: DeckState): DeckState {
  const exists: (deckId: string) => boolean = (deckId) => !!findDeck(s, deckId);
  return {
    ...s,
    activeCard: s.activeCard && exists(s.activeCard.deckId) ? s.activeCard : null,
    assigned: s.assigned.filter((entry) => exists(entry.deckId)),
  };
}
