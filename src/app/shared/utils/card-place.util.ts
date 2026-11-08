import { CardLocation } from '../../core/models/card-location.model';
import { CardRef, DeckState } from '../../core/models/deck-state.model';
import { EQUIPMENT_SLOTS } from '../../core/models/equipment.model';
import { findDeck, isSameRef, toCardRef } from '../../core/services/card-deck/deck-state.util';

/** Stelle der angesehenen Karte an ihrem Ort; `index` zählt ab 0. */
export interface PlacePosition {
  index: number;
  total: number;
}

/**
 * Alle Karten am Ort `location` in Anzeigereihenfolge: Hand (alle Decks), Stapel und Bank des Decks `deckId`,
 * Slots eines Charakters (Kopf bis Amulett), sein Inventar oder sein Gürtel.
 */
export function cardsAtPlace(s: DeckState, deckId: string, location: CardLocation): CardRef[] {
  switch (location.kind) {
    case 'hand':
      return s.hand.map(toCardRef);
    case 'equipped':
      return s.assigned
        .filter((entry) => entry.characterId === location.characterId)
        .sort((a, b) => EQUIPMENT_SLOTS.indexOf(a.slot) - EQUIPMENT_SLOTS.indexOf(b.slot))
        .map(toCardRef);
    case 'inventory':
    case 'belt':
      return s[location.kind]
        .filter((entry) => entry.characterId === location.characterId)
        .map(toCardRef);
    default:
      return (findDeck(s, deckId)?.[location.kind] ?? []).map((card) => ({
        deckId,
        cardId: card.id,
      }));
  }
}

/** Stelle von `ref` in `place`; nicht enthalten → `null`. */
export function placePosition(place: readonly CardRef[], ref: CardRef): PlacePosition | null {
  const index: number = place.findIndex((entry) => isSameRef(entry, ref));
  return index < 0 ? null : { index, total: place.length };
}

/**
 * Karte, die der Viewer nach einer Aktion zeigt: Liegt `moved` noch am Ort oder ist der Ort jetzt leer, bleibt
 * es `moved`; sonst die Karte, die an ihre Stelle `index` gerückt ist (am Ende die letzte).
 */
export function cardAfterMove(place: readonly CardRef[], index: number, moved: CardRef): CardRef {
  if (place.length === 0 || place.some((entry) => isSameRef(entry, moved))) return moved;
  return place[Math.min(index, place.length - 1)];
}
