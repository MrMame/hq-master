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
    <h2 mat-dialog-title class="!text-xl !font-bold text-gray-800">Neuen Character erstellen/h2>
    
    <mat-dialog-content>
    </mat-dialog-content>

    <!-- Feste Aktionsleiste für den Abbruch -->
    <mat-dialog-actions align="end" class="border-t pt-2">
      <button mat-button (click)="onOkClick()" class="!text-gray-500 font-semibold">Ok</button>
      <button mat-button (click)="onNoClick()" class="!text-gray-500 font-semibold">Abbrechen</button>
    </mat-dialog-actions>
  `,
  styles: `
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
