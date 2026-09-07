import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';

import { CharacterInfo } from '../../models/CharacterInfo';
import { MonsterCharacterCreatorService } from '../../services/character-creators/monster-character-creator-service';



@Component({
  selector: 'app-add-character-dialog',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogModule
  ],
  template: `
    <h2 mat-dialog-title class="!text-xl !font-bold text-gray-800">Neuen Character erstellen</h2>
    
    <mat-dialog-content>
      <div class="flex flex-col gap-4">
        <p class="text-gray-600">Monstertyp</p>
      </div>
      <div class="flex flex-row gap-4 p-4 overflow-x-auto">
        <img src="img/monster-icon-ChaosWarrior.png" alt="" class="monster-image ">
        <img src="img/monster-icon-FimirAbomination.png" alt="" class="monster-image" >
        <img src="img/monster-icon-Gargoyle.png" alt="" class="monster-image" >
        <img src="img/monster-icon-Goblin.png" alt="" class="monster-image" >
        <img src="img/monster-icon-Hexer.png" alt="" class="monster-image">
        <img src="img/monster-icon-Mummy.png" alt="" class="monster-image">
        <img src="img/monster-icon-Orc.png" alt="" class="monster-image">
        <img src="img/monster-icon-Skeleton.png" alt="" class="monster-image">
        <img src="img/monster-icon-Zombie.png" alt="" class="monster-image">
      </div>
      <div class="flex flex-row gap-2 p-4">
        <button mat-button (click)="onOkClick()" class="difficulty-btn !bg-gray-200 hover:!bg-gray-300 !text-gray-800">Leicht</button>
        <button mat-button (click)="onOkClick()" class="difficulty-btn !bg-gray-200 hover:!bg-gray-300 !text-gray-800">Mittel</button>
        <button mat-button (click)="onOkClick()" class="difficulty-btn !bg-gray-200 hover:!bg-gray-300 !text-gray-800">Schwer</button>
        <button mat-button (click)="onOkClick()" class="difficulty-btn !bg-gray-200 hover:!bg-gray-300 !text-gray-800">Extrem</button>
      </div>
      <div class="flex flex-row gap-2 p-4">
        <div class="selectable-color-box !bg-red-500"></div>
        <div class="selectable-color-box !bg-blue-500"></div>
        <div class="selectable-color-box !bg-green-500"></div>
        <div class="selectable-color-box !bg-pink-500"></div>
        <div class="selectable-color-box !bg-white-500"></div>
        <div class="selectable-color-box !bg-yellow-500"></div>
        <div class="selectable-color-box !bg-yellow-700"></div>
        <div class="selectable-color-box !bg-pink-900"></div>
      </div>
    </mat-dialog-content>

    <!-- Feste Aktionsleiste für den Abbruch -->
    <mat-dialog-actions align="end" class="border-t pt-2">
      <button mat-button (click)="onOkClick()" class="!text-gray-500 font-semibold">Ok</button>
      <button mat-button (click)="onNoClick()" class="!text-gray-500 font-semibold">Abbrechen</button>
    </mat-dialog-actions>
  `,
  styles: `
  .selectable-color-box {
    width: 32px;
    height: 32px;
    border-radius: 4px;
    border: 2px solid #ccc;
    cursor: pointer;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }

  .selectable-color-box:hover {
    transform: scale(1.1);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
  .monster-image {
    width: 64px;
    height: 64px;
    object-fit: scale-down;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }

  .monster-image:hover {
    transform: scale(1.1);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
      /* Das Geheimnis für winzige, quadratische Material-Buttons */
    .damage-grid-btn {
      /* Überschreibt die harten Material-Vorgaben vollständig */
      min-width: 0 !important;
      min-height: 0 !important;
      padding: 0 !important;
      
      /* Macht den Button perfekt quadratisch */
      width: 100% !important;
      aspect-ratio: 1 / 1 !important;
      
      /* Sorgt dafür, dass der Text trotz der geringen Größe zentriert bleibt */
      display: inline-flex !important;
      align-items: center !important;
      justify-content: center !important;
      border-radius: 6px !important;
    }
  `,
})
export class AddCharacterDialog {

  monstersService = inject(MonsterCharacterCreatorService);

  private dialogRef = inject(MatDialogRef<AddCharacterDialog>);

// Generiert das Array von 1 bis 100
  protected readonly damageOptions = Array.from({ length: 100 }, (_, i) => i + 1);

  onNoClick(): void {
    this.dialogRef.close(false);
  }
  onOkClick(): void {
    let newMonster : CharacterInfo = this.monstersService.CreateNewRandomMonster();
    this.dialogRef.close(newMonster);
  }



}
