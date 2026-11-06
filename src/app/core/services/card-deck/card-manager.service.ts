import { computed, inject, Injectable, Signal } from '@angular/core';
import { PersistedState, persistedState } from '../../session-state/persisted-state';
import { SESSION_KEYS } from '../../session-state/session-keys';
import { SessionStateSlice } from '../../session-state/session-state-slice';
import { DeckXmlLoaderService } from './deck-xml-loader.service';
import { Card } from '../../models/card.model';
import { DeckConfig } from '../../models/deck-config.model';
import { AssignedCard, DeckState } from '../../models/deck-state.model';
import { EquipmentSlot } from '../../models/equipment.model';
import { DECK_STATE_CODEC } from './deck-state-codec.util';
import { assignActiveCard, discardAssigned, unassignedCards } from './deck-assignment.util';

/**
 * Deck-Zustand der Session: Nachziehstapel, Ablage, aktive Karte, Bank und die Ausrüstungskarten in den
 * Slots der Charaktere. Liegt in `core`, weil der Charakter-Editor die Ausrüstung bearbeitet.
 */
@Injectable({ providedIn: 'root' })
export class CardManagerService implements SessionStateSlice<DeckState | null> {
  private readonly deckLoaderService: DeckXmlLoaderService = inject(DeckXmlLoaderService);
  // Jede Mutation setzt ein neues State-Objekt, nur so feuern abhängige Signals.
  private readonly _state: PersistedState<DeckState | null> = persistedState<DeckState | null>(
    SESSION_KEYS.deckState,
    () => null,
    DECK_STATE_CODEC,
  );

  public readonly state: Signal<DeckState | null> = this._state.value;
  public readonly sessionState: Signal<DeckState | null> = this.state;
  /** Zugewiesene Ausrüstungskarten; ohne Deck leer. */
  public readonly assigned: Signal<AssignedCard[]> = computed(() => this.state()?.assigned ?? []);

  async loadDeck(url: string): Promise<void> {
    this.loadDeckConfig(await this.deckLoaderService.loadFromUrl(url));
  }

  shuffle(): void {
    this.updateDeck((s) => ({ ...s, drawPile: this.fisherYates([...s.drawPile]) }));
  }

  draw(): void {
    this.updateDeck((s) => {
      if (s.drawPile.length === 0) return s;
      const [activeCard, ...drawPile] = s.drawPile;
      return { ...s, drawPile, activeCard };
    });
  }

  discardActiveCard(): void {
    this.updateDeck((s) =>
      s.activeCard ? { ...s, discardPile: [...s.discardPile, s.activeCard], activeCard: null } : s,
    );
  }

  /** Mischt Stapel, Ablage, aktive Karte und Bank zurück in den Ziehstapel; Zuweisungen bleiben. */
  reshuffleAll(): void {
    this.updateDeck((s) => ({
      ...s,
      drawPile: this.fisherYates(unassignedCards(s)),
      discardPile: [],
      activeCard: null,
      bank: [],
    }));
  }

  /** Neues Deck: alle Karten im Ziehstapel, bisherige Zuweisungen sind verworfen. */
  loadDeckConfig(config: DeckConfig): void {
    this._state.set({
      config,
      drawPile: this.fisherYates([...config.cards]),
      discardPile: [],
      activeCard: null,
      bank: [],
      assigned: [],
    });
  }

  /** Eine bisher aktive Karte kommt zuerst in den Ablagestapel; zugewiesene Karten bleiben im Slot. */
  makeCardActive(cardId: string): void {
    this.discardActiveCard();
    this.updateDeck((s) => {
      const card: Card | undefined = unassignedCards(s).find((c) => c.id === cardId);
      if (!card) return s;
      const others: (cards: Card[]) => Card[] = (cards) => cards.filter((c) => c.id !== cardId);
      return {
        ...s,
        drawPile: others(s.drawPile),
        discardPile: others(s.discardPile),
        bank: others(s.bank),
        activeCard: card,
      };
    });
  }

  public shuffleActiveCardIntoDrawPile(): void {
    this.updateDeck((s) =>
      s.activeCard
        ? { ...s, drawPile: this.fisherYates([...s.drawPile, s.activeCard]), activeCard: null }
        : s,
    );
  }

  public dropActiveCardIntoBank(): void {
    this.updateDeck((s) =>
      s.activeCard ? { ...s, bank: [...s.bank, s.activeCard], activeCard: null } : s,
    );
  }

  /** Aktive Ausrüstungskarte in den Slot; eine dort liegende Karte kommt in den Ablagestapel. */
  public assignActiveCard(characterId: string, slot: EquipmentSlot): void {
    this.updateDeck((s) => assignActiveCard(s, characterId, slot));
  }

  /** Zugewiesene Karten aus ihren Slots in den Ablagestapel. */
  public discardAssignedCards(cardIds: readonly string[]): void {
    this.updateDeck((s) => discardAssigned(s, cardIds));
  }

  /** Ersetzt den Deck-Zustand vollständig (`null` = kein Deck), z. B. beim Laden einer Session. */
  public restore(state: DeckState | null): void {
    this._state.set(state);
  }

  /** Neue Session: kein Deck geladen. */
  public reset(): void {
    this._state.set(null);
  }

  /** Ohne Deck passiert nichts; gibt `change` den Zustand unverändert zurück, wird nicht geschrieben. */
  private updateDeck(change: (s: DeckState) => DeckState): void {
    const s: DeckState | null = this._state.current();
    if (!s) return;
    const next: DeckState = change(s);
    if (next !== s) this._state.set(next);
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
