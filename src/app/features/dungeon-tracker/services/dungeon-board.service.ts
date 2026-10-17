import { computed, Injectable, Signal } from '@angular/core';
import { PersistedState, persistedState } from '../../../core/session-state/persisted-state';
import { SESSION_KEYS } from '../../../core/session-state/session-keys';
import { SessionStateSlice } from '../../../core/session-state/session-state-slice';
import { CharacterInfo } from '../../character-tracker/models/character-info.model';
import {
  DEFAULT_DUNGEON_BOARD_STATE,
  DungeonBoardState,
} from '../models/dungeon-board-state.model';
import { DungeonPosition } from '../models/dungeon-position.model';
import { DungeonSessionState } from '../models/dungeon-session-state.model';

@Injectable({
  providedIn: 'root',
})
export class DungeonBoardService implements SessionStateSlice<DungeonSessionState> {
  // Mutationen lesen über current()/update() untracked: sie werden u. a. aus effect() aufgerufen.
  private readonly _boardState: PersistedState<DungeonBoardState> =
    persistedState<DungeonBoardState>(SESSION_KEYS.dungeonBoard, () => ({
      ...DEFAULT_DUNGEON_BOARD_STATE,
    }));
  private readonly _positions: PersistedState<DungeonPosition[]> = persistedState<
    DungeonPosition[]
  >(SESSION_KEYS.dungeonPositions, () => []);

  readonly boardState: Signal<DungeonBoardState> = this._boardState.value;
  readonly positions: Signal<DungeonPosition[]> = this._positions.value;
  readonly sessionState: Signal<DungeonSessionState> = computed(() => ({
    board: this.boardState(),
    positions: this.positions(),
  }));

  setBoardImage(base64: string): void {
    this._boardState.update((board) => ({ ...board, boardImageBase64: base64 }));
  }

  updateGridSettings(partial: Partial<DungeonBoardState>): void {
    this._boardState.update((board) => ({ ...board, ...partial }));
  }

  updatePosition(characterId: string, col: number, row: number): void {
    this._positions.update((positions) =>
      positions.some((p) => p.characterId === characterId)
        ? positions.map((p) => (p.characterId === characterId ? { ...p, col, row } : p))
        : [...positions, { characterId, col, row }],
    );
  }

  initPositionsForCharacters(characters: CharacterInfo[]): void {
    const existing: DungeonPosition[] = this._positions.current();
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

    this._positions.set([...filtered, ...newPositions]);
  }

  /** Ersetzt Board und Positionen vollständig, z. B. beim Laden eines Spielstands. */
  restore({ board, positions }: DungeonSessionState): void {
    this._boardState.set({ ...board });
    this._positions.set([...positions]);
  }

  reset(): void {
    this.restore({ board: DEFAULT_DUNGEON_BOARD_STATE, positions: [] });
  }
}
