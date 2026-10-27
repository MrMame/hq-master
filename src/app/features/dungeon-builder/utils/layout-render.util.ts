import { DungeonLayout } from '../models/dungeon-layout.model';
import {
  CatalogAppearance,
  DEFAULT_APPEARANCE,
  ElementCatalog,
} from '../models/element-catalog.model';
import { RenderStep } from '../models/render-step.model';
import { doorSteps, floorSteps, pieceSteps, wallSteps } from './element-steps.util';

/** Pixel je Kachel im JPEG und Obergrenze der längsten Bildseite (Base64 im localStorage des Trackers). */
const EXPORT_TILE_PX: number = 64;
const EXPORT_MAX_PX: number = 2048;

/** Bildgröße des JPEG-Exports: 64 px je Kachel, höchstens 2048 px an der längsten Seite. */
export function exportSize(
  columns: number,
  rows: number,
): { tile: number; width: number; height: number } {
  const tile: number = Math.min(
    EXPORT_TILE_PX,
    Math.floor(EXPORT_MAX_PX / Math.max(columns, rows)),
  );
  return { tile, width: columns * tile, height: rows * tile };
}

/**
 * Zeichenschritte in der Reihenfolge der Ebenen: Fels, Boden, Möbel, Wände (mit Lücken für Türen),
 * Türen. Plan und JPEG zeichnen dieselben Schritte; das Raster gehört nicht dazu.
 */
export function renderSteps(
  layout: DungeonLayout,
  catalog: ElementCatalog | null,
  tile: number,
): RenderStep[] {
  const appearance: CatalogAppearance = catalog?.appearance ?? DEFAULT_APPEARANCE;
  const rock: RenderStep = {
    kind: 'rect',
    key: 'rock',
    color: appearance.rockColor,
    x: 0,
    y: 0,
    width: layout.columns * tile,
    height: layout.rows * tile,
  };
  return [
    rock,
    ...floorSteps(layout, catalog, tile),
    ...pieceSteps(layout, catalog, tile),
    ...wallSteps(layout, appearance, tile),
    ...doorSteps(layout, catalog, tile),
  ];
}
