import { Component, inject } from '@angular/core';
import { DragDropModule, CdkDragEnd } from '@angular/cdk/drag-drop';
import { MonsterCard} from '../monster-card/monster-card';
import { MovableItem } from '../../models/MovableItem';
import { MovableMonsterItem } from '../../models/MovableMonsterItem';
import { MonsterInfo } from '../../models/MonsterInfo';

import { MonstersDbService } from '../../services/monsters-db.service';
import { Monsters } from '../../services/monsters';

@Component({
  selector: 'app-monster-tracker-ex-page',
  imports: [DragDropModule,MonsterCard],
  templateUrl: './monster-tracker-ex-page.html',
  styleUrl: './monster-tracker-ex-page.scss',
})
export class MonsterTrackerExPage {

  monsterDbService = inject(MonstersDbService);
  monstersService = inject(Monsters);

  private newMonsterCardPosition = { x: 50, y: 50 }; // Startposition für neue Monsterkarten

  movableMonsterItems: MovableMonsterItem[] = [];


  constructor() {
    this.loadMonstersFromDb();
  }


  loadMonstersFromDb() {
    const monstersFromDb: MonsterInfo[] = this.monsterDbService.getMonsters();
    this.movableMonsterItems = monstersFromDb.map((monster, index) => {
      return new MovableMonsterItem(index + 1,  50 + index * 100, 50 + index * 100, monster);
    });
  }
  addMonster() {
    const newId = this.movableMonsterItems.length + 1;
    this.movableMonsterItems.push(
      new MovableMonsterItem(
        newId,
        this.newMonsterCardPosition.x,
        this.newMonsterCardPosition.y,
        this.monstersService.CreateNewRandomMonster()
      )
    );


  }

  showMovableMonsterItemOnTop(item: MovableMonsterItem) {
    this.movableMonsterItems.forEach(i => i.showTop = false); // Setzt alle anderen Boxen auf false
    item.showTop = true;
  }

  // Diese Funktion wird aufgerufen, wenn der Drag beendet wird
  onDragEnded(event: CdkDragEnd, item: MovableItem) {
    // Holen der neuen Distanz relativ zur Startposition
    const offset = event.source.getFreeDragPosition();

    // Aktualisieren der finalen Position im Datenmodell
    item.x += offset.x;
    item.y += offset.y;

    // Setzt den internen CDK-Offset zurück, da wir die Position nun via Styles festlegen
    event.source.reset();
  }

}
