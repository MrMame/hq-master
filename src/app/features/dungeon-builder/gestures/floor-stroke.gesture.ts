import { DungeonLayout } from '../models/dungeon-layout.model';
import { PlanPoint, TileCell } from '../models/grid.model';
import { LayoutCommands, PlanGesture } from '../models/plan-gesture.model';
import { paintFloor } from '../utils/floor-edit.util';
import { cellAt, cellKey, cellsOnLine } from '../utils/grid-geometry.util';

/** Pinsel bzw. Radierer (`floorId = null`): jede berührte Kachel bekommt die Bodenart. */
export class FloorStrokeGesture implements PlanGesture {
  private constructor(
    readonly cells: readonly TileCell[],
    private readonly floorId: string | null,
  ) {}

  static start(point: PlanPoint, floorId: string | null): FloorStrokeGesture {
    return new FloorStrokeGesture([cellAt(point)], floorId);
  }

  /** Ergänzt die Kacheln bis zum Zeiger, auch bei schnellen Bewegungen ohne Lücken. */
  move(point: PlanPoint): FloorStrokeGesture {
    const last: TileCell = this.cells[this.cells.length - 1];
    const known: Set<string> = new Set<string>(this.cells.map(cellKey));
    const added: TileCell[] = cellsOnLine(last, cellAt(point)).filter(
      (cell) => !known.has(cellKey(cell)),
    );
    return added.length === 0
      ? this
      : new FloorStrokeGesture([...this.cells, ...added], this.floorId);
  }

  draft(layout: DungeonLayout): DungeonLayout {
    return paintFloor(layout, [...this.cells], this.floorId);
  }

  commit(commands: LayoutCommands): void {
    commands.paintFloor([...this.cells], this.floorId);
  }
}
