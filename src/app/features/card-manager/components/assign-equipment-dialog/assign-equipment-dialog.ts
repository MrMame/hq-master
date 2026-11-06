import { Component, computed, inject, Signal, signal, WritableSignal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { AssignedCard } from '../../../../core/models/deck-state.model';
import {
  CARD_SLOT_LABELS,
  EQUIPMENT_SLOT_LABELS,
  EquipmentSlot,
} from '../../../../core/models/equipment.model';
import { slotOccupant } from '../../../../core/services/card-deck/deck-assignment.util';
import {
  preferredSlot,
  slotsForCard,
} from '../../../../core/services/equipment/equipment-slots.util';
import {
  AssignEquipmentChoice,
  AssignEquipmentDialogData,
} from '../../models/assign-equipment.model';

/**
 * Wählt den Charakter (und bei Händen links/rechts) für eine Ausrüstungskarte. Vorausgewählt ist die freie
 * Hand des gewählten Charakters. Schließt mit der Auswahl oder ohne Wert; schreibt selbst nichts.
 */
@Component({
  selector: 'app-assign-equipment-dialog',
  imports: [MatDialogModule, MatButtonModule],
  host: { class: 'general-dialog' },
  templateUrl: './assign-equipment-dialog.html',
  styleUrl: './assign-equipment-dialog.css',
})
export class AssignEquipmentDialog {
  private readonly dialogRef: MatDialogRef<AssignEquipmentDialog, AssignEquipmentChoice> = inject(
    MatDialogRef<AssignEquipmentDialog, AssignEquipmentChoice>,
  );
  protected readonly data: AssignEquipmentDialogData =
    inject<AssignEquipmentDialogData>(MAT_DIALOG_DATA);

  protected readonly cardSlotLabel: string = CARD_SLOT_LABELS[this.data.card.slot];
  protected readonly handSlots: readonly EquipmentSlot[] =
    this.data.card.slot === 'hand' ? slotsForCard('hand') : [];
  protected readonly slotLabels: Readonly<Record<EquipmentSlot, string>> = EQUIPMENT_SLOT_LABELS;

  /** Mit nur einem Charakter ist er vorausgewählt. */
  protected readonly characterId: WritableSignal<string | null> = signal<string | null>(
    this.data.characters.length === 1 ? this.data.characters[0].id : null,
  );
  /** Vom DM gewählte Hand; `null` = Vorauswahl (freie Hand). */
  private readonly chosenHand: WritableSignal<EquipmentSlot | null> = signal<EquipmentSlot | null>(
    null,
  );

  protected readonly slot: Signal<EquipmentSlot | null> = computed(() => {
    const characterId: string | null = this.characterId();
    if (characterId === null) return null;
    return this.chosenHand() ?? preferredSlot(this.data.card.slot, this.data.assigned, characterId);
  });

  /** Karte, die beim Zuweisen in den Ablagestapel käme. */
  protected readonly occupant: Signal<AssignedCard | undefined> = computed(() => {
    const characterId: string | null = this.characterId();
    const slot: EquipmentSlot | null = this.slot();
    return characterId && slot ? slotOccupant(this.data.assigned, characterId, slot) : undefined;
  });

  /** Beim Charakterwechsel gilt wieder die Vorauswahl der Hand. */
  selectCharacter(characterId: string): void {
    this.characterId.set(characterId);
    this.chosenHand.set(null);
  }

  selectHand(slot: EquipmentSlot): void {
    this.chosenHand.set(slot);
  }

  confirm(): void {
    const characterId: string | null = this.characterId();
    const slot: EquipmentSlot | null = this.slot();
    if (characterId && slot) this.dialogRef.close({ characterId, slot });
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
