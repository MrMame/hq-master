import { Card } from '../../models/card.model';
import { DeckState } from '../../models/deck-state.model';
import { moveCard } from './card-move.util';
import { findDeck, toCardRef } from './deck-state.util';

/** Die aktive Karte kommt in den Ablagestapel ihrer Instanz; ohne aktive Karte bleibt alles gleich. */
export function discardActive(s: DeckState): DeckState {
  return s.activeCard ? moveCard(s, toCardRef(s.activeCard), { kind: 'discardPile' }) : s;
}

/** Oberste Karte des Nachziehstapels wird aktiv; eine bisher aktive Karte wird zuvor abgelegt. */
export function drawCard(s: DeckState, deckId: string): DeckState {
  const top: Card | undefined = findDeck(s, deckId)?.drawPile[0];
  return top ? moveCard(s, { deckId, cardId: top.id }, { kind: 'active' }) : s;
}
