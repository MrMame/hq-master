import { inject, Injectable, Signal } from '@angular/core';
import { FloorRectangleGesture } from '../gestures/floor-rectangle.gesture';
import { FloorStrokeGesture } from '../gestures/floor-stroke.gesture';
import { MoveGesture } from '../gestures/move.gesture';
import { WallGesture } from '../gestures/wall.gesture';
import { BuilderTool } from '../models/builder-tool.model';
import { ElementCatalog } from '../models/element-catalog.model';
import { ElementSelection } from '../models/element-selection.model';
import { PlanPoint } from '../models/grid.model';
import { PlanGesture } from '../models/plan-gesture.model';
import { cellAt } from '../utils/grid-geometry.util';
import { hitTest } from '../utils/hit-test.util';
import { BuilderUiService } from './builder-ui.service';
import { DungeonLayoutService } from './dungeon-layout.service';
import { ElementCatalogService } from './element-catalog.service';

/**
 * Verteilt Zeiger-Ereignisse des Plans je nach Werkzeug: Tipp-Werkzeuge (Füllen, Stempel) schreiben
 * sofort, Zieh-Werkzeuge starten eine Geste mit Vorschau, die beim Loslassen einmal schreibt.
 */
@Injectable()
export class PlanPointerService {
  private readonly ui: BuilderUiService = inject(BuilderUiService);
  private readonly layoutService: DungeonLayoutService = inject(DungeonLayoutService);
  private readonly catalog: Signal<ElementCatalog | null> = inject(ElementCatalogService).catalog;

  /** Läuft eine Geste, die mit einem Druck auf den Plan begonnen hat? */
  private pointerDown: boolean = false;

  /** Zeiger gedrückt; `true`, wenn der Plan die Geste übernimmt (kein Verschieben des Ausschnitts). */
  down(point: PlanPoint): boolean {
    const tool: BuilderTool = this.ui.tool();
    switch (tool.kind) {
      case 'select':
        return this.startSelect(point);
      case 'stamp':
        this.layoutService.placeElement(tool.catalogId, point);
        return true;
      case 'fill':
        this.layoutService.fillFloor(cellAt(point), this.ui.floorId());
        return true;
      case 'brush':
        return this.start(FloorStrokeGesture.start(point, this.ui.floorId()));
      case 'eraser':
        return this.start(FloorStrokeGesture.start(point, null));
      case 'rectangle':
        return this.start(FloorRectangleGesture.start(point, this.ui.floorId()));
      case 'wall':
        return this.start(WallGesture.start(point, this.layoutService.layout()));
    }
  }

  move(point: PlanPoint): void {
    const gesture: PlanGesture | null = this.ownGesture();
    if (gesture) this.ui.setGesture(gesture.move(point));
  }

  /** Loslassen: Die Geste schreibt einmal (ein Rückgängig-Schritt). */
  up(point: PlanPoint): void {
    const gesture: PlanGesture | null = this.ownGesture();
    if (!gesture) return;
    this.cancel();
    gesture.move(point).commit(this.layoutService);
  }

  /** Abgebrochene Geste (z. B. Systemgeste am Tablet): Vorschau verwerfen, nichts schreiben. */
  cancel(): void {
    if (!this.pointerDown) return;
    this.pointerDown = false;
    this.ui.setGesture(null);
  }

  /**
   * Nur selbst gestartete Gesten: Die Vorschau beim Ziehen aus der Bibliothek liegt ebenfalls im
   * UI-Zustand, wird aber von der Seite abgeschlossen. Sonst würde sie hier doppelt gesetzt.
   */
  private ownGesture(): PlanGesture | null {
    return this.pointerDown ? this.ui.gesture() : null;
  }

  private start(gesture: PlanGesture): boolean {
    this.pointerDown = true;
    this.ui.setGesture(gesture);
    return true;
  }

  /** Markiert das oberste Element und beginnt das Verschieben; auf freier Fläche verschiebt `BoardPan` den Ausschnitt. */
  private startSelect(point: PlanPoint): boolean {
    const hit: ElementSelection | null = hitTest(
      this.layoutService.layout(),
      this.catalog(),
      point,
    );
    this.ui.select(hit);
    return hit ? this.start(new MoveGesture(hit, point)) : false;
  }
}
