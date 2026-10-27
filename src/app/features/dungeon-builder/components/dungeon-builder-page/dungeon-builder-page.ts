import { Component, inject, Signal, signal, viewChild, WritableSignal } from '@angular/core';
import { CollapsibleSidebar } from '../../../../shared/components/collapsible-sidebar/collapsible-sidebar';
import { PlaceGesture } from '../../gestures/place.gesture';
import { ElementSelection } from '../../models/element-selection.model';
import { PlanPoint } from '../../models/grid.model';
import { LibraryDrag } from '../../models/library-entry.model';
import { BuilderUiService } from '../../services/builder-ui.service';
import { DungeonLayoutService } from '../../services/dungeon-layout.service';
import { BuilderShortcut, shortcutFor } from '../../utils/builder-shortcut.util';
import { BuilderFilePanel } from '../builder-file-panel/builder-file-panel';
import { BuilderToolStrip } from '../builder-tool-strip/builder-tool-strip';
import { ElementLibrary } from '../element-library/element-library';
import { LayoutPlan } from '../layout-plan/layout-plan';
import { LayoutSettings } from '../layout-settings/layout-settings';

/**
 * Dungeon Builder: Seitenleiste (Datei, Layout, Bibliothek), Werkzeugstreifen und Plan.
 * Stellt den UI-Zustand bereit und verarbeitet Tastenkürzel und das Ziehen aus der Bibliothek.
 */
@Component({
  selector: 'app-dungeon-builder-page',
  imports: [
    CollapsibleSidebar,
    BuilderFilePanel,
    LayoutSettings,
    ElementLibrary,
    BuilderToolStrip,
    LayoutPlan,
  ],
  providers: [BuilderUiService],
  host: { '(document:keydown)': 'onKeydown($event)' },
  templateUrl: './dungeon-builder-page.html',
  styleUrl: './dungeon-builder-page.css',
})
export class DungeonBuilderPage {
  private readonly ui: BuilderUiService = inject(BuilderUiService);
  private readonly layoutService: DungeonLayoutService = inject(DungeonLayoutService);
  private readonly plan: Signal<LayoutPlan> = viewChild.required(LayoutPlan);

  /** Zoomstufe des Plans; nicht gespeichert. */
  protected readonly zoom: WritableSignal<number> = signal<number>(1);

  protected onKeydown(event: KeyboardEvent): void {
    const shortcut: BuilderShortcut | null = shortcutFor(event);
    if (!shortcut) return;
    event.preventDefault();
    this.run(shortcut);
  }

  /** Vorschau auf dem Plan, solange der Zeiger darüber ist. */
  protected onLibraryDragMoved(drag: LibraryDrag): void {
    const point: PlanPoint | null = this.plan().toPlanPoint(drag.clientX, drag.clientY);
    this.ui.setGesture(point ? new PlaceGesture(drag.catalogId, point) : null);
  }

  /** Losgelassen über dem Plan: Element setzen; außerhalb passiert nichts. */
  protected onLibraryDropped(drag: LibraryDrag): void {
    this.ui.setGesture(null);
    const point: PlanPoint | null = this.plan().toPlanPoint(drag.clientX, drag.clientY);
    if (point) this.layoutService.placeElement(drag.catalogId, point);
  }

  private run(shortcut: BuilderShortcut): void {
    const selection: ElementSelection | null = this.ui.selection();
    switch (shortcut) {
      case 'rotate':
        if (selection) this.layoutService.rotateElement(selection);
        return;
      case 'remove':
        if (selection) this.layoutService.removeElement(selection);
        return;
      case 'escape':
        this.ui.escape();
        return;
      case 'undo':
        this.layoutService.undo();
        return;
      case 'redo':
        this.layoutService.redo();
    }
  }
}
