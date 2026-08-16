import { CharacterInfo } from "./CharacterInfo";
import { MovableItem } from "./MovableItem";

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
    this.isMinimised = false;
    this.characterInfo = characterInfo;
    this.showTop = false;
  }

  toggleMinimise() {
    this.isMinimised = !this.isMinimised;
  }
}
