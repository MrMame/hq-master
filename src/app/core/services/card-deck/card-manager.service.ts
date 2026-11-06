import { computed, inject, Injectable, Signal } from '@angular/core';
import { PersistedState, persistedState } from '../../session-state/persisted-state';
import { SESSION_KEYS } from '../../session-state/session-keys';
import { SessionStateSlice } from '../../session-state/session-state-slice';
import { DeckXmlLoaderService } from './deck-xml-loader.service';
import { DeckConfig } from '../../models/deck-config.model';
import { AssignedCard, CardRef, DeckInstance, DeckState } from '../../models/deck-state.model';
import { EquipmentSlot } from '../../models/equipment.model';
import { DECK_STATE_CODEC } from './deck-state-codec.util';
import { assignActiveCard, discardAssigned } from './deck-assignment.util';
import { emptyDeckState } from './deck-state.util';
import {
  activateCard,
  discardActive,
  drawCard,
  dropActiveIntoBank,
  shuffleActiveIntoDrawPile,
} from './deck-draw.util';
import {
  addDeck,
  moveDeck,
  removeDeck,
  renameDeck,
  resetDeck,
  shuffleDrawPile,
} from './deck-instance.util';

/**
 * Deck-Zustand der Session: beliebig viele Deck-Instanzen mit eigenem Nachziehstapel, Ablage und Bank, die
 * eine aktive Karte und die Ausrüstungskarten in den Slots der Charaktere. Liegt in `core`, weil der
 * Charakter-Editor die Ausrüstung bearbeitet.
 */
@Injectable({ providedIn: 'root' })
export class CardManagerService implements SessionStateSlice<DeckState> {
  private readonly deckLoaderService: DeckXmlLoaderService = inject(DeckXmlLoaderService);
  // Jede Mutation setzt ein neues State-Objekt, nur so feuern abhängige Signals.
  private readonly _state: PersistedState<DeckState> = persistedState<DeckState>(
    SESSION_KEYS.deckState,
    emptyDeckState,
    DECK_STATE_CODEC,
  );

  public readonly state: Signal<DeckState> = this._state.value;
  public readonly sessionState: Signal<DeckState> = this.state;
  public readonly decks: Signal<DeckInstance[]> = computed(() => this.state().decks);
  /** Zugewiesene Ausrüstungskarten aller Decks. */
  public readonly assigned: Signal<AssignedCard[]> = computed(() => this.state().assigned);

  /** Lädt eine Deck-XML-Datei als neue Instanz am Ende des Tischs. */
  async addDeck(url: string): Promise<void> {
    this.addDeckConfig(await this.deckLoaderService.loadFromUrl(url), url);
  }

  addDeckConfig(config: DeckConfig, source: string): void {
    this.change((s) => addDeck(s, config, source, crypto.randomUUID()));
  }

  renameDeck(deckId: string, name: string): void {
    this.change((s) => renameDeck(s, deckId, name));
  }

  /** Entfernt das Deck mit Stapeln, Bank, aktiver Karte und seinen zugewiesenen Karten. */
  removeDeck(deckId: string): void {
    this.change((s) => removeDeck(s, deckId));
  }

  moveDeck(deckId: string, offset: number): void {
    this.change((s) => moveDeck(s, deckId, offset));
  }

  shuffle(deckId: string): void {
    this.change((s) => shuffleDrawPile(s, deckId));
  }

  /** Mischt Stapel, Ablage, Bank und die aktive Karte des Decks zurück; Zuweisungen bleiben. */
  resetDeck(deckId: string): void {
    this.change((s) => resetDeck(s, deckId));
  }

  /** Oberste Karte wird aktiv; eine bisher aktive kommt in den Ablagestapel ihres Decks. */
  draw(deckId: string): void {
    this.change((s) => drawCard(s, deckId));
  }

  /** Eine Karte aus Stapel, Ablage oder Bank wird aktiv; die bisherige kommt in ihren Ablagestapel. */
  makeCardActive(deckId: string, cardId: string): void {
    this.change((s) => activateCard(s, deckId, cardId));
  }

  discardActiveCard(): void {
    this.change(discardActive);
  }

  shuffleActiveCardIntoDrawPile(): void {
    this.change(shuffleActiveIntoDrawPile);
  }

  dropActiveCardIntoBank(): void {
    this.change(dropActiveIntoBank);
  }

  /** Aktive Ausrüstungskarte in den Slot; eine dort liegende Karte kommt in ihren Ablagestapel. */
  assignActiveCard(characterId: string, slot: EquipmentSlot): void {
    this.change((s) => assignActiveCard(s, characterId, slot));
  }

  /** Zugewiesene Karten aus ihren Slots in den Ablagestapel ihres Decks. */
  discardAssignedCards(refs: readonly CardRef[]): void {
    this.change((s) => discardAssigned(s, refs));
  }

  /** Ersetzt den Deck-Zustand vollständig, z. B. beim Laden einer Session. */
  restore(state: DeckState): void {
    this._state.set(state);
  }

  /** Neue Session: keine Decks. */
  reset(): void {
    this._state.set(emptyDeckState());
  }

  /** Gibt `change` den Zustand unverändert zurück, wird nicht geschrieben. */
  private change(change: (s: DeckState) => DeckState): void {
    const s: DeckState = this._state.current();
    const next: DeckState = change(s);
    if (next !== s) this._state.set(next);
  }
}
