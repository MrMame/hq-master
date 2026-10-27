import { Component, model, ModelSignal } from '@angular/core';

/**
 * Senkrechter Zoom-Regler im schmalen Streifen links neben dem Spielbrett (oben = größer).
 * Reiner Anzeigezustand: Der Wert wird nicht gespeichert.
 */
@Component({
  selector: 'app-board-zoom-control',
  standalone: true,
  template: `
    <label class="zoom-control">
      <span class="zoom-control__value">{{ (zoom() * 100).toFixed(0) }} %</span>
      <input
        type="range"
        min="1"
        max="4"
        step="0.1"
        aria-label="Zoom"
        class="zoom-control__slider"
        [value]="zoom()"
        (input)="zoom.set(+$any($event.target).value)"
      />
    </label>
  `,
  styles: `
    .zoom-control {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--space-2);
      padding: var(--space-2) var(--space-1);
      border-radius: var(--radius-md);
      background-color: color-mix(in oklab, var(--color-general-sidebar) 80%, transparent);
      color: var(--color-white);
      font-size: var(--text-xs);
      line-height: var(--text-xs--line-height);
    }

    .zoom-control__value {
      min-width: var(--space-10);
      text-align: center;
    }

    /* Senkrecht, oben = größer */
    .zoom-control__slider {
      writing-mode: vertical-lr;
      direction: rtl;
      height: calc(var(--space-10) * 4);
      accent-color: var(--color-yellow-400);
      cursor: pointer;
    }
  `,
})
export class BoardZoomControl {
  /** 1 = Brett passt in den sichtbaren Bereich, 4 = 400 %. */
  readonly zoom: ModelSignal<number> = model<number>(1);
}
