import { inject, Injectable, signal, Signal, untracked, WritableSignal } from '@angular/core';
import { StorageService } from '../../../core/services/storage/storage.service';
import { CharacterInfo } from '../../character-tracker/models/character-info.model';
import {
  DEFAULT_DUNGEON_BOARD_STATE,
  DungeonBoardState,
} from '../models/dungeon-board-state.model';
import { DungeonPosition } from '../models/dungeon-position.model';

const KEY_BOARD: string = 'dungeon_board';
const KEY_POSITIONS: string = 'dungeon_positions';

@Injectable({
  providedIn: 'root',
})
export class DungeonBoardService {
  private readonly storageService: StorageService = inject(StorageService);

  private readonly _boardState: WritableSignal<DungeonBoardState> = signal<DungeonBoardState>(
    this.loadBoard(),
  );
  private readonly _positions: WritableSignal<DungeonPosition[]> = signal<DungeonPosition[]>(
    this.loadPositions(),
  );

  readonly boardState: Signal<DungeonBoardState> = this._boardState.asReadonly();
  readonly positions: Signal<DungeonPosition[]> = this._positions.asReadonly();

  setBoardImage(base64: string): void {
    this.persistBoard({ ...this.currentBoard(), boardImageBase64: base64 });
  }

  updateGridSettings(partial: Partial<DungeonBoardState>): void {
    this.persistBoard({ ...this.currentBoard(), ...partial });
  }

  updatePosition(characterId: string, col: number, row: number): void {
    const positions: DungeonPosition[] = this.currentPositions();
    const exists: boolean = positions.some((p) => p.characterId === characterId);
    this.persistPositions(
      exists
        ? positions.map((p) => (p.characterId === characterId ? { ...p, col, row } : p))
        : [...positions, { characterId, col, row }],
    );
  }

  initPositionsForCharacters(characters: CharacterInfo[]): void {
    const existing: DungeonPosition[] = this.currentPositions();
    const existingIds: Set<string> = new Set<string>(existing.map((p) => p.characterId));
    const characterIds: Set<string> = new Set<string>(characters.map((c) => c.id));

    // Positionen gelöschter Charaktere entfernen
    const filtered: DungeonPosition[] = existing.filter((p) => characterIds.has(p.characterId));

    // Positionen für neue Charaktere hinzufügen (gestaffelt platzieren)
    const newPositions: DungeonPosition[] = characters
      .filter((c) => !existingIds.has(c.id))
      .map((c, index) => ({
        characterId: c.id,
        col: index % 5,
        row: Math.floor(index / 5),
      }));

    this.persistPositions([...filtered, ...newPositions]);
  }

  /** Ersetzt Board und Positionen vollständig, z. B. beim Laden eines Spielstands. */
  restore(board: DungeonBoardState, positions: DungeonPosition[]): void {
    this.persistBoard({ ...board });
    this.persistPositions([...positions]);
  }

  reset(): void {
    this.restore(DEFAULT_DUNGEON_BOARD_STATE, []);
  }

  // Lesen ohne Abhängigkeit: Mutationen werden u. a. aus effect() aufgerufen und dürfen
  // das eigene Signal nicht tracken, sonst löst das Setzen den effect endlos erneut aus.
  private currentBoard(): DungeonBoardState {
    return untracked(this._boardState);
  }

  private currentPositions(): DungeonPosition[] {
    return untracked(this._positions);
  }

  private persistBoard(board: DungeonBoardState): void {
    this._boardState.set(board);
    this.storageService.writeToLocalStorage<DungeonBoardState>(KEY_BOARD, board);
  }

  private persistPositions(positions: DungeonPosition[]): void {
    this._positions.set(positions);
    this.storageService.writeToLocalStorage<DungeonPosition[]>(KEY_POSITIONS, positions);
  }

  private loadBoard(): DungeonBoardState {
    return (
      this.storageService.readFromLocalStorage<DungeonBoardState>(KEY_BOARD) ?? {
        ...DEFAULT_DUNGEON_BOARD_STATE,
      }
    );
  }

  private loadPositions(): DungeonPosition[] {
    return this.storageService.readFromLocalStorage<DungeonPosition[]>(KEY_POSITIONS) ?? [];
  }
}
