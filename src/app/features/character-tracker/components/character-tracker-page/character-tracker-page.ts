import { Component, inject , signal} from '@angular/core';
import { DragDropModule, CdkDragEnd } from '@angular/cdk/drag-drop';
import { CharacterCard} from '../character-card/character-card';
import { MovableItem } from '../../models/MovableItem';
import { MovableCharacterItem } from '../../models/MovableCharacterItem';
import { CharacterInfo } from '../../models/CharacterInfo';

import { CharactersDbService } from '../../../../core/services/persitents/characters-database-service';
import { MonsterCharacterCreatorService } from '../../services/character-creators/monster-character-creator-service';
import { HeroCharacterCreatorService } from '../../services/character-creators/hero-character-creator-service';
import { CombatCalculatorService } from '../../services/combat-calculator'

import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog';

import { DamageTypes } from '../../models/DamageTypes';
import { DamageTakenDialog } from '../damage-taken-dialog/damage-taken-dialog';
import { AddCharacterDialog } from '../add-character-dialog/add-character-dialog';

@Component({
  selector: 'app-monster-tracker-page',
  imports: [DragDropModule,CharacterCard],
  templateUrl: './character-tracker-page.html',
  styleUrl: './character-tracker-page.scss',
})
export class CharacterTrackerPage {

  // Enum DamageTypes importieren und in der HTML-Komponente verfügbar machen
  DamageTypes = DamageTypes;
  charactersDbService = inject(CharactersDbService);
  monsterCharacterCreatorService = inject(MonsterCharacterCreatorService);
  heroCharacterCreatorService = inject(HeroCharacterCreatorService);
  combatCalculatorService = inject(CombatCalculatorService);
  dialog = inject(MatDialog); // Service injizieren

  private newCharacterCardPosition = { x: 50, y: 50 }; // Startposition für neue Monsterkarten

  movableCharacterItems = signal<MovableCharacterItem[]>([]);


  constructor() {
    this.loadMonstersFromDb();
  }


  loadMonstersFromDb() {
    const charactersFromDb: CharacterInfo[] = this.charactersDbService.readCharacters() || this.monsterCharacterCreatorService.getInitMonsterCharacters();
    const items = charactersFromDb.map((character, index) => {
      return new MovableCharacterItem(index + 1, 50 + index * 100, 50 + index * 100, character);
    });
    // 3. Signal-Wert setzen
    this.movableCharacterItems.set(items);
  }
  addMonster() {
    const newId = this.movableCharacterItems().length + 1;
    const newMonster = this.monsterCharacterCreatorService.CreateNewRandomMonster();
    this.charactersDbService.writeCharacter(newMonster);
    const newItem = new MovableCharacterItem(
      newId,
      this.newCharacterCardPosition.x,
      this.newCharacterCardPosition.y,
      newMonster
    );
    // 4. Signal updaten (erstellt neues Array-Inhalt)
    this.movableCharacterItems.update(items => [...items, newItem]);
  }
  addHero() {
    const newId = this.movableCharacterItems().length + 1;
    const newCharacter = this.heroCharacterCreatorService.CreateNewRandomHero();
    this.charactersDbService.writeCharacter(newCharacter);
    const newItem = new MovableCharacterItem(
      newId,
      this.newCharacterCardPosition.x,
      this.newCharacterCardPosition.y,
      newCharacter
    );
    this.movableCharacterItems.update(items => [...items, newItem]);
  }
  addCharacter(){
    const dialogRef = this.dialog.open(AddCharacterDialog, { width: '80vw', maxWidth: '80vw' ,height: '80vh', maxHeight: '80vh'});
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined && result !== false) {
        const newId = this.movableCharacterItems().length + 1;
        const newItem = new MovableCharacterItem(
          newId,
          this.newCharacterCardPosition.x,
          this.newCharacterCardPosition.y,
          { ...result, id: newId }
        );
        this.movableCharacterItems.update(items => [...items, newItem]);
      }
    });
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
    // Remove Characterinfo From Database
    this.charactersDbService.removeCharacter(item.characterInfo);
    // Remove Movable Card
    this.movableCharacterItems.update(items => items.filter(i => i !== item));
  }




openDamageTakenDialog(damageType: DamageTypes, movableCharacterItem: MovableCharacterItem): void {
  const dialogRef = this.dialog.open(DamageTakenDialog, { 
    width: '80vw', maxWidth: '80vw', height: '80vh', maxHeight: '80vh'
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result !== undefined && result !== false) {
      
      // 1. Berechnung durchführen (verändert die Werte im Objekt)
      this.combatCalculatorService.applyDamage(movableCharacterItem, damageType, result);

      // 2. Das übergeordnete Signal mit neuen Referenzen updaten
      this.movableCharacterItems.update(items => {
        return items.map(item => {
          if (item.id === movableCharacterItem.id) {
            
            // WICHTIG: Wir weisen characterInfo eine frische Objekt-Kopie zu.
            // Nur so bemerken das übergeordnete Signal UND die CharacterCard die Änderung!
            item.characterInfo = { ...item.characterInfo };
            
            // Optional: Wenn du eine Klasse statt eines Interfaces nutzt, 
            // kannst du das gesamte Item klonen, falls nötig:
            // return Object.assign(Object.create(Object.getPrototypeOf(item)), item);
          }
          return item;
        });
      });

      // 3. Den aktualisierten Zustand sofort in die Datenbank schreiben
      this.charactersDbService.writeCharacter(movableCharacterItem.characterInfo);
    }
  });
}


// Diese Methode in die Klasse CharacterTrackerPage einfügen:
updateCharacterInList(itemId: number, updatedInfo: CharacterInfo|undefined) {
   // Wenn das Event fehlerhaft oder leer ist, brechen wir ab
  if (!updatedInfo) return; 
  this.movableCharacterItems.update(items => {
    return items.map(item => {
      if (item.id === itemId) {
        // Wir weisen die neue Objektreferenz zu
        item.characterInfo = updatedInfo;
        this.charactersDbService.writeCharacter(updatedInfo);

      }
      return item;
    });
  });
}



}
