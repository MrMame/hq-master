import { Card } from '../../models/card.model';
import { DeckInstance, DeckState } from '../../models/deck-state.model';
import { readStoredProperties } from './card-property-xml.util';

/**
 * Karte aus einem geladenen Stand mit genau den Feldern einer Karte: Ohne eigene Rückseite gilt die des Decks;
 * frühere Felder (`cardType`, `slot`, `modifiers`, `attack`/`defense` alter `combat`-Karten) entfallen,
 * Eigenschaften werden geprüft.
 */
export function normalizedCard(card: Card, deckBack: string): Card {
  const { id, name, imagePath, backImagePath, description } = card;
  return {
    id,
    name,
    imagePath,
    backImagePath: backImagePath || deckBack,
    description,
    properties: readStoredProperties(card.properties, id),
  };
}

function normalizedDeck(deck: DeckInstance): DeckInstance {
  const back: string = deck.config.backImagePath;
  const all: (cards: Card[]) => Card[] = (cards) => cards.map((c) => normalizedCard(c, back));
  const { id, name, backImagePath } = deck.config;
  return {
    ...deck,
    config: { id, name, backImagePath, cards: all(deck.config.cards) },
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
  const card: <T extends { deckId: string; card: Card }>(entry: T) => T = (entry) => ({
    ...entry,
    card: normalizedCard(entry.card, backs.get(entry.deckId) ?? ''),
  });
  return {
    decks: state.decks.map(normalizedDeck),
    hand: state.hand.map(card),
    assigned: state.assigned.map(card),
    inventory: state.inventory.map(card),
    belt: state.belt.map(card),
  };
}
