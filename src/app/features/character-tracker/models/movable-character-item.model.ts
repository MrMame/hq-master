import { CharacterInfo } from './character-info.model';
import { MovableItem } from './movable-item.model';

export class MovableCharacterItem implements MovableItem {
  id: number;
  x: number;
  y: number;
  isMinimised: boolean;
  showTop: boolean;
  characterInfo: CharacterInfo;

  constructor(id: number, x: number, y: number, characterInfo: CharacterInfo) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.isMinimised = true;
    this.characterInfo = characterInfo;
    this.showTop = false;
  }

  toggleMinimise(): void {
    this.isMinimised = !this.isMinimised;
  }
}
