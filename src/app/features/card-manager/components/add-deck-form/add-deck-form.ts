import {
  Component,
  computed,
  inject,
  linkedSignal,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { CardManagerService } from '../../../../core/services/card-deck/card-manager.service';
import { DeckCatalogService } from '../../../../core/services/card-deck/deck-catalog.service';
import { DeckCatalogEntry } from '../../../../core/models/deck-catalog-entry.model';

/**
 * Lädt ein Deck aus der Deckliste (`decks/index.json`) als neues Deck; bestehende Decks bleiben unverändert.
 * Die Auswahl bleibt nach dem Hinzufügen stehen, damit dasselbe Deck sofort noch einmal hinzugefügt werden kann.
 */
@Component({
  selector: 'app-add-deck-form',
  template: `
    <select
      #deckSelect
      class="add-deck__select"
      aria-label="Deck auswählen"
      [disabled]="entries().length === 0"
      (change)="selectedUrl.set(deckSelect.value)"
    >
      @for (entry of entries(); track entry.url) {
        <option [value]="entry.url" [selected]="entry.url === selectedUrl()">
          {{ entry.name }}
        </option>
      }
    </select>
    <button
      type="button"
      class="general-sidebar__button"
      [disabled]="isLoading() || !selectedUrl()"
      (click)="add()"
    >
      {{ isLoading() ? 'Lade …' : 'Deck hinzufügen' }}
    </button>
    @if (catalogHint(); as hint) {
      <p class="add-deck__hint" data-testid="deck-catalog-hint">{{ hint }}</p>
    }
    @if (loadError(); as error) {
      <p class="add-deck__error" data-testid="deck-load-error">{{ error }}</p>
    }
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      gap: var(--space-2);
    }

    .add-deck__select {
      min-width: 0;
      padding: var(--space-2) var(--space-3);
      border: 1px solid var(--color-gray-600);
      border-radius: var(--radius-sm);
      background-color: var(--color-gray-800);
      color: var(--color-white);
      font-size: var(--text-sm);
      line-height: var(--text-sm--line-height);
    }

    .add-deck__hint,
    .add-deck__error {
      font-size: var(--text-sm);
      line-height: var(--text-sm--line-height);
    }

    .add-deck__hint {
      color: var(--color-gray-400);
    }

    .add-deck__error {
      color: var(--color-red-400);
    }
  `,
})
export class AddDeckForm {
  private readonly cardManager: CardManagerService = inject(CardManagerService);
  private readonly catalog: DeckCatalogService = inject(DeckCatalogService);

  protected readonly entries: Signal<DeckCatalogEntry[]> = this.catalog.entries;
  /** Vorausgewählt ist der erste Eintrag; eine gültige Auswahl bleibt bestehen. */
  protected readonly selectedUrl: WritableSignal<string | null> = linkedSignal<
    DeckCatalogEntry[],
    string | null
  >({
    source: this.entries,
    computation: (entries, previous) =>
      entries.some((entry) => entry.url === previous?.value)
        ? previous!.value
        : (entries[0]?.url ?? null),
  });

  protected readonly catalogHint: Signal<string | null> = computed(() => {
    if (this.catalog.isLoading()) return 'Decks werden geladen …';
    if (this.catalog.loadError()) return 'Deckliste konnte nicht geladen werden.';
    return this.entries().length === 0 ? 'Keine Decks unter public/decks gefunden.' : null;
  });

  private readonly _isLoading: WritableSignal<boolean> = signal(false);
  protected readonly isLoading: Signal<boolean> = this._isLoading.asReadonly();
  private readonly _loadError: WritableSignal<string | null> = signal<string | null>(null);
  protected readonly loadError: Signal<string | null> = this._loadError.asReadonly();

  protected async add(): Promise<void> {
    const url: string | null = this.selectedUrl();
    if (!url) return;
    this._isLoading.set(true);
    this._loadError.set(null);
    try {
      await this.cardManager.addDeck(url);
    } catch (err) {
      this._loadError.set(err instanceof Error ? err.message : 'Deck konnte nicht geladen werden.');
    } finally {
      this._isLoading.set(false);
    }
  }
}
