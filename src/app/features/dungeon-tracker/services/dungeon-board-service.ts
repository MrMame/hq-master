import { inject, Injectable, signal } from '@angular/core';
import { StorageService } from '../../../core/services/persistent/storage-service';
import { CharacterInfo } from '../../character-tracker/models/CharacterInfo';
import { DEFAULT_DUNGEON_BOARD_STATE, DungeonBoardState } from '../models/DungeonBoardState';
import { DungeonPosition } from '../models/DungeonPosition';

const KEY_BOARD = 'dungeon_board';
const KEY_POSITIONS = 'dungeon_positions';

@Injectable({
  providedIn: 'root',
})
export class DungeonBoardService {
  private readonly storageService = inject(StorageService);

  private readonly _boardState = signal<DungeonBoardState>(
    this.storageService.readFromLocalStorage<DungeonBoardState>(KEY_BOARD) ?? { ...DEFAULT_DUNGEON_BOARD_STATE }
  );

  private readonly _positions = signal<DungeonPosition[]>(
    this.storageService.readFromLocalStorage<DungeonPosition[]>(KEY_POSITIONS) ?? []
  );

  readonly boardState = this._boardState.asReadonly();
  readonly positions = this._positions.asReadonly();

  setBoardImage(base64: string): void {
    this._boardState.update(s => ({ ...s, boardImageBase64: base64 }));
    this.persistBoard();
  }

  updateGridSettings(partial: Partial<DungeonBoardState>): void {
    this._boardState.update(s => ({ ...s, ...partial }));
    this.persistBoard();
  }

  updatePosition(characterId: string, col: number, row: number): void {
    this._positions.update(positions => {
      const existing = positions.findIndex(p => p.characterId === characterId);
      if (existing !== -1) {
        return positions.map(p => p.characterId === characterId ? { ...p, col, row } : p);
      }
      return [...positions, { characterId, col, row }];
    });
    this.persistPositions();
  }

  initPositionsForCharacters(characters: CharacterInfo[]): void {
    this._positions.update(existing => {
      const existingIds = new Set(existing.map(p => p.characterId));
      const characterIds = new Set(characters.map(c => c.id));

      // Positionen gelöschter Charaktere entfernen
      const filtered = existing.filter(p => characterIds.has(p.characterId));

      // Positionen für neue Charaktere hinzufügen (gestaffelt platzieren)
      const newPositions: DungeonPosition[] = characters
        .filter(c => !existingIds.has(c.id))
        .map((c, index) => ({
          characterId: c.id,
          col: index % 5,
          row: Math.floor(index / 5),
        }));

      return [...filtered, ...newPositions];
    });
    this.persistPositions();
  }

  private persistBoard(): void {
    this.storageService.writeToLocalStorage(KEY_BOARD, this._boardState());
  }

  private persistPositions(): void {
    this.storageService.writeToLocalStorage(KEY_POSITIONS, this._positions());
  }
}
