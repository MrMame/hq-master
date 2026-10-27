import { PlacedPiece } from '../models/dungeon-layout.model';
import { PieceShape } from '../models/element-catalog.model';
import { TileCell } from '../models/grid.model';
import { clamp } from './grid-geometry.util';
import { nextRotation, rotateShape } from './piece-shape.util';

/** Belegte Kacheln eines platzierten Möbels auf dem Plan. */
export function occupiedCells(piece: PlacedPiece, shape: PieceShape): TileCell[] {
  return rotateShape(shape, piece.rotation).cells.map(({ col, row }) => ({
    col: piece.col + col,
    row: piece.row + row,
  }));
}

/** Schiebt das Möbel ganz in den Plan. */
export function clampPiece(
  piece: PlacedPiece,
  shape: PieceShape,
  columns: number,
  rows: number,
): PlacedPiece {
  const { width, height }: PieceShape = rotateShape(shape, piece.rotation);
  return {
    ...piece,
    col: clamp(piece.col, 0, Math.max(columns - width, 0)),
    row: clamp(piece.row, 0, Math.max(rows - height, 0)),
  };
}

/** Neues Möbel mit seiner Mitte auf `center`, ganz im Plan. */
export function centeredPiece(
  ids: { id: string; catalogId: string },
  shape: PieceShape,
  center: TileCell,
  size: { columns: number; rows: number },
): PlacedPiece {
  const piece: PlacedPiece = {
    ...ids,
    col: center.col - Math.floor((shape.width - 1) / 2),
    row: center.row - Math.floor((shape.height - 1) / 2),
    rotation: 0,
  };
  return clampPiece(piece, shape, size.columns, size.rows);
}

/**
 * Dreht um die Mitte des umgebenden Rechtecks, gerundet auf ganze Kacheln. `Math.trunc` rundet
 * symmetrisch, so heben sich zwei Drehungen auf und viermal Drehen ergibt die Ausgangslage.
 */
export function rotatePiece(
  piece: PlacedPiece,
  shape: PieceShape,
  columns: number,
  rows: number,
): PlacedPiece {
  const { width, height }: PieceShape = rotateShape(shape, piece.rotation);
  const turned: PlacedPiece = {
    ...piece,
    col: piece.col + Math.trunc((width - height) / 2),
    row: piece.row + Math.trunc((height - width) / 2),
    rotation: nextRotation(piece.rotation),
  };
  return clampPiece(turned, shape, columns, rows);
}

export function translatePiece(
  piece: PlacedPiece,
  shape: PieceShape,
  delta: { dx: number; dy: number },
  size: { columns: number; rows: number },
): PlacedPiece {
  const moved: PlacedPiece = { ...piece, col: piece.col + delta.dx, row: piece.row + delta.dy };
  return clampPiece(moved, shape, size.columns, size.rows);
}
