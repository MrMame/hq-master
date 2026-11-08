import { Card } from '../models/card.model';
import { CardLocation } from '../models/card-location.model';
import { DeckConfig } from '../models/deck-config.model';
import { CardRef, DeckInstance, DeckState } from '../models/deck-state.model';
import {
  assignedCard,
  BASIC_CARD,
  createDeckInstance,
  createPropertyCard,
  inventoryCard,
} from './deck.fixtures';

/** Testdaten für Specs (wird nicht in den App-Code importiert). */
function handCard(n: number): Card {
  return createPropertyCard(`h${n}`, `Schild ${n}`, [{ name: 'Abwehr', value: n }]);
}

export const HAND_CARDS: readonly Card[] = [1, 2, 3, 4, 5, 6, 7].map(handCard);
const [H1, H2, H3, H4, H5, H6, H7] = HAND_CARDS;

/**
 * Je Ort eine Handkarte aus deck-1: h1 in der Hand des DM, h2 im Nachziehstapel, h3 abgelegt, h4 in der Bank,
 * h5 bei „a“ in der linken Hand, h6 im Inventar von „a“, h7 im Gürtel von „a“.
 */
export const ORIGINS: readonly { cardId: string; location: CardLocation }[] = [
  { cardId: 'h1', location: { kind: 'hand' } },
  { cardId: 'h2', location: { kind: 'drawPile' } },
  { cardId: 'h3', location: { kind: 'discardPile' } },
  { cardId: 'h4', location: { kind: 'bank' } },
  { cardId: 'h5', location: { kind: 'equipped', characterId: 'a', slot: 'leftHand' } },
  { cardId: 'h6', location: { kind: 'inventory', characterId: 'a' } },
  { cardId: 'h7', location: { kind: 'belt', characterId: 'a' } },
];

/** Ziele der Bewegungsmatrix; Slot, Inventar und Gürtel gehören „b“, der Slot ist frei. */
export const TARGETS: readonly CardLocation[] = [
  { kind: 'hand' },
  { kind: 'drawPile' },
  { kind: 'discardPile' },
  { kind: 'bank' },
  { kind: 'equipped', characterId: 'b', slot: 'leftHand' },
  { kind: 'inventory', characterId: 'b' },
  { kind: 'belt', characterId: 'b' },
];

export function deck1Ref(cardId: string): CardRef {
  return { deckId: 'deck-1', cardId };
}

/**
 * Zwei Instanzen derselben Deck-Datei: deck-1 wie `ORIGINS`, dazu Fackel b1 im Nachziehstapel; deck-2 mit
 * denselben IDs (h1, h2 im Nachziehstapel, h3 abgelegt, h4 in der Bank, h5 bei „b“ in der rechten Hand,
 * h6 im Inventar von „b“).
 */
export function createMoveState(): DeckState {
  const config: DeckConfig = {
    ...createDeckInstance().config,
    cards: [BASIC_CARD, ...HAND_CARDS],
  };
  return {
    decks: [
      createDeckInstance('deck-1', {
        config,
        drawPile: [H2, BASIC_CARD],
        discardPile: [H3],
        bank: [H4],
      }),
      createDeckInstance('deck-2', {
        name: 'Testdeck (2)',
        config,
        drawPile: [H1, H2],
        discardPile: [H3],
        bank: [H4],
      }),
    ],
    hand: [{ deckId: 'deck-1', card: H1 }],
    assigned: [
      assignedCard(H5, 'a', 'leftHand', 'deck-1'),
      assignedCard(H5, 'b', 'rightHand', 'deck-2'),
    ],
    inventory: [inventoryCard(H6, 'a', 'deck-1'), inventoryCard(H6, 'b', 'deck-2')],
    belt: [inventoryCard(H7, 'a', 'deck-1')],
  };
}

/** Wie oft die Karte im Zustand vorkommt (Hand, Stapel und Bank ihres Decks, Slots, Inventar, Gürtel). */
export function occurrences(s: DeckState, ref: CardRef): number {
  const matches: (cards: readonly Card[]) => number = (cards) =>
    cards.filter((card) => card.id === ref.cardId).length;
  const deck: DeckInstance | undefined = s.decks.find((d) => d.id === ref.deckId);
  const hand: number = s.hand.filter(
    (entry) => entry.deckId === ref.deckId && entry.card.id === ref.cardId,
  ).length;
  const slots: number = [...s.assigned, ...s.inventory, ...s.belt].filter(
    (entry) => entry.deckId === ref.deckId && entry.card.id === ref.cardId,
  ).length;
  const piles: number = deck
    ? matches(deck.drawPile) + matches(deck.discardPile) + matches(deck.bank)
    : 0;
  return hand + slots + piles;
}
