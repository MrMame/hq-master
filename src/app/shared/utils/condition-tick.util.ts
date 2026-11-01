import { ActiveCondition } from '../../core/models/character-condition.model';
import { CharacterInfo } from '../../core/models/character-info.model';
import { ConditionEvent } from '../../core/models/condition-event.model';
import { DamageTypes } from '../../core/models/damage-types.model';
import { applyDamage } from './damage.util';
import { conditionEnd } from './condition-time.util';

const MS_PER_SECOND: number = 1000;

export interface ConditionAdvance {
  character: CharacterInfo;
  events: ConditionEvent[];
}

/**
 * Wendet alle Wirkmomente bis `now` an (höchstens bis zum Ende der Dauer) und entfernt abgelaufene
 * Zustände. Schaden geht direkt aufs Leben; bei 0 Leben entsteht keiner mehr, `lastTickAt` läuft weiter.
 * Liegt `now` nicht hinter `lastTickAt` (Zeit zurück), bleibt der Zustand unverändert.
 * Ohne Änderung kommt dasselbe Objekt zurück.
 */
export function advanceConditions(character: CharacterInfo, now: Date): ConditionAdvance {
  let current: CharacterInfo = character;
  const events: ConditionEvent[] = [];
  const remaining: ActiveCondition[] = [];
  let changed: boolean = false;

  for (const condition of character.conditions) {
    if (now.getTime() <= Date.parse(condition.lastTickAt)) {
      remaining.push(condition);
      continue;
    }
    const end: number | null = conditionEnd(condition);
    const ticks: number[] = dueTicks(condition, Math.min(now.getTime(), end ?? Infinity));
    for (const tick of ticks) {
      const before: number = current.health;
      current = applyDamage(current, DamageTypes.Critical, condition.damagePerTick);
      if (current.health < before) {
        events.push(event('damage', character, condition, tick, before - current.health));
      }
    }
    if (end !== null && now.getTime() >= end) {
      events.push(event('expired', character, condition, end));
      changed = true;
    } else if (ticks.length > 0) {
      remaining.push({ ...condition, lastTickAt: new Date(ticks.at(-1) as number).toISOString() });
      changed = true;
    } else {
      remaining.push(condition);
    }
  }
  return changed
    ? { character: { ...current, conditions: remaining }, events }
    : { character, events };
}

/** Zeitpunkte (ms) der fälligen Wirkmomente nach `lastTickAt` bis einschließlich `limit`. */
function dueTicks(condition: ActiveCondition, limit: number): number[] {
  if (condition.intervalSeconds <= 0) return [];
  const step: number = condition.intervalSeconds * MS_PER_SECOND;
  const ticks: number[] = [];
  for (let tick: number = Date.parse(condition.lastTickAt) + step; tick <= limit; tick += step) {
    ticks.push(tick);
  }
  return ticks;
}

function event(
  type: ConditionEvent['type'],
  character: CharacterInfo,
  condition: ActiveCondition,
  time: number,
  damage?: number,
): ConditionEvent {
  return {
    type,
    characterId: character.id,
    conditionId: condition.id,
    gameTime: new Date(time).toISOString(),
    ...(damage === undefined ? {} : { damage }),
  };
}
