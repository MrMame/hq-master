import { Component, computed, inject, Signal } from '@angular/core';
import { NgStyle } from '@angular/common';
import { Router } from '@angular/router';
import { DungeonBoardService } from '../../services/dungeon-board.service';
import { DungeonBoardState } from '../../models/dungeon-board-state.model';
import { BoardToken } from '../../models/board-token.model';
import { DungeonToken } from '../dungeon-token/dungeon-token';

@Component({
  selector: 'app-dungeon-tracker-page',
  standalone: true,
  imports: [DungeonToken, NgStyle],
  templateUrl: './dungeon-tracker-page.html',
  styleUrl: './dungeon-tracker-page.scss',
})
export class DungeonTrackerPage {
  private readonly dungeonBoardService: DungeonBoardService = inject(DungeonBoardService);
  private readonly router: Router = inject(Router);

  readonly boardState: Signal<DungeonBoardState> = this.dungeonBoardService.boardState;
  readonly tokens: Signal<BoardToken[]> = this.dungeonBoardService.tokens;

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

  onTokenDoubleClick(): void {
    void this.router.navigate(['/charactertracker']);
  }
}
