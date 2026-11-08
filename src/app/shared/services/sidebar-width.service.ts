import { Injectable, Signal } from '@angular/core';
import { NUMBER_RECORD_CODEC } from '../../core/session-state/number-record-codec.util';
import { PersistedState, persistedState } from '../../core/session-state/persisted-state';
import { TOOL_STATE_KEYS } from '../../core/session-state/tool-state-keys';
import { SIDEBAR_MIN_WIDTH } from '../utils/sidebar-width.util';

/**
 * Gezogene Breiten der Seitenleisten (`CollapsibleSidebar`) aller Features, je Feature-ID in px.
 * Ohne Eintrag gilt die Standardbreite aus `sidebar.css`. Werkzeug-Zustand außerhalb der Spielesession.
 */
@Injectable({
  providedIn: 'root',
})
export class SidebarWidthService {
  private readonly _widths: PersistedState<Record<string, number>> = persistedState<
    Record<string, number>
  >(TOOL_STATE_KEYS.sidebarWidths, () => ({}), NUMBER_RECORD_CODEC);

  readonly widths: Signal<Record<string, number>> = this._widths.value;

  /** Gespeicherte Breite, mindestens `SIDEBAR_MIN_WIDTH`; `null` ohne gespeicherten Wert. */
  widthOf(sidebarId: string): number | null {
    const width: number | undefined = this.widths()[sidebarId];
    return width === undefined ? null : Math.max(width, SIDEBAR_MIN_WIDTH);
  }

  setWidth(sidebarId: string, width: number): void {
    this._widths.update((widths) => ({ ...widths, [sidebarId]: width }));
  }
}
