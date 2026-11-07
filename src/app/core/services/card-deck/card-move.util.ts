import { Card, EquipmentCard } from '../../models/card.model';
import { CardLocation, EquippedLocation, PileKind } from '../../models/card-location.model';
import { AssignedCard, CardRef, DeckInstance, DeckState } from '../../models/deck-state.model';
import { slotsForCard } from '../equipment/equipment-slots.util';
import { findCardAt, isSameLocation, LocatedCard } from './card-location.util';
import { slotOccupant } from './deck-assignment.util';
import { isSameCard, updateDeck, withDiscarded } from './deck-state.util';
import { shuffled } from './shuffle.util';

/**
 * Nimmt eine Karte von ihrem Ort und legt sie am Ziel ab: aktive Karte (eine bisher aktive kommt in den
 * Ablagestapel ihres Decks), Nachziehstapel (eingemischt), Ablagestapel oder Bank ihres eigenen Decks, Slot
 * eines Charakters (eine dort liegende Karte kommt in den Ablagestapel ihres Decks).
 * Unbekannte Karte, Ziel gleich Herkunft oder unpassender Slot → derselbe Zustand.
 */
export function moveCard(s: DeckState, ref: CardRef, target: CardLocation): DeckState {
  const found: LocatedCard | null = findCardAt(s, ref);
  return found ? relocate(s, ref, found, target) : s;
}

/**
 * Nimmt Karten aus ihren Slots in den Ablagestapel ihres Decks (in der Reihenfolge der Zuweisungen). Der Ort
 * steht schon fest, deshalb wird nicht neu gesucht.
 */
export function discardAssigned(s: DeckState, refs: readonly CardRef[]): DeckState {
  return s.assigned
    .filter((entry) => refs.some((ref) => isSameCard(entry, ref)))
    .reduce(
      (state, { deckId, card, characterId, slot }) =>
        relocate(
          state,
          { deckId, cardId: card.id },
          { card, location: { kind: 'equipped', characterId, slot } },
          { kind: 'discardPile' },
        ),
      s,
    );
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
  if (target.kind === 'active') {
    const previous: DeckState = withDiscarded(taken, taken.activeCard ? [taken.activeCard] : []);
    return { ...previous, activeCard: { deckId: ref.deckId, card } };
  }
  return updateDeck(taken, ref.deckId, (deck) => withPile(deck, target.kind, card));
}

function fitsSlot(card: Card, target: EquippedLocation): card is EquipmentCard {
  return card.cardType === 'equipment' && slotsForCard(card.slot).includes(target.slot);
}

function take(s: DeckState, ref: CardRef, from: CardLocation): DeckState {
  switch (from.kind) {
    case 'active':
      return { ...s, activeCard: null };
    case 'equipped':
      return { ...s, assigned: s.assigned.filter((entry) => !isSameCard(entry, ref)) };
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
