import { PlacedDoor, PlacedWall } from '../models/dungeon-layout.model';
import { GridPoint, PlanPoint } from '../models/grid.model';
import { Rotation } from '../models/rotation.model';
import { clamp } from './grid-geometry.util';
import { nextRotation } from './piece-shape.util';
import { GridDelta, Segment, segmentLength, shiftSegment } from './wall-geometry.util';

/** Richtung der Türkante ab ihrem Startpunkt je Drehung. */
const DIRECTIONS: Record<Rotation, GridPoint> = {
  0: { x: 1, y: 0 },
  90: { x: 0, y: 1 },
  180: { x: -1, y: 0 },
  270: { x: 0, y: -1 },
};

export function doorEdge(door: Pick<PlacedDoor, 'x' | 'y' | 'rotation'>): Segment {
  const direction: GridPoint = DIRECTIONS[door.rotation];
  return { x1: door.x, y1: door.y, x2: door.x + direction.x, y2: door.y + direction.y };
}

/** Gleicher Schlüssel für dieselbe Gitterkante, egal in welcher Richtung sie beschrieben ist. */
export function edgeKey(edge: Segment): string {
  const orientation: string = edge.x1 === edge.x2 ? 'v' : 'h';
  return `${Math.min(edge.x1, edge.x2)},${Math.min(edge.y1, edge.y2)},${orientation}`;
}

/** Nächste Gitterkante zu einem Punkt: waagerecht (Drehung 0) oder senkrecht (Drehung 90). */
export function nearestDoorPosition(
  point: PlanPoint,
  columns: number,
  rows: number,
): Pick<PlacedDoor, 'x' | 'y' | 'rotation'> {
  const toRowLine: number = Math.abs(point.y - Math.round(point.y));
  const toColumnLine: number = Math.abs(point.x - Math.round(point.x));
  return toRowLine <= toColumnLine
    ? {
        x: clamp(Math.floor(point.x), 0, columns - 1),
        y: clamp(Math.round(point.y), 0, rows),
        rotation: 0,
      }
    : {
        x: clamp(Math.round(point.x), 0, columns),
        y: clamp(Math.floor(point.y), 0, rows - 1),
        rotation: 90,
      };
}

/** Schiebt die Türkante in den Plan (eine Kante passt immer); der Startpunkt folgt der Kante. */
function fitDoor(door: PlacedDoor, columns: number, rows: number): PlacedDoor {
  const fitted: Segment = shiftSegment(doorEdge(door), columns, rows);
  return { ...door, x: fitted.x1, y: fitted.y1 };
}

/** Dreht um den Startpunkt (Mitte einer Kante der Länge 1, gerundet auf den Punkt davor). */
export function rotateDoor(door: PlacedDoor, columns: number, rows: number): PlacedDoor {
  return fitDoor({ ...door, rotation: nextRotation(door.rotation) }, columns, rows);
}

export function translateDoor(
  door: PlacedDoor,
  delta: GridDelta,
  columns: number,
  rows: number,
): PlacedDoor {
  return fitDoor({ ...door, x: door.x + delta.dx, y: door.y + delta.dy }, columns, rows);
}

/** Teilstücke eines Wandzugs ohne die Kanten, auf denen eine Tür liegt (Tür ersetzt Wandstück). */
export function wallSegments(wall: PlacedWall, doors: PlacedDoor[]): Segment[] {
  const doorEdges: Set<string> = new Set<string>(doors.map((door) => edgeKey(doorEdge(door))));
  const stepX: number = Math.sign(wall.x2 - wall.x1);
  const stepY: number = Math.sign(wall.y2 - wall.y1);
  const segments: Segment[] = [];
  let run: Segment | null = null;
  for (let i: number = 0; i < segmentLength(wall); i++) {
    const edge: Segment = {
      x1: wall.x1 + stepX * i,
      y1: wall.y1 + stepY * i,
      x2: wall.x1 + stepX * (i + 1),
      y2: wall.y1 + stepY * (i + 1),
    };
    if (doorEdges.has(edgeKey(edge))) {
      run = null;
    } else if (run) {
      run.x2 = edge.x2;
      run.y2 = edge.y2;
    } else {
      run = edge;
      segments.push(run);
    }
  }
  return segments;
}
