import { Component } from '@angular/core';

/**
 * Schnellzugriffsleiste: senkrechter Streifen links neben einer Spielfläche. Reiner Container,
 * häufige Befehle (`QuickAccessButton`, `QuickAccessDivider`, Zoom-Regler) von oben nach unten.
 */
@Component({
  selector: 'app-quick-access-bar',
  template: `<ng-content />`,
  styles: `
    :host {
      display: flex;
      flex-shrink: 0;
      flex-direction: column;
      align-items: center;
      gap: var(--space-2);
      padding: var(--space-2) var(--space-1);
      overflow-y: auto;
    }
  `,
})
export class QuickAccessBar {}
