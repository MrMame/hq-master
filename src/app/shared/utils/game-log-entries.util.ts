import { ActiveCondition, ConditionId } from '../../core/models/character-condition.model';
import { CharacterInfo } from '../../core/models/character-info.model';
import { ConditionEvent } from '../../core/models/condition-event.model';
import { DamageTypes } from '../../core/models/damage-types.model';
import { NewGameLogEntry } from '../../core/models/game-log-entry.model';
import { conditionText, damageText } from '../../core/services/game-log/game-log-text.util';

/** Log-Eintrag zu einem Ereignis des Zustands-Ticks; Zeitpunkt ist der Wirkmoment bzw. der Ablauf. */
export function conditionEventEntry(
  event: ConditionEvent,
  characterName: string | undefined,
): NewGameLogEntry {
  const isDamage: boolean = event.type === 'damage';
  return {
    type: isDamage ? 'condition-damage' : 'condition-expired',
    gameTime: event.gameTime,
    characterId: event.characterId,
    characterName,
    conditionId: event.conditionId,
    ...(isDamage ? { value: event.damage } : {}),
    text: conditionText(event.type, characterName, event.conditionId, event.damage),
  };
}

/**
 * Je neu gesetztem und entferntem Zustand ein Eintrag (zuerst gesetzte, dann entfernte).
 * Geänderte Werte eines bleibenden Zustands werden nicht geloggt.
 */
export function conditionChangeEntries(
  before: ActiveCondition[],
  after: CharacterInfo,
  now: Date,
): NewGameLogEntry[] {
  const ids: (conditions: ActiveCondition[]) => ConditionId[] = (conditions) =>
    conditions.map((condition) => condition.id);
  const beforeIds: ConditionId[] = ids(before);
  const afterIds: ConditionId[] = ids(after.conditions);
  const entry: (type: 'set' | 'removed', id: ConditionId) => NewGameLogEntry = (type, id) => ({
    type: type === 'set' ? 'condition-set' : 'condition-removed',
    gameTime: now.toISOString(),
    characterId: after.id,
    characterName: after.name,
    conditionId: id,
    text: conditionText(type, after.name, id),
  });
  return [
    ...afterIds.filter((id) => !beforeIds.includes(id)).map((id) => entry('set', id)),
    ...beforeIds.filter((id) => !afterIds.includes(id)).map((id) => entry('removed', id)),
  ];
}

/** Log-Eintrag zu manuell eingetragenem Schaden auf Rüstung (`Normal`) oder Leben (`Critical`). */
export function damageEntry(
  character: CharacterInfo,
  damageType: DamageTypes,
  damage: number,
  now: Date,
): NewGameLogEntry {
  return {
    type: 'damage',
    gameTime: now.toISOString(),
    characterId: character.id,
    characterName: character.name,
    value: damage,
    damageType,
    text: damageText(character.name, damage, damageType),
  };
}
