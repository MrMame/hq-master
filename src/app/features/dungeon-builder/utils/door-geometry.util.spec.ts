import { PlacedDoor } from '../models/dungeon-layout.model';
import {
  doorEdge,
  edgeKey,
  nearestDoorPosition,
  rotateDoor,
  translateDoor,
  wallSegments,
} from './door-geometry.util';

function door(x: number, y: number, rotation: PlacedDoor['rotation'] = 0): PlacedDoor {
  return { id: 'd1', catalogId: 'door', x, y, rotation };
}

describe('door-geometry.util', () => {
  it('lies on the edge starting at its point in the direction of its rotation', () => {
    expect(doorEdge(door(2, 3, 0))).toEqual({ x1: 2, y1: 3, x2: 3, y2: 3 });
    expect(doorEdge(door(2, 3, 90))).toEqual({ x1: 2, y1: 3, x2: 2, y2: 4 });
    expect(doorEdge(door(2, 3, 180))).toEqual({ x1: 2, y1: 3, x2: 1, y2: 3 });
    expect(doorEdge(door(2, 3, 270))).toEqual({ x1: 2, y1: 3, x2: 2, y2: 2 });
  });

  it('gives the same key for the same edge in both directions', () => {
    expect(edgeKey(doorEdge(door(2, 3, 0)))).toBe(edgeKey(doorEdge(door(3, 3, 180))));
    expect(edgeKey(doorEdge(door(2, 3, 90)))).not.toBe(edgeKey(doorEdge(door(2, 3, 0))));
  });

  it('snaps to the nearest horizontal or vertical edge', () => {
    expect(nearestDoorPosition({ x: 3.5, y: 2.1 }, 10, 8)).toEqual({ x: 3, y: 2, rotation: 0 });
    expect(nearestDoorPosition({ x: 4.9, y: 1.5 }, 10, 8)).toEqual({ x: 5, y: 1, rotation: 90 });
    expect(nearestDoorPosition({ x: 12.5, y: 0.1 }, 10, 8)).toEqual({ x: 9, y: 0, rotation: 0 });
  });

  it('turns around its start point and stays in the plan', () => {
    expect(rotateDoor(door(2, 3, 0), 10, 8)).toEqual(door(2, 3, 90));
    expect(rotateDoor(door(0, 3, 90), 10, 8)).toEqual(door(1, 3, 180));
  });

  it('moves by grid points and stops at the border', () => {
    expect(translateDoor(door(2, 3), { dx: 1, dy: -1 }, 10, 8)).toEqual(door(3, 2));
    expect(translateDoor(door(2, 3), { dx: 20, dy: 0 }, 10, 8)).toEqual(door(9, 3));
  });

  describe('wallSegments', () => {
    const wall: { id: string; x1: number; y1: number; x2: number; y2: number } = {
      id: 'w1',
      x1: 1,
      y1: 2,
      x2: 6,
      y2: 2,
    };

    it('keeps the whole wall without doors', () => {
      expect(wallSegments(wall, [])).toEqual([{ x1: 1, y1: 2, x2: 6, y2: 2 }]);
    });

    it('leaves a gap where a door lies on the wall', () => {
      expect(wallSegments(wall, [door(3, 2), door(6, 2, 180)])).toEqual([
        { x1: 1, y1: 2, x2: 3, y2: 2 },
        { x1: 4, y1: 2, x2: 5, y2: 2 },
      ]);
    });

    it('ignores doors on other edges', () => {
      expect(wallSegments(wall, [door(3, 2, 90)])).toHaveLength(1);
    });
  });
});
