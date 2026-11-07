import { Card } from '../../models/card.model';
import { DeckState } from '../../models/deck-state.model';
import { moveCard } from './card-move.util';
import { findDeck } from './deck-state.util';

/** Oberste Karte des Nachziehstapels kommt ans Ende der Hand; die übrigen Handkarten bleiben. */
export function drawCard(s: DeckState, deckId: string): DeckState {
  const top: Card | undefined = findDeck(s, deckId)?.drawPile[0];
  return top ? moveCard(s, { deckId, cardId: top.id }, { kind: 'hand' }) : s;
}
