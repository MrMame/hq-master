import { DungeonLayout } from '../models/dungeon-layout.model';
import { ElementCatalog } from '../models/element-catalog.model';
import { PlanPoint } from '../models/grid.model';
import { LayoutCommands, PlanGesture } from '../models/plan-gesture.model';
import { placeElement } from '../utils/element-placement.util';

/** Id des Vorschau-Elements; das echte Element bekommt beim Loslassen eine neue Id. */
const PREVIEW_ID: string = 'place-preview';

/** Element aus der Bibliothek über den Plan ziehen: Vorschau, wo es beim Loslassen landet. */
export class PlaceGesture implements PlanGesture {
  constructor(
    private readonly catalogId: string,
    private readonly point: PlanPoint,
  ) {}

  move(point: PlanPoint): PlaceGesture {
    return new PlaceGesture(this.catalogId, point);
  }

  draft(layout: DungeonLayout, catalog: ElementCatalog | null): DungeonLayout {
    return placeElement(layout, catalog, { id: PREVIEW_ID, catalogId: this.catalogId }, this.point);
  }

  commit(commands: LayoutCommands): void {
    commands.placeElement(this.catalogId, this.point);
  }
}
