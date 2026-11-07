import {
  AssignedCard,
  DeckInstance,
  DeckState,
  HandCard,
  InventoryCard,
} from '../../models/deck-state.model';
import { EQUIPMENT_SLOTS } from '../../models/equipment.model';
import { StorageCodec } from '../../session-state/persisted-state';
import { LegacyDeckState, migrateLegacyDeck } from './deck-state-migration.util';
import { withoutDanglingRefs } from './deck-state.util';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isAssignment(value: unknown): value is Omit<AssignedCard, 'deckId'> {
  return (
    isRecord(value) &&
    typeof value['characterId'] === 'string' &&
    EQUIPMENT_SLOTS.some((slot) => slot === value['slot']) &&
    isRecord(value['card']) &&
    value['card']['cardType'] === 'equipment' &&
    Array.isArray(value['card']['modifiers'])
  );
}

function isAssignedCard(value: unknown): value is AssignedCard {
  return isAssignment(value) && typeof (value as Record<string, unknown>)['deckId'] === 'string';
}

function isDeckInstance(value: unknown): value is DeckInstance {
  return (
    isRecord(value) &&
    typeof value['id'] === 'string' &&
    typeof value['name'] === 'string' &&
    isRecord(value['config']) &&
    ['drawPile', 'discardPile', 'bank'].every((pile) => Array.isArray(value[pile]))
  );
}

function isHandCard(value: unknown): value is HandCard {
  return isRecord(value) && typeof value['deckId'] === 'string' && isRecord(value['card']);
}

function isInventoryCard(value: unknown): value is InventoryCard {
  return isRecord(value) && isHandCard(value) && typeof value['characterId'] === 'string';
}

function list<T>(value: unknown, guard: (item: unknown) => item is T): T[] {
  return Array.isArray(value) ? value.filter(guard) : [];
}

/** Älterer Zustand mit genau einem Deck (`config` statt `decks`). */
function decodeLegacy(stored: Record<string, unknown>): DeckState {
  return migrateLegacyDeck({
    ...(stored as unknown as LegacyDeckState),
    assigned: list(stored['assigned'], isAssignment),
  });
}

/** Hand; ein älterer Zustand mit `activeCard` lädt sie als einzige Handkarte. */
function decodeHand(stored: Record<string, unknown>): HandCard[] {
  if (Array.isArray(stored['hand'])) return list(stored['hand'], isHandCard);
  return isHandCard(stored['activeCard']) ? [stored['activeCard']] : [];
}

/**
 * Speichert den Deck-Zustand unverändert. Beim Laden wird ein älterer Zustand mit einem Deck zu einer
 * Instanz; ungültige Instanzen, Zuweisungen und Inventarkarten sowie Verweise auf fehlende Instanzen werden
 * verworfen; ohne Inventar (ältere Stände) ist es leer. Kein Objekt → Startwert (keine Decks).
 */
export const DECK_STATE_CODEC: StorageCodec<DeckState> = {
  encode: (state: DeckState): unknown => state,
  decode: (stored: unknown): DeckState | null => {
    if (!isRecord(stored)) return null;
    if (isRecord(stored['config'])) return decodeLegacy(stored);
    return withoutDanglingRefs({
      decks: list(stored['decks'], isDeckInstance).map((deck) => ({
        ...deck,
        source: typeof deck.source === 'string' ? deck.source : '',
      })),
      hand: decodeHand(stored),
      assigned: list(stored['assigned'], isAssignedCard),
      inventory: list(stored['inventory'], isInventoryCard),
    });
  },
};
