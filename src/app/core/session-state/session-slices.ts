import { DeckState } from '../../features/card-manager/models/deck-state.model';
import { CardLayoutState } from '../../features/character-tracker/models/card-layout.model';
import { CharacterInfo } from '../models/character-info.model';
import { DungeonSessionState } from '../../features/dungeon-tracker/models/dungeon-session-state.model';
import { SessionStateSlice } from './session-state-slice';

/**
 * Zustand aller Slices einer Spielesession. Ein neuer Eintrag hier lässt den Compiler
 * alle Stellen melden, die ihn noch nicht kennen (Slice-Map, Snapshot, XML).
 */
export interface SessionSliceData {
  gameTime: Date;
  characters: CharacterInfo[];
  dungeon: DungeonSessionState;
  deck: DeckState | null;
  characterCards: CardLayoutState;
}

export type SessionSlices = {
  [K in keyof SessionSliceData]: SessionStateSlice<SessionSliceData[K]>;
};
