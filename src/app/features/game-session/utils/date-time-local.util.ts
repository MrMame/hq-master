import { GameTime } from '../../../core/models/game-time.model';

const DATE_TIME_LOCAL_PATTERN: RegExp = /^(\d{4,})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?$/;

/** Wandelt den Wert eines `<input type="datetime-local">` in eine `GameTime` um. */
export function parseDateTimeLocal(value: string): GameTime | null {
  const match: RegExpMatchArray | null = DATE_TIME_LOCAL_PATTERN.exec(value);
  if (!match) return null;
  const [year, month, day, hours, minutes, seconds] = match
    .slice(1)
    .map((part: string | undefined) => Number(part ?? 0));
  return { year, month, day, hours, minutes, seconds };
}
