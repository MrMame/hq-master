import { Component, inject } from '@angular/core';
import { DragDropModule, CdkDragEnd } from '@angular/cdk/drag-drop';
import { CharacterCard} from '../character-card/character-card';
import { MovableItem } from '../../models/MovableItem';
import { MovableCharacterItem } from '../../models/MovableCharacterItem';
import { CharacterInfo } from '../../models/CharacterInfo';

import { CharactersDbService } from '../../services/databases/characters-database-service';
import { MonsterCharacterCreatorService } from '../../services/character-creators/monster-character-creator-service';
import { HeroCharacterCreatorService } from '../../services/character-creators/hero-character-creator-service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog';

import { DamageTypes } from '../../models/DamageTypes';
import { DamageTakenDialog } from '../damage-taken-dialog/damage-taken-dialog';

@Component({
  selector: 'app-monster-tracker-page',
  imports: [DragDropModule,CharacterCard],
  templateUrl: './character-tracker-page.html',
  styleUrl: './character-tracker-page.scss',
})
export class CharacterTrackerPage {

  // Enum DamageTypes importieren und in der HTML-Komponente verfügbar machen
  DamageTypes = DamageTypes;
  
  monsterDbService = inject(CharactersDbService);
  monstersService = inject(MonsterCharacterCreatorService);
  herosService = inject(HeroCharacterCreatorService);
  dialog = inject(MatDialog); // Service injizieren

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
    this.movableCharacterItems.push(
      new MovableCharacterItem(
        newId,
        this.newCharacterCardPosition.x,
        this.newCharacterCardPosition.y,
        this.herosService.CreateNewRandomHero()
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

  debugNachrichtAusgeben() {
    console.log('Der Knopf wurde gedrückt!');
  }

  removeMovableCharacteritem(item: MovableCharacterItem) {
    const itemToRemove: MovableCharacterItem = item; 
    this.movableCharacterItems = this.movableCharacterItems.filter(
      item => item !== itemToRemove
    );

  } 

  openDialog(): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px' // Optionale Konfiguration der Breite
    });

    // Ergebnis nach dem Schließen abfangen
    dialogRef.afterClosed().subscribe(result => {
      console.log('Der Dialog wurde geschlossen. Ergebnis:', result);
      if (result === true) {
        // Logik für "Bestätigen"
      }
    });
  }



  openDamageTakenDialog(damageType: DamageTypes,movableCharacterItem:MovableCharacterItem): void {
    const dialogRef = this.dialog.open(DamageTakenDialog, {
      width: '350px' // Optionale Konfiguration der Breite
    });

    // Ergebnis nach dem Schließen abfangen
    dialogRef.afterClosed().subscribe(result => {
      console.log('Der Dialog wurde geschlossen. Ergebnis:', result);
      if (result !== false) {
        // Logik für "Bestätigen"
        switch(damageType){
          case DamageTypes.Normal:
            movableCharacterItem.characterInfo.armor -= result;
            break;
            case DamageTypes.Critical:
            movableCharacterItem.characterInfo.health -= result;
            break;
        }
      }
    });
  }



}
