import { Component, inject, Signal, signal, WritableSignal } from '@angular/core';
import { CardManagerService } from '../../../../core/services/card-deck/card-manager.service';

const DEFAULT_DECK_URL: string = 'decks/default/default-deck.xml';

/** Lädt eine Deck-XML-Datei als neues Deck; bestehende Decks bleiben unverändert. */
@Component({
  selector: 'app-add-deck-form',
  template: `
    <input
      #urlInput
      type="text"
      class="add-deck__input"
      aria-label="Pfad der Deck-Datei"
      [placeholder]="defaultUrl"
      [value]="defaultUrl"
    />
    <button
      type="button"
      class="general-sidebar__button"
      [disabled]="isLoading()"
      (click)="add(urlInput.value)"
    >
      {{ isLoading() ? 'Lade …' : 'Deck hinzufügen' }}
    </button>
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

    .add-deck__input {
      min-width: 0;
      padding: var(--space-2) var(--space-3);
      border: 1px solid var(--color-gray-600);
      border-radius: var(--radius-sm);
      background-color: var(--color-gray-800);
      color: var(--color-white);
      font-size: var(--text-sm);
      line-height: var(--text-sm--line-height);
    }

    .add-deck__error {
      color: var(--color-red-400);
      font-size: var(--text-sm);
      line-height: var(--text-sm--line-height);
    }
  `,
})
export class AddDeckForm {
  private readonly cardManager: CardManagerService = inject(CardManagerService);
  protected readonly defaultUrl: string = DEFAULT_DECK_URL;

  private readonly _isLoading: WritableSignal<boolean> = signal(false);
  protected readonly isLoading: Signal<boolean> = this._isLoading.asReadonly();
  private readonly _loadError: WritableSignal<string | null> = signal<string | null>(null);
  protected readonly loadError: Signal<string | null> = this._loadError.asReadonly();

  protected async add(url: string): Promise<void> {
    const trimmed: string = url.trim();
    if (!trimmed) return;
    this._isLoading.set(true);
    this._loadError.set(null);
    try {
      await this.cardManager.addDeck(trimmed);
    } catch (err) {
      this._loadError.set(err instanceof Error ? err.message : 'Deck konnte nicht geladen werden.');
    } finally {
      this._isLoading.set(false);
    }
  }
}
