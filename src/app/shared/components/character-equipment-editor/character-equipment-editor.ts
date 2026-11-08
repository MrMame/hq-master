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
import { CardDisplay } from '../card-display/card-display';

interface SlotRow {
  slot: EquipmentSlot;
  label: string;
  entry: AssignedCard | undefined;
}

/**
 * Abschnitt „Ausrüstung“ des Charakter-Editors: alle Slots mit Kartenbild und Name, leere als „frei“.
 * Ein Klick auf Bild oder Name meldet die Karte; der Editor öffnet sie im Card Viewer (Entwurf).
 */
@Component({
  selector: 'app-character-equipment-editor',
  imports: [CardDisplay],
  templateUrl: './character-equipment-editor.html',
  styleUrl: './character-equipment-editor.css',
})
export class CharacterEquipmentEditor {
  /** Karten, die nach dem Übernehmen noch am Charakter liegen. */
  readonly cards: InputSignal<readonly AssignedCard[]> = input<readonly AssignedCard[]>([]);
  /** Bild oder Name einer Karte wurde angeklickt. */
  readonly view: OutputEmitterRef<CardRef> = output<CardRef>();

  protected readonly rows: Signal<SlotRow[]> = computed(() =>
    EQUIPMENT_SLOTS.map((slot) => ({
      slot,
      label: EQUIPMENT_SLOT_LABELS[slot],
      entry: this.cards().find((card) => card.slot === slot),
    })),
  );
}
