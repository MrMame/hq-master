import { StorageCodec } from './persisted-state';

function isStringList(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((entry) => typeof entry === 'string');
}

/** Speichert eine Liste von IDs unverändert; alles andere als eine Liste von Texten fällt auf den Startwert zurück. */
export const STRING_LIST_CODEC: StorageCodec<string[]> = {
  encode: (list: string[]): unknown => list,
  decode: (stored: unknown): string[] | null => (isStringList(stored) ? stored : null),
};
