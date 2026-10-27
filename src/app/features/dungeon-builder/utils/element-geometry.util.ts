import { DungeonLayout, PlacedDoor, PlacedPiece } from '../models/dungeon-layout.model';
import { ElementCatalog, PieceShape } from '../models/element-catalog.model';
import { ElementSelection } from '../models/element-selection.model';
import { Bounds, ImagePlacement } from '../models/render-step.model';
import { pieceShapeOf } from './catalog-lookup.util';
import { doorEdge } from './door-geometry.util';
import { rotateShape } from './piece-shape.util';
import { Segment } from './wall-geometry.util';

/** Tiefe einer Tür quer zur Gitterlinie, in Kacheln (Grafik `viewBox="0 0 64 16"`). */
export const DOOR_DEPTH: number = 0.25;

/** Rand um Linien-Elemente für Markierungsrahmen, in Kacheln. */
const LINE_PADDING: number = 0.15;

/** Möbel: Grafik ungedreht um die Mitte des gedrehten Rechtecks gedreht. */
export function pieceImagePlacement(
  piece: PlacedPiece,
  shape: PieceShape,
  tile: number,
): ImagePlacement {
  const rotated: PieceShape = rotateShape(shape, piece.rotation);
  return {
    translateX: (piece.col + rotated.width / 2) * tile,
    translateY: (piece.row + rotated.height / 2) * tile,
    rotation: piece.rotation,
    x: (-shape.width * tile) / 2,
    y: (-shape.height * tile) / 2,
    width: shape.width * tile,
    height: shape.height * tile,
  };
}

/** Tür: Grafik liegt mittig auf der Kante und dreht um deren Startpunkt. */
export function doorImagePlacement(door: PlacedDoor, tile: number): ImagePlacement {
  return {
    translateX: door.x * tile,
    translateY: door.y * tile,
    rotation: door.rotation,
    x: 0,
    y: (-DOOR_DEPTH * tile) / 2,
    width: tile,
    height: DOOR_DEPTH * tile,
  };
}

function segmentBounds(segment: Segment): Bounds {
  const x: number = Math.min(segment.x1, segment.x2) - LINE_PADDING;
  const y: number = Math.min(segment.y1, segment.y2) - LINE_PADDING;
  return {
    x,
    y,
    width: Math.abs(segment.x2 - segment.x1) + 2 * LINE_PADDING,
    height: Math.abs(segment.y2 - segment.y1) + 2 * LINE_PADDING,
  };
}

/** Umgebendes Rechteck eines Elements, z. B. für Markierungsrahmen und Menüleiste. */
export function elementBounds(
  layout: DungeonLayout,
  ref: ElementSelection,
  catalog: ElementCatalog | null,
): Bounds | null {
  if (ref.kind === 'piece') {
    const piece: PlacedPiece | undefined = layout.pieces.find((p) => p.id === ref.id);
    if (!piece) return null;
    const { width, height }: PieceShape = rotateShape(
      pieceShapeOf(catalog, piece.catalogId),
      piece.rotation,
    );
    return { x: piece.col, y: piece.row, width, height };
  }
  const segment: Segment | undefined =
    ref.kind === 'wall'
      ? layout.walls.find((w) => w.id === ref.id)
      : layout.doors.filter((d) => d.id === ref.id).map(doorEdge)[0];
  return segment ? segmentBounds(segment) : null;
}
