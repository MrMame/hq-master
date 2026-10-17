import { CharacterInfo } from '../../character-tracker/models/character-info.model';
import { DungeonPosition } from './dungeon-position.model';

/** Eine Token-Position zusammen mit dem zugehörigen Charakter, bereit zur Anzeige. */
export interface BoardToken {
  position: DungeonPosition;
  character: CharacterInfo;
}
