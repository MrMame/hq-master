import { Component } from '@angular/core';
import { DragDropModule, CdkDragEnd } from '@angular/cdk/drag-drop';
import { MonsterCard} from '../monster-card/monster-card';

interface MovableItem {
  id: number;
  title: string;
  x: number;
  y: number;
  isMinimised:boolean;
  toggleMinimise: () => void;
  showTop:boolean;
}

@Component({
  selector: 'app-monster-tracker-ex-page',
  imports: [DragDropModule,MonsterCard],
  templateUrl: './monster-tracker-ex-page.html',
  styleUrl: './monster-tracker-ex-page.scss',
})
export class MonsterTrackerExPage {
 // Liste der verschiebbaren Boxen mit Startpositionen
  items: MovableItem[] = [
    { id: 1, title: 'Komponente A', x: 50, y: 50 ,isMinimised: false,toggleMinimise: function() { this.isMinimised = !this.isMinimised; }, showTop: false },
    { id: 2, title: 'Komponente B', x: 300, y: 150 ,isMinimised: false,toggleMinimise: function() { this.isMinimised = !this.isMinimised; }, showTop: false },
  ];

  showBoxTop(item: MovableItem) {
    this.items.forEach(i => i.showTop = false); // Setzt alle anderen Boxen auf false
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
