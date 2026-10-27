import { DungeonLayout, FloorMap, PlacedPiece } from '../models/dungeon-layout.model';
import { ElementCatalog } from '../models/element-catalog.model';
import { pieceShapeOf } from './catalog-lookup.util';
import { doorEdge } from './door-geometry.util';
import { isInside } from './grid-geometry.util';
import { occupiedCells } from './piece-edit.util';
import { Segment } from './wall-geometry.util';

interface PlanSize {
  columns: number;
  rows: number;
}

function segmentInside(segment: Segment, { columns, rows }: PlanSize): boolean {
  return Math.max(segment.x1, segment.x2) <= columns && Math.max(segment.y1, segment.y2) <= rows;
}

function pieceInside(piece: PlacedPiece, size: PlanSize, catalog: ElementCatalog | null): boolean {
  return occupiedCells(piece, pieceShapeOf(catalog, piece.catalogId)).every((cell) =>
    isInside(cell, size.columns, size.rows),
  );
}

/** Anzahl der Elemente, die bei der neuen Größe ganz oder teilweise außerhalb lägen. */
export function elementsOutside(
  layout: DungeonLayout,
  size: PlanSize,
  catalog: ElementCatalog | null,
): number {
  return (
    layout.pieces.filter((piece) => !pieceInside(piece, size, catalog)).length +
    layout.walls.filter((wall) => !segmentInside(wall, size)).length +
    layout.doors.filter((door) => !segmentInside(doorEdge(door), size)).length
  );
}

/**
 * Ändert die Größe vom linken oberen Eck aus. Neue Fläche ist Fels; Elemente und Boden außerhalb
 * entfallen.
 */
export function resizeLayout(
  layout: DungeonLayout,
  size: PlanSize,
  catalog: ElementCatalog | null,
): DungeonLayout {
  const floor: FloorMap = Object.fromEntries(
    Object.entries(layout.floor).filter(([key]) => {
      const [col, row]: number[] = key.split(',').map(Number);
      return isInside({ col, row }, size.columns, size.rows);
    }),
  );
  return {
    ...layout,
    columns: size.columns,
    rows: size.rows,
    floor,
    pieces: layout.pieces.filter((piece) => pieceInside(piece, size, catalog)),
    walls: layout.walls.filter((wall) => segmentInside(wall, size)),
    doors: layout.doors.filter((door) => segmentInside(doorEdge(door), size)),
  };
}
