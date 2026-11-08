import { CardProperty } from '../../core/models/card-property.model';
import { CharacterInfo, FixedProperty } from '../../core/models/character-info.model';
import { withEquipmentChange } from '../../core/services/characters/character-limits.util';
import { bonusOf } from '../../core/services/equipment/effective-stats.util';

/**
 * Setzt einen festen Wert als neues Objekt. `change` ist die Änderung durch vorgemerkte Kartenbewegungen: Der
 * eingegebene Wert ist der angezeigte (inkl. `Leben`/`Ruestung` der Karten), gespeichert wird er ohne sie.
 */
export function withStat(
  character: CharacterInfo,
  stat: FixedProperty,
  value: number,
  change: readonly CardProperty[] = [],
): CharacterInfo {
  if (stat === 'Tempo' || !isNumber(value)) return { ...character, [stat]: value };
  return { ...character, [stat]: value - bonusOf(change, stat) };
}

/**
 * Werte, wie sie nach dem Übernehmen gälten: Leben/Ruestung plus `change`, nie unter 0. Eine ungültige Eingabe
 * (z. B. leeres Feld) bleibt stehen, damit das Formular sie meldet.
 */
export function withDraftChange(
  character: CharacterInfo,
  change: readonly CardProperty[],
): CharacterInfo {
  if (change.length === 0) return character;
  const changed: CharacterInfo = withEquipmentChange(character, change, 1);
  return {
    ...changed,
    Leben: isNumber(character.Leben) ? changed.Leben : character.Leben,
    Ruestung: isNumber(character.Ruestung) ? changed.Ruestung : character.Ruestung,
  };
}

function isNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}
