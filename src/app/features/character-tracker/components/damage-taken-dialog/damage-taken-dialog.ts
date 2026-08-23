import { Component,inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { DamageTypes } from '../../models/DamageTypes';

@Component({
  selector: 'app-damage-taken-dialog',
  imports: [MatDialogModule, MatButtonModule],
  standalone:true,
   template: `
    <h2 mat-dialog-title>Auswahl treffen</h2>
    <mat-dialog-content>Möchten Sie diese Aktion wirklich ausführen?</mat-dialog-content>
    <mat-dialog-content align="end">
      <button mat-button (click)="onNoClick()">Abbrechen</button>
      <button mat-raised-button color="primary" [mat-dialog-close]="true" (click)="confirmDamageTaken(1)">1</button>
      <button mat-raised-button color="primary" [mat-dialog-close]="true" (click)="confirmDamageTaken(2)">2</button>
      <button mat-raised-button color="primary" [mat-dialog-close]="true" (click)="confirmDamageTaken(3)">3</button>
    </mat-dialog-content>
  `
})
export class DamageTakenDialog {

  private dialogRef = inject(MatDialogRef<DamageTakenDialog>);


  onNoClick(): void {
    this.dialogRef.close(false); // Gibt 'false' zurück
  }

  confirmDamageTaken(value:number): void {
    this.dialogRef.close(value); // Gibt 'false' zurück
  }

}
