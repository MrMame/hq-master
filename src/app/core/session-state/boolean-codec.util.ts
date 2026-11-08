import { StorageCodec } from './persisted-state';

/** Speichert einen Schalter unverändert; alles andere als `true`/`false` fällt auf den Startwert zurück. */
export const BOOLEAN_CODEC: StorageCodec<boolean> = {
  encode: (value: boolean): unknown => value,
  decode: (stored: unknown): boolean | null => (typeof stored === 'boolean' ? stored : null),
};
