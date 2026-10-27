import { PieceShape } from '../models/element-catalog.model';
import { TileCell } from '../models/grid.model';
import { Rotation } from '../models/rotation.model';
import { cellKey } from './grid-geometry.util';

export function rectangleCells(width: number, height: number): TileCell[] {
  const cells: TileCell[] = [];
  for (let row: number = 0; row < height; row++) {
    for (let col: number = 0; col < width; col++) cells.push({ col, row });
  }
  return cells;
}

/** Hängen alle Kacheln über Kanten zusammen (4er-Nachbarschaft)? */
export function isConnected(cells: TileCell[]): boolean {
  if (cells.length === 0) return false;
  const remaining: Set<string> = new Set<string>(cells.map(cellKey));
  const queue: TileCell[] = [cells[0]];
  remaining.delete(cellKey(cells[0]));
  while (queue.length > 0) {
    const { col, row }: TileCell = queue.shift() as TileCell;
    for (const next of [
      { col: col + 1, row },
      { col: col - 1, row },
      { col, row: row + 1 },
      { col, row: row - 1 },
    ]) {
      if (remaining.delete(cellKey(next))) queue.push(next);
    }
  }
  return remaining.size === 0;
}

/** Form nach einer Drehung: Rechteck und Kacheln bleiben bei `0,0` verankert. */
export function rotateShape(shape: PieceShape, rotation: Rotation): PieceShape {
  let rotated: PieceShape = shape;
  for (let turn: number = 0; turn < rotation / 90; turn++) {
    const { width, height, cells }: PieceShape = rotated;
    rotated = {
      width: height,
      height: width,
      cells: cells.map(({ col, row }) => ({ col: height - 1 - row, row: col })),
    };
  }
  return rotated;
}

/** Nächste Drehung im Uhrzeigersinn. */
export function nextRotation(rotation: Rotation): Rotation {
  return ((rotation + 90) % 360) as Rotation;
}
