import { AssignedCard, DeckState } from '../../models/deck-state.model';
import { EQUIPMENT_SLOTS } from '../../models/equipment.model';
import { StorageCodec } from '../../session-state/persisted-state';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isAssignedCard(value: unknown): value is AssignedCard {
  return (
    isRecord(value) &&
    typeof value['characterId'] === 'string' &&
    EQUIPMENT_SLOTS.some((slot) => slot === value['slot']) &&
    isRecord(value['card']) &&
    value['card']['cardType'] === 'equipment' &&
    Array.isArray(value['card']['modifiers'])
  );
}

/**
 * Speichert den Deck-Zustand unverändert. Beim Laden bekommt ein älterer Zustand ohne `assigned` eine leere
 * Liste; ungültige Zuweisungen werden verworfen. Kein Objekt → Startwert (kein Deck).
 */
export const DECK_STATE_CODEC: StorageCodec<DeckState | null> = {
  encode: (state: DeckState | null): unknown => state,
  decode: (stored: unknown): DeckState | null => {
    if (!isRecord(stored)) return null;
    const assigned: unknown = stored['assigned'];
    return {
      ...stored,
      assigned: Array.isArray(assigned) ? assigned.filter(isAssignedCard) : [],
    } as unknown as DeckState;
  },
};
