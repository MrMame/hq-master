import { inject, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { StorageService } from '../../../core/services/persistent/storage-service';
import { Card } from '../models/card.model';
import { DeckConfig } from '../models/deck-config.model';
import { STAGING_SLOT_COUNT, StagingSlot } from '../models/card-deck-state.model';

const KEY_DRAW: string = 'card_deck_draw';
const KEY_DISCARD: string = 'card_deck_discard';
const KEY_STAGING: string = 'card_deck_staging';
const KEY_DECK: string = 'card_deck_config';

@Injectable({ providedIn: 'root' })
export class CardDeckService {
  private readonly storageService: StorageService = inject(StorageService);

  private readonly _drawPile: WritableSignal<Card[]> = signal(
    this.storageService.readFromLocalStorage<Card[]>(KEY_DRAW) ?? []
  );
  private readonly _discardPile: WritableSignal<Card[]> = signal(
    this.storageService.readFromLocalStorage<Card[]>(KEY_DISCARD) ?? []
  );
  private readonly _stagingSlots: WritableSignal<StagingSlot[]> = signal(
    this.storageService.readFromLocalStorage<StagingSlot[]>(KEY_STAGING) ??
    Array(STAGING_SLOT_COUNT).fill(null)
  );
  private readonly _currentDeck: WritableSignal<DeckConfig | null> = signal(
    this.storageService.readFromLocalStorage<DeckConfig>(KEY_DECK) ?? null
  );

  readonly drawPile: Signal<Card[]> = this._drawPile.asReadonly();
  readonly discardPile: Signal<Card[]> = this._discardPile.asReadonly();
  readonly stagingSlots: Signal<StagingSlot[]> = this._stagingSlots.asReadonly();
  readonly currentDeck: Signal<DeckConfig | null> = this._currentDeck.asReadonly();

  loadDeck(config: DeckConfig): void {
    this._currentDeck.set(config);
    this._drawPile.set(this.shuffle([...config.cards]));
    this._discardPile.set([]);
    this._stagingSlots.set(Array(STAGING_SLOT_COUNT).fill(null));
    this.persist();
  }

  drawCard(): void {
    const draw: Card[] = this._drawPile();
    if (draw.length === 0) {
      this.reshuffleDiscardToDraw();
      return;
    }
    const [top, ...rest]: Card[] = draw;
    this._drawPile.set(rest);
    this._discardPile.update((d: Card[]) => [top, ...d]);
    this.persistPiles();
  }

  reshuffleDiscardToDraw(): void {
    const discard: Card[] = this._discardPile();
    if (discard.length === 0) return;
    this._drawPile.update((d: Card[]) => [...d, ...this.shuffle(discard)]);
    this._discardPile.set([]);
    this.persistPiles();
  }

  shuffleDrawPile(): void {
    this._drawPile.update((d: Card[]) => this.shuffle(d));
    this.persistPiles();
  }

  shuffleDiscardPile(): void {
    this._discardPile.update((d: Card[]) => this.shuffle(d));
    this.persistPiles();
  }

  combineAndShuffle(): void {
    const staging: Card[] = this._stagingSlots().filter((s: StagingSlot): s is Card => s !== null);
    const all: Card[] = [...this._drawPile(), ...this._discardPile(), ...staging];
    this._drawPile.set(this.shuffle(all));
    this._discardPile.set([]);
    this._stagingSlots.set(Array(STAGING_SLOT_COUNT).fill(null));
    this.persist();
  }

  moveInStaging(fromSlot: number, toSlot: number): void {
    if (fromSlot === toSlot) return;
    this._stagingSlots.update((slots: StagingSlot[]) => {
      const updated: StagingSlot[] = [...slots];
      [updated[fromSlot], updated[toSlot]] = [updated[toSlot], updated[fromSlot]];
      return updated;
    });
    this.persist();
  }

  moveFromDiscardToStaging(card: Card, slotIndex: number): void {
    this._discardPile.update((d: Card[]) => d.filter((c: Card) => c.id !== card.id));
    this._stagingSlots.update((slots: StagingSlot[]) => {
      const updated: StagingSlot[] = [...slots];
      updated[slotIndex] = card;
      return updated;
    });
    this.persist();
  }

  returnFromStagingToDiscard(slotIndex: number): void {
    const card: StagingSlot = this._stagingSlots()[slotIndex];
    if (!card) return;
    this._discardPile.update((d: Card[]) => [card, ...d]);
    this.clearSlot(slotIndex);
    this.persist();
  }

  returnFromStagingToDrawPile(slotIndex: number): void {
    const card: StagingSlot = this._stagingSlots()[slotIndex];
    if (!card) return;
    this._drawPile.update((d: Card[]) => this.shuffle([...d, card]));
    this.clearSlot(slotIndex);
    this.persist();
  }

  private clearSlot(slotIndex: number): void {
    this._stagingSlots.update((slots: StagingSlot[]) => {
      const updated: StagingSlot[] = [...slots];
      updated[slotIndex] = null;
      return updated;
    });
  }

  private shuffle<T>(arr: T[]): T[] {
    const a: T[] = [...arr];
    for (let i: number = a.length - 1; i > 0; i--) {
      const j: number = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  private persist(): void {
    this.persistPiles();
    this.storageService.writeToLocalStorage(KEY_STAGING, this._stagingSlots());
    this.storageService.writeToLocalStorage(KEY_DECK, this._currentDeck());
  }

  private persistPiles(): void {
    this.storageService.writeToLocalStorage(KEY_DRAW, this._drawPile());
    this.storageService.writeToLocalStorage(KEY_DISCARD, this._discardPile());
  }
}
