import { inject, Signal, signal, untracked, WritableSignal } from '@angular/core';
import { StorageService } from '../services/storage/storage.service';
import { SessionStateKey } from './session-keys';

/** Übersetzt einen Wert in seine JSON-taugliche Storage-Form und zurück. */
export interface StorageCodec<T> {
  encode(value: T): unknown;
  /** Liefert `null` bei ungültigem Inhalt, dann greift der Fallback. */
  decode(stored: unknown): T | null;
}

/** Ein Session-Wert, dessen Signal und Storage-Eintrag immer gemeinsam geändert werden. */
export interface PersistedState<T> {
  /** Öffentliche, schreibgeschützte Lese-Schnittstelle. */
  readonly value: Signal<T>;
  /** Liest ohne Abhängigkeit, sicher in Mutationen, die aus `effect()` kommen. */
  current(): T;
  /** Setzt Signal und Storage gemeinsam. */
  set(next: T): void;
  /** Wie `set()`, ausgehend vom aktuellen Wert (untracked gelesen). */
  update(fn: (current: T) => T): void;
}

/**
 * Legt einen persistierten Session-Wert an. Muss im Injection Context aufgerufen werden,
 * z. B. als Feld-Initializer eines Service. Fehlt der Storage-Wert oder ist er ungültig,
 * wird `fallback()` verwendet.
 */
export function persistedState<T>(
  key: SessionStateKey,
  fallback: () => T,
  codec?: StorageCodec<T>,
): PersistedState<T> {
  const storageService: StorageService = inject(StorageService);

  const load: () => T = (): T => {
    if (!codec) return storageService.readFromLocalStorage<T>(key) ?? fallback();
    const stored: unknown = storageService.readFromLocalStorage<unknown>(key);
    return (stored === null ? null : codec.decode(stored)) ?? fallback();
  };

  const state: WritableSignal<T> = signal<T>(load());

  const set: (next: T) => void = (next: T): void => {
    state.set(next);
    storageService.writeToLocalStorage<unknown>(key, codec ? codec.encode(next) : next);
  };

  return {
    value: state.asReadonly(),
    current: (): T => untracked(state),
    set,
    update: (fn: (current: T) => T): void => set(fn(untracked(state))),
  };
}
