import { Rotation } from './rotation.model';

/** Möbel, Treppe oder Hindernis; `col`/`row` ist die linke obere Kachel des gedrehten Rechtecks. */
export interface PlacedPiece {
  id: string;
  catalogId: string;
  col: number;
  row: number;
  rotation: Rotation;
}

/** Wandzug zwischen zwei Gitterpunkten, waagerecht oder senkrecht, Länge ≥ 1. */
export interface PlacedWall {
  id: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

/** Tür auf der Gitterkante ab `x, y`: nach rechts (0), unten (90), links (180) oder oben (270). */
export interface PlacedDoor {
  id: string;
  catalogId: string;
  x: number;
  y: number;
  rotation: Rotation;
}

/** Boden je Kachel, Schlüssel `"col,row"` → Boden-`id`; fehlende Kacheln sind Fels. */
export type FloorMap = Readonly<Record<string, string>>;

/** Ein Layout des Dungeon Builders. Die Reihenfolge der Listen ist die Zeichenreihenfolge. */
export interface DungeonLayout {
  name: string;
  columns: number;
  rows: number;
  floor: FloorMap;
  pieces: PlacedPiece[];
  walls: PlacedWall[];
  doors: PlacedDoor[];
}

/** Grenzen für Spalten und Zeilen eines Layouts. */
export const LAYOUT_SIZE_LIMITS: { min: number; max: number } = { min: 5, max: 40 };

/** Startwert: leerer Plan aus Fels. */
export const NEW_LAYOUT: DungeonLayout = {
  name: 'Neues Layout',
  columns: 26,
  rows: 19,
  floor: {},
  pieces: [],
  walls: [],
  doors: [],
};
