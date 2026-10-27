import { Component, input, InputSignal } from '@angular/core';

/** Inhalt eines Bibliothekseintrags: Vorschaubild (oder Farbfeld), Name und Größe. */
@Component({
  selector: 'app-library-entry',
  template: `
    <span class="library-entry__preview" [style.background-color]="swatch()">
      @if (image()) {
        <img [src]="image()" alt="" draggable="false" class="library-entry__image" />
      }
    </span>
    <span class="library-entry__name">{{ name() }}</span>
    @if (size()) {
      <span class="library-entry__size">{{ size() }}</span>
    }
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--space-1);
      pointer-events: none;
    }

    .library-entry__preview {
      display: flex;
      align-items: center;
      justify-content: center;
      width: var(--space-10);
      height: var(--space-10);
      border-radius: var(--radius-sm);
    }

    .library-entry__image {
      max-width: 100%;
      max-height: 100%;
      user-select: none;
    }

    .library-entry__name {
      font-size: var(--text-xs);
      line-height: var(--text-xs--line-height);
      text-align: center;
    }

    .library-entry__size {
      color: var(--color-gray-400);
      font-size: var(--text-xs);
      line-height: var(--text-xs--line-height);
    }
  `,
})
export class LibraryEntry {
  readonly name: InputSignal<string> = input.required<string>();
  /** Grafik aus dem Katalog; leer bei einem reinen Farbfeld (z. B. Fels). */
  readonly image: InputSignal<string> = input<string>('');
  readonly swatch: InputSignal<string> = input<string>('');
  /** Größe in Kacheln, z. B. „3 × 2“. */
  readonly size: InputSignal<string> = input<string>('');
}
