import { DungeonLayout } from '../models/dungeon-layout.model';
import { GridPoint, PlanPoint } from '../models/grid.model';
import { LayoutCommands, PlanGesture } from '../models/plan-gesture.model';
import { nearestGridPoint } from '../utils/grid-geometry.util';
import { addWall } from '../utils/layout-edit.util';
import { constrainedWallEnd, segmentLength } from '../utils/wall-geometry.util';

/** Id der Vorschau-Wand; die echte Wand bekommt beim Loslassen eine neue Id. */
const PREVIEW_ID: string = 'wall-preview';

/** Wand ziehen: vom nächsten Gitterpunkt aus, nur waagerecht oder senkrecht. */
export class WallGesture implements PlanGesture {
  private constructor(
    private readonly from: GridPoint,
    private readonly to: GridPoint,
    private readonly size: { columns: number; rows: number },
  ) {}

  static start(point: PlanPoint, size: { columns: number; rows: number }): WallGesture {
    const from: GridPoint = nearestGridPoint(point, size.columns, size.rows);
    return new WallGesture(from, from, size);
  }

  move(point: PlanPoint): WallGesture {
    const to: GridPoint = constrainedWallEnd(this.from, point, this.size.columns, this.size.rows);
    return new WallGesture(this.from, to, this.size);
  }

  draft(layout: DungeonLayout): DungeonLayout {
    const wall: { x1: number; y1: number; x2: number; y2: number } = {
      x1: this.from.x,
      y1: this.from.y,
      x2: this.to.x,
      y2: this.to.y,
    };
    return segmentLength(wall) < 1 ? layout : addWall(layout, { id: PREVIEW_ID, ...wall });
  }

  /** Unter einer Kachel Länge legt der Service keine Wand an. */
  commit(commands: LayoutCommands): void {
    commands.addWall(this.from, this.to);
  }
}
