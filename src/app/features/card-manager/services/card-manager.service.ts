import { inject, Injectable, Signal } from '@angular/core';
import { PersistedState, persistedState } from '../../../core/session-state/persisted-state';
import { SESSION_KEYS } from '../../../core/session-state/session-keys';
import { SessionStateSlice } from '../../../core/session-state/session-state-slice';
import { DeckXmlLoaderService } from './deck-xml-loader.service';
import { Card } from '../models/card.model';
import { DeckConfig } from '../models/deck-config.model';
import { DeckState } from '../models/deck-state.model';

@Injectable({ providedIn: 'root' })
export class CardManagerService implements SessionStateSlice<DeckState | null> {
  // PRIVATE INJECTIONS ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  private readonly deckLoaderService: DeckXmlLoaderService = inject(DeckXmlLoaderService);
  // PRIVATE SIGNALS ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // Jede Mutation setzt ein neues State-Objekt, nur so feuern abhängige Signals.
  private readonly _state: PersistedState<DeckState | null> = persistedState<DeckState | null>(
    SESSION_KEYS.deckState,
    () => null,
  );

  // PUBLIC SIGNALS =====================================================================
  public readonly state: Signal<DeckState | null> = this._state.value;
  public readonly sessionState: Signal<DeckState | null> = this.state;

  // PUBLIC METHODS =====================================================================
  async loadDeck(url: string): Promise<void> {
    this.loadDeckConfig(await this.deckLoaderService.loadFromUrl(url));
  }

  shuffle(): void {
    const s: DeckState | null = this._state.current();
    if (!s) return;
    this._state.set({ ...s, drawPile: this.fisherYates([...s.drawPile]) });
  }

  draw(): void {
    const s: DeckState | null = this._state.current();
    if (!s || s.drawPile.length === 0) return;
    const [activeCard, ...drawPile] = s.drawPile;
    this._state.set({ ...s, drawPile, activeCard });
  }

  discardActiveCard(): void {
    const s: DeckState | null = this._state.current();
    if (!s || !s.activeCard) return;
    this._state.set({
      ...s,
      discardPile: [...s.discardPile, s.activeCard],
      activeCard: null,
    });
  }

  /** Mischt alle Karten (Stapel, Ablage, aktive Karte, Bank) zurück in den Ziehstapel. */
  reshuffleAll(): void {
    const s: DeckState | null = this._state.current();
    if (!s) return;
    const all: Card[] = collectAll(s);
    this._state.set({
      ...s,
      drawPile: this.fisherYates(all),
      discardPile: [],
      activeCard: null,
      bank: [],
    });
  }

  loadDeckConfig(config: DeckConfig): void {
    const newState: DeckState = {
      config,
      drawPile: this.fisherYates([...config.cards]),
      discardPile: [],
      activeCard: null,
      bank: [],
    };
    this._state.set(newState);
  }

  makeCardActive(cardId: string): void {
    // Falls bereits ein Aktive Karte, wirf zuerst ab
    this.discardActiveCard();
    const s: DeckState | null = this._state.current();
    if (!s) return;

    const all: Card[] = collectAll(s);
    const card: Card | undefined = all.find((c: Card) => c.id === cardId);
    if (!card) return;
    const drawPile: Card[] = s.drawPile.filter((c: Card) => c.id !== cardId);
    const discardPile: Card[] = s.discardPile.filter((c: Card) => c.id !== cardId);
    const bank: Card[] = s.bank.filter((c: Card) => c.id !== cardId);
    this._state.set({
      ...s,
      drawPile: drawPile,
      discardPile: discardPile,
      activeCard: card,
      bank: bank,
    });
  }

  public shuffleActiveCardIntoDrawPile(): void {
    const s: DeckState | null = this._state.current();
    if (!s || !s.activeCard) return;
    const drawPile: Card[] = this.fisherYates([...s.drawPile, s.activeCard]);
    this._state.set({ ...s, drawPile, activeCard: null });
  }

  public dropActiveCardIntoBank(): void {
    const s: DeckState | null = this._state.current();
    if (!s || !s.activeCard) return;
    const bank: Card[] = [...s.bank, s.activeCard];
    this._state.set({ ...s, bank, activeCard: null });
  }

  /** Ersetzt den Deck-Zustand vollständig (`null` = kein Deck), z. B. beim Laden einer Session. */
  public restore(state: DeckState | null): void {
    this._state.set(state);
  }

  /** Neue Session: kein Deck geladen. */
  public reset(): void {
    this._state.set(null);
  }

  // PRIVATES =====================================================================

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
  return [...s.drawPile, ...s.discardPile, ...active, ...s.bank];
}
