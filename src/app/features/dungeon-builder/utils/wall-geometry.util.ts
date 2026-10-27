import { PlacedWall } from '../models/dungeon-layout.model';
import { GridPoint, PlanPoint } from '../models/grid.model';
import { nearestGridPoint, shiftInto } from './grid-geometry.util';

/** Strecke zwischen zwei Gitterpunkten (Wandzug, Wandstück oder Türkante). */
export interface Segment {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface GridDelta {
  dx: number;
  dy: number;
}

export function segmentLength(segment: Segment): number {
  return Math.abs(segment.x2 - segment.x1) + Math.abs(segment.y2 - segment.y1);
}

/** Endpunkt beim Wandziehen: nächster Gitterpunkt, nur waagerecht oder senkrecht zum Start. */
export function constrainedWallEnd(
  from: GridPoint,
  point: PlanPoint,
  columns: number,
  rows: number,
): GridPoint {
  const end: GridPoint = nearestGridPoint(point, columns, rows);
  return Math.abs(end.x - from.x) >= Math.abs(end.y - from.y)
    ? { x: end.x, y: from.y }
    : { x: from.x, y: end.y };
}

/** Schiebt eine Strecke ganz in den Plan; passt sie nicht hinein, `null`. */
export function fitSegment<T extends Segment>(segment: T, columns: number, rows: number): T | null {
  const fitted: T = shiftSegment(segment, columns, rows);
  const inside: boolean =
    Math.max(fitted.x1, fitted.x2) <= columns && Math.max(fitted.y1, fitted.y2) <= rows;
  return inside && Math.min(fitted.x1, fitted.x2) >= 0 && Math.min(fitted.y1, fitted.y2) >= 0
    ? fitted
    : null;
}

/**
 * Schiebt eine Strecke so weit wie nötig in den Plan. Für Strecken, die schon einmal hineingepasst
 * haben (Verschieben, Türen), reicht das immer.
 */
export function shiftSegment<T extends Segment>(segment: T, columns: number, rows: number): T {
  const dx: number = shiftInto(
    Math.min(segment.x1, segment.x2),
    Math.max(segment.x1, segment.x2),
    columns,
  );
  const dy: number = shiftInto(
    Math.min(segment.y1, segment.y2),
    Math.max(segment.y1, segment.y2),
    rows,
  );
  return {
    ...segment,
    x1: segment.x1 + dx,
    x2: segment.x2 + dx,
    y1: segment.y1 + dy,
    y2: segment.y2 + dy,
  };
}

/**
 * Dreht um 90° im Uhrzeigersinn. Drehpunkt ist der Gitterpunkt in der Mitte, bei ungerader Länge
 * der Gitterpunkt davor; so bleiben beide Enden auf dem Gitter. Passt die Wand gedreht nicht in
 * den Plan, bleibt sie unverändert.
 */
export function rotateWall(wall: PlacedWall, columns: number, rows: number): PlacedWall {
  const half: number = Math.floor(segmentLength(wall) / 2);
  const pivot: GridPoint = {
    x: wall.x1 + Math.sign(wall.x2 - wall.x1) * half,
    y: wall.y1 + Math.sign(wall.y2 - wall.y1) * half,
  };
  const turn: (x: number, y: number) => GridPoint = (x: number, y: number): GridPoint => ({
    x: pivot.x - (y - pivot.y),
    y: pivot.y + (x - pivot.x),
  });
  const start: GridPoint = turn(wall.x1, wall.y1);
  const end: GridPoint = turn(wall.x2, wall.y2);
  const turned: PlacedWall = { ...wall, x1: start.x, y1: start.y, x2: end.x, y2: end.y };
  return fitSegment(turned, columns, rows) ?? wall;
}

export function translateWall(
  wall: PlacedWall,
  delta: GridDelta,
  columns: number,
  rows: number,
): PlacedWall {
  const moved: PlacedWall = {
    ...wall,
    x1: wall.x1 + delta.dx,
    x2: wall.x2 + delta.dx,
    y1: wall.y1 + delta.dy,
    y2: wall.y2 + delta.dy,
  };
  return shiftSegment(moved, columns, rows);
}

/** Kürzester Abstand eines Punkts zu einer Strecke, in Kacheln. */
export function distanceToSegment(point: PlanPoint, segment: Segment): number {
  const lengthX: number = segment.x2 - segment.x1;
  const lengthY: number = segment.y2 - segment.y1;
  const lengthSquared: number = lengthX * lengthX + lengthY * lengthY;
  const t: number =
    lengthSquared === 0
      ? 0
      : Math.min(
          1,
          Math.max(
            0,
            ((point.x - segment.x1) * lengthX + (point.y - segment.y1) * lengthY) / lengthSquared,
          ),
        );
  return Math.hypot(point.x - (segment.x1 + t * lengthX), point.y - (segment.y1 + t * lengthY));
}
