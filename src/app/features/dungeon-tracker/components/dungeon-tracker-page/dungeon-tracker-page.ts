import { Component, computed, inject, Signal, signal, WritableSignal } from '@angular/core';
import { NgStyle } from '@angular/common';
import { CharacterEditorService } from '../../../../shared/services/character-editor.service';
import { CharacterDamageService } from '../../../../shared/services/character-damage.service';
import { CharacterInfo } from '../../../../core/models/character-info.model';
import { DamageTypes } from '../../../../core/models/damage-types.model';
import { DungeonBoardService } from '../../services/dungeon-board.service';
import { DungeonBoardState } from '../../models/dungeon-board-state.model';
import { BoardToken } from '../../models/board-token.model';
import { DungeonToken } from '../dungeon-token/dungeon-token';
import { DungeonLegendEntry } from '../dungeon-legend-entry/dungeon-legend-entry';

@Component({
  selector: 'app-dungeon-tracker-page',
  standalone: true,
  imports: [DungeonToken, DungeonLegendEntry, NgStyle],
  templateUrl: './dungeon-tracker-page.html',
  styleUrls: ['./dungeon-tracker-page.css', './dungeon-board.css'],
})
export class DungeonTrackerPage {
  private readonly dungeonBoardService: DungeonBoardService = inject(DungeonBoardService);
  private readonly characterEditor: CharacterEditorService = inject(CharacterEditorService);
  private readonly characterDamage: CharacterDamageService = inject(CharacterDamageService);

  readonly boardState: Signal<DungeonBoardState> = this.dungeonBoardService.boardState;
  readonly tokens: Signal<BoardToken[]> = this.dungeonBoardService.tokens;

  /** Markiertes Token: reiner UI-Zustand, gehört nicht zur Spielesession. */
  readonly selectedCharacterId: WritableSignal<string | null> = signal<string | null>(null);

  /** Die Markierung gilt nur, solange es den Charakter noch gibt. */
  readonly selectedId: Signal<string | null> = computed(() => {
    const id: string | null = this.selectedCharacterId();
    return this.tokens().some((t) => t.position.characterId === id) ? id : null;
  });

  readonly gridStyle: Signal<{
    'background-image': string;
    'background-position': string;
    'background-size': string;
  }> = computed(() => {
    const { gridCellSizePx, gridOffsetX, gridOffsetY, gridOpacity } = this.boardState();
    const c: string = `rgba(255,255,255,${gridOpacity})`;
    const size: number = gridCellSizePx;
    return {
      'background-image': [
        `repeating-linear-gradient(0deg, transparent, transparent ${size - 1}px, ${c} ${size}px)`,
        `repeating-linear-gradient(90deg, transparent, transparent ${size - 1}px, ${c} ${size}px)`,
      ].join(', '),
      'background-position': `${gridOffsetX}px ${gridOffsetY}px`,
      'background-size': `${size}px ${size}px`,
    };
  });

  onImageUpload(event: Event): void {
    const input: HTMLInputElement = event.target as HTMLInputElement;
    const file: File | undefined = input.files?.[0];
    if (!file) return;

    const reader: FileReader = new FileReader();
    reader.onload = (): void => {
      this.dungeonBoardService.setBoardImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  }

  onGridSettingChange(
    key: 'gridCellSizePx' | 'gridOffsetX' | 'gridOffsetY' | 'gridOpacity',
    value: number,
  ): void {
    this.dungeonBoardService.updateGridSettings({ [key]: value });
  }

  onTokenMoved(event: { characterId: string; col: number; row: number }): void {
    this.dungeonBoardService.updatePosition(event.characterId, event.col, event.row);
  }

  /** Der Editor speichert selbst; Token und Legende folgen über `tokens` sofort. */
  onTokenDoubleClick(character: CharacterInfo): void {
    this.characterEditor.openEdit(character);
  }

  /** Der Service schreibt den Treffer; Token und Legende folgen über `tokens` sofort. */
  onDamageRequested(character: CharacterInfo, damageType: DamageTypes): void {
    this.characterDamage.requestDamage(character, damageType);
  }

  /** Den neuen Charakter setzt der Sync-Effekt des DungeonBoardService aufs erste freie Feld. */
  onNewCharacterClick(): void {
    this.characterEditor.openCreate();
  }
}
