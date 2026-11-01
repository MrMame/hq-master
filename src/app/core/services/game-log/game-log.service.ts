import { Injectable, Signal } from '@angular/core';
import { GameLogEntry, NewGameLogEntry } from '../../models/game-log-entry.model';
import { PersistedState, persistedState } from '../../session-state/persisted-state';
import { SESSION_KEYS } from '../../session-state/session-keys';
import { SessionStateSlice } from '../../session-state/session-state-slice';
import { GAME_LOG_CODEC } from './game-log-codec.util';

/** Höchstzahl gespeicherter Einträge; die ältesten fallen zuerst weg, damit der LocalStorage klein bleibt. */
export const GAME_LOG_LIMIT: number = 1000;

/**
 * Ereignis-Log der Spielesession in Anhängereihenfolge. Andere Services schreiben nur über `append()`.
 */
@Injectable({
  providedIn: 'root',
})
export class GameLogService implements SessionStateSlice<GameLogEntry[]> {
  private readonly _entries: PersistedState<GameLogEntry[]> = persistedState<GameLogEntry[]>(
    SESSION_KEYS.gameLog,
    () => [],
    GAME_LOG_CODEC,
  );
  /** Zählt innerhalb derselben Millisekunde hoch, damit IDs eindeutig bleiben. */
  private sequence: number = 0;

  readonly entries: Signal<GameLogEntry[]> = this._entries.value;
  readonly sessionState: Signal<GameLogEntry[]> = this.entries;

  append(...entries: NewGameLogEntry[]): void {
    if (entries.length === 0) return;
    const created: GameLogEntry[] = entries.map((entry) => ({ id: this.nextId(), ...entry }));
    this._entries.update((current) => [...current, ...created].slice(-GAME_LOG_LIMIT));
  }

  clear(): void {
    this._entries.set([]);
  }

  restore(entries: GameLogEntry[]): void {
    this._entries.set(entries.slice(-GAME_LOG_LIMIT));
  }

  reset(): void {
    this.clear();
  }

  private nextId(): string {
    this.sequence += 1;
    return `${Date.now().toString(36)}-${this.sequence}`;
  }
}
