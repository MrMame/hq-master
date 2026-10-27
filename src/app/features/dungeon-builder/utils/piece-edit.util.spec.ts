import { PlacedPiece } from '../models/dungeon-layout.model';
import { PieceShape } from '../models/element-catalog.model';
import { TEST_CATALOG } from '../testing/builder.fixtures';
import { pieceShapeOf } from './catalog-lookup.util';
import {
  centeredPiece,
  clampPiece,
  occupiedCells,
  rotatePiece,
  translatePiece,
} from './piece-edit.util';

const TABLE: PieceShape = pieceShapeOf(TEST_CATALOG, 'table');
const SIZE: { columns: number; rows: number } = { columns: 10, rows: 8 };

function table(col: number, row: number, rotation: PlacedPiece['rotation'] = 0): PlacedPiece {
  return { id: 't1', catalogId: 'table', col, row, rotation };
}

describe('piece-edit.util', () => {
  it('lists the occupied cells of a placed and turned piece', () => {
    expect(occupiedCells(table(2, 1), TABLE)).toHaveLength(6);
    expect(occupiedCells(table(2, 1, 90), TABLE)).toContainEqual({ col: 3, row: 3 });
    expect(occupiedCells(table(2, 1, 90), TABLE)).not.toContainEqual({ col: 4, row: 1 });
  });

  it('centres a new piece on the tile and keeps it inside the plan', () => {
    const ids: { id: string; catalogId: string } = { id: 't1', catalogId: 'table' };
    expect(centeredPiece(ids, TABLE, { col: 5, row: 4 }, SIZE)).toEqual(table(4, 4));
    expect(centeredPiece(ids, TABLE, { col: 0, row: 0 }, SIZE)).toEqual(table(0, 0));
    expect(centeredPiece(ids, TABLE, { col: 9, row: 7 }, SIZE)).toEqual(table(7, 6));
  });

  it('clamps a piece into the plan with its turned size', () => {
    expect(clampPiece(table(9, 7, 90), TABLE, 10, 8)).toEqual(table(8, 5, 90));
  });

  it('turns a table 3 × 2 into 2 × 3 and back after four turns', () => {
    let piece: PlacedPiece = table(4, 3);
    piece = rotatePiece(piece, TABLE, 10, 8);
    expect(piece.rotation).toBe(90);
    expect(occupiedCells(piece, TABLE).every((c) => c.col <= 5 && c.row <= 5)).toBe(true);
    piece = rotatePiece(rotatePiece(rotatePiece(piece, TABLE, 10, 8), TABLE, 10, 8), TABLE, 10, 8);
    expect(piece).toEqual(table(4, 3));
  });

  it('keeps a long piece on its centre when turning', () => {
    const shelf: PieceShape = { width: 3, height: 1, cells: [] };
    const turned: PlacedPiece = rotatePiece(table(4, 4), shelf, 10, 8);
    expect([turned.col, turned.row]).toEqual([5, 3]);
  });

  it('moves a piece by whole tiles and stops at the border', () => {
    expect(translatePiece(table(1, 1), TABLE, { dx: 2, dy: 1 }, SIZE)).toEqual(table(3, 2));
    expect(translatePiece(table(1, 1), TABLE, { dx: -5, dy: 20 }, SIZE)).toEqual(table(0, 6));
  });
});
