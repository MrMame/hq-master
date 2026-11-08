import { Card, toCardType } from '../../models/card.model';
import { DeckInstance, DeckState } from '../../models/deck-state.model';

function withBack<T extends Card>(card: T, deckBack: string): T {
  return card.backImagePath ? card : { ...card, backImagePath: deckBack };
}

/**
 * Karte aus einem älteren Stand: ohne eigene Rückseite gilt die des Decks; frühere Kartentypen (`combat`) werden
 * zu `basic`, ihre Werte (`attack`/`defense`) entfallen.
 */
export function normalizedCard(card: Card, deckBack: string): Card {
  if (card.cardType === 'equipment') return withBack(card, deckBack);
  const { id, name, imagePath, backImagePath, description } = card;
  return withBack({ id, name, imagePath, backImagePath, description, cardType: 'basic' }, deckBack);
}

function normalizedDeck(deck: DeckInstance): DeckInstance {
  const back: string = deck.config.backImagePath;
  const all: (cards: Card[]) => Card[] = (cards) => cards.map((c) => normalizedCard(c, back));
  return {
    ...deck,
    config: {
      ...deck.config,
      defaultCardType: toCardType(deck.config.defaultCardType),
      cards: all(deck.config.cards),
    },
    drawPile: all(deck.drawPile),
    discardPile: all(deck.discardPile),
    bank: all(deck.bank),
  };
}

/** Alle Karten eines geladenen Deck-Zustands (Spielstand, gespeicherte Session) mit wirksamer Rückseite. */
export function withNormalizedCards(state: DeckState): DeckState {
  const backs: ReadonlyMap<string, string> = new Map(
    state.decks.map((deck) => [deck.id, deck.config.backImagePath]),
  );
  const backOf: (deckId: string) => string = (deckId) => backs.get(deckId) ?? '';
  return {
    decks: state.decks.map(normalizedDeck),
    hand: state.hand.map((e) => ({ ...e, card: normalizedCard(e.card, backOf(e.deckId)) })),
    assigned: state.assigned.map((e) => ({ ...e, card: withBack(e.card, backOf(e.deckId)) })),
    inventory: state.inventory.map((e) => ({
      ...e,
      card: normalizedCard(e.card, backOf(e.deckId)),
    })),
  };
}
