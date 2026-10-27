import { DungeonLayout } from '../models/dungeon-layout.model';
import { ElementCatalog } from '../models/element-catalog.model';
import { PlanPoint } from '../models/grid.model';
import { findDoor, findPiece } from './catalog-lookup.util';
import { nearestDoorPosition } from './door-geometry.util';
import { cellAt } from './grid-geometry.util';
import { addDoor, addPiece } from './layout-edit.util';
import { centeredPiece } from './piece-edit.util';

/**
 * Setzt ein Element aus dem Katalog: Möbel mittig auf die Kachel unter dem Punkt, Türen auf die
 * nächste Gitterkante. Unbekannte Einträge ändern nichts.
 */
export function placeElement(
  layout: DungeonLayout,
  catalog: ElementCatalog | null,
  ids: { id: string; catalogId: string },
  point: PlanPoint,
): DungeonLayout {
  if (findDoor(catalog, ids.catalogId)) {
    return addDoor(layout, { ...ids, ...nearestDoorPosition(point, layout.columns, layout.rows) });
  }
  const piece: ReturnType<typeof findPiece> = findPiece(catalog, ids.catalogId);
  return piece ? addPiece(layout, centeredPiece(ids, piece, cellAt(point), layout)) : layout;
}

/** Elemente und Böden, deren Katalogeintrag fehlt (z. B. gelöscht oder umbenannt). */
export function unknownElementCount(layout: DungeonLayout, catalog: ElementCatalog | null): number {
  if (!catalog) return 0;
  return (
    Object.values(layout.floor).filter((id) => !catalog.floors.some((f) => f.id === id)).length +
    layout.pieces.filter((p) => !findPiece(catalog, p.catalogId)).length +
    layout.doors.filter((d) => !findDoor(catalog, d.catalogId)).length
  );
}

/** Ein leeres Layout lässt sich ohne Rückfrage ersetzen. */
export function isEmptyLayout(layout: DungeonLayout): boolean {
  return (
    Object.keys(layout.floor).length === 0 &&
    layout.pieces.length === 0 &&
    layout.walls.length === 0 &&
    layout.doors.length === 0
  );
}
