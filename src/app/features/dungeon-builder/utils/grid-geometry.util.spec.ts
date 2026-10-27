import { TileCell } from '../models/grid.model';
import {
  cellAt,
  cellKey,
  cellsInRectangle,
  cellsOnLine,
  clamp,
  isInside,
  nearestGridPoint,
  shiftInto,
} from './grid-geometry.util';

describe('grid-geometry.util', () => {
  it('clamps a value into a range', () => {
    expect(clamp(-2, 0, 5)).toBe(0);
    expect(clamp(3, 0, 5)).toBe(3);
    expect(clamp(9, 0, 5)).toBe(5);
  });

  it('builds the floor key and finds the cell under a point', () => {
    expect(cellKey({ col: 3, row: 7 })).toBe('3,7');
    expect(cellAt({ x: 2.99, y: 0.01 })).toEqual({ col: 2, row: 0 });
  });

  it('knows whether a cell lies inside the plan', () => {
    expect(isInside({ col: 0, row: 0 }, 4, 3)).toBe(true);
    expect(isInside({ col: 3, row: 2 }, 4, 3)).toBe(true);
    expect(isInside({ col: 4, row: 0 }, 4, 3)).toBe(false);
    expect(isInside({ col: 0, row: -1 }, 4, 3)).toBe(false);
  });

  it('snaps to the nearest grid point inside the plan', () => {
    expect(nearestGridPoint({ x: 1.4, y: 2.6 }, 10, 10)).toEqual({ x: 1, y: 3 });
    expect(nearestGridPoint({ x: -3, y: 12 }, 10, 10)).toEqual({ x: 0, y: 10 });
  });

  it('lists the cells of a rectangle in both drag directions', () => {
    const expected: TileCell[] = [
      { col: 1, row: 1 },
      { col: 2, row: 1 },
      { col: 1, row: 2 },
      { col: 2, row: 2 },
    ];
    expect(cellsInRectangle({ col: 1, row: 1 }, { col: 2, row: 2 })).toEqual(expected);
    expect(cellsInRectangle({ col: 2, row: 2 }, { col: 1, row: 1 })).toEqual(expected);
  });

  it('lists the cells on a line without gaps', () => {
    expect(cellsOnLine({ col: 0, row: 0 }, { col: 3, row: 1 })).toEqual([
      { col: 0, row: 0 },
      { col: 1, row: 0 },
      { col: 2, row: 1 },
      { col: 3, row: 1 },
    ]);
    expect(cellsOnLine({ col: 2, row: 2 }, { col: 2, row: 2 })).toEqual([{ col: 2, row: 2 }]);
  });

  it('computes the shift that brings an interval into the plan', () => {
    expect(shiftInto(-2, 1, 10)).toBe(2);
    expect(shiftInto(8, 12, 10)).toBe(-2);
    expect(shiftInto(2, 5, 10)).toBe(0);
  });
});
