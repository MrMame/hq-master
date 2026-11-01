import { conditionTemplate } from '../../../core/models/condition-templates.model';
import { DamageTypes } from '../../../core/models/damage-types.model';
import { GameLogEntry, GameLogEntryType } from '../../../core/models/game-log-entry.model';
import { formatClock } from '../../../shared/utils/condition-time.util';
import { GameLogFilter, GameLogRow } from '../models/game-log-row.model';

const CLOCK_ICON: string = './img/clock.svg';

/** Welche Eintragsarten ein Filter zeigt; Zustands-Schaden zählt zu „Zustände“ und zu „Schaden“. */
const FILTER_TYPES: Record<Exclude<GameLogFilter, 'all'>, readonly GameLogEntryType[]> = {
  time: ['time'],
  conditions: ['condition-damage', 'condition-expired', 'condition-set', 'condition-removed'],
  damage: ['damage', 'condition-damage'],
};

/**
 * Gefilterte Zeilen, neueste Spielzeit oben; bei gleicher Spielzeit steht der später angehängte Eintrag
 * oben. Zwischen zwei Einträgen verschiedener Tage steht eine Trennzeile mit dem Datum der älteren.
 */
export function gameLogRows(entries: GameLogEntry[], filter: GameLogFilter): GameLogRow[] {
  const sorted: { entry: GameLogEntry; time: Date }[] = entries
    .map((entry, index) => ({ entry, index, time: new Date(entry.gameTime) }))
    .filter(({ entry }) => filter === 'all' || FILTER_TYPES[filter].includes(entry.type))
    .sort((a, b) => b.time.getTime() - a.time.getTime() || b.index - a.index);

  const rows: GameLogRow[] = [];
  sorted.forEach(({ entry, time }, position) => {
    const previous: Date | undefined = sorted[position - 1]?.time;
    if (previous && formatDate(previous) !== formatDate(time)) {
      rows.push({ kind: 'date', key: `date-${entry.id}`, date: formatDate(time) });
    }
    rows.push({
      kind: 'entry',
      key: entry.id,
      type: entry.type,
      time: formatClock(time),
      icon: entryIcon(entry),
      text: entry.text,
    });
  });
  return rows;
}

/** Datum der Spielzeit wie im Zeit-Label: `YYYY-MM-DD`. */
export function formatDate(time: Date): string {
  const month: string = (time.getMonth() + 1).toString().padStart(2, '0');
  const day: string = time.getDate().toString().padStart(2, '0');
  return `${time.getFullYear()}-${month}-${day}`;
}

/** Zustandssymbol, sonst Uhr (Zeit) bzw. Treffer auf Rüstung/Leben (manueller Schaden). */
export function entryIcon(entry: GameLogEntry): string {
  if (entry.conditionId) return conditionTemplate(entry.conditionId).icon;
  if (entry.type === 'damage') {
    return entry.damageType === DamageTypes.Normal
      ? './img/hit-normal.svg'
      : './img/hit-critical.svg';
  }
  return CLOCK_ICON;
}
