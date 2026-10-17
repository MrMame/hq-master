import { DungeonPosition } from '../models/dungeon-position.model';

/** Breite des Startbereichs, in dem neue Tokens zeilenweise abgelegt werden. */
export const TOKEN_PLACEMENT_COLUMNS: number = 5;

const cellKey: (col: number, row: number) => string = (col: number, row: number): string =>
  `${col},${row}`;

/**
 * Vergibt für neue Charaktere je das erste freie Feld (zeilenweise, `columns` breit).
 * Belegt sind die Felder aus `occupied` sowie die im selben Lauf bereits vergebenen.
 */
export function placeNewTokens(
  occupied: DungeonPosition[],
  newCharacterIds: string[],
  columns: number = TOKEN_PLACEMENT_COLUMNS,
): DungeonPosition[] {
  const taken: Set<string> = new Set<string>(occupied.map((p) => cellKey(p.col, p.row)));
  let cell: number = 0;

  return newCharacterIds.map((characterId) => {
    while (taken.has(cellKey(cell % columns, Math.floor(cell / columns)))) cell++;
    const position: DungeonPosition = {
      characterId,
      col: cell % columns,
      row: Math.floor(cell / columns),
    };
    taken.add(cellKey(position.col, position.row));
    return position;
  });
}
