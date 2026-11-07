import { Component, inject, signal, WritableSignal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { GiveToInventoryDialogData } from '../../models/give-to-inventory.model';

/**
 * Wählt den Charakter, in dessen Inventar eine Karte kommt. Mit nur einem Charakter ist er vorausgewählt.
 * Schließt mit der Charakter-ID oder ohne Wert; schreibt selbst nichts.
 */
@Component({
  selector: 'app-give-to-inventory-dialog',
  imports: [MatDialogModule, MatButtonModule],
  host: { class: 'general-dialog' },
  templateUrl: './give-to-inventory-dialog.html',
  styleUrl: './give-to-inventory-dialog.css',
})
export class GiveToInventoryDialog {
  private readonly dialogRef: MatDialogRef<GiveToInventoryDialog, string> = inject(
    MatDialogRef<GiveToInventoryDialog, string>,
  );
  protected readonly data: GiveToInventoryDialogData =
    inject<GiveToInventoryDialogData>(MAT_DIALOG_DATA);

  protected readonly characterId: WritableSignal<string | null> = signal<string | null>(
    this.data.characters.length === 1 ? this.data.characters[0].id : null,
  );

  confirm(): void {
    const characterId: string | null = this.characterId();
    if (characterId) this.dialogRef.close(characterId);
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
