import { inject, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { StorageService } from '../../../core/services/persistent/storage-service';
import { DeckXmlLoaderService } from './deck-xml-loader.service';
import { Card } from '../models/card.model';
import { DeckConfig } from '../models/deck-config.model';
import { DeckState } from '../models/deck-state.model';

const KEY_DECK_STATE: string = 'card_manager_deck_state';

@Injectable({ providedIn: 'root' })
export class CardManagerService {
  // PRIVATE INJECTIONS ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  private readonly storageService     : StorageService        = inject(StorageService);
  private readonly deckLoaderService  : DeckXmlLoaderService  = inject(DeckXmlLoaderService);
  // PRIVATE SIGNALS ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  private readonly _state: WritableSignal<DeckState | null> = signal<DeckState | null>(
    this.storageService.readFromLocalStorage<DeckState>(KEY_DECK_STATE),
  );



  // PUBLIC SIGNALS =====================================================================
  public readonly state: Signal<DeckState | null> = this._state.asReadonly();


  // PUBLIC METHODS =====================================================================
  async loadDeck(url: string): Promise<void> {
    const config: DeckConfig = await this.deckLoaderService.loadFromUrl(url);
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

  discardActiveCard(): void {
    const s: DeckState | null = this._state();
    if (!s || !s.activeCard) return;
    this.setState({
      ...s,
      discardPile: [...s.discardPile,s.activeCard],
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

  makeCardActive(cardId: string): void {
    // Falls bereits ein Aktive Karte, wirf zuerst ab
    this.discardActiveCard();
    const s: DeckState | null = this._state();
    if (!s) return;

    const all: Card[] = collectAll(s);
    const card: Card | undefined = all.find((c: Card) => c.id === cardId);
    if (!card) return;
    const drawPile: Card[] = s.drawPile.filter((c: Card) => c.id !== cardId);
    const discardPile: Card[] = s.discardPile.filter((c: Card) => c.id !== cardId);
    this.setState({ ...s, drawPile, discardPile, activeCard: card });
  }

  public shuffleActiveCardIntoDrawPile(): void {
    const s: DeckState | null = this._state();
    if (!s || !s.activeCard) return;
    const drawPile: Card[] = this.fisherYates([...s.drawPile, s.activeCard]);
    this.setState({ ...s, drawPile, activeCard: null });
  }

  // PRIVATES =====================================================================


  // Set State muss am Ende immer gesetzt werden, damit das _State Objekt komplett erneuert wird. 
  // Nur dadurch bekommt das Angular Signal-System mit, dass sich der Wert geändert hat.
  private setState(s: DeckState): void {
    this._state.set(s);
    this.storageService.writeToLocalStorage(KEY_DECK_STATE, s);
  }

  // Fisher-Yates Shuffle Algorithm
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
