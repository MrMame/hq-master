import { Component } from '@angular/core';

/**
 * Großes rotes Kreuz über dem Bild eines Charakters mit 0 Leben (Token und Legende).
 * Füllt den nächsten positionierten Vorfahren und lässt Klicks und Ziehen zum Bild darunter durch.
 */
@Component({
  selector: 'app-dead-marker',
  host: { role: 'img', 'aria-label': 'Tot', title: 'Tot' },
  template: `
    <svg viewBox="0 0 100 100" class="dead-marker__cross" aria-hidden="true">
      <line x1="18" y1="18" x2="82" y2="82" />
      <line x1="82" y1="18" x2="18" y2="82" />
    </svg>
  `,
  styleUrl: './dead-marker.css',
})
export class DeadMarker {}
