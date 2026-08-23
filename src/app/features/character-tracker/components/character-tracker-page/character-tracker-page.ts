import { Component, inject , signal} from '@angular/core';
import { DragDropModule, CdkDragEnd } from '@angular/cdk/drag-drop';
import { CharacterCard} from '../character-card/character-card';
import { MovableItem } from '../../models/MovableItem';
import { MovableCharacterItem } from '../../models/MovableCharacterItem';
import { CharacterInfo } from '../../models/CharacterInfo';

import { CharactersDbService } from '../../services/databases/characters-database-service';
import { MonsterCharacterCreatorService } from '../../services/character-creators/monster-character-creator-service';
import { HeroCharacterCreatorService } from '../../services/character-creators/hero-character-creator-service';
import { CombatCalculatorService } from '../../services/combat-calculator'

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
  combatService = inject(CombatCalculatorService);
  dialog = inject(MatDialog); // Service injizieren

  private newCharacterCardPosition = { x: 50, y: 50 }; // Startposition für neue Monsterkarten

  movableCharacterItems = signal<MovableCharacterItem[]>([]);


  constructor() {
    this.loadMonstersFromDb();
  }


     loadMonstersFromDb() {
    const monstersFromDb: CharacterInfo[] = this.monsterDbService.getMonsters();
    const items = monstersFromDb.map((monster, index) => {
      return new MovableCharacterItem(index + 1, 50 + index * 100, 50 + index * 100, monster);
    });
    // 3. Signal-Wert setzen
    this.movableCharacterItems.set(items);
  }
    addMonster() {
    const newId = this.movableCharacterItems().length + 1;
    const newItem = new MovableCharacterItem(
      newId,
      this.newCharacterCardPosition.x,
      this.newCharacterCardPosition.y,
      this.monstersService.CreateNewRandomMonster()
    );
    // 4. Signal updaten (erstellt neues Array-Inhalt)
    this.movableCharacterItems.update(items => [...items, newItem]);
  }
  addHero() {
    const newId = this.movableCharacterItems().length + 1;
    const newItem = new MovableCharacterItem(
      newId,
      this.newCharacterCardPosition.x,
      this.newCharacterCardPosition.y,
      this.herosService.CreateNewRandomHero()
    );
    this.movableCharacterItems.update(items => [...items, newItem]);
  }

  showMovableCharacterItemOnTop(item: MovableCharacterItem) {
    // Über das Signal mappen
    this.movableCharacterItems.update(items => {
      items.forEach(i => i.showTop = false);
      item.showTop = true;
      return [...items]; // Gibt eine neue Array-Referenz zurück
    });
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


  removeMovableCharacteritem(item: MovableCharacterItem) {
    this.movableCharacterItems.update(items => items.filter(i => i !== item));
  }




  openDamageTakenDialog(damageType: DamageTypes, movableCharacterItem: MovableCharacterItem): void {
    const dialogRef = this.dialog.open(DamageTakenDialog, { width: '350px' });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined && result !== false) {
        /* 5. Hier triggern wir die UI-Aktualisierung via .update()
          Angular wouldn't recognize chaning values deeply inside Arrays. The trick is to
          change the values deeply, then create a compltee new copy of the array and return it
          ( return [...items]; ). Angular reccognize the whole new array and updates the UI
        */
        this.movableCharacterItems.update(items => {
          // switch(damageType) {
          //   case DamageTypes.Normal:
          //     movableCharacterItem.characterInfo.armor -= result;
          //     break;
          //   case DamageTypes.Critical:
          //     movableCharacterItem.characterInfo.health -= result;
          //     break;
          // }
          this.combatService.applyDamage(movableCharacterItem,damageType,result);

          // Gibt ein flach kopiertes Array zurück, damit Angular die Änderung bemerkt
          return [...items]; 
        });

      }
    });
  }



}
