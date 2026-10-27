import { DungeonLayout } from '../models/dungeon-layout.model';
import { TileCell } from '../models/grid.model';
import { cellKey, isInside } from './grid-geometry.util';

/**
 * Setzt die Bodenart der Kacheln; `null` macht sie wieder zu Fels. Kacheln außerhalb des Plans
 * entfallen. Ändert sich nichts, kommt dasselbe Layout zurück (kein Rückgängig-Schritt).
 */
export function paintFloor(
  layout: DungeonLayout,
  cells: TileCell[],
  floorId: string | null,
): DungeonLayout {
  const floor: Record<string, string> = { ...layout.floor };
  let changed: boolean = false;
  for (const cell of cells) {
    if (!isInside(cell, layout.columns, layout.rows)) continue;
    const key: string = cellKey(cell);
    if ((floor[key] ?? null) === floorId) continue;
    if (floorId === null) delete floor[key];
    else floor[key] = floorId;
    changed = true;
  }
  return changed ? { ...layout, floor } : layout;
}

/** Zusammenhängende Fläche gleicher Art ab `start` (4er-Nachbarschaft), für „Füllen“. */
export function fillArea(layout: DungeonLayout, start: TileCell): TileCell[] {
  if (!isInside(start, layout.columns, layout.rows)) return [];
  const value: string | undefined = layout.floor[cellKey(start)];
  const seen: Set<string> = new Set<string>([cellKey(start)]);
  const area: TileCell[] = [];
  const queue: TileCell[] = [start];
  while (queue.length > 0) {
    const cell: TileCell = queue.shift() as TileCell;
    area.push(cell);
    for (const next of neighbours(cell)) {
      const key: string = cellKey(next);
      if (seen.has(key) || !isInside(next, layout.columns, layout.rows)) continue;
      seen.add(key);
      if (layout.floor[key] === value) queue.push(next);
    }
  }
  return area;
}

function neighbours({ col, row }: TileCell): TileCell[] {
  return [
    { col: col + 1, row },
    { col: col - 1, row },
    { col, row: row + 1 },
    { col, row: row - 1 },
  ];
}
