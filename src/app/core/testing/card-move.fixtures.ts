import { Card, EquipmentCard } from '../models/card.model';
import { CardLocation } from '../models/card-location.model';
import { DeckConfig } from '../models/deck-config.model';
import { CardRef, DeckInstance, DeckState } from '../models/deck-state.model';
import { assignedCard, BASIC_CARD, createDeckInstance, createEquipmentCard } from './deck.fixtures';

/** Testdaten für Specs (wird nicht in den App-Code importiert). */
function handCard(n: number): EquipmentCard {
  return createEquipmentCard(`h${n}`, `Schild ${n}`, 'hand', [{ stat: 'defense', value: n }]);
}

export const HAND_CARDS: readonly EquipmentCard[] = [1, 2, 3, 4, 5].map(handCard);
const [H1, H2, H3, H4, H5] = HAND_CARDS;

/** Je Ort eine Handkarte aus deck-1: h1 in der Hand des DM, h2 im Nachziehstapel, h3 abgelegt, h4 in der Bank, h5 bei „a“. */
export const ORIGINS: readonly { cardId: string; location: CardLocation }[] = [
  { cardId: 'h1', location: { kind: 'hand' } },
  { cardId: 'h2', location: { kind: 'drawPile' } },
  { cardId: 'h3', location: { kind: 'discardPile' } },
  { cardId: 'h4', location: { kind: 'bank' } },
  { cardId: 'h5', location: { kind: 'equipped', characterId: 'a', slot: 'leftHand' } },
];

/** Ziele der Bewegungsmatrix; der Slot ist für alle Herkünfte frei und passt zu Handkarten. */
export const TARGETS: readonly CardLocation[] = [
  { kind: 'hand' },
  { kind: 'drawPile' },
  { kind: 'discardPile' },
  { kind: 'bank' },
  { kind: 'equipped', characterId: 'b', slot: 'leftHand' },
];

export function deck1Ref(cardId: string): CardRef {
  return { deckId: 'deck-1', cardId };
}

/**
 * Zwei Instanzen derselben Deck-Datei: deck-1 wie `ORIGINS`, dazu Fackel b1 im Nachziehstapel; deck-2 mit
 * denselben IDs (h1, h2 im Nachziehstapel, h3 abgelegt, h4 in der Bank, h5 bei „b“ in der rechten Hand).
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
  };
}

/** Wie oft die Karte im Zustand vorkommt (Hand, Stapel und Bank ihres Decks, Slots). */
export function occurrences(s: DeckState, ref: CardRef): number {
  const matches: (cards: readonly Card[]) => number = (cards) =>
    cards.filter((card) => card.id === ref.cardId).length;
  const deck: DeckInstance | undefined = s.decks.find((d) => d.id === ref.deckId);
  const hand: number = s.hand.filter(
    (entry) => entry.deckId === ref.deckId && entry.card.id === ref.cardId,
  ).length;
  const slots: number = s.assigned.filter(
    (entry) => entry.deckId === ref.deckId && entry.card.id === ref.cardId,
  ).length;
  const piles: number = deck
    ? matches(deck.drawPile) + matches(deck.discardPile) + matches(deck.bank)
    : 0;
  return hand + slots + piles;
}
