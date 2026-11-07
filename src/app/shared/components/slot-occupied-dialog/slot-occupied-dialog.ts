import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { SlotOccupiedChoice, SlotOccupiedDialogData } from '../../models/slot-occupied.model';

/**
 * Rückfrage beim Anlegen in einen belegten Slot: Die bisherige Karte kommt ins Inventar des Charakters oder
 * in den Ablagestapel ihres Decks; „Abbrechen“ (Fokus beim Öffnen) schließt ohne Wert.
 */
@Component({
  selector: 'app-slot-occupied-dialog',
  imports: [MatDialogModule, MatButtonModule],
  host: { class: 'general-dialog' },
  template: `
    <h2 mat-dialog-title class="general-dialog__title">Slot belegt</h2>
    <mat-dialog-content>
      Wohin kommt „{{ data.cardName }}“ von {{ data.characterName }}?
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button class="general-dialog__cancel" (click)="close()">Abbrechen</button>
      <button mat-button class="general-dialog__confirm" (click)="close('discardPile')">
        In den Ablagestapel
      </button>
      <button mat-flat-button class="general-dialog__confirm" (click)="close('inventory')">
        Ins Inventar
      </button>
    </mat-dialog-actions>
  `,
})
export class SlotOccupiedDialog {
  private readonly dialogRef: MatDialogRef<SlotOccupiedDialog, SlotOccupiedChoice> = inject(
    MatDialogRef<SlotOccupiedDialog, SlotOccupiedChoice>,
  );
  protected readonly data: SlotOccupiedDialogData = inject<SlotOccupiedDialogData>(MAT_DIALOG_DATA);

  protected close(choice?: SlotOccupiedChoice): void {
    this.dialogRef.close(choice);
  }
}
