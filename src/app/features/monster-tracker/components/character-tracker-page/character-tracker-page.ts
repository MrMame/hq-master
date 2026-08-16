import { Component, inject } from '@angular/core';
import { DragDropModule, CdkDragEnd } from '@angular/cdk/drag-drop';
import { CharacterCard} from '../character-card/character-card';
import { MovableItem } from '../../models/MovableItem';
import { MovableCharacterItem } from '../../models/MovableCharacterItem';
import { CharacterInfo } from '../../models/CharacterInfo';

import { CharactersDbService } from '../../services/CharactersDbService';
import { MonsterCharacterCreatorService } from '../../services/MonsterCharacterCreatorService';

@Component({
  selector: 'app-monster-tracker-page',
  imports: [DragDropModule,CharacterCard],
  templateUrl: './character-tracker-page.html',
  styleUrl: './character-tracker-page.scss',
})
export class CharacterTrackerPage {

  monsterDbService = inject(CharactersDbService);
  monstersService = inject(MonsterCharacterCreatorService);

  private newCharacterCardPosition = { x: 50, y: 50 }; // Startposition für neue Monsterkarten

  movableCharacterItems: MovableCharacterItem[] = [];


  constructor() {
    this.loadMonstersFromDb();
  }


  loadMonstersFromDb() {
    const monstersFromDb: CharacterInfo[] = this.monsterDbService.getMonsters();
    this.movableCharacterItems = monstersFromDb.map((monster, index) => {
      return new MovableCharacterItem(index + 1,  50 + index * 100, 50 + index * 100, monster);
    });
  }
  addMonster() {
    const newId = this.movableCharacterItems.length + 1;
    this.movableCharacterItems.push(
      new MovableCharacterItem(
        newId,
        this.newCharacterCardPosition.x,
        this.newCharacterCardPosition.y,
        this.monstersService.CreateNewRandomMonster()
      )
    );
  }
  addHero() {
    const newId = this.movableCharacterItems.length + 1;
    const hero: CharacterInfo = {
      id: `hero-${newId}`,
      name: `Hero ${newId}`,
      type: 'Hero',
      health: 100,
      attack: 20,
      defense: 15,
      speed: 10,
      abilities: ['Slash', 'Shield Block'],
      image: 'path/to/hero/image.png',
      description: 'A brave hero ready to fight monsters.'
    };
    this.movableCharacterItems.push(
      new MovableCharacterItem(
        newId,
        this.newCharacterCardPosition.x,
        this.newCharacterCardPosition.y,
        hero
      )
    );
  }

  showMovableCharacterItemOnTop(item: MovableCharacterItem) {
    this.movableCharacterItems.forEach(i => i.showTop = false); // Setzt alle anderen Boxen auf false
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
