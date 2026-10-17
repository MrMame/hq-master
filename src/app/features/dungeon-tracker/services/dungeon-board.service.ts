import { computed, effect, inject, Injectable, Signal, untracked } from '@angular/core';
import { CharactersDbService } from '../../../core/services/characters/characters-db.service';
import { PersistedState, persistedState } from '../../../core/session-state/persisted-state';
import { SESSION_KEYS } from '../../../core/session-state/session-keys';
import { SessionStateSlice } from '../../../core/session-state/session-state-slice';
import { CharacterInfo } from '../../character-tracker/models/character-info.model';
import {
  DEFAULT_DUNGEON_BOARD_STATE,
  DungeonBoardState,
} from '../models/dungeon-board-state.model';
import { BoardToken } from '../models/board-token.model';
import { DungeonPosition } from '../models/dungeon-position.model';
import { DungeonSessionState } from '../models/dungeon-session-state.model';
import { placeNewTokens } from '../utils/token-placement.util';

@Injectable({
  providedIn: 'root',
})
export class DungeonBoardService implements SessionStateSlice<DungeonSessionState> {
  private readonly charactersDbService: CharactersDbService = inject(CharactersDbService);

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

  /** Positionen mit ihrem Charakter; Positionen ohne (noch) vorhandenen Charakter entfallen. */
  readonly tokens: Signal<BoardToken[]> = computed(() => {
    const byId: Map<string, CharacterInfo> = new Map<string, CharacterInfo>(
      this.charactersDbService.characters().map((c) => [c.id, c]),
    );
    return this.positions().flatMap((position) => {
      const character: CharacterInfo | undefined = byId.get(position.characterId);
      return character ? [{ position, character }] : [];
    });
  });

  constructor() {
    // Hält die Positionen app-weit konsistent, unabhängig davon, ob eine Page geöffnet ist.
    effect(() => {
      const characters: CharacterInfo[] = this.charactersDbService.characters();
      untracked(() => this.syncPositionsWithCharacters(characters));
    });
  }

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

  /** Ersetzt Board und Positionen vollständig, z. B. beim Laden eines Spielstands. */
  restore({ board, positions }: DungeonSessionState): void {
    this._boardState.set({ ...board });
    this._positions.set([...positions]);
  }

  reset(): void {
    this.restore({ board: DEFAULT_DUNGEON_BOARD_STATE, positions: [] });
  }

  // PRIVATES ===============================================================================

  /** Entfernt Positionen gelöschter und platziert neue Charaktere; schreibt nur bei Änderung. */
  private syncPositionsWithCharacters(characters: CharacterInfo[]): void {
    const existing: DungeonPosition[] = this._positions.current();
    const existingIds: Set<string> = new Set<string>(existing.map((p) => p.characterId));
    const characterIds: Set<string> = new Set<string>(characters.map((c) => c.id));

    const kept: DungeonPosition[] = existing.filter((p) => characterIds.has(p.characterId));
    const newIds: string[] = characters.map((c) => c.id).filter((id) => !existingIds.has(id));
    if (kept.length === existing.length && newIds.length === 0) return;

    this._positions.set([...kept, ...placeNewTokens(kept, newIds)]);
  }
}
