import { DungeonLayout } from '../models/dungeon-layout.model';
import { PlanPoint, TileCell } from '../models/grid.model';
import { LayoutCommands, PlanGesture } from '../models/plan-gesture.model';
import { paintFloor } from '../utils/floor-edit.util';
import { cellAt, cellsInRectangle } from '../utils/grid-geometry.util';

/** Rechteck aufziehen: alle Kacheln zwischen Start- und aktueller Kachel bekommen die Bodenart. */
export class FloorRectangleGesture implements PlanGesture {
  private constructor(
    private readonly from: TileCell,
    private readonly to: TileCell,
    private readonly floorId: string | null,
  ) {}

  static start(point: PlanPoint, floorId: string | null): FloorRectangleGesture {
    return new FloorRectangleGesture(cellAt(point), cellAt(point), floorId);
  }

  move(point: PlanPoint): FloorRectangleGesture {
    return new FloorRectangleGesture(this.from, cellAt(point), this.floorId);
  }

  draft(layout: DungeonLayout): DungeonLayout {
    return paintFloor(layout, cellsInRectangle(this.from, this.to), this.floorId);
  }

  commit(commands: LayoutCommands): void {
    commands.paintFloor(cellsInRectangle(this.from, this.to), this.floorId);
  }
}
