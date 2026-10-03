import { Component, computed, inject, signal } from '@angular/core';
import { NgStyle } from '@angular/common';
import { Router } from '@angular/router';
import { CharactersDbService } from '../../../../core/services/persistent/characters-database-service';
import { CharacterInfo } from '../../../character-tracker/models/CharacterInfo';
import { DungeonBoardService } from '../../services/dungeon-board-service';
import { DungeonToken } from '../dungeon-token/dungeon-token';

@Component({
  selector: 'app-dungeon-tracker-page',
  standalone: true,
  imports: [DungeonToken, NgStyle],
  templateUrl: './dungeon-tracker-page.html',
  styleUrl: './dungeon-tracker-page.scss',
})
export class DungeonTrackerPage {
  private readonly dungeonBoardService = inject(DungeonBoardService);
  private readonly charactersDbService = inject(CharactersDbService);
  private readonly router = inject(Router);

  readonly boardState = this.dungeonBoardService.boardState;
  readonly positions = this.dungeonBoardService.positions;

  readonly characters = signal<CharacterInfo[]>([]);

  constructor() {
    const chars = this.charactersDbService.readCharacters() ?? [];
    this.characters.set(chars);
    this.dungeonBoardService.initPositionsForCharacters(chars);
  }

  readonly gridStyle = computed(() => {
    const { gridCellSizePx, gridOffsetX, gridOffsetY, gridOpacity } = this.boardState();
    const c = `rgba(255,255,255,${gridOpacity})`;
    const size = gridCellSizePx;
    return {
      'background-image': [
        `repeating-linear-gradient(0deg, transparent, transparent ${size - 1}px, ${c} ${size}px)`,
        `repeating-linear-gradient(90deg, transparent, transparent ${size - 1}px, ${c} ${size}px)`,
      ].join(', '),
      'background-position': `${gridOffsetX}px ${gridOffsetY}px`,
      'background-size': `${size}px ${size}px`,
    };
  });

  getCharacter(characterId: string): CharacterInfo | undefined {
    return this.characters().find(c => c.id === characterId);
  }

  onImageUpload(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      this.dungeonBoardService.setBoardImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  }

  onGridSettingChange(key: 'gridCellSizePx' | 'gridOffsetX' | 'gridOffsetY' | 'gridOpacity', value: number): void {
    this.dungeonBoardService.updateGridSettings({ [key]: value });
  }

  onTokenMoved(event: { characterId: string; col: number; row: number }): void {
    this.dungeonBoardService.updatePosition(event.characterId, event.col, event.row);
  }

  onTokenDoubleClick(characterId: string): void {
    void this.router.navigate(['/charactertracker']);
  }
}
