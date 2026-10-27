import { DungeonLayout, PlacedDoor, PlacedPiece, PlacedWall } from '../models/dungeon-layout.model';
import { ElementCatalog } from '../models/element-catalog.model';
import { ElementSelection } from '../models/element-selection.model';
import { pieceShapeOf } from './catalog-lookup.util';
import { doorEdge, edgeKey, rotateDoor, translateDoor } from './door-geometry.util';
import { rotatePiece, translatePiece } from './piece-edit.util';
import { GridDelta, rotateWall, translateWall } from './wall-geometry.util';

/** Änderung je Elementart für `transformElement`. */
interface ElementTransform {
  piece: (piece: PlacedPiece) => PlacedPiece;
  wall: (wall: PlacedWall) => PlacedWall;
  door: (door: PlacedDoor) => PlacedDoor;
}

export function addPiece(layout: DungeonLayout, piece: PlacedPiece): DungeonLayout {
  return { ...layout, pieces: [...layout.pieces, piece] };
}

export function addWall(layout: DungeonLayout, wall: PlacedWall): DungeonLayout {
  return { ...layout, walls: [...layout.walls, wall] };
}

/** Auf einer Kante liegt höchstens eine Tür: Eine neue Tür ersetzt die alte. */
export function addDoor(layout: DungeonLayout, door: PlacedDoor): DungeonLayout {
  const key: string = edgeKey(doorEdge(door));
  const others: PlacedDoor[] = layout.doors.filter(
    (d) => d.id !== door.id && edgeKey(doorEdge(d)) !== key,
  );
  return { ...layout, doors: [...others, door] };
}

export function hasElement(layout: DungeonLayout, ref: ElementSelection): boolean {
  const list: { id: string }[] =
    ref.kind === 'piece' ? layout.pieces : ref.kind === 'wall' ? layout.walls : layout.doors;
  return list.some((element) => element.id === ref.id);
}

export function removeElement(layout: DungeonLayout, ref: ElementSelection): DungeonLayout {
  if (!hasElement(layout, ref)) return layout;
  const keep: (element: { id: string }) => boolean = (element: { id: string }): boolean =>
    element.id !== ref.id;
  if (ref.kind === 'piece') return { ...layout, pieces: layout.pieces.filter(keep) };
  if (ref.kind === 'wall') return { ...layout, walls: layout.walls.filter(keep) };
  return { ...layout, doors: layout.doors.filter(keep) };
}

/** Verschiebt in Kacheln bzw. Gitterpunkten; das Element bleibt im Plan und liegt danach oben. */
export function moveElement(
  layout: DungeonLayout,
  ref: ElementSelection,
  delta: GridDelta,
  catalog: ElementCatalog | null,
): DungeonLayout {
  if (delta.dx === 0 && delta.dy === 0) return layout;
  return transformElement(layout, ref, {
    piece: (p) => translatePiece(p, pieceShapeOf(catalog, p.catalogId), delta, layout),
    wall: (w) => translateWall(w, delta, layout.columns, layout.rows),
    door: (d) => translateDoor(d, delta, layout.columns, layout.rows),
  });
}

/** Dreht um 90° im Uhrzeigersinn; das Element liegt danach oben. */
export function rotateElement(
  layout: DungeonLayout,
  ref: ElementSelection,
  catalog: ElementCatalog | null,
): DungeonLayout {
  return transformElement(layout, ref, {
    piece: (p) => rotatePiece(p, pieceShapeOf(catalog, p.catalogId), layout.columns, layout.rows),
    wall: (w) => rotateWall(w, layout.columns, layout.rows),
    door: (d) => rotateDoor(d, layout.columns, layout.rows),
  });
}

/** Ändert ein Element und setzt es ans Ende seiner Ebene (zuletzt bearbeitet liegt oben). */
function transformElement(
  layout: DungeonLayout,
  ref: ElementSelection,
  transform: ElementTransform,
): DungeonLayout {
  const isOther: (element: { id: string }) => boolean = (element: { id: string }): boolean =>
    element.id !== ref.id;
  if (ref.kind === 'piece') {
    const piece: PlacedPiece | undefined = layout.pieces.find((p) => p.id === ref.id);
    if (!piece) return layout;
    return { ...layout, pieces: [...layout.pieces.filter(isOther), transform.piece(piece)] };
  }
  if (ref.kind === 'wall') {
    const wall: PlacedWall | undefined = layout.walls.find((w) => w.id === ref.id);
    if (!wall) return layout;
    return { ...layout, walls: [...layout.walls.filter(isOther), transform.wall(wall)] };
  }
  const door: PlacedDoor | undefined = layout.doors.find((d) => d.id === ref.id);
  if (!door) return layout;
  return addDoor({ ...layout, doors: layout.doors.filter(isOther) }, transform.door(door));
}
