import { ActiveCondition } from '../../core/models/character-condition.model';

const MS_PER_SECOND: number = 1000;

/** Ende eines Zustands in ms; `null` bei unbegrenzter Dauer (0). */
export function conditionEnd(condition: ActiveCondition): number | null {
  return condition.durationSeconds > 0
    ? Date.parse(condition.startedAt) + condition.durationSeconds * MS_PER_SECOND
    : null;
}

/** Abgelaufen, sobald die Spielzeit das Ende erreicht. */
export function isConditionExpired(condition: ActiveCondition, now: Date): boolean {
  const end: number | null = conditionEnd(condition);
  return end !== null && now.getTime() >= end;
}

/** Restdauer in ganzen Sekunden (aufgerundet, nie negativ); `null` bei unbegrenzter Dauer. */
export function remainingSeconds(condition: ActiveCondition, now: Date): number | null {
  const end: number | null = conditionEnd(condition);
  return end === null ? null : Math.max(0, Math.ceil((end - now.getTime()) / MS_PER_SECOND));
}

/** Nächster Wirkmoment mit Schaden; `null`, wenn der Zustand keinen Schaden macht oder vorher endet. */
export function nextTickAt(condition: ActiveCondition): Date | null {
  if (condition.intervalSeconds <= 0 || condition.damagePerTick <= 0) return null;
  const next: number = Date.parse(condition.lastTickAt) + condition.intervalSeconds * MS_PER_SECOND;
  const end: number | null = conditionEnd(condition);
  return end !== null && next > end ? null : new Date(next);
}

/** Dauer als `m:ss`, z. B. 450 → „7:30“. */
export function formatDuration(seconds: number): string {
  const minutes: number = Math.floor(seconds / 60);
  return `${minutes}:${(seconds % 60).toString().padStart(2, '0')}`;
}

/** Restdauer zur Anzeige: `m:ss` oder „unbegrenzt“. */
export function formatRemaining(condition: ActiveCondition, now: Date): string {
  const remaining: number | null = remainingSeconds(condition, now);
  return remaining === null ? 'unbegrenzt' : formatDuration(remaining);
}

/** Uhrzeit der Spielzeit als `HH:MM:SS`. */
export function formatClock(time: Date): string {
  return [time.getHours(), time.getMinutes(), time.getSeconds()]
    .map((part) => part.toString().padStart(2, '0'))
    .join(':');
}
