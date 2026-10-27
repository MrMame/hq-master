import { PlacedWall } from '../models/dungeon-layout.model';
import {
  constrainedWallEnd,
  distanceToSegment,
  fitSegment,
  rotateWall,
  segmentLength,
  translateWall,
} from './wall-geometry.util';

function wall(x1: number, y1: number, x2: number, y2: number): PlacedWall {
  return { id: 'w1', x1, y1, x2, y2 };
}

describe('wall-geometry.util', () => {
  it('measures the length in grid steps', () => {
    expect(segmentLength(wall(2, 3, 6, 3))).toBe(4);
    expect(segmentLength(wall(2, 5, 2, 3))).toBe(2);
  });

  it('keeps a drawn wall horizontal or vertical, following the main direction', () => {
    expect(constrainedWallEnd({ x: 2, y: 2 }, { x: 5.2, y: 2.9 }, 10, 8)).toEqual({ x: 5, y: 2 });
    expect(constrainedWallEnd({ x: 2, y: 2 }, { x: 2.6, y: 6.1 }, 10, 8)).toEqual({ x: 2, y: 6 });
  });

  it('shifts a segment into the plan or rejects it when it is too long', () => {
    expect(fitSegment(wall(-1, 2, 3, 2), 10, 8)).toEqual(wall(0, 2, 4, 2));
    expect(fitSegment(wall(8, 9, 8, 7), 10, 8)).toEqual(wall(8, 8, 8, 6));
    expect(fitSegment(wall(0, 0, 0, 9), 10, 8)).toBeNull();
  });

  it('turns an even wall around its middle grid point', () => {
    expect(rotateWall(wall(2, 4, 6, 4), 10, 8)).toEqual(wall(4, 2, 4, 6));
  });

  it('turns an odd wall around the grid point before the middle and is back after four turns', () => {
    let turned: PlacedWall = rotateWall(wall(3, 4, 6, 4), 10, 8);
    expect(turned).toEqual(wall(4, 3, 4, 6));
    for (let i: number = 0; i < 3; i++) turned = rotateWall(turned, 10, 8);
    expect(turned).toEqual(wall(3, 4, 6, 4));
  });

  it('keeps a wall that does not fit the plan when turned', () => {
    const long: PlacedWall = wall(0, 4, 10, 4);
    expect(rotateWall(long, 10, 8)).toBe(long);
  });

  it('moves a wall by grid points and stops at the border', () => {
    expect(translateWall(wall(1, 1, 3, 1), { dx: 2, dy: 1 }, 10, 8)).toEqual(wall(3, 2, 5, 2));
    expect(translateWall(wall(1, 1, 3, 1), { dx: 20, dy: 0 }, 10, 8)).toEqual(wall(8, 1, 10, 1));
  });

  it('measures the distance of a point to a segment', () => {
    expect(distanceToSegment({ x: 3, y: 2.2 }, wall(2, 2, 6, 2))).toBeCloseTo(0.2);
    expect(distanceToSegment({ x: 0, y: 2 }, wall(2, 2, 6, 2))).toBeCloseTo(2);
    expect(distanceToSegment({ x: 1, y: 1 }, wall(1, 2, 1, 2))).toBeCloseTo(1);
  });
});
