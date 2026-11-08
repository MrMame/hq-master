import { Card } from '../../models/card.model';
import { DeckInstance, DeckState } from '../../models/deck-state.model';
import { withUniqueCardIds } from './card-id.util';
import { readStoredProperties } from './card-property-xml.util';
import { CardInDeck } from './deck-state.util';

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

/**
 * Eindeutige IDs innerhalb einer Instanz: `config.cards` für sich, Nachziehstapel, Ablage und Bank als eine Folge.
 * `carried` sind die IDs aus Hand, Slots, Inventar und Gürtel; sie bleiben, und kein Stapel vergibt sie neu.
 */
function withUniqueDeckIds(deck: DeckInstance, carried: string[]): DeckInstance {
  const { drawPile, discardPile, bank } = deck;
  const piles: Card[] = withUniqueCardIds([...drawPile, ...discardPile, ...bank], carried);
  const discardStart: number = drawPile.length;
  const bankStart: number = discardStart + discardPile.length;
  return {
    ...deck,
    config: { ...deck.config, cards: withUniqueCardIds(deck.config.cards) },
    drawPile: piles.slice(0, discardStart),
    discardPile: piles.slice(discardStart, bankStart),
    bank: piles.slice(bankStart),
  };
}

/**
 * Alle Karten eines geladenen Deck-Zustands (Spielstand, gespeicherte Session) mit wirksamer Rückseite und
 * eindeutigen IDs je Instanz (siehe `withUniqueDeckIds`).
 */
export function withNormalizedCards(state: DeckState): DeckState {
  const backs: ReadonlyMap<string, string> = new Map(
    state.decks.map((deck) => [deck.id, deck.config.backImagePath]),
  );
  const card: <T extends CardInDeck>(entry: T) => T = (entry) => ({
    ...entry,
    card: normalizedCard(entry.card, backs.get(entry.deckId) ?? ''),
  });
  const carried: CardInDeck[] = [
    ...state.hand,
    ...state.assigned,
    ...state.inventory,
    ...state.belt,
  ];
  const carriedIds: (deckId: string) => string[] = (deckId) =>
    carried.filter((entry) => entry.deckId === deckId).map((entry) => entry.card.id);
  return {
    decks: state.decks.map((deck) => withUniqueDeckIds(normalizedDeck(deck), carriedIds(deck.id))),
    hand: state.hand.map(card),
    assigned: state.assigned.map(card),
    inventory: state.inventory.map(card),
    belt: state.belt.map(card),
  };
}
