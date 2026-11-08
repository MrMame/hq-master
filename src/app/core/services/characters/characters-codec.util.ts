import { ActiveCondition, ConditionId } from '../../models/character-condition.model';
import { CharacterInfo, FIXED_PROPERTIES } from '../../models/character-info.model';
import { CONDITION_TEMPLATES } from '../../models/condition-templates.model';
import { StorageCodec } from '../../session-state/persisted-state';
import { withinLimits } from './character-limits.util';

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

/** Felder älterer Sessions, die es nicht mehr gibt (Typ, Fähigkeiten, Maximalwerte, Angriff, Abwehr, alte Namen). */
const REMOVED_FIELDS: readonly string[] = [
  'type',
  'abilities',
  'maxHealth',
  'maxArmor',
  'attack',
  'defense',
  'health',
  'armor',
  'speed',
];

/** Meldet einen Charakter, der ohne gültige Zahl in einem festen Wert gespeichert ist (Codec und XML). */
export function warnInvalidCharacter(id: unknown): void {
  console.warn(
    `Charakter „${String(id)}“ ohne gültige Zahl in ${FIXED_PROPERTIES.join(', ')} wird verworfen.`,
  );
}

function hasFixedProperties(character: Record<string, unknown>): boolean {
  const valid: boolean = FIXED_PROPERTIES.every((key) => Number.isFinite(character[key]));
  if (!valid) warnInvalidCharacter(character['id']);
  return valid;
}

function withoutRemovedFields(character: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(character).filter(([key]) => !REMOVED_FIELDS.includes(key)),
  );
}

function readCharacter(character: Record<string, unknown>): CharacterInfo {
  const decoded: CharacterInfo = {
    ...withoutRemovedFields(character),
    conditions: readConditions(character['conditions']),
    movedThisRound: character['movedThisRound'] === true,
  } as unknown as CharacterInfo;
  return withinLimits(decoded);
}

/**
 * Speichert die Charaktere unverändert. Beim Laden bekommen ältere Einträge ohne `conditions` eine leere
 * Liste und ohne `movedThisRound` den Wert `false`; Leben und Ruestung werden ganze Zahlen ≥ 0.
 * Altdaten werden nicht umgeschrieben: Ein Eintrag ohne gültige Zahl in `Leben`, `Ruestung` oder `Tempo` (z. B.
 * nur mit den alten Namen `health`/`armor`/`speed`) wird mit Konsolenwarnung verworfen; der EquipmentSyncService
 * legt dann seine Karten ab. Felder aus `REMOVED_FIELDS`, ungültige Zustände und Einträge, die kein Objekt sind,
 * werden verworfen; keine Liste → Startwert.
 */
export const CHARACTERS_CODEC: StorageCodec<CharacterInfo[]> = {
  encode: (characters: CharacterInfo[]): unknown => characters,
  decode: (stored: unknown): CharacterInfo[] | null =>
    Array.isArray(stored)
      ? stored.filter(isRecord).filter(hasFixedProperties).map(readCharacter)
      : null,
};
