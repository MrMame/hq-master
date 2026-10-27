import { computed, inject, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { PersistedState, persistedState } from '../../../core/session-state/persisted-state';
import { TOOL_STATE_KEYS } from '../../../core/session-state/tool-state-keys';
import { DungeonLayout, NEW_LAYOUT } from '../models/dungeon-layout.model';
import { ElementCatalog } from '../models/element-catalog.model';
import { ElementSelection } from '../models/element-selection.model';
import { GridPoint, PlanPoint, TileCell } from '../models/grid.model';
import { placeElement } from '../utils/element-placement.util';
import { fillArea, paintFloor } from '../utils/floor-edit.util';
import { LAYOUT_CODEC } from '../utils/layout-codec.util';
import { addWall, moveElement, removeElement, rotateElement } from '../utils/layout-edit.util';
import {
  EMPTY_HISTORY,
  LayoutHistory,
  recordChange,
  redoChange,
  undoChange,
} from '../utils/layout-history.util';
import { resizeLayout } from '../utils/layout-resize.util';
import { GridDelta, Segment, segmentLength } from '../utils/wall-geometry.util';
import { ElementCatalogService } from './element-catalog.service';

/**
 * Single Source of Truth für das Layout des Dungeon Builders. Werkzeug-Zustand außerhalb der
 * Spielesession: kein `SessionStateSlice`. Jede fachliche Änderung ist ein Rückgängig-Schritt.
 */
@Injectable({
  providedIn: 'root',
})
export class DungeonLayoutService {
  private readonly catalog: Signal<ElementCatalog | null> = inject(ElementCatalogService).catalog;

  private readonly _layout: PersistedState<DungeonLayout> = persistedState<DungeonLayout>(
    TOOL_STATE_KEYS.dungeonBuilderLayout,
    () => NEW_LAYOUT,
    LAYOUT_CODEC,
  );
  /** Verlauf für Rückgängig/Wiederholen; nicht persistiert. */
  private readonly history: WritableSignal<LayoutHistory> = signal<LayoutHistory>(EMPTY_HISTORY);

  readonly layout: Signal<DungeonLayout> = this._layout.value;
  readonly canUndo: Signal<boolean> = computed(() => this.history().past.length > 0);
  readonly canRedo: Signal<boolean> = computed(() => this.history().future.length > 0);

  /** `floorId = null` macht die Kacheln zu Fels. */
  paintFloor(cells: TileCell[], floorId: string | null): void {
    this.commit(paintFloor(this.current(), cells, floorId));
  }

  fillFloor(start: TileCell, floorId: string | null): void {
    this.paintFloor(fillArea(this.current(), start), floorId);
  }

  addWall(from: GridPoint, to: GridPoint): void {
    const wall: Segment = { x1: from.x, y1: from.y, x2: to.x, y2: to.y };
    if (segmentLength(wall) < 1) return;
    this.commit(addWall(this.current(), { id: crypto.randomUUID(), ...wall }));
  }

  /** Setzt ein Element aus dem Katalog: Möbel mittig auf die Kachel, Türen auf die nächste Kante. */
  placeElement(catalogId: string, point: PlanPoint): void {
    const ids: { id: string; catalogId: string } = { id: crypto.randomUUID(), catalogId };
    this.commit(placeElement(this.current(), this.catalog(), ids, point));
  }

  moveElement(ref: ElementSelection, delta: GridDelta): void {
    this.commit(moveElement(this.current(), ref, delta, this.catalog()));
  }

  rotateElement(ref: ElementSelection): void {
    this.commit(rotateElement(this.current(), ref, this.catalog()));
  }

  removeElement(ref: ElementSelection): void {
    this.commit(removeElement(this.current(), ref));
  }

  resize(columns: number, rows: number): void {
    this.commit(resizeLayout(this.current(), { columns, rows }, this.catalog()));
  }

  /** Umbenennen ist kein eigener Rückgängig-Schritt. */
  rename(name: string): void {
    this._layout.update((layout) => ({ ...layout, name }));
  }

  /** Ersetzt das Layout, z. B. beim Laden einer Datei; der Verlauf beginnt neu. */
  replace(layout: DungeonLayout): void {
    this._layout.set(layout);
    this.history.set(EMPTY_HISTORY);
  }

  /** „Neu“: leerer Plan in Startgröße, der Verlauf beginnt neu. */
  reset(): void {
    this.replace(NEW_LAYOUT);
  }

  undo(): void {
    this.applyHistoryStep(undoChange(this.history(), this.current()));
  }

  redo(): void {
    this.applyHistoryStep(redoChange(this.history(), this.current()));
  }

  // PRIVATES ===============================================================================

  private current(): DungeonLayout {
    return this._layout.current();
  }

  private applyHistoryStep(step: { history: LayoutHistory; layout: DungeonLayout } | null): void {
    if (!step) return;
    this.history.set(step.history);
    this._layout.set(step.layout);
  }

  /** Schreibt eine Änderung als Rückgängig-Schritt; ohne Änderung passiert nichts. */
  private commit(next: DungeonLayout): void {
    const previous: DungeonLayout = this.current();
    if (next === previous) return;
    this.history.update((history) => recordChange(history, previous));
    this._layout.set(next);
  }
}
