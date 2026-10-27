import { PieceShape } from '../models/element-catalog.model';
import { isConnected, nextRotation, rectangleCells, rotateShape } from './piece-shape.util';

const L_SHAPE: PieceShape = {
  width: 2,
  height: 2,
  cells: [
    { col: 0, row: 0 },
    { col: 0, row: 1 },
    { col: 1, row: 1 },
  ],
};

describe('piece-shape.util', () => {
  it('lists all cells of a rectangle row by row', () => {
    expect(rectangleCells(2, 2)).toEqual([
      { col: 0, row: 0 },
      { col: 1, row: 0 },
      { col: 0, row: 1 },
      { col: 1, row: 1 },
    ]);
  });

  it('accepts shapes connected over edges only', () => {
    expect(isConnected(L_SHAPE.cells)).toBe(true);
    expect(isConnected(rectangleCells(3, 2))).toBe(true);
    expect(
      isConnected([
        { col: 0, row: 0 },
        { col: 1, row: 1 },
      ]),
    ).toBe(false);
    expect(isConnected([])).toBe(false);
  });

  it('swaps width and height when turning a rectangle', () => {
    const turned: PieceShape = rotateShape(
      { width: 3, height: 2, cells: rectangleCells(3, 2) },
      90,
    );
    expect([turned.width, turned.height]).toEqual([2, 3]);
    expect(turned.cells).toHaveLength(6);
  });

  it('turns a free shape clockwise around its rectangle', () => {
    expect(rotateShape(L_SHAPE, 90).cells).toEqual([
      { col: 1, row: 0 },
      { col: 0, row: 0 },
      { col: 0, row: 1 },
    ]);
  });

  it('returns to the start after four turns', () => {
    expect(rotateShape(L_SHAPE, 0)).toBe(L_SHAPE);
    const fourTimes: PieceShape = rotateShape(rotateShape(L_SHAPE, 180), 180);
    expect(fourTimes.cells).toEqual(L_SHAPE.cells);
  });

  it('cycles the rotation clockwise', () => {
    expect(nextRotation(0)).toBe(90);
    expect(nextRotation(270)).toBe(0);
  });
});
