import { ActiveCondition, ConditionTemplate } from '../../core/models/character-condition.model';
import { isConditionExpired } from './condition-time.util';

/** Zeitwerte eines Zustands, die der Editor als Minuten + Sekunden anbietet. */
export type ConditionDuration = 'intervalSeconds' | 'durationSeconds';

/** Kopie der Vorlage für die Arbeitskopie; `startedAt` bleibt bis zum „Übernehmen“ leer. */
export function conditionFromTemplate(template: ConditionTemplate): ActiveCondition {
  return {
    id: template.id,
    intervalSeconds: template.intervalSeconds,
    damagePerTick: template.damagePerTick,
    durationSeconds: template.durationSeconds,
    description: template.description,
    startedAt: '',
    lastTickAt: '',
  };
}

/**
 * Beim „Übernehmen“: Neu angekreuzte Zustände starten zur Spielzeit `now`, aktive behalten
 * `startedAt` und `lastTickAt`. Nach der (geänderten) Dauer schon abgelaufene Zustände fallen weg.
 */
export function startConditions(conditions: ActiveCondition[], now: Date): ActiveCondition[] {
  const iso: string = now.toISOString();
  return conditions
    .map((condition) =>
      condition.startedAt ? condition : { ...condition, startedAt: iso, lastTickAt: iso },
    )
    .filter((condition) => !isConditionExpired(condition, now));
}

/** Ganze Zahl ≥ 0 und höchstens `max`; `null` (leeres Feld) ist ungültig. */
export function isWholeNumber(value: number | null, max: number = Infinity): value is number {
  return value !== null && Number.isInteger(value) && value >= 0 && value <= max;
}

export function minutesOf(totalSeconds: number): number {
  return Math.floor(totalSeconds / 60);
}

export function secondsOf(totalSeconds: number): number {
  return totalSeconds % 60;
}

/** Ersetzt den Minutenanteil, die Sekunden bleiben. */
export function withMinutes(totalSeconds: number, minutes: number): number {
  return minutes * 60 + secondsOf(totalSeconds);
}

/** Ersetzt den Sekundenanteil (0–59), die Minuten bleiben. */
export function withSeconds(totalSeconds: number, seconds: number): number {
  return minutesOf(totalSeconds) * 60 + seconds;
}
