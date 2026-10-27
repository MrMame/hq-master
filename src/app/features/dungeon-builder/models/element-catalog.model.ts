import { TileCell } from './grid.model';

/** Optik der Karte; gilt auf dem Plan und im JPEG gleich. `wallThickness` in Kacheln. */
export interface CatalogAppearance {
  rockColor: string;
  wallColor: string;
  wallThickness: number;
}

/** Bodenart, die per Pinsel, Rechteck oder Füllen auf Kacheln kommt. */
export interface CatalogFloor {
  id: string;
  name: string;
  image: string;
}

/** Tür; liegt auf genau einer Gitterkante. */
export interface CatalogDoor {
  id: string;
  name: string;
  image: string;
}

/** Form eines Elements: umgebendes Rechteck und die davon belegten Kacheln. */
export interface PieceShape {
  width: number;
  height: number;
  cells: TileCell[];
}

/** Möbel, Treppe oder Hindernis; belegt ganze Kacheln in beliebig zusammenhängender Form. */
export interface CatalogPiece extends PieceShape {
  id: string;
  name: string;
  image: string;
}

/** Gruppe der Bibliothek, z. B. „Grundmöbel“. */
export interface PieceCategory {
  name: string;
  pieces: CatalogPiece[];
}

export interface ElementCatalog {
  appearance: CatalogAppearance;
  floors: CatalogFloor[];
  doors: CatalogDoor[];
  categories: PieceCategory[];
}

/** Gilt, wenn der Katalog keine `<appearance>` angibt. */
export const DEFAULT_APPEARANCE: CatalogAppearance = {
  rockColor: '#1c1915',
  wallColor: '#9a8f80',
  wallThickness: 0.2,
};
