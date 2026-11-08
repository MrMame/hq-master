import { Card } from '../../models/card.model';
import {
  CardLocation,
  CarriedKind,
  EquippedLocation,
  PileKind,
} from '../../models/card-location.model';
import {
  AssignedCard,
  CardRef,
  DeckInstance,
  DeckState,
  InventoryCard,
} from '../../models/deck-state.model';
import { findCardAt, isSameLocation, LocatedCard } from './card-location.util';
import { slotOccupant } from './deck-assignment.util';
import { CardInDeck, findDeck, isSameCard, updateDeck, withDiscarded } from './deck-state.util';
import { shuffled } from './shuffle.util';

/**
 * Nimmt eine Karte von ihrem Ort und legt sie am Ziel ab: Hand (ans Ende), Nachziehstapel (eingemischt, mit
 * `top` oben auf, auch aus dem Nachziehstapel selbst),
 * Ablagestapel oder Bank ihres eigenen Decks, Slot eines Charakters (eine dort liegende Karte kommt in den
 * Ablagestapel ihres Decks), Inventar oder Gürtel eines Charakters (ans Ende, jede Karte).
 * Jede Karte passt in jeden Slot. Unbekannte Karte oder Ziel gleich Herkunft (auch: liegt schon oben) → derselbe
 * Zustand.
 */
export function moveCard(s: DeckState, ref: CardRef, target: CardLocation): DeckState {
  const found: LocatedCard | null = findCardAt(s, ref);
  return found ? relocate(s, ref, found, target) : s;
}

/**
 * Nimmt Karten der Charaktere aus Slots, Inventar und Gürtel in den Ablagestapel ihres Decks (erst Slots, dann
 * Inventar, dann Gürtel, jeweils in Listenreihenfolge). Der Ort steht schon fest, deshalb wird nicht neu gesucht.
 */
export function discardOwned(s: DeckState, refs: readonly CardRef[]): DeckState {
  const picked: (entry: CardInDeck) => boolean = (entry) => refs.some((r) => isSameCard(entry, r));
  const owned: LocatedRef[] = [
    ...s.assigned.filter(picked).map(slotEntry),
    ...s.inventory.filter(picked).map((entry) => carriedEntry(entry, 'inventory')),
    ...s.belt.filter(picked).map((entry) => carriedEntry(entry, 'belt')),
  ];
  return owned.reduce(
    (state, { ref, found }) => relocate(state, ref, found, { kind: 'discardPile' }),
    s,
  );
}

interface LocatedRef {
  ref: CardRef;
  found: LocatedCard;
}

function slotEntry({ deckId, card, characterId, slot }: AssignedCard): LocatedRef {
  return {
    ref: { deckId, cardId: card.id },
    found: { card, location: { kind: 'equipped', characterId, slot } },
  };
}

function carriedEntry({ deckId, card, characterId }: InventoryCard, kind: CarriedKind): LocatedRef {
  return { ref: { deckId, cardId: card.id }, found: { card, location: { kind, characterId } } };
}

function relocate(
  s: DeckState,
  ref: CardRef,
  { card, location }: LocatedCard,
  target: CardLocation,
): DeckState {
  if (isOnTopTarget(target)) return putOnTop(s, ref, card, location);
  if (isSameLocation(location, target)) return s;
  if (target.kind === 'equipped') {
    return equip(take(s, ref, location), ref.deckId, card, target);
  }
  const taken: DeckState = take(s, ref, location);
  if (target.kind === 'hand') {
    return { ...taken, hand: [...taken.hand, { deckId: ref.deckId, card }] };
  }
  if (target.kind === 'inventory' || target.kind === 'belt') {
    const carried: InventoryCard = { deckId: ref.deckId, card, characterId: target.characterId };
    return { ...taken, [target.kind]: [...taken[target.kind], carried] };
  }
  return updateDeck(taken, ref.deckId, (deck) => withPile(deck, target.kind, card));
}

function isOnTopTarget(target: CardLocation): boolean {
  return target.kind === 'drawPile' && target.top === true;
}

function putOnTop(s: DeckState, ref: CardRef, card: Card, from: CardLocation): DeckState {
  if (from.kind === 'drawPile' && findDeck(s, ref.deckId)?.drawPile[0]?.id === ref.cardId) return s;
  return updateDeck(take(s, ref, from), ref.deckId, (deck) => ({
    ...deck,
    drawPile: [card, ...deck.drawPile],
  }));
}

function take(s: DeckState, ref: CardRef, from: CardLocation): DeckState {
  switch (from.kind) {
    case 'hand':
      return { ...s, hand: s.hand.filter((entry) => !isSameCard(entry, ref)) };
    case 'equipped':
      return { ...s, assigned: s.assigned.filter((entry) => !isSameCard(entry, ref)) };
    case 'inventory':
    case 'belt':
      return { ...s, [from.kind]: s[from.kind].filter((entry) => !isSameCard(entry, ref)) };
    default:
      return updateDeck(s, ref.deckId, (deck) => ({
        ...deck,
        [from.kind]: deck[from.kind].filter((c) => c.id !== ref.cardId),
      }));
  }
}

function withPile(deck: DeckInstance, kind: PileKind, card: Card): DeckInstance {
  return kind === 'drawPile'
    ? { ...deck, drawPile: shuffled([...deck.drawPile, card]) }
    : { ...deck, [kind]: [...deck[kind], card] };
}

function equip(
  s: DeckState,
  deckId: string,
  card: Card,
  { characterId, slot }: EquippedLocation,
): DeckState {
  const previous: AssignedCard | undefined = slotOccupant(s.assigned, characterId, slot);
  return {
    ...withDiscarded(s, previous ? [previous] : []),
    assigned: [
      ...s.assigned.filter((entry) => entry !== previous),
      { deckId, card, characterId, slot },
    ],
  };
}
