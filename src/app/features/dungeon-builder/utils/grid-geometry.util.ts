import { GridPoint, PlanPoint, TileCell } from '../models/grid.model';

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/** Schlüssel einer Kachel in der `FloorMap`. */
export function cellKey(cell: TileCell): string {
  return `${cell.col},${cell.row}`;
}

/** Kachel unter einem Punkt des Plans. */
export function cellAt(point: PlanPoint): TileCell {
  return { col: Math.floor(point.x), row: Math.floor(point.y) };
}

export function isInside(cell: TileCell, columns: number, rows: number): boolean {
  return cell.col >= 0 && cell.row >= 0 && cell.col < columns && cell.row < rows;
}

/** Nächster Gitterpunkt innerhalb des Plans. */
export function nearestGridPoint(point: PlanPoint, columns: number, rows: number): GridPoint {
  return {
    x: clamp(Math.round(point.x), 0, columns),
    y: clamp(Math.round(point.y), 0, rows),
  };
}

/** Alle Kacheln des Rechtecks zwischen zwei Ecken, in beide Ziehrichtungen. */
export function cellsInRectangle(from: TileCell, to: TileCell): TileCell[] {
  const cells: TileCell[] = [];
  for (let row: number = Math.min(from.row, to.row); row <= Math.max(from.row, to.row); row++) {
    for (let col: number = Math.min(from.col, to.col); col <= Math.max(from.col, to.col); col++) {
      cells.push({ col, row });
    }
  }
  return cells;
}

/** Kacheln zwischen zwei Kacheln (beide eingeschlossen), damit ein schneller Strich keine Lücken lässt. */
export function cellsOnLine(from: TileCell, to: TileCell): TileCell[] {
  const steps: number = Math.max(Math.abs(to.col - from.col), Math.abs(to.row - from.row));
  const cells: TileCell[] = [];
  for (let step: number = 0; step <= steps; step++) {
    const t: number = steps === 0 ? 0 : step / steps;
    cells.push({
      col: Math.round(from.col + (to.col - from.col) * t),
      row: Math.round(from.row + (to.row - from.row) * t),
    });
  }
  return cells;
}

/** Verschiebung, die das Intervall `[min, max]` in `[0, limit]` bringt (0, wenn es schon passt). */
export function shiftInto(min: number, max: number, limit: number): number {
  if (min < 0) return -min;
  if (max > limit) return limit - max;
  return 0;
}
