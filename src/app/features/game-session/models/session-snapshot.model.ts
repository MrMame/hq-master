import { CharacterInfo } from '../../character-tracker/models/character-info.model';
import { DungeonBoardState } from '../../dungeon-tracker/models/dungeon-board-state.model';
import { DungeonPosition } from '../../dungeon-tracker/models/dungeon-position.model';
import { DeckState } from '../../card-manager/models/deck-state.model';
import { SessionMeta } from './session-meta.model';

/** Vollständiger, feature-übergreifender Zustand einer Spielesession (Speichern/Laden). */
export interface SessionSnapshot {
  meta: SessionMeta;
  gameTime: Date;
  characters: CharacterInfo[];
  board: DungeonBoardState;
  positions: DungeonPosition[];
  deck: DeckState | null;
}
