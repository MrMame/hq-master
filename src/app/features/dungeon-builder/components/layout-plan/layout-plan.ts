import {
  afterNextRender,
  afterRenderEffect,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  input,
  InputSignal,
  Signal,
  signal,
  viewChild,
  WritableSignal,
} from '@angular/core';
import { BoardPan } from '../../../../shared/directives/board-pan';
import { DungeonLayout } from '../../models/dungeon-layout.model';
import { ElementCatalog } from '../../models/element-catalog.model';
import { PlanPoint, TILE_UNITS } from '../../models/grid.model';
import { Bounds, ImagePlacement, RenderStep } from '../../models/render-step.model';
import { BuilderUiService } from '../../services/builder-ui.service';
import { ElementCatalogService } from '../../services/element-catalog.service';
import { PlanPointerService } from '../../services/plan-pointer.service';
import { UNKNOWN_FILL } from '../../utils/canvas-draw.util';
import { elementBounds } from '../../utils/element-geometry.util';
import { renderSteps } from '../../utils/layout-render.util';
import { Extent, planScale } from '../../utils/plan-scale.util';
import { ElementActionBar } from '../element-action-bar/element-action-bar';

/**
 * Zoombarer Plan: zeichnet dieselben Schritte wie der JPEG-Export als SVG (1 Kachel = 64 Einheiten),
 * darüber Raster, Markierung und Menüleiste. Zeiger-Ereignisse gehen an den `PlanPointerService`.
 */
@Component({
  selector: 'app-layout-plan',
  imports: [BoardPan, ElementActionBar],
  providers: [PlanPointerService],
  templateUrl: './layout-plan.html',
  styleUrl: './layout-plan.css',
})
export class LayoutPlan {
  private readonly ui: BuilderUiService = inject(BuilderUiService);
  private readonly pointer: PlanPointerService = inject(PlanPointerService);
  private readonly catalog: Signal<ElementCatalog | null> = inject(ElementCatalogService).catalog;
  private readonly viewport: Signal<ElementRef<HTMLElement>> = viewChild.required('viewport');
  private readonly surface: Signal<ElementRef<SVGSVGElement>> = viewChild.required('surface');

  /** Zoomstufe aus dem Werkzeugstreifen; 1 = der ganze Plan ist sichtbar. */
  readonly zoom: InputSignal<number> = input<number>(1);

  protected readonly tile: number = TILE_UNITS;
  protected readonly unknownFill: string = UNKNOWN_FILL;
  protected readonly layout: Signal<DungeonLayout> = this.ui.draft;
  protected readonly plan: Signal<Extent> = computed(() => ({
    width: this.layout().columns * TILE_UNITS,
    height: this.layout().rows * TILE_UNITS,
  }));
  private readonly viewportSize: WritableSignal<Extent> = signal<Extent>({ width: 0, height: 0 });
  protected readonly scale: Signal<number> = computed(() =>
    planScale(this.viewportSize(), this.plan(), this.zoom()),
  );
  protected readonly steps: Signal<RenderStep[]> = computed(() =>
    renderSteps(this.layout(), this.catalog(), TILE_UNITS),
  );
  /** Markierung in Kacheln, für Rahmen und Menüleiste. */
  protected readonly selected: Signal<Bounds | null> = computed(() => {
    const selection: ReturnType<BuilderUiService['selection']> = this.ui.selection();
    return selection ? elementBounds(this.layout(), selection, this.catalog()) : null;
  });
  /** Nur mit „Auswahl“ verschiebt Ziehen auf freier Fläche den Ausschnitt. */
  protected readonly pannable: Signal<boolean> = computed(() => this.ui.tool().kind === 'select');

  /** Mitte des sichtbaren Ausschnitts relativ zur gescrollten Fläche (0..1). */
  private viewCenter: PlanPoint = { x: 0.5, y: 0.5 };

  constructor() {
    const destroyRef: DestroyRef = inject(DestroyRef);
    afterNextRender(() => {
      const observer: ResizeObserver = new ResizeObserver(([entry]) => {
        this.viewportSize.set({ width: entry.contentRect.width, height: entry.contentRect.height });
      });
      observer.observe(this.viewport().nativeElement);
      destroyRef.onDestroy(() => observer.disconnect());
    });

    // Nach jeder Maßstabsänderung (Zoom, Fenstergröße) bleibt die Mitte des Ausschnitts stehen.
    afterRenderEffect(() => {
      this.scale();
      const element: HTMLElement = this.viewport().nativeElement;
      element.scrollLeft = this.viewCenter.x * element.scrollWidth - element.clientWidth / 2;
      element.scrollTop = this.viewCenter.y * element.scrollHeight - element.clientHeight / 2;
    });
  }

  /** Punkt des Plans in Kacheln unter einer Bildschirmposition; `null` außerhalb des Plans. */
  toPlanPoint(clientX: number, clientY: number): PlanPoint | null {
    const point: PlanPoint = this.clientToPlan(clientX, clientY);
    const { columns, rows }: DungeonLayout = this.layout();
    const inside: boolean = point.x >= 0 && point.y >= 0 && point.x < columns && point.y < rows;
    return inside ? point : null;
  }

  protected transform(placement: ImagePlacement): string {
    return `translate(${placement.translateX} ${placement.translateY}) rotate(${placement.rotation})`;
  }

  protected rememberViewCenter(): void {
    const element: HTMLElement = this.viewport().nativeElement;
    this.viewCenter = {
      x: (element.scrollLeft + element.clientWidth / 2) / element.scrollWidth,
      y: (element.scrollTop + element.clientHeight / 2) / element.scrollHeight,
    };
  }

  /** Übernimmt der Plan die Geste, sieht `BoardPan` den Druck nicht (kein Verschieben). */
  protected onPointerDown(event: PointerEvent): void {
    if (event.button !== 0) return;
    if (!this.pointer.down(this.clientToPlan(event.clientX, event.clientY))) return;
    event.stopPropagation();
    this.surface().nativeElement.setPointerCapture?.(event.pointerId);
  }

  protected onPointerMove(event: PointerEvent): void {
    this.pointer.move(this.clientToPlan(event.clientX, event.clientY));
  }

  protected onPointerUp(event: PointerEvent): void {
    this.pointer.up(this.clientToPlan(event.clientX, event.clientY));
  }

  protected onPointerCancel(): void {
    this.pointer.cancel();
  }

  private clientToPlan(clientX: number, clientY: number): PlanPoint {
    const bounds: DOMRect = this.surface().nativeElement.getBoundingClientRect();
    const unitsPerTile: number = TILE_UNITS * this.scale();
    return { x: (clientX - bounds.left) / unitsPerTile, y: (clientY - bounds.top) / unitsPerTile };
  }
}
