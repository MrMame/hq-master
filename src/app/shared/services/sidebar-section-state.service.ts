import { Injectable, Signal, signal, untracked, WritableSignal } from '@angular/core';
import { PersistedState, persistedState } from '../../core/session-state/persisted-state';
import { STRING_LIST_CODEC } from '../../core/session-state/string-list-codec.util';
import { TOOL_STATE_KEYS } from '../../core/session-state/tool-state-keys';

/** Ein Abschnitt gehört zu einem Bereich, wenn seine ID mit `<bereich>.` beginnt (z. B. `dungeon-builder.layout`). */
function inScope(sectionId: string, scope: string): boolean {
  return sectionId.startsWith(`${scope}.`);
}

/**
 * Auf- und zugeklappte Abschnitte der Seitenleisten aller Features.
 * Gespeichert werden nur die zugeklappten IDs: Unbekannte Abschnitte (z. B. neue Katalog-Kategorien) sind offen.
 * Werkzeug-Zustand außerhalb der Spielesession.
 */
@Injectable({
  providedIn: 'root',
})
export class SidebarSectionStateService {
  private readonly _collapsedIds: PersistedState<string[]> = persistedState<string[]>(
    TOOL_STATE_KEYS.sidebarSections,
    () => [],
    STRING_LIST_CODEC,
  );
  /** Gerade angezeigte Abschnitte; nicht gespeichert, nur für „alle auf-/zuklappen“. */
  private readonly _registeredIds: WritableSignal<string[]> = signal<string[]>([]);

  readonly collapsedIds: Signal<string[]> = this._collapsedIds.value;

  isCollapsed(sectionId: string): boolean {
    return this.collapsedIds().includes(sectionId);
  }

  toggle(sectionId: string): void {
    this._collapsedIds.update((ids) =>
      ids.includes(sectionId) ? ids.filter((id) => id !== sectionId) : [...ids, sectionId],
    );
  }

  register(sectionId: string): void {
    this._registeredIds.update((ids) => [...ids, sectionId]);
  }

  /** Entfernt eine Anmeldung; ein gleichnamiger zweiter Abschnitt bleibt angemeldet. */
  unregister(sectionId: string): void {
    this._registeredIds.update((ids) => {
      const index: number = ids.indexOf(sectionId);
      return index < 0 ? ids : [...ids.slice(0, index), ...ids.slice(index + 1)];
    });
  }

  /** `true`, wenn der Bereich angezeigte Abschnitte hat und alle davon zugeklappt sind. */
  allCollapsed(scope: string): boolean {
    const shown: string[] = this._registeredIds().filter((id) => inScope(id, scope));
    return shown.length > 0 && shown.every((id) => this.isCollapsed(id));
  }

  /** Klappt alle angezeigten Abschnitte des Bereichs zu bzw. alle gespeicherten des Bereichs auf. */
  setAll(scope: string, collapsed: boolean): void {
    const others: string[] = this._collapsedIds.current().filter((id) => !inScope(id, scope));
    if (!collapsed) {
      this._collapsedIds.set(others);
      return;
    }
    const shown: string[] = untracked(this._registeredIds).filter((id) => inScope(id, scope));
    this._collapsedIds.set([...others, ...new Set(shown)]);
  }
}
