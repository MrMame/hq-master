import { Component, input, InputSignal, output, OutputEmitterRef } from '@angular/core';
import { CardTableArea } from '../../models/card-table-area.model';

/**
 * Gruppe „Bereiche“ in der Seitenleiste: je Bereich des Hauptbereichs ein Eintrag mit Anzahl. Ein Klick meldet
 * den Bereich; leere Bereiche sind deaktiviert und nennen den Grund im Tooltip. Ändert keine Karten.
 */
@Component({
  selector: 'app-table-area-nav',
  templateUrl: './table-area-nav.html',
  styleUrl: './table-area-nav.css',
})
export class TableAreaNav {
  readonly areas: InputSignal<CardTableArea[]> = input.required<CardTableArea[]>();
  readonly selected: OutputEmitterRef<CardTableArea> = output<CardTableArea>();
}
