import { computed, inject, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { BuilderTool, FLOOR_TOOLS, StripToolKind } from '../models/builder-tool.model';
import { DungeonLayout } from '../models/dungeon-layout.model';
import { ElementCatalog } from '../models/element-catalog.model';
import { ElementSelection } from '../models/element-selection.model';
import { PlanGesture } from '../models/plan-gesture.model';
import { hasElement } from '../utils/layout-edit.util';
import { DungeonLayoutService } from './dungeon-layout.service';
import { ElementCatalogService } from './element-catalog.service';
import { RecentElementsService } from './recent-elements.service';

/** Bodenart beim Start der Seite. */
export const DEFAULT_FLOOR_ID: string = 'room';

/**
 * UI-Zustand des Dungeon Builders: Werkzeug, Bodenart, Markierung und laufende Geste.
 * Wird von der Seite bereitgestellt (`providers`) und nicht gespeichert: nach Reload gilt „Auswahl“.
 */
@Injectable()
export class BuilderUiService {
  private readonly layoutService: DungeonLayoutService = inject(DungeonLayoutService);
  private readonly catalog: Signal<ElementCatalog | null> = inject(ElementCatalogService).catalog;
  private readonly recentElements: RecentElementsService = inject(RecentElementsService);

  private readonly _tool: WritableSignal<BuilderTool> = signal<BuilderTool>({ kind: 'select' });
  /** Gewählte Bodenart; `null` ist Fels. */
  private readonly _floorId: WritableSignal<string | null> = signal<string | null>(
    DEFAULT_FLOOR_ID,
  );
  private readonly _selection: WritableSignal<ElementSelection | null> =
    signal<ElementSelection | null>(null);
  private readonly _gesture: WritableSignal<PlanGesture | null> = signal<PlanGesture | null>(null);

  readonly tool: Signal<BuilderTool> = this._tool.asReadonly();
  readonly floorId: Signal<string | null> = this._floorId.asReadonly();
  readonly gesture: Signal<PlanGesture | null> = this._gesture.asReadonly();

  /** Markierung; entfällt von selbst, wenn das Element nicht mehr existiert (Löschen, Rückgängig). */
  readonly selection: Signal<ElementSelection | null> = computed(() => {
    const selection: ElementSelection | null = this._selection();
    return selection && hasElement(this.layoutService.layout(), selection) ? selection : null;
  });

  /** Layout samt Vorschau der laufenden Geste; ohne Geste das gespeicherte Layout. */
  readonly draft: Signal<DungeonLayout> = computed(() => {
    const gesture: PlanGesture | null = this._gesture();
    const layout: DungeonLayout = this.layoutService.layout();
    return gesture ? gesture.draft(layout, this.catalog()) : layout;
  });

  selectTool(kind: StripToolKind): void {
    this._tool.set({ kind });
    if (kind !== 'select') this._selection.set(null);
  }

  /** Ein Tipp auf einen Bibliothekseintrag macht ihn zum Stempel (und merkt ihn), ein zweiter beendet ihn. */
  toggleStamp(catalogId: string): void {
    const tool: BuilderTool = this._tool();
    const active: boolean = tool.kind === 'stamp' && tool.catalogId === catalogId;
    this._tool.set(active ? { kind: 'select' } : { kind: 'stamp', catalogId });
    this._selection.set(null);
    if (!active) this.recentElements.record(catalogId);
  }

  /** Wählt die Bodenart und schaltet auf den Pinsel, wenn gerade kein Boden-Werkzeug aktiv ist. */
  chooseFloor(floorId: string | null): void {
    this._floorId.set(floorId);
    const kind: BuilderTool['kind'] = this._tool().kind;
    if (!FLOOR_TOOLS.some((tool) => tool === kind)) this._tool.set({ kind: 'brush' });
  }

  select(selection: ElementSelection | null): void {
    this._selection.set(selection);
  }

  /** `Esc`: beendet den Stempel bzw. hebt die Markierung auf. */
  escape(): void {
    if (this._tool().kind === 'stamp') this._tool.set({ kind: 'select' });
    this._selection.set(null);
  }

  setGesture(gesture: PlanGesture | null): void {
    this._gesture.set(gesture);
  }
}
