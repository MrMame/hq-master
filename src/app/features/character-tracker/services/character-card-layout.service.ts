import { effect, EffectRef, inject, Injectable, Signal } from '@angular/core';
import { Point } from '@angular/cdk/drag-drop';
import { CharactersDbService } from '../../../core/services/characters/characters-db.service';
import { PersistedState, persistedState } from '../../../core/session-state/persisted-state';
import { SESSION_KEYS } from '../../../core/session-state/session-keys';
import { SessionStateSlice } from '../../../core/session-state/session-state-slice';
import { CharacterInfo } from '../../../core/models/character-info.model';
import {
  CardLayout,
  CardLayoutState,
  DEFAULT_CARD_LAYOUT,
  DEFAULT_CARD_LAYOUT_STATE,
} from '../models/card-layout.model';

const CARD_STAGGER_PX: number = 100;

/**
 * Hält Position, Minimierung und Stapelreihenfolge der Charakterkarten. Das Layout gehört
 * zur Spielesession, damit die Karten nach Reload und Laden eines Spielstands dort liegen,
 * wo der DM sie abgelegt hat.
 */
@Injectable({
  providedIn: 'root',
})
export class CharacterCardLayoutService implements SessionStateSlice<CardLayoutState> {
  private readonly charactersDbService: CharactersDbService = inject(CharactersDbService);

  private readonly _layout: PersistedState<CardLayoutState> = persistedState<CardLayoutState>(
    SESSION_KEYS.characterCardLayout,
    () => ({ ...DEFAULT_CARD_LAYOUT_STATE }),
  );

  readonly layout: Signal<CardLayoutState> = this._layout.value;
  readonly sessionState: Signal<CardLayoutState> = this.layout;

  // Neue Charaktere bekommen ein Layout, gelöschte verlieren ihres.
  private readonly syncWithCharacters: EffectRef = effect(() =>
    this.syncCards(this.charactersDbService.characters()),
  );

  layoutFor(characterId: string): CardLayout {
    return this.layout().cards[characterId] ?? DEFAULT_CARD_LAYOUT;
  }

  isOnTop(characterId: string): boolean {
    return this.layout().topCardId === characterId;
  }

  moveBy(characterId: string, offset: Point): void {
    this.updateCard(characterId, (card) => ({
      ...card,
      x: card.x + offset.x,
      y: card.y + offset.y,
    }));
  }

  toggleMinimised(characterId: string): void {
    this.updateCard(characterId, (card) => ({ ...card, isMinimised: !card.isMinimised }));
  }

  bringToFront(characterId: string): void {
    if (this._layout.current().topCardId === characterId) return;
    this._layout.update((layout) => ({ ...layout, topCardId: characterId }));
  }

  restore(layout: CardLayoutState): void {
    this._layout.set({ cards: { ...layout.cards }, topCardId: layout.topCardId });
  }

  reset(): void {
    this.restore(DEFAULT_CARD_LAYOUT_STATE);
  }

  private updateCard(characterId: string, change: (card: CardLayout) => CardLayout): void {
    this._layout.update((layout) => ({
      ...layout,
      cards: {
        ...layout.cards,
        [characterId]: change(layout.cards[characterId] ?? DEFAULT_CARD_LAYOUT),
      },
    }));
  }

  private syncCards(characters: CharacterInfo[]): void {
    const { cards, topCardId }: CardLayoutState = this._layout.current();
    const ids: string[] = characters.map((c) => c.id);
    const isInSync: boolean =
      ids.length === Object.keys(cards).length && ids.every((id) => id in cards);
    if (isInSync) return;

    const synced: Record<string, CardLayout> = {};
    ids.forEach((id, index) => (synced[id] = cards[id] ?? this.staggeredLayout(index)));
    this._layout.set({
      cards: synced,
      topCardId: topCardId !== null && topCardId in synced ? topCardId : null,
    });
  }

  private staggeredLayout(index: number): CardLayout {
    const offset: number = index * CARD_STAGGER_PX;
    return {
      ...DEFAULT_CARD_LAYOUT,
      x: DEFAULT_CARD_LAYOUT.x + offset,
      y: DEFAULT_CARD_LAYOUT.y + offset,
    };
  }
}
