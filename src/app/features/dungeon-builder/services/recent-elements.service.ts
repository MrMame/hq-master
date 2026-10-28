import { Injectable, Signal } from '@angular/core';
import { PersistedState, persistedState } from '../../../core/session-state/persisted-state';
import { STRING_LIST_CODEC } from '../../../core/session-state/string-list-codec.util';
import { TOOL_STATE_KEYS } from '../../../core/session-state/tool-state-keys';

/** Höchstens so viele Einträge zeigt „Zuletzt verwendet“. */
export const MAX_RECENT_ELEMENTS: number = 8;

/**
 * Zuletzt als Stempel gewählte oder auf den Plan gezogene Türen und Möbel (Katalog-IDs, neueste zuerst).
 * Werkzeug-Zustand außerhalb der Spielesession.
 */
@Injectable({
  providedIn: 'root',
})
export class RecentElementsService {
  private readonly _recentIds: PersistedState<string[]> = persistedState<string[]>(
    TOOL_STATE_KEYS.dungeonBuilderRecent,
    () => [],
    STRING_LIST_CODEC,
  );

  readonly recentIds: Signal<string[]> = this._recentIds.value;

  /** Stellt das Element nach vorn; ein schon enthaltenes rückt vor, statt doppelt zu erscheinen. */
  record(catalogId: string): void {
    this._recentIds.update((ids) =>
      [catalogId, ...ids.filter((id) => id !== catalogId)].slice(0, MAX_RECENT_ELEMENTS),
    );
  }
}
