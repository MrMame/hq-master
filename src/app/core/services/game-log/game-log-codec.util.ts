import { CONDITION_TEMPLATES } from '../../models/condition-templates.model';
import { DamageTypes } from '../../models/damage-types.model';
import { GAME_LOG_ENTRY_TYPES, GameLogEntry } from '../../models/game-log-entry.model';
import { StorageCodec } from '../../session-state/persisted-state';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isOptional(value: unknown, check: (present: unknown) => boolean): boolean {
  return value === undefined || check(value);
}

/** Prüft Pflichtfelder und Typ jedes optionalen Felds eines gespeicherten Eintrags. */
export function isGameLogEntry(value: unknown): value is GameLogEntry {
  if (!isRecord(value)) return false;
  const isText: (field: unknown) => boolean = (field) => typeof field === 'string';
  return (
    ['id', 'gameTime', 'text'].every((key) => isText(value[key])) &&
    GAME_LOG_ENTRY_TYPES.some((type) => type === value['type']) &&
    isOptional(value['characterId'], isText) &&
    isOptional(value['characterName'], isText) &&
    isOptional(value['conditionId'], (id) => CONDITION_TEMPLATES.some((t) => t.id === id)) &&
    isOptional(value['value'], (field) => typeof field === 'number') &&
    isOptional(value['damageType'], (type) => Object.values(DamageTypes).some((d) => d === type))
  );
}

/** Speichert das Log unverändert; ungültige Einträge werden beim Laden verworfen, keine Liste → Startwert. */
export const GAME_LOG_CODEC: StorageCodec<GameLogEntry[]> = {
  encode: (entries: GameLogEntry[]): unknown => entries,
  decode: (stored: unknown): GameLogEntry[] | null =>
    Array.isArray(stored) ? stored.filter(isGameLogEntry) : null,
};
