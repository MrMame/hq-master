import { Injectable, Signal } from '@angular/core';
import { PersistedState, persistedState } from '../../core/session-state/persisted-state';
import { STRING_LIST_CODEC } from '../../core/session-state/string-list-codec.util';
import { TOOL_STATE_KEYS } from '../../core/session-state/tool-state-keys';

/**
 * Ein- und ausgeklappte Seitenleisten (`CollapsibleSidebar`) aller Features, je Feature-ID.
 * Gespeichert werden nur die eingeklappten IDs: Unbekannte Leisten sind ausgeklappt.
 * Werkzeug-Zustand außerhalb der Spielesession.
 */
@Injectable({
  providedIn: 'root',
})
export class CollapsibleSidebarStateService {
  private readonly _collapsedIds: PersistedState<string[]> = persistedState<string[]>(
    TOOL_STATE_KEYS.collapsedSidebars,
    () => [],
    STRING_LIST_CODEC,
  );

  readonly collapsedIds: Signal<string[]> = this._collapsedIds.value;

  isCollapsed(sidebarId: string): boolean {
    return this.collapsedIds().includes(sidebarId);
  }

  toggle(sidebarId: string): void {
    this._collapsedIds.update((ids) =>
      ids.includes(sidebarId) ? ids.filter((id) => id !== sidebarId) : [...ids, sidebarId],
    );
  }
}
