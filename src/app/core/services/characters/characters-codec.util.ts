import { ActiveCondition, ConditionId } from '../../models/character-condition.model';
import { CharacterInfo } from '../../models/character-info.model';
import { CONDITION_TEMPLATES } from '../../models/condition-templates.model';
import { StorageCodec } from '../../session-state/persisted-state';
import { normalizedLimits, readLimit } from './character-limits.util';

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

function readCharacter(character: Record<string, unknown>): CharacterInfo {
  const decoded: CharacterInfo = {
    ...character,
    conditions: readConditions(character['conditions']),
    movedThisRound: character['movedThisRound'] === true,
  } as unknown as CharacterInfo;
  return normalizedLimits({
    ...decoded,
    maxHealth: readLimit(character['maxHealth'], decoded.health),
    maxArmor: readLimit(character['maxArmor'], decoded.armor),
  });
}

/**
 * Speichert die Charaktere unverändert. Beim Laden bekommen ältere Einträge ohne `conditions` eine leere
 * Liste und ohne `movedThisRound` den Wert `false`; fehlt ein Maximum oder ist es ungültig, gilt der aktuelle Wert,
 * ein aktueller Wert darüber wird auf das Maximum gesenkt; ungültige Zustände und Einträge, die kein Objekt sind, werden verworfen; keine Liste → Startwert.
 */
export const CHARACTERS_CODEC: StorageCodec<CharacterInfo[]> = {
  encode: (characters: CharacterInfo[]): unknown => characters,
  decode: (stored: unknown): CharacterInfo[] | null =>
    Array.isArray(stored) ? stored.filter(isRecord).map(readCharacter) : null,
};
