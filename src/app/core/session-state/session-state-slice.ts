import { Signal } from '@angular/core';

/**
 * Fachlicher Beitrag eines Service zur Spielesession. Der `GameSessionService` liest und ersetzt
 * den Zustand nur über diesen Vertrag; fachliche Mutationen bleiben Methoden des Service.
 */
export interface SessionStateSlice<T> {
  /** Kompletter Zustand des Slice (reaktiv, z. B. für das Speichern). */
  readonly sessionState: Signal<T>;
  /** Ersetzt den Zustand vollständig, z. B. beim Laden einer Session. */
  restore(state: T): void;
  /** Setzt den Zustand für eine neue Session zurück. */
  reset(): void;
}
