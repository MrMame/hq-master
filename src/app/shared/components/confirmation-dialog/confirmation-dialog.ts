import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { ConfirmationDialogData } from '../../models/confirmation-dialog-data.model';

/** Texte, wenn der Aufrufer keine eigenen übergibt. */
const DEFAULT_TEXTS: Required<ConfirmationDialogData> = {
  title: 'Auswahl treffen',
  message: 'Möchten Sie diese Aktion wirklich ausführen?',
  confirmLabel: 'Bestätigen',
};

/**
 * Rückfrage im gemeinsamen Dialog-Look (`.general-dialog`). Schließt mit `true` (bestätigt) oder
 * `false` (abgebrochen); „Abbrechen“ hat beim Öffnen den Fokus.
 */
@Component({
  selector: 'app-confirmation-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  host: { class: 'general-dialog' },
  template: `
    <h2 mat-dialog-title class="general-dialog__title">{{ title }}</h2>
    <mat-dialog-content>{{ message }}</mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button class="general-dialog__cancel" (click)="onNoClick()">Abbrechen</button>
      <button mat-flat-button class="general-dialog__confirm" [mat-dialog-close]="true">
        {{ confirmLabel }}
      </button>
    </mat-dialog-actions>
  `,
})
export class ConfirmationDialog {
  private dialogRef: MatDialogRef<ConfirmationDialog> = inject(MatDialogRef<ConfirmationDialog>);
  private readonly data: ConfirmationDialogData =
    inject<ConfirmationDialogData | null>(MAT_DIALOG_DATA, { optional: true }) ?? {};

  protected readonly title: string = this.data.title ?? DEFAULT_TEXTS.title;
  protected readonly message: string = this.data.message ?? DEFAULT_TEXTS.message;
  protected readonly confirmLabel: string = this.data.confirmLabel ?? DEFAULT_TEXTS.confirmLabel;

  onNoClick(): void {
    this.dialogRef.close(false);
  }
}
