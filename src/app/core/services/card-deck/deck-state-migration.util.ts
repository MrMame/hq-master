import { Card } from '../../models/card.model';
import { DeckConfig } from '../../models/deck-config.model';
import { AssignedCard, DeckState } from '../../models/deck-state.model';

/** Deck-Zustand vor mehreren Decks: genau ein Deck, Zuweisungen ohne Deck-Instanz. */
export interface LegacyDeckState {
  config: DeckConfig;
  drawPile: Card[];
  discardPile: Card[];
  activeCard: Card | null;
  bank: Card[];
  assigned: Omit<AssignedCard, 'deckId'>[];
}

/** Ein älterer Zustand wird zu einer Instanz; die aktive Karte wird einzige Handkarte, Zuweisungen gehören zu ihr. */
export function migrateLegacyDeck(legacy: LegacyDeckState): DeckState {
  const deckId: string = legacy.config.id || 'deck-1';
  return {
    decks: [
      {
        id: deckId,
        name: legacy.config.name,
        source: '',
        config: legacy.config,
        drawPile: legacy.drawPile,
        discardPile: legacy.discardPile,
        bank: legacy.bank,
      },
    ],
    hand: legacy.activeCard ? [{ deckId, card: legacy.activeCard }] : [],
    assigned: legacy.assigned.map((entry) => ({ ...entry, deckId })),
    inventory: [],
  };
}
