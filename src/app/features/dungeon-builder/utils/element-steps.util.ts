import { DungeonLayout } from '../models/dungeon-layout.model';
import { CatalogAppearance, CatalogPiece, ElementCatalog } from '../models/element-catalog.model';
import { Bounds, ImagePlacement, RenderStep } from '../models/render-step.model';
import { findDoor, findFloor, findPiece } from './catalog-lookup.util';
import { doorEdge, wallSegments } from './door-geometry.util';
import { DOOR_DEPTH, doorImagePlacement, pieceImagePlacement } from './element-geometry.util';
import { Segment } from './wall-geometry.util';

/** Je Bodenkachel ein Bild; Böden ohne Katalogeintrag als Platzhalter. */
export function floorSteps(
  layout: DungeonLayout,
  catalog: ElementCatalog | null,
  tile: number,
): RenderStep[] {
  return Object.entries(layout.floor).map(([key, floorId]) => {
    const [col, row]: number[] = key.split(',').map(Number);
    const area: Bounds = { x: col * tile, y: row * tile, width: tile, height: tile };
    const src: string | undefined = findFloor(catalog, floorId)?.image;
    if (!src) return { kind: 'unknown', key: `f:${key}`, ...area };
    const placement: ImagePlacement = { ...area, translateX: 0, translateY: 0, rotation: 0 };
    return { kind: 'image', key: `f:${key}:${floorId}`, src, placement };
  });
}

export function pieceSteps(
  layout: DungeonLayout,
  catalog: ElementCatalog | null,
  tile: number,
): RenderStep[] {
  return layout.pieces.map((piece) => {
    const known: CatalogPiece | undefined = findPiece(catalog, piece.catalogId);
    const key: string = `p:${piece.id}`;
    if (known) {
      const placement: ImagePlacement = pieceImagePlacement(piece, known, tile);
      return { kind: 'image', key, src: known.image, placement };
    }
    return {
      kind: 'unknown',
      key,
      x: piece.col * tile,
      y: piece.row * tile,
      width: tile,
      height: tile,
    };
  });
}

/** Wandzüge als Linien, an Türen unterbrochen. */
export function wallSteps(
  layout: DungeonLayout,
  appearance: CatalogAppearance,
  tile: number,
): RenderStep[] {
  return layout.walls.flatMap((wall) =>
    wallSegments(wall, layout.doors).map((segment, index) => ({
      kind: 'line' as const,
      key: `w:${wall.id}:${index}`,
      color: appearance.wallColor,
      width: appearance.wallThickness * tile,
      x1: segment.x1 * tile,
      y1: segment.y1 * tile,
      x2: segment.x2 * tile,
      y2: segment.y2 * tile,
    })),
  );
}

export function doorSteps(
  layout: DungeonLayout,
  catalog: ElementCatalog | null,
  tile: number,
): RenderStep[] {
  return layout.doors.map((door) => {
    const key: string = `d:${door.id}`;
    const src: string | undefined = findDoor(catalog, door.catalogId)?.image;
    if (src) return { kind: 'image', key, src, placement: doorImagePlacement(door, tile) };
    const edge: Segment = doorEdge(door);
    const vertical: boolean = edge.x1 === edge.x2;
    const depth: number = DOOR_DEPTH * tile;
    return {
      kind: 'unknown',
      key,
      x: Math.min(edge.x1, edge.x2) * tile - (vertical ? depth / 2 : 0),
      y: Math.min(edge.y1, edge.y2) * tile - (vertical ? 0 : depth / 2),
      width: vertical ? depth : tile,
      height: vertical ? tile : depth,
    };
  });
}
