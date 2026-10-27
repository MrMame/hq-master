import { DungeonLayout } from '../models/dungeon-layout.model';
import { ElementCatalog } from '../models/element-catalog.model';
import { ElementSelection } from '../models/element-selection.model';
import { PlanPoint } from '../models/grid.model';
import { LayoutCommands, PlanGesture } from '../models/plan-gesture.model';
import { moveElement } from '../utils/layout-edit.util';
import { GridDelta } from '../utils/wall-geometry.util';

/** Element ziehen: Verschiebung in ganzen Kacheln bzw. Gitterpunkten ab dem Druckpunkt. */
export class MoveGesture implements PlanGesture {
  constructor(
    private readonly ref: ElementSelection,
    private readonly start: PlanPoint,
    private readonly delta: GridDelta = { dx: 0, dy: 0 },
  ) {}

  move(point: PlanPoint): MoveGesture {
    const delta: GridDelta = {
      dx: Math.round(point.x - this.start.x),
      dy: Math.round(point.y - this.start.y),
    };
    return new MoveGesture(this.ref, this.start, delta);
  }

  draft(layout: DungeonLayout, catalog: ElementCatalog | null): DungeonLayout {
    return moveElement(layout, this.ref, this.delta, catalog);
  }

  /** Ein Tipp ohne Bewegung verschiebt nichts und ist kein Rückgängig-Schritt. */
  commit(commands: LayoutCommands): void {
    if (this.delta.dx !== 0 || this.delta.dy !== 0) commands.moveElement(this.ref, this.delta);
  }
}
