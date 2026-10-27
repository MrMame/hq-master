/** Einheiten je Kachel auf dem Plan und in den Katalog-Grafiken (`viewBox` der SVGs). */
export const TILE_UNITS: number = 64;

/** Eine Kachel des Plans, 0-basiert von links oben. */
export interface TileCell {
  col: number;
  row: number;
}

/** Ein Gitterpunkt (Schnittpunkt der Rasterlinien), `0 … columns` bzw. `0 … rows`. */
export interface GridPoint {
  x: number;
  y: number;
}

/** Ein Punkt auf dem Plan in Kacheln, mit Nachkommastellen (z. B. Zeigerposition). */
export interface PlanPoint {
  x: number;
  y: number;
}
