import { StorageCodec } from './persisted-state';

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isPositiveNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value > 0;
}

/**
 * Speichert Zahlen je ID (z. B. Breiten je Seitenleiste). Ist der gespeicherte Wert kein Objekt,
 * greift der Startwert; einzelne Einträge ohne positive, endliche Zahl werden verworfen.
 */
export const NUMBER_RECORD_CODEC: StorageCodec<Record<string, number>> = {
  encode: (record: Record<string, number>): unknown => record,
  decode: (stored: unknown): Record<string, number> | null => {
    if (!isPlainObject(stored)) return null;
    return Object.fromEntries(
      Object.entries(stored).filter((entry): entry is [string, number] =>
        isPositiveNumber(entry[1]),
      ),
    );
  },
};
