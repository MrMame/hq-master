import {
  Component,
  computed,
  inject,
  model,
  ModelSignal,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { DungeonBoardState } from '../../models/dungeon-board-state.model';
import { DungeonBoardService } from '../../services/dungeon-board.service';
import {
  CELL_SIZE_LIMITS,
  COLUMN_LIMITS,
  ColumnFit,
  fitColumns,
  formatCellSize,
  parseCellSize,
  roundCellSize,
} from '../../utils/grid-fit.util';
import {
  formatOrigin,
  GRID_STEPS,
  OPACITY_LIMITS,
  ORIGIN_LIMITS,
} from '../../utils/grid-step.util';
import { GridSlider } from '../grid-slider/grid-slider';

/** Werte, die ein Regler direkt setzt. */
type SliderSetting = 'gridCellSizePx' | 'gridOffsetX' | 'gridOffsetY' | 'gridOpacity';

/**
 * Raster-Einstellungen in der Seitenleiste: Schalter „Nullpunkt verschieben“, Zellgröße per Regler
 * oder Zahl (mit Nachkommastellen), Raster über die Spaltenanzahl an die Bildbreite anpassen,
 * Nullpunkt und Deckkraft; jeder Regler mit „−“/„+“ in feinster Stufe. Liest und schreibt nur über
 * den `DungeonBoardService`.
 */
@Component({
  selector: 'app-grid-settings',
  imports: [GridSlider],
  templateUrl: './grid-settings.html',
  styleUrl: './grid-settings.css',
})
export class GridSettings {
  private readonly dungeonBoardService: DungeonBoardService = inject(DungeonBoardService);

  /** Modus „Nullpunkt verschieben“: reiner UI-Zustand der Seite, wird nicht gespeichert. */
  readonly originMode: ModelSignal<boolean> = model<boolean>(false);

  protected readonly boardState: Signal<DungeonBoardState> = this.dungeonBoardService.boardState;
  protected readonly cellLimits: { min: number; max: number } = CELL_SIZE_LIMITS;
  protected readonly columnLimits: { min: number; max: number } = COLUMN_LIMITS;
  protected readonly originLimits: { min: number; max: number } = ORIGIN_LIMITS;
  protected readonly opacityLimits: { min: number; max: number } = OPACITY_LIMITS;
  protected readonly steps: typeof GRID_STEPS = GRID_STEPS;

  /** Anzeige „38,46“; gerechnet wird mit dem ungerundeten Wert. */
  protected readonly cellSizeText: Signal<string> = computed(() =>
    formatCellSize(this.boardState().gridCellSizePx),
  );
  protected readonly cellSizeValue: Signal<number> = computed(() =>
    roundCellSize(this.boardState().gridCellSizePx),
  );
  protected readonly originXText: Signal<string> = computed(() =>
    formatOrigin(this.boardState().gridOffsetX),
  );
  protected readonly originYText: Signal<string> = computed(() =>
    formatOrigin(this.boardState().gridOffsetY),
  );
  protected readonly opacityText: Signal<string> = computed(
    () => `${(this.boardState().gridOpacity * 100).toFixed(0)}%`,
  );
  /** Hinweis, wenn sich die Spaltenanzahl nicht übernehmen lässt; reiner UI-Zustand. */
  protected readonly columnHint: WritableSignal<string | null> = signal<string | null>(null);

  protected onOriginModeChange(event: Event): void {
    this.originMode.set((event.target as HTMLInputElement).checked);
  }

  protected onSlide(key: SliderSetting, value: number): void {
    this.dungeonBoardService.updateGridSettings({ [key]: value });
  }

  /** Ungültige oder leere Eingabe ändert nichts; das Feld zeigt wieder den gespeicherten Wert. */
  protected onCellSizeEntered(event: Event): void {
    const input: HTMLInputElement = event.target as HTMLInputElement;
    const value: number | null = parseCellSize(input.value);
    if (value === null) {
      input.value = String(this.cellSizeValue());
      return;
    }
    this.dungeonBoardService.updateGridSettings({ gridCellSizePx: value });
  }

  /** Zellgröße = Bildbreite / Spalten, Nullpunkt 0 / 0; für randlose Bilder wie aus dem Dungeon Builder. */
  protected onFitColumns(raw: string): void {
    const columns: number = raw.trim() === '' ? NaN : Number(raw);
    const fit: ColumnFit = fitColumns(columns);
    if ('hint' in fit) {
      this.columnHint.set(fit.hint);
      return;
    }
    this.columnHint.set(null);
    this.dungeonBoardService.updateGridSettings({
      gridColumns: columns,
      gridCellSizePx: fit.cellSize,
      gridOffsetX: 0,
      gridOffsetY: 0,
    });
  }
}
