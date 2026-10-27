import { DungeonLayout } from './dungeon-layout.model';
import { ElementCatalog } from './element-catalog.model';
import { ElementSelection } from './element-selection.model';
import { GridPoint, PlanPoint, TileCell } from './grid.model';

/** Schreibwege, die eine Geste beim Loslassen nutzt (erfüllt vom `DungeonLayoutService`). */
export interface LayoutCommands {
  paintFloor(cells: TileCell[], floorId: string | null): void;
  addWall(from: GridPoint, to: GridPoint): void;
  placeElement(catalogId: string, point: PlanPoint): void;
  moveElement(ref: ElementSelection, delta: { dx: number; dy: number }): void;
}

/**
 * Eine laufende Zeiger-Geste auf dem Plan (Pinselstrich, Rechteck, Wand, Verschieben, Platzieren).
 * Unveränderlich: `move` liefert eine neue Geste, damit Signale die Vorschau neu berechnen.
 */
export interface PlanGesture {
  move(point: PlanPoint): PlanGesture;
  /** Vorschau: das Layout, wie es nach dem Loslassen aussähe. */
  draft(layout: DungeonLayout, catalog: ElementCatalog | null): DungeonLayout;
  /** Loslassen: schreibt die Änderung einmal, also ein Speichervorgang und ein Rückgängig-Schritt. */
  commit(commands: LayoutCommands): void;
}
