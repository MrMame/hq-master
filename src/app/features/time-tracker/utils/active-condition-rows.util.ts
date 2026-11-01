import { CharacterInfo } from '../../../core/models/character-info.model';
import { conditionTemplate } from '../../../core/models/condition-templates.model';
import {
  formatClock,
  formatRemaining,
  nextTickAt,
  remainingSeconds,
} from '../../../shared/utils/condition-time.util';
import { ActiveConditionRow } from '../models/active-condition-row.model';

interface SortableRow {
  row: ActiveConditionRow;
  /** ms des nächsten Wirkmoments; `null` ohne Wirkmoment. */
  next: number | null;
  /** Restdauer in s; unbegrenzt zählt als unendlich. */
  remaining: number;
}

/**
 * Eine Zeile je aktivem Zustand aller Charaktere, sortiert nach dem nächsten Wirkmoment.
 * Zustände ohne Wirkmoment folgen danach, sortiert nach der Restdauer (unbegrenzt zuletzt).
 */
export function activeConditionRows(characters: CharacterInfo[], now: Date): ActiveConditionRow[] {
  return characters
    .flatMap((character) => character.conditions.map((condition) => ({ character, condition })))
    .map(({ character, condition }): SortableRow => {
      const { label, icon } = conditionTemplate(condition.id);
      const next: Date | null = nextTickAt(condition);
      return {
        row: {
          characterId: character.id,
          characterName: character.name,
          conditionId: condition.id,
          label,
          icon,
          damagePerTick: condition.damagePerTick,
          nextTick: next ? formatClock(next) : '–',
          remaining: formatRemaining(condition, now),
        },
        next: next?.getTime() ?? null,
        remaining: remainingSeconds(condition, now) ?? Infinity,
      };
    })
    .sort(compareRows)
    .map(({ row }) => row);
}

function compareRows(a: SortableRow, b: SortableRow): number {
  if (a.next !== null && b.next !== null) return a.next - b.next;
  if (a.next !== null) return -1;
  if (b.next !== null) return 1;
  return a.remaining === b.remaining ? 0 : a.remaining < b.remaining ? -1 : 1;
}
