import { Component, inject, Signal, signal, WritableSignal } from '@angular/core';
import { CardManagerService } from '../../services/card-manager.service';
import { DeckState } from '../../models/deck-state.model';
import { CardDisplay } from '../card-display/card-display';

@Component({
  selector: 'app-card-manager-page',
  imports: [CardDisplay],
  templateUrl: './card-manager-page.html',
  styleUrl: './card-manager-page.scss',
})
export class CardManagerPage {
  private readonly cardManagerService: CardManagerService = inject(CardManagerService);

  readonly state: Signal<DeckState | null> = this.cardManagerService.state;

  private readonly _isLoading: WritableSignal<boolean> = signal(false);
  readonly isLoading: Signal<boolean> = this._isLoading.asReadonly();

  private readonly _loadError: WritableSignal<string | null> = signal<string | null>(null);
  readonly loadError: Signal<string | null> = this._loadError.asReadonly();

  async onLoadDeck(url: string): Promise<void> {
    const trimmed: string = url.trim();
    if (!trimmed) return;
    this._isLoading.set(true);
    this._loadError.set(null);
    try {
      await this.cardManagerService.loadDeck(trimmed);
    } catch (err) {
      this._loadError.set(err instanceof Error ? err.message : 'Deck konnte nicht geladen werden.');
    } finally {
      this._isLoading.set(false);
    }
  }
}
