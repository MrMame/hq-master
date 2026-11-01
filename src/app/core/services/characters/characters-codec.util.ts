import { ActiveCondition, ConditionId } from '../../models/character-condition.model';
import { CharacterInfo } from '../../models/character-info.model';
import { CONDITION_TEMPLATES } from '../../models/condition-templates.model';
import { StorageCodec } from '../../session-state/persisted-state';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isConditionId(value: unknown): value is ConditionId {
  return CONDITION_TEMPLATES.some((template) => template.id === value);
}

function isActiveCondition(value: unknown): value is ActiveCondition {
  if (!isRecord(value) || !isConditionId(value['id'])) return false;
  const numbers: string[] = ['intervalSeconds', 'damagePerTick', 'durationSeconds'];
  const texts: string[] = ['description', 'startedAt', 'lastTickAt'];
  return (
    numbers.every((key) => typeof value[key] === 'number') &&
    texts.every((key) => typeof value[key] === 'string')
  );
}

/** Gültige Zustände eines gespeicherten Charakters; fehlt die Liste (ältere Session), bleibt sie leer. */
export function readConditions(stored: unknown): ActiveCondition[] {
  return Array.isArray(stored) ? stored.filter(isActiveCondition) : [];
}

/**
 * Speichert die Charaktere unverändert. Beim Laden bekommen ältere Einträge ohne `conditions` eine leere
 * Liste, ungültige Zustände und Einträge, die kein Objekt sind, werden verworfen; keine Liste → Startwert.
 */
export const CHARACTERS_CODEC: StorageCodec<CharacterInfo[]> = {
  encode: (characters: CharacterInfo[]): unknown => characters,
  decode: (stored: unknown): CharacterInfo[] | null =>
    Array.isArray(stored)
      ? stored.filter(isRecord).map(
          (character) =>
            ({
              ...character,
              conditions: readConditions(character['conditions']),
            }) as unknown as CharacterInfo,
        )
      : null,
};
