import {
  Component,
  computed,
  input,
  InputSignal,
  output,
  OutputEmitterRef,
  Signal,
} from '@angular/core';
import { CarriedKind } from '../../../core/models/card-location.model';
import { CardRef, InventoryCard } from '../../../core/models/deck-state.model';
import { CardDisplay } from '../card-display/card-display';

/** Überschrift und Leertext je Ort. */
const TEXTS: Readonly<Record<CarriedKind, { caption: string; empty: string }>> = {
  inventory: { caption: 'Inventar', empty: 'Keine Karten im Inventar' },
  belt: { caption: 'Gürtel', empty: 'Keine Karten im Gürtel' },
};

/**
 * Abschnitt „Inventar“ bzw. (`kind` = `belt`) „Gürtel“ des Charakter-Editors unter „Ausrüstung“: Bild und Name je
 * Karte, leer „Keine Karten im Inventar“ bzw. „… im Gürtel“. Ein Klick meldet die Karte; der Editor öffnet sie im
 * Card Viewer (Entwurf).
 */
@Component({
  selector: 'app-character-inventory-editor',
  imports: [CardDisplay],
  templateUrl: './character-inventory-editor.html',
  styleUrl: './character-inventory-editor.css',
})
export class CharacterInventoryEditor {
  /** Karten dieses Orts laut Entwurf. */
  readonly cards: InputSignal<readonly InventoryCard[]> = input<readonly InventoryCard[]>([]);
  readonly kind: InputSignal<CarriedKind> = input<CarriedKind>('inventory');
  protected readonly texts: Signal<{ caption: string; empty: string }> = computed(
    () => TEXTS[this.kind()],
  );
  /** Bild oder Name einer Karte wurde angeklickt. */
  readonly view: OutputEmitterRef<CardRef> = output<CardRef>();
}
