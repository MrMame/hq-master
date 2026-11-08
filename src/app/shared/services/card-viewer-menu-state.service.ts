import { Injectable, Signal } from '@angular/core';
import { BOOLEAN_CODEC } from '../../core/session-state/boolean-codec.util';
import { PersistedState, persistedState } from '../../core/session-state/persisted-state';
import { TOOL_STATE_KEYS } from '../../core/session-state/tool-state-keys';

/**
 * Ein-/Ausklapp-Zustand des Aktionsmenüs im Card Viewer, für alle Einsatzorte gleich.
 * Werkzeug-Zustand außerhalb der Spielesession; ohne gespeicherten Wert ist das Menü zugeklappt.
 */
@Injectable({
  providedIn: 'root',
})
export class CardViewerMenuStateService {
  private readonly _expanded: PersistedState<boolean> = persistedState<boolean>(
    TOOL_STATE_KEYS.cardViewerMenuOpen,
    () => false,
    BOOLEAN_CODEC,
  );

  readonly expanded: Signal<boolean> = this._expanded.value;

  toggle(): void {
    this._expanded.update((expanded) => !expanded);
  }
}
