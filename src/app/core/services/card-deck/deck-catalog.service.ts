import { HttpClient } from '@angular/common/http';
import { inject, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { DeckCatalogEntry } from '../../models/deck-catalog-entry.model';
import { readDeckCatalog } from './deck-catalog.util';

/** Deckliste; relativ zur `base href`, damit sie auch unter GitHub Pages lädt. */
export const DECK_CATALOG_URL: string = 'decks/index.json';

/**
 * Lädt die Liste der bereitgestellten Decks einmal beim Start (root) und stellt sie als Signal bereit.
 * Gehört nicht zur Spielesession und nicht zum XML-Spielstand.
 */
@Injectable({
  providedIn: 'root',
})
export class DeckCatalogService {
  private readonly http: HttpClient = inject(HttpClient);

  private readonly _entries: WritableSignal<DeckCatalogEntry[]> = signal<DeckCatalogEntry[]>([]);
  private readonly _isLoading: WritableSignal<boolean> = signal(true);
  private readonly _loadError: WritableSignal<string | null> = signal<string | null>(null);

  readonly entries: Signal<DeckCatalogEntry[]> = this._entries.asReadonly();
  readonly isLoading: Signal<boolean> = this._isLoading.asReadonly();
  readonly loadError: Signal<string | null> = this._loadError.asReadonly();

  constructor() {
    void this.load();
  }

  private async load(): Promise<void> {
    try {
      const catalog: unknown = await firstValueFrom(this.http.get<unknown>(DECK_CATALOG_URL));
      this._entries.set(readDeckCatalog(catalog));
    } catch (error: unknown) {
      console.warn('Deckliste konnte nicht geladen werden.', error);
      this._loadError.set('Deckliste konnte nicht geladen werden.');
    } finally {
      this._isLoading.set(false);
    }
  }
}
