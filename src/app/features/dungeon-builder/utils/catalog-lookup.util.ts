import {
  CatalogDoor,
  CatalogFloor,
  CatalogPiece,
  ElementCatalog,
  PieceShape,
} from '../models/element-catalog.model';

/** Form für Elemente, deren Katalogeintrag fehlt: eine Kachel (graue Fläche mit Fragezeichen). */
export const UNKNOWN_SHAPE: PieceShape = { width: 1, height: 1, cells: [{ col: 0, row: 0 }] };

export function findPiece(catalog: ElementCatalog | null, id: string): CatalogPiece | undefined {
  return catalog?.categories.flatMap((category) => category.pieces).find((p) => p.id === id);
}

export function findDoor(catalog: ElementCatalog | null, id: string): CatalogDoor | undefined {
  return catalog?.doors.find((door) => door.id === id);
}

export function findFloor(catalog: ElementCatalog | null, id: string): CatalogFloor | undefined {
  return catalog?.floors.find((floor) => floor.id === id);
}

/** Form eines Möbels laut Katalog; fehlt der Eintrag, eine Kachel. */
export function pieceShapeOf(catalog: ElementCatalog | null, catalogId: string): PieceShape {
  return findPiece(catalog, catalogId) ?? UNKNOWN_SHAPE;
}
