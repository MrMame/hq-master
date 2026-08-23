import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-damage-taken-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title class="!text-xl !font-bold text-gray-800">Schaden auswählen</h2>
    
    <mat-dialog-content>
      <!-- Grid-Container für die Schadensbuttons -->
      <div class="grid grid-cols-6 sm:grid-cols-10 gap-1.5 max-h-[55vh] overflow-y-auto p-1 bg-gray-50 rounded-lg border border-gray-100">
        @for (damageValue of damageOptions; track damageValue) {
          <button 
            mat-flat-button 
            [class]="getButtonColorClass(damageValue)"
            class="damage-grid-btn text-xs font-bold transition-all duration-200 hover:scale-105 active:scale-95"
            (click)="confirmDamageTaken(damageValue)">
            {{ damageValue }}
          </button>
        }
      </div>
    </mat-dialog-content>

    <!-- Feste Aktionsleiste für den Abbruch -->
    <mat-dialog-actions align="end" class="border-t pt-2">
      <button mat-button (click)="onNoClick()" class="!text-gray-500 font-semibold">Abbrechen</button>
    </mat-dialog-actions>
  `,
  styles: [`
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
  `]
})
export class DamageTakenDialog {
  private dialogRef = inject(MatDialogRef<DamageTakenDialog>);

  // Generiert das Array von 1 bis 100
  protected readonly damageOptions = Array.from({ length: 100 }, (_, i) => i + 1);

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  confirmDamageTaken(value: number): void {
    this.dialogRef.close(value);
  }

  /**
   * Ermittelt die Tailwind-Farbklassen basierend auf der Schadenshöhe
   */
  getButtonColorClass(value: number): string {
    if (value <= 10) {
      // 1 - 10: Leicht (Helles Grün)
      return '!bg-green-100 !text-green-800 hover:!bg-green-200';
    } else if (value <= 30) {
      // 11 - 30: Moderat (Gelb-Grün)
      return '!bg-lime-100 !text-lime-800 hover:!bg-lime-200';
    } else if (value <= 50) {
      // 31 - 50: Spürbar (Gelb/Orange)
      return '!bg-amber-100 !text-amber-800 hover:!bg-amber-200';
    } else if (value <= 75) {
      // 51 - 75: Schwer (Hellrot)
      return '!bg-orange-200 !text-orange-900 hover:!bg-orange-300';
    } else {
      // 76 - 100: Kritisch (Dunkelrot mit weißer Schrift)
      return '!bg-red-600 !text-white hover:!bg-red-700';
    }
  }
}
