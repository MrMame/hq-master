// confirmation-dialog.component.ts
import { Component, inject } from '@angular/core';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-confirmation-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>Auswahl treffen</h2>
    <mat-dialog-content>Möchten Sie diese Aktion wirklich ausführen?</mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onNoClick()">Abbrechen</button>
      <button mat-raised-button color="primary" [mat-dialog-close]="true">Bestätigen</button>
    </mat-dialog-actions>
  `
})
export class ConfirmationDialogComponent {
  // MatDialogRef nutzen, um den Dialog aus dem Code heraus zu steuern
  private dialogRef = inject(MatDialogRef<ConfirmationDialogComponent>);

  onNoClick(): void {
    this.dialogRef.close(false); // Gibt 'false' zurück
  }
}
