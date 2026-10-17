import { computed, inject, Injectable, Signal } from '@angular/core';
import { GameTimeService } from '../../../core/services/game-time/game-time.service';
import { GameTime } from '../../../core/models/game-time.model';
import { CharactersDbService } from '../../../core/services/characters/characters-db.service';
import {
  PersistedState,
  persistedState,
  StorageCodec,
} from '../../../core/session-state/persisted-state';
import { SESSION_KEYS } from '../../../core/session-state/session-keys';
import { SessionSliceData, SessionSlices } from '../../../core/session-state/session-slices';
import { CardManagerService } from '../../card-manager/services/card-manager.service';
import { DungeonBoardService } from '../../dungeon-tracker/services/dungeon-board.service';
import { CharacterCardLayoutService } from '../../character-tracker/services/character-card-layout.service';
import { DEFAULT_SESSION_META, SessionMeta } from '../models/session-meta.model';
import { SessionSnapshot } from '../models/session-snapshot.model';

/** Ältere oder unvollständige Einträge werden mit den Defaults ergänzt. */
const SESSION_META_CODEC: StorageCodec<SessionMeta> = {
  encode: (value: SessionMeta): SessionMeta => value,
  decode: (stored: unknown): SessionMeta | null =>
    typeof stored === 'object' && stored !== null
      ? { ...DEFAULT_SESSION_META, ...(stored as Partial<SessionMeta>) }
      : null,
};

export interface SessionStartOptions {
  name: string;
  startTime: GameTime;
}

/**
 * Steuert den Lebenszyklus der Spielesession (Starten, Beenden, Laden).
 * Fremde Zustände werden ausschließlich über den `SessionStateSlice`-Vertrag
 * der jeweils verantwortlichen Services gelesen und ersetzt.
 */
@Injectable({
  providedIn: 'root',
})
export class GameSessionService {
  private readonly gameTimeService: GameTimeService = inject(GameTimeService);

  private readonly slices: SessionSlices = {
    gameTime: this.gameTimeService,
    characters: inject(CharactersDbService),
    dungeon: inject(DungeonBoardService),
    deck: inject(CardManagerService),
    characterCards: inject(CharacterCardLayoutService),
  };

  // Die Meta gehört dem Orchestrator selbst und ist kein Slice.
  private readonly _meta: PersistedState<SessionMeta> = persistedState<SessionMeta>(
    SESSION_KEYS.sessionMeta,
    () => ({ ...DEFAULT_SESSION_META }),
    SESSION_META_CODEC,
  );

  // REACTIVE INTERFACES ===============================================================================

  readonly meta: Signal<SessionMeta> = this._meta.value;

  /** Feature-übergreifender Gesamtzustand, z. B. für das Speichern als XML. */
  readonly snapshot: Signal<SessionSnapshot> = computed(() => ({
    meta: this.meta(),
    gameTime: this.slices.gameTime.sessionState(),
    characters: this.slices.characters.sessionState(),
    dungeon: this.slices.dungeon.sessionState(),
    deck: this.slices.deck.sessionState(),
    characterCards: this.slices.characterCards.sessionState(),
  }));

  // PUBLICS ===============================================================================

  /** Setzt alle Feature-Zustände zurück und startet eine neue Session zur gewählten Ingame-Zeit. */
  startSession({ name, startTime }: SessionStartOptions): void {
    this.sliceKeys().forEach((key) => this.slices[key].reset());
    this.gameTimeService.setGameTime(startTime);
    this._meta.set({ name, active: true, startedAt: new Date().toISOString() });
  }

  /** Markiert die Session als beendet; alle Daten bleiben erhalten (z. B. zum Speichern). */
  endSession(): void {
    this._meta.update((meta) => ({ ...meta, active: false }));
  }

  restoreSnapshot(snapshot: SessionSnapshot): void {
    this.sliceKeys().forEach((key) => this.restoreSlice(key, snapshot));
    this._meta.set({ ...snapshot.meta });
  }

  // PRIVATES ===============================================================================

  private restoreSlice<K extends keyof SessionSliceData>(key: K, data: SessionSliceData): void {
    this.slices[key].restore(data[key]);
  }

  private sliceKeys(): (keyof SessionSlices)[] {
    return Object.keys(this.slices) as (keyof SessionSlices)[];
  }
}
