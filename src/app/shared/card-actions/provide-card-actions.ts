import { Provider } from '@angular/core';
import { CARD_ACTIONS, CardAction } from '../models/card-action.model';

/** Erzeugt eine Kartenaktion im Injection-Kontext; darf also `inject()` nutzen. */
export type CardActionFactory = () => CardAction;

/**
 * Registriert Kartenaktionen für das Menü des Card Viewers (Multi-Provider auf `CARD_ACTIONS`). Eine neue
 * Aktion braucht nur diesen Aufruf, keine Änderung am Viewer.
 */
export function provideCardActions(...factories: CardActionFactory[]): Provider[] {
  return factories.map((factory) => ({ provide: CARD_ACTIONS, useFactory: factory, multi: true }));
}
