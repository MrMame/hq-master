import {
  Component,
  computed,
  input,
  InputSignal,
  output,
  OutputEmitterRef,
  Signal,
} from '@angular/core';
import { AssignedCard, CardRef } from '../../../core/models/deck-state.model';
import {
  EQUIPMENT_SLOT_LABELS,
  EQUIPMENT_SLOTS,
  EquipmentSlot,
} from '../../../core/models/equipment.model';

interface SlotRow {
  slot: EquipmentSlot;
  label: string;
  entry: AssignedCard | undefined;
}

/**
 * Abschnitt „Ausrüstung“ des Charakter-Editors: alle Slots mit Kartenbild und Name, leere als „frei“.
 * „Ablegen“ meldet nur die Karte; der Editor legt sie erst mit „Übernehmen“ in den Ablagestapel.
 */
@Component({
  selector: 'app-character-equipment-editor',
  imports: [],
  templateUrl: './character-equipment-editor.html',
  styleUrl: './character-equipment-editor.css',
})
export class CharacterEquipmentEditor {
  /** Karten, die nach dem Übernehmen noch am Charakter liegen. */
  readonly cards: InputSignal<readonly AssignedCard[]> = input<readonly AssignedCard[]>([]);
  readonly discard: OutputEmitterRef<CardRef> = output<CardRef>();

  protected readonly rows: Signal<SlotRow[]> = computed(() =>
    EQUIPMENT_SLOTS.map((slot) => ({
      slot,
      label: EQUIPMENT_SLOT_LABELS[slot],
      entry: this.cards().find((card) => card.slot === slot),
    })),
  );
}
