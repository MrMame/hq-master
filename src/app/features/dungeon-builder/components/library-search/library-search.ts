import { Component, model, ModelSignal } from '@angular/core';

/** Suchfeld der Bibliothek; × und Escape leeren es. Der Begriff wird nicht gespeichert. */
@Component({
  selector: 'app-library-search',
  template: `
    <input
      type="search"
      class="library-search__input"
      aria-label="Element suchen"
      placeholder="Element suchen …"
      [value]="term()"
      (input)="onInput($event)"
      (keydown.escape)="onEscape($event)"
    />
    @if (term()) {
      <button
        type="button"
        class="library-search__clear"
        aria-label="Suche leeren"
        (click)="term.set('')"
      >
        ×
      </button>
    }
  `,
  styles: `
    :host {
      position: relative;
      display: flex;
    }

    .library-search__input {
      width: 100%;
      height: var(--space-10);
      padding: 0 var(--space-8) 0 var(--space-2);
      border: 1px solid var(--color-gray-600);
      border-radius: var(--radius-sm);
      background-color: var(--color-gray-800);
      color: var(--color-white);
      font-size: var(--text-sm);
      line-height: var(--text-sm--line-height);

      &::placeholder {
        color: var(--color-gray-400);
      }

      &:focus {
        border-color: var(--color-yellow-400);
        outline: none;
      }

      /* Eigener ×-Button statt des Browser-Kreuzes */
      &::-webkit-search-cancel-button {
        appearance: none;
      }
    }

    .library-search__clear {
      position: absolute;
      top: 0;
      right: 0;
      width: var(--space-8);
      height: var(--space-10);
      color: var(--color-gray-400);
      font-size: var(--text-lg);
      line-height: var(--text-lg--line-height);
      cursor: pointer;

      &:hover {
        color: var(--color-yellow-400);
      }
    }
  `,
})
export class LibrarySearch {
  readonly term: ModelSignal<string> = model<string>('');

  protected onInput(event: Event): void {
    this.term.set((event.target as HTMLInputElement).value);
  }

  /** Leert ein gefülltes Feld; ein leeres lässt Escape durch. */
  protected onEscape(event: Event): void {
    if (!this.term()) return;
    event.preventDefault();
    event.stopPropagation();
    this.term.set('');
  }
}
