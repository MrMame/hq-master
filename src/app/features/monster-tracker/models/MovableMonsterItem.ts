import { MonsterInfo } from "./MonsterInfo";
import { MovableItem } from "./MovableItem";

export class MovableMonsterItem implements MovableItem {
  id: number;
  title: string;
  x: number;
  y: number;
  isMinimised: boolean;
  showTop: boolean;
  monsterInfo: MonsterInfo;

  constructor(id: number, title: string, x: number, y: number, monsterInfo: MonsterInfo) {
    this.id = id;
    this.title = title;
    this.x = x;
    this.y = y;
    this.isMinimised = false;
    this.monsterInfo = monsterInfo;
    this.showTop = false;
  }

  toggleMinimise() {
    this.isMinimised = !this.isMinimised;
  }
}
