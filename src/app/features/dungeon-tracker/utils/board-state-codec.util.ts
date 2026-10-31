import { StorageCodec } from '../../../core/session-state/persisted-state';
import {
  DEFAULT_DUNGEON_BOARD_STATE,
  DungeonBoardState,
} from '../models/dungeon-board-state.model';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Speichert die Spielbrett-Einstellungen unverändert. Beim Laden ergänzt er Felder, die ein älterer
 * Spielstand noch nicht kennt (z. B. `tokenScale`), mit dem Standardwert; kein Objekt → Startwert.
 */
export const BOARD_STATE_CODEC: StorageCodec<DungeonBoardState> = {
  encode: (board: DungeonBoardState): unknown => board,
  decode: (stored: unknown): DungeonBoardState | null =>
    isRecord(stored) ? { ...DEFAULT_DUNGEON_BOARD_STATE, ...stored } : null,
};
