import { inject, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { StorageService } from '../../../core/services/persistent/storage-service';
import { DeckXmlLoaderService } from './deck-xml-loader.service';
import { Card } from '../models/card.model';
import { DeckConfig } from '../models/deck-config.model';
import { DeckState } from '../models/deck-state.model';

const KEY_DECK_STATE: string = 'card_manager_deck_state';

@Injectable({ providedIn: 'root' })
export class CardManagerService {
  private readonly storage: StorageService = inject(StorageService);
  private readonly xmlLoader: DeckXmlLoaderService = inject(DeckXmlLoaderService);

  private readonly _state: WritableSignal<DeckState | null> = signal<DeckState | null>(
    this.storage.readFromLocalStorage<DeckState>(KEY_DECK_STATE),
  );

  readonly state: Signal<DeckState | null> = this._state.asReadonly();

  async loadDeck(url: string): Promise<void> {
    const config: DeckConfig = await this.xmlLoader.loadFromUrl(url);
    const newState: DeckState = {
      config,
      drawPile: this.fisherYates([...config.cards]),
      discardPile: [],
      activeCard: null,
    };
    this.setState(newState);
  }

  shuffle(): void {
    const s: DeckState | null = this._state();
    if (!s) return;
    this.setState({ ...s, drawPile: this.fisherYates([...s.drawPile]) });
  }

  draw(): void {
    const s: DeckState | null = this._state();
    if (!s || s.drawPile.length === 0) return;
    const [activeCard, ...drawPile] = s.drawPile;
    this.setState({ ...s, drawPile, activeCard });
  }

  discard(): void {
    const s: DeckState | null = this._state();
    if (!s || !s.activeCard) return;
    this.setState({
      ...s,
      discardPile: [s.activeCard, ...s.discardPile],
      activeCard: null,
    });
  }

  reset(): void {
    const s: DeckState | null = this._state();
    if (!s) return;
    const all: Card[] = collectAll(s);
    this.setState({ ...s, drawPile: this.fisherYates(all), discardPile: [], activeCard: null });
  }

  loadDeckConfig(config: DeckConfig): void {
    const newState: DeckState = {
      config,
      drawPile: this.fisherYates([...config.cards]),
      discardPile: [],
      activeCard: null,
    };
    this.setState(newState);
  }

  private setState(s: DeckState): void {
    this._state.set(s);
    this.storage.writeToLocalStorage(KEY_DECK_STATE, s);
  }

  private fisherYates<T>(arr: T[]): T[] {
    for (let i: number = arr.length - 1; i > 0; i--) {
      const j: number = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }
}

function collectAll(s: DeckState): Card[] {
  const active: Card[] = s.activeCard ? [s.activeCard] : [];
  return [...s.drawPile, ...s.discardPile, ...active];
}
