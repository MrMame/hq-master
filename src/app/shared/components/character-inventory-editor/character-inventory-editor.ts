import { Component, input, InputSignal, output, OutputEmitterRef } from '@angular/core';
import { CardRef, InventoryCard } from '../../../core/models/deck-state.model';
import { CardDisplay } from '../card-display/card-display';

/**
 * Abschnitt „Inventar“ des Charakter-Editors unter „Ausrüstung“: Bild und Name je Karte, leer „Keine Karten
 * im Inventar“. Ein Klick meldet die Karte; der Editor öffnet sie im Card Viewer (Entwurf).
 */
@Component({
  selector: 'app-character-inventory-editor',
  imports: [CardDisplay],
  templateUrl: './character-inventory-editor.html',
  styleUrl: './character-inventory-editor.css',
})
export class CharacterInventoryEditor {
  /** Inventarkarten laut Entwurf. */
  readonly cards: InputSignal<readonly InventoryCard[]> = input<readonly InventoryCard[]>([]);
  /** Bild oder Name einer Karte wurde angeklickt. */
  readonly view: OutputEmitterRef<CardRef> = output<CardRef>();
}
