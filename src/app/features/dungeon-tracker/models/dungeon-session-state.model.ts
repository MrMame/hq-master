import { DungeonBoardState } from './dungeon-board-state.model';
import { DungeonPosition } from './dungeon-position.model';

/** Session-Zustand des Dungeon-Trackers: Spielbrett und Token-Positionen. */
export interface DungeonSessionState {
  board: DungeonBoardState;
  positions: DungeonPosition[];
}
