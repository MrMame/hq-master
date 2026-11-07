import { Card, EquipmentCard } from '../../models/card.model';
import { CardLocation, EquippedLocation, PileKind } from '../../models/card-location.model';
import {
  AssignedCard,
  CardRef,
  DeckInstance,
  DeckState,
  InventoryCard,
} from '../../models/deck-state.model';
import { slotsForCard } from '../equipment/equipment-slots.util';
import { findCardAt, isSameLocation, LocatedCard } from './card-location.util';
import { slotOccupant } from './deck-assignment.util';
import { CardInDeck, isSameCard, updateDeck, withDiscarded } from './deck-state.util';
import { shuffled } from './shuffle.util';

/**
 * Nimmt eine Karte von ihrem Ort und legt sie am Ziel ab: Hand (ans Ende), Nachziehstapel (eingemischt),
 * Ablagestapel oder Bank ihres eigenen Decks, Slot eines Charakters (eine dort liegende Karte kommt in den
 * Ablagestapel ihres Decks), Inventar eines Charakters (ans Ende, jede Kartenart).
 * Unbekannte Karte, Ziel gleich Herkunft oder unpassender Slot → derselbe Zustand.
 */
export function moveCard(s: DeckState, ref: CardRef, target: CardLocation): DeckState {
  const found: LocatedCard | null = findCardAt(s, ref);
  return found ? relocate(s, ref, found, target) : s;
}

/**
 * Nimmt Karten der Charaktere aus Slots und Inventar in den Ablagestapel ihres Decks (erst Slots, dann
 * Inventar, jeweils in Listenreihenfolge). Der Ort steht schon fest, deshalb wird nicht neu gesucht.
 */
export function discardOwned(s: DeckState, refs: readonly CardRef[]): DeckState {
  const picked: (entry: CardInDeck) => boolean = (entry) => refs.some((r) => isSameCard(entry, r));
  const owned: LocatedRef[] = [
    ...s.assigned.filter(picked).map(slotEntry),
    ...s.inventory.filter(picked).map(inventoryEntry),
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

function inventoryEntry({ deckId, card, characterId }: InventoryCard): LocatedRef {
  return {
    ref: { deckId, cardId: card.id },
    found: { card, location: { kind: 'inventory', characterId } },
  };
}

function relocate(
  s: DeckState,
  ref: CardRef,
  { card, location }: LocatedCard,
  target: CardLocation,
): DeckState {
  if (isSameLocation(location, target)) return s;
  if (target.kind === 'equipped') {
    return fitsSlot(card, target) ? equip(take(s, ref, location), ref.deckId, card, target) : s;
  }
  const taken: DeckState = take(s, ref, location);
  if (target.kind === 'hand') {
    return { ...taken, hand: [...taken.hand, { deckId: ref.deckId, card }] };
  }
  if (target.kind === 'inventory') {
    const carried: InventoryCard = { deckId: ref.deckId, card, characterId: target.characterId };
    return { ...taken, inventory: [...taken.inventory, carried] };
  }
  return updateDeck(taken, ref.deckId, (deck) => withPile(deck, target.kind, card));
}

function fitsSlot(card: Card, target: EquippedLocation): card is EquipmentCard {
  return card.cardType === 'equipment' && slotsForCard(card.slot).includes(target.slot);
}

function take(s: DeckState, ref: CardRef, from: CardLocation): DeckState {
  switch (from.kind) {
    case 'hand':
      return { ...s, hand: s.hand.filter((entry) => !isSameCard(entry, ref)) };
    case 'equipped':
      return { ...s, assigned: s.assigned.filter((entry) => !isSameCard(entry, ref)) };
    case 'inventory':
      return { ...s, inventory: s.inventory.filter((entry) => !isSameCard(entry, ref)) };
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
  card: EquipmentCard,
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
