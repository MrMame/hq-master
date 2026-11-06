import { Component, input, InputSignal, model, ModelSignal } from '@angular/core';

/** Suchfeld (z. B. Bibliothek, Deckliste); × und Escape leeren es. Der Begriff wird nicht gespeichert. */
@Component({
  selector: 'app-search-field',
  template: `
    <input
      type="search"
      class="search-field__input"
      [attr.aria-label]="label()"
      [placeholder]="label() + ' …'"
      [value]="term()"
      (input)="onInput($event)"
      (keydown.escape)="onEscape($event)"
    />
    @if (term()) {
      <button
        type="button"
        class="search-field__clear"
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

    .search-field__input {
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

    .search-field__clear {
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
export class SearchField {
  /** Beschriftung und Platzhalter, z. B. „Element suchen“. */
  readonly label: InputSignal<string> = input.required<string>();
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
