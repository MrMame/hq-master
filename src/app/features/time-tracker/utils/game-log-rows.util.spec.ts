import { entryIcon, formatDate, gameLogRows } from './game-log-rows.util';
import { DamageTypes } from '../../../core/models/damage-types.model';
import { GameLogEntry } from '../../../core/models/game-log-entry.model';
import { createTestLogEntry } from '../../../core/testing/game-log.fixtures';
import { GameLogFilter, GameLogRow } from '../models/game-log-row.model';

const at: (day: number, hours: number, minutes?: number) => string = (
  day: number,
  hours: number,
  minutes: number = 0,
): string => new Date(2381, 0, day, hours, minutes).toISOString();

const entry: (id: string, overrides: Partial<GameLogEntry>) => GameLogEntry = (id, overrides) =>
  createTestLogEntry({ id, text: id, ...overrides });

/** Kompakte Sicht: Trennzeilen als „— Datum“, Einträge als „Zeit Text“. */
const view: (rows: GameLogRow[]) => string[] = (rows) =>
  rows.map((row) => (row.kind === 'date' ? `— ${row.date}` : `${row.time} ${row.text}`));

describe('game-log-rows.util', () => {
  const log: GameLogEntry[] = [
    entry('gesetzt', { type: 'condition-set', conditionId: 'poison', gameTime: at(1, 23, 50) }),
    entry('+1 h', { type: 'time', gameTime: at(2, 0, 50) }),
    entry('runde', { type: 'round', gameTime: at(1, 23, 50) }),
    entry('gift 1', { type: 'condition-damage', conditionId: 'poison', gameTime: at(1, 23, 51) }),
    entry('gift 2', { type: 'condition-damage', conditionId: 'poison', gameTime: at(2, 0, 0) }),
    entry('ablauf', { type: 'condition-expired', conditionId: 'poison', gameTime: at(2, 0, 0) }),
    entry('treffer', { type: 'damage', damageType: DamageTypes.Normal, gameTime: at(2, 0, 50) }),
  ];

  it('sorts by game time descending, later appended first, with a date row at day changes', () => {
    expect(view(gameLogRows(log, 'all'))).toEqual([
      '00:50:00 treffer',
      '00:50:00 +1 h',
      '00:00:00 ablauf',
      '00:00:00 gift 2',
      '— 2381-01-01',
      '23:51:00 gift 1',
      '23:50:00 runde',
      '23:50:00 gesetzt',
    ]);
  });

  it.each<[GameLogFilter, string[]]>([
    ['time', ['+1 h', 'runde']],
    ['conditions', ['ablauf', 'gift 2', 'gift 1', 'gesetzt']],
    ['damage', ['treffer', 'gift 2', 'gift 1']],
  ])('shows only matching entries for filter "%s"', (filter, texts) => {
    const rows: GameLogRow[] = gameLogRows(log, filter).filter((row) => row.kind === 'entry');
    expect(rows.map((row) => (row.kind === 'entry' ? row.text : ''))).toEqual(texts);
  });

  it('shows equipment entries only under "all"', () => {
    const equipment: GameLogEntry[] = [entry('erhält', { type: 'equipment-assigned' })];
    expect(gameLogRows(equipment, 'all')).toHaveLength(1);
    (['time', 'conditions', 'damage'] as GameLogFilter[]).forEach((filter) =>
      expect(gameLogRows(equipment, filter)).toEqual([]),
    );
  });

  it('returns no rows for an empty log', () => {
    expect(gameLogRows([], 'all')).toEqual([]);
  });

  it('formats the date with leading zeros', () => {
    expect(formatDate(new Date(2381, 2, 4))).toBe('2381-03-04');
  });

  it.each<[Partial<GameLogEntry>, string]>([
    [{ type: 'condition-damage', conditionId: 'blind' }, './img/conditions/blind.svg'],
    [{ type: 'damage', damageType: DamageTypes.Normal }, './img/hit-normal.svg'],
    [{ type: 'damage', damageType: DamageTypes.Critical }, './img/hit-critical.svg'],
    [{ type: 'time' }, './img/clock.svg'],
    [{ type: 'round' }, './img/clock.svg'],
    [{ type: 'equipment-assigned' }, './img/equipment.svg'],
    [{ type: 'equipment-removed' }, './img/equipment.svg'],
  ])('picks the icon for %o', (overrides, icon) => {
    expect(entryIcon(createTestLogEntry(overrides))).toBe(icon);
  });
});
