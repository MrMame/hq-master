import { StorageCodec } from '../../../core/session-state/persisted-state';
import { DungeonLayout } from '../models/dungeon-layout.model';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** Prüft den groben Aufbau eines gespeicherten Layouts, damit ein kaputter Eintrag den Start nicht verhindert. */
export function isDungeonLayout(value: unknown): value is DungeonLayout {
  return (
    isRecord(value) &&
    typeof value['name'] === 'string' &&
    typeof value['columns'] === 'number' &&
    typeof value['rows'] === 'number' &&
    isRecord(value['floor']) &&
    Array.isArray(value['pieces']) &&
    Array.isArray(value['walls']) &&
    Array.isArray(value['doors'])
  );
}

/** Speichert das Layout unverändert als JSON; ungültige Einträge fallen auf den Startwert zurück. */
export const LAYOUT_CODEC: StorageCodec<DungeonLayout> = {
  encode: (layout: DungeonLayout): unknown => layout,
  decode: (stored: unknown): DungeonLayout | null => (isDungeonLayout(stored) ? stored : null),
};
