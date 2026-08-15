import { Component } from '@angular/core';
import { DragDropModule, CdkDragEnd } from '@angular/cdk/drag-drop';
import { MonsterCard} from '../monster-card/monster-card';
import { MovableItem } from '../../models/MovableItem';
import { MovableMonsterItem } from '../../models/MovableMonsterItem';


@Component({
  selector: 'app-monster-tracker-ex-page',
  imports: [DragDropModule,MonsterCard],
  templateUrl: './monster-tracker-ex-page.html',
  styleUrl: './monster-tracker-ex-page.scss',
})
export class MonsterTrackerExPage {
 // Liste der verschiebbaren Boxen mit Startpositionen
  movableMonsterItems: MovableMonsterItem[] = [
    new MovableMonsterItem(1, 'Komponente A', 50, 50, { id: 1, name: 'Monster A', type: 'Feuer', health: 100, attack: 20, defense: 10, speed: 15, abilities: ['Flammenwerfer'] ,image: './img/monster-icon-Gargoyle.png', description: 'Dies ist ein Beschreibung für Monster A.'}),
    new MovableMonsterItem(2, 'Komponente B', 300, 150, { id: 2, name: 'Monster B', type: 'Wasser', health: 120, attack: 15, defense: 25, speed: 10, abilities: ['Aquatische Angriffe'] ,image: './img/monster-icon-Gargoyle.png', description: 'Dies ist ein Beschreibung für Monster B.'}),
  ];


  addMonster() {
    const newId = this.movableMonsterItems.length + 1;
    this.movableMonsterItems.push(new MovableMonsterItem(newId, `Komponente ${newId}`, 50, 50, { id: newId, name: `Monster ${newId}`, type: 'Unbekannt', health: 100, attack: 20, defense: 10, speed: 15, abilities: [] ,image: './img/monster-icon-Gargoyle.png', description: 'Dies ist ein Beschreibung für das neue Monster.'}));

  }

  showItemOnTop(item: MovableItem) {
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
