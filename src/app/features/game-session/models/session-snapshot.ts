import { CharacterInfo } from '../../character-tracker/models/CharacterInfo';
import { DungeonBoardState } from '../../dungeon-tracker/models/DungeonBoardState';
import { DungeonPosition } from '../../dungeon-tracker/models/DungeonPosition';
import { DeckState } from '../../card-manager/models/deck-state.model';
import { SessionMeta } from './session-meta';

/** Vollständiger, feature-übergreifender Zustand einer Spielesession (Speichern/Laden). */
export interface SessionSnapshot {
  meta: SessionMeta;
  gameTime: Date;
  characters: CharacterInfo[];
  board: DungeonBoardState;
  positions: DungeonPosition[];
  deck: DeckState | null;
}
