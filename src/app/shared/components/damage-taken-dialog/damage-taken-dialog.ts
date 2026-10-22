import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { DamageTypes } from '../../../core/models/damage-types.model';
import { DamageDialogData } from '../../models/damage-dialog-data.model';

/** Bezeichnung der Schadensart im Dialogtitel. */
const DAMAGE_TYPE_LABELS: Record<DamageTypes, string> = {
  [DamageTypes.Normal]: 'Schaden auf Rüstung',
  [DamageTypes.Critical]: 'Schaden auf Leben',
};

/**
 * Reine Auswahl eines Schadenswerts (1–100) im gemeinsamen Dialog-Look (`.general-dialog`).
 * Schließt mit der gewählten Zahl oder ohne Wert; schreibt selbst nichts.
 */
@Component({
  selector: 'app-damage-taken-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  host: { class: 'general-dialog' },
  templateUrl: './damage-taken-dialog.html',
  styleUrl: './damage-taken-dialog.css',
})
export class DamageTakenDialog {
  private readonly dialogRef: MatDialogRef<DamageTakenDialog, number> = inject(
    MatDialogRef<DamageTakenDialog, number>,
  );
  private readonly data: DamageDialogData = inject<DamageDialogData>(MAT_DIALOG_DATA);

  protected readonly title: string = `${DAMAGE_TYPE_LABELS[this.data.damageType]}: ${this.data.characterName}`;

  // Generiert das Array von 1 bis 100
  protected readonly damageOptions: number[] = Array.from({ length: 100 }, (_, i) => i + 1);

  onNoClick(): void {
    this.dialogRef.close();
  }

  confirmDamageTaken(value: number): void {
    this.dialogRef.close(value);
  }

  /** Modifier-Klasse für die Farbstufe nach Schadenshöhe (Styles in damage-taken-dialog.css). */
  getButtonColorClass(value: number): string {
    if (value <= 10) return 'damage-btn--light'; // 1 - 10: Leicht (Helles Grün)
    if (value <= 30) return 'damage-btn--moderate'; // 11 - 30: Moderat (Gelb-Grün)
    if (value <= 50) return 'damage-btn--noticeable'; // 31 - 50: Spürbar (Gelb/Orange)
    if (value <= 75) return 'damage-btn--heavy'; // 51 - 75: Schwer (Hellrot)
    return 'damage-btn--critical'; // 76 - 100: Kritisch (Dunkelrot mit weißer Schrift)
  }
}
