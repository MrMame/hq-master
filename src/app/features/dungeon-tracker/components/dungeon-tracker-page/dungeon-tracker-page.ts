import { Component, inject, Signal, signal, WritableSignal } from '@angular/core';
import { CharacterEditorService } from '../../../../shared/services/character-editor.service';
import { CharacterDamageService } from '../../../../shared/services/character-damage.service';
import { CharacterInfo } from '../../../../core/models/character-info.model';
import { DamageTypes } from '../../../../core/models/damage-types.model';
import { DungeonBoardService } from '../../services/dungeon-board.service';
import { DungeonBoardState } from '../../models/dungeon-board-state.model';
import { BoardToken } from '../../models/board-token.model';
import { DungeonBoard } from '../dungeon-board/dungeon-board';
import { DungeonLegendEntry } from '../dungeon-legend-entry/dungeon-legend-entry';

@Component({
  selector: 'app-dungeon-tracker-page',
  standalone: true,
  imports: [DungeonBoard, DungeonLegendEntry],
  templateUrl: './dungeon-tracker-page.html',
  styleUrl: './dungeon-tracker-page.css',
})
export class DungeonTrackerPage {
  private readonly dungeonBoardService: DungeonBoardService = inject(DungeonBoardService);
  private readonly characterEditor: CharacterEditorService = inject(CharacterEditorService);
  private readonly characterDamage: CharacterDamageService = inject(CharacterDamageService);

  readonly boardState: Signal<DungeonBoardState> = this.dungeonBoardService.boardState;
  readonly tokens: Signal<BoardToken[]> = this.dungeonBoardService.tokens;

  /** Zoomstufe des Spielbretts: reiner Anzeigezustand, wird nicht gespeichert. */
  readonly zoom: WritableSignal<number> = signal<number>(1);

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

  /** Der Service schreibt den Treffer; Token und Legende folgen über `tokens` sofort. */
  onDamageRequested(character: CharacterInfo, damageType: DamageTypes): void {
    this.characterDamage.requestDamage(character, damageType);
  }

  /** Den neuen Charakter setzt der Sync-Effekt des DungeonBoardService aufs erste freie Feld. */
  onNewCharacterClick(): void {
    this.characterEditor.openCreate();
  }
}
