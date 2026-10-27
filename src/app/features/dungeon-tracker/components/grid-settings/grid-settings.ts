import { Component, computed, inject, Signal, signal, WritableSignal } from '@angular/core';
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

/** Werte, die ein Regler direkt setzt. */
type SliderSetting = 'gridCellSizePx' | 'gridOffsetX' | 'gridOffsetY' | 'gridOpacity';

/**
 * Raster-Einstellungen in der Seitenleiste: Zellgröße per Regler oder Zahl (mit Nachkommastellen),
 * Raster über die Spaltenanzahl an die Bildbreite anpassen, Versatz und Deckkraft. Liest und schreibt
 * nur über den `DungeonBoardService`.
 */
@Component({
  selector: 'app-grid-settings',
  templateUrl: './grid-settings.html',
  styleUrl: './grid-settings.css',
})
export class GridSettings {
  private readonly dungeonBoardService: DungeonBoardService = inject(DungeonBoardService);

  protected readonly boardState: Signal<DungeonBoardState> = this.dungeonBoardService.boardState;
  protected readonly cellLimits: { min: number; max: number } = CELL_SIZE_LIMITS;
  protected readonly columnLimits: { min: number; max: number } = COLUMN_LIMITS;

  /** Anzeige „38,46“; gerechnet wird mit dem ungerundeten Wert. */
  protected readonly cellSizeText: Signal<string> = computed(() =>
    formatCellSize(this.boardState().gridCellSizePx),
  );
  protected readonly cellSizeValue: Signal<number> = computed(() =>
    roundCellSize(this.boardState().gridCellSizePx),
  );
  /** Hinweis, wenn sich die Spaltenanzahl nicht übernehmen lässt; reiner UI-Zustand. */
  protected readonly columnHint: WritableSignal<string | null> = signal<string | null>(null);

  protected onSlide(key: SliderSetting, event: Event): void {
    const value: number = Number((event.target as HTMLInputElement).value);
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

  /** Zellgröße = Bildbreite / Spalten, Versatz 0; für randlose Bilder wie aus dem Dungeon Builder. */
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
