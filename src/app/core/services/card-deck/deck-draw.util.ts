import { Card } from '../../models/card.model';
import { ActiveCard, DeckInstance, DeckState } from '../../models/deck-state.model';
import { findDeck, updateDeck, withDiscarded } from './deck-state.util';
import { shuffled } from './shuffle.util';

/** Die aktive Karte kommt in den Ablagestapel ihrer Instanz; ohne aktive Karte bleibt alles gleich. */
export function discardActive(s: DeckState): DeckState {
  if (!s.activeCard) return s;
  return { ...withDiscarded(s, [s.activeCard]), activeCard: null };
}

/** Oberste Karte des Nachziehstapels wird aktiv; eine bisher aktive Karte wird zuvor abgelegt. */
export function drawCard(s: DeckState, deckId: string): DeckState {
  const top: Card | undefined = findDeck(s, deckId)?.drawPile[0];
  return top ? activateCard(s, deckId, top.id) : s;
}

/**
 * Macht eine Karte aus Stapel, Ablage oder Bank ihrer Instanz aktiv; eine bisher aktive Karte kommt
 * vorher in den Ablagestapel ihrer Instanz. Unbekannte Karte → unverändert.
 */
export function activateCard(s: DeckState, deckId: string, cardId: string): DeckState {
  const deck: DeckInstance | undefined = findDeck(s, deckId);
  const card: Card | undefined = deck
    ? [...deck.drawPile, ...deck.discardPile, ...deck.bank].find((c) => c.id === cardId)
    : undefined;
  if (!card) return s;
  const others: (cards: Card[]) => Card[] = (cards) => cards.filter((c) => c !== card);
  const taken: DeckState = updateDeck(s, deckId, (d) => ({
    ...d,
    drawPile: others(d.drawPile),
    discardPile: others(d.discardPile),
    bank: others(d.bank),
  }));
  return { ...discardActive(taken), activeCard: { deckId, card } };
}

/** Die aktive Karte wird in den Nachziehstapel ihrer Instanz gemischt. */
export function shuffleActiveIntoDrawPile(s: DeckState): DeckState {
  return moveActive(s, (d, card) => ({ ...d, drawPile: shuffled([...d.drawPile, card]) }));
}

/** Die aktive Karte kommt in die Bank ihrer Instanz. */
export function dropActiveIntoBank(s: DeckState): DeckState {
  return moveActive(s, (d, card) => ({ ...d, bank: [...d.bank, card] }));
}

function moveActive(
  s: DeckState,
  place: (deck: DeckInstance, card: Card) => DeckInstance,
): DeckState {
  const active: ActiveCard | null = s.activeCard;
  if (!active) return s;
  const next: DeckState = updateDeck(s, active.deckId, (d) => place(d, active.card));
  return { ...next, activeCard: null };
}
