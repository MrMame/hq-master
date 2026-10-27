import { DungeonLayout, PlacedPiece } from '../models/dungeon-layout.model';
import { ElementCatalog } from '../models/element-catalog.model';
import { ElementSelection } from '../models/element-selection.model';
import { PlanPoint, TileCell } from '../models/grid.model';
import { pieceShapeOf } from './catalog-lookup.util';
import { doorEdge } from './door-geometry.util';
import { cellAt } from './grid-geometry.util';
import { occupiedCells } from './piece-edit.util';
import { distanceToSegment } from './wall-geometry.util';

/** Trefferabstand zu Wänden und Türen in Kacheln; breiter als die Linie, damit der Finger trifft. */
const LINE_HIT_DISTANCE: number = 0.25;

/**
 * Oberstes Element unter dem Punkt, in der Reihenfolge der Ebenen von oben nach unten:
 * Türen, Wände, Möbel. Innerhalb einer Ebene gewinnt das zuletzt gesetzte Element.
 */
export function hitTest(
  layout: DungeonLayout,
  catalog: ElementCatalog | null,
  point: PlanPoint,
): ElementSelection | null {
  const door: { id: string } | undefined = [...layout.doors]
    .reverse()
    .find((d) => distanceToSegment(point, doorEdge(d)) <= LINE_HIT_DISTANCE);
  if (door) return { kind: 'door', id: door.id };

  const wall: { id: string } | undefined = [...layout.walls]
    .reverse()
    .find((w) => distanceToSegment(point, w) <= LINE_HIT_DISTANCE);
  if (wall) return { kind: 'wall', id: wall.id };

  const cell: TileCell = cellAt(point);
  const piece: PlacedPiece | undefined = [...layout.pieces]
    .reverse()
    .find((p) =>
      occupiedCells(p, pieceShapeOf(catalog, p.catalogId)).some(
        (c) => c.col === cell.col && c.row === cell.row,
      ),
    );
  return piece ? { kind: 'piece', id: piece.id } : null;
}
