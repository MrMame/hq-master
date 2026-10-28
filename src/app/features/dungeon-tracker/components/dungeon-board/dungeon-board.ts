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
  output,
  OutputEmitterRef,
  Signal,
  signal,
  viewChild,
  WritableSignal,
} from '@angular/core';
import { NgStyle } from '@angular/common';
import { CharacterEditorService } from '../../../../shared/services/character-editor.service';
import { CharacterInfo } from '../../../../core/models/character-info.model';
import { DungeonBoardService } from '../../services/dungeon-board.service';
import { DungeonBoardState } from '../../models/dungeon-board-state.model';
import { BoardToken } from '../../models/board-token.model';
import { CharacterSelection } from '../../models/character-selection.model';
import { Size } from '../../models/size.model';
import { Point } from '../../models/point.model';
import { fitScale, stageSize } from '../../utils/board-scale.util';
import { gridStyle, GridStyle } from '../../utils/grid-style.util';
import { BoardPan } from '../../../../shared/directives/board-pan';
import { DungeonToken } from '../dungeon-token/dungeon-token';
import { GridOriginMarker } from '../grid-origin-marker/grid-origin-marker';

/**
 * Spielbrettbereich: Foto, Raster und Tokens liegen auf einer Spielfläche mit festen Einheiten,
 * die als Ganzes skaliert wird. Nur dieser Bereich zoomt und scrollt.
 */
@Component({
  selector: 'app-dungeon-board',
  imports: [DungeonToken, GridOriginMarker, NgStyle, BoardPan],
  templateUrl: './dungeon-board.html',
  styleUrl: './dungeon-board.css',
})
export class DungeonBoard {
  private readonly dungeonBoardService: DungeonBoardService = inject(DungeonBoardService);
  private readonly characterEditor: CharacterEditorService = inject(CharacterEditorService);
  private readonly viewport: Signal<ElementRef<HTMLElement>> = viewChild.required('viewport');

  /** Zoomstufe aus der Sidebar; 1 = die ganze Spielfläche ist sichtbar. */
  readonly zoom: InputSignal<number> = input<number>(1);
  /** Modus „Nullpunkt verschieben“ aus der Sidebar: zeigt den ziehbaren Nullpunkt-Marker. */
  readonly originMode: InputSignal<boolean> = input<boolean>(false);

  readonly boardState: Signal<DungeonBoardState> = this.dungeonBoardService.boardState;
  readonly tokens: Signal<BoardToken[]> = this.dungeonBoardService.tokens;

  /** Markierung der Seite; gilt nur für noch vorhandene Charaktere (prüft die Seite). */
  readonly selection: InputSignal<CharacterSelection | null> = input<CharacterSelection | null>(
    null,
  );

  /** Angeklicktes Token bzw. `null` für einen Klick auf eine freie Stelle. */
  readonly selectionChange: OutputEmitterRef<string | null> = output<string | null>();

  /** Natürliche Größe des geladenen Fotos, gemeldet vom `load`-Event des Bildes. */
  private readonly photoSize: WritableSignal<Size | null> = signal<Size | null>(null);
  /** Größe des Spielbrettbereichs (mit Bildlaufleisten, damit sie den Maßstab nicht ändern). */
  private readonly viewportSize: WritableSignal<Size> = signal<Size>({ width: 0, height: 0 });

  readonly stage: Signal<Size> = computed(() =>
    stageSize(this.boardState().boardImageBase64 ? this.photoSize() : null),
  );
  readonly scale: Signal<number> = computed(
    () => fitScale(this.viewportSize(), this.stage()) * this.zoom(),
  );
  /** Nullpunkt während des Ziehens am Marker, sonst `null`; reiner UI-Zustand. */
  protected readonly originPreview: WritableSignal<Point | null> = signal<Point | null>(null);
  /** Nullpunkt für Raster, Tokens und Marker: beim Ziehen die Vorschau, sonst der gespeicherte. */
  readonly origin: Signal<Point> = computed(
    () =>
      this.originPreview() ?? {
        x: this.boardState().gridOffsetX,
        y: this.boardState().gridOffsetY,
      },
  );
  readonly gridStyle: Signal<GridStyle> = computed(() =>
    gridStyle(
      { ...this.boardState(), gridOffsetX: this.origin().x, gridOffsetY: this.origin().y },
      this.scale() > 0 ? 1 / this.scale() : 1,
    ),
  );

  /** Mitte des sichtbaren Ausschnitts relativ zur gescrollten Fläche (0..1). */
  private viewCenter: { x: number; y: number } = { x: 0.5, y: 0.5 };

  constructor() {
    const destroyRef: DestroyRef = inject(DestroyRef);
    afterNextRender(() => {
      const observer: ResizeObserver = new ResizeObserver(([entry]) => {
        const [box]: readonly ResizeObserverSize[] = entry.borderBoxSize;
        this.viewportSize.set({ width: box.inlineSize, height: box.blockSize });
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

  rememberViewCenter(): void {
    const element: HTMLElement = this.viewport().nativeElement;
    this.viewCenter = {
      x: (element.scrollLeft + element.clientWidth / 2) / element.scrollWidth,
      y: (element.scrollTop + element.clientHeight / 2) / element.scrollHeight,
    };
  }

  onPhotoLoad(event: Event): void {
    const photo: HTMLImageElement = event.target as HTMLImageElement;
    this.photoSize.set({ width: photo.naturalWidth, height: photo.naturalHeight });
  }

  /** Tokens behalten ihr Feld und wandern mit dem Raster mit. */
  onOriginMoved(origin: Point): void {
    this.dungeonBoardService.updateGridSettings({ gridOffsetX: origin.x, gridOffsetY: origin.y });
    this.originPreview.set(null);
  }

  onTokenMoved(event: { characterId: string; col: number; row: number }): void {
    this.dungeonBoardService.updatePosition(event.characterId, event.col, event.row);
  }

  /** Der Editor speichert selbst; Token und Legende folgen über `tokens` sofort. */
  onTokenDoubleClick(character: CharacterInfo): void {
    this.characterEditor.openEdit(character);
  }
}
