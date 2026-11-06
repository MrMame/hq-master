import { Component, inject, signal, WritableSignal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

/** Neuer Name für ein Deck. Schließt mit dem getrimmten Namen oder ohne Wert; schreibt selbst nichts. */
@Component({
  selector: 'app-rename-deck-dialog',
  imports: [MatDialogModule, MatButtonModule],
  host: { class: 'general-dialog' },
  template: `
    <h2 mat-dialog-title class="general-dialog__title">Deck umbenennen</h2>
    <mat-dialog-content>
      <input
        type="text"
        class="rename-deck__input"
        aria-label="Deckname"
        cdkFocusInitial
        [value]="name()"
        (input)="onInput($event)"
        (keydown.enter)="confirm()"
      />
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button class="general-dialog__cancel" (click)="cancel()">Abbrechen</button>
      <button
        mat-flat-button
        class="general-dialog__confirm"
        [disabled]="!name().trim()"
        (click)="confirm()"
      >
        Umbenennen
      </button>
    </mat-dialog-actions>
  `,
  styles: `
    .rename-deck__input {
      width: 100%;
      padding: var(--space-2) var(--space-3);
      border: 1px solid var(--color-gray-600);
      border-radius: var(--radius-sm);
      background-color: var(--color-gray-800);
      color: var(--color-white);

      &:focus {
        border-color: var(--color-yellow-400);
        outline: none;
      }
    }
  `,
})
export class RenameDeckDialog {
  private readonly dialogRef: MatDialogRef<RenameDeckDialog, string> = inject(
    MatDialogRef<RenameDeckDialog, string>,
  );
  protected readonly name: WritableSignal<string> = signal<string>(inject<string>(MAT_DIALOG_DATA));

  protected onInput(event: Event): void {
    this.name.set((event.target as HTMLInputElement).value);
  }

  protected confirm(): void {
    const trimmed: string = this.name().trim();
    if (trimmed) this.dialogRef.close(trimmed);
  }

  protected cancel(): void {
    this.dialogRef.close();
  }
}
