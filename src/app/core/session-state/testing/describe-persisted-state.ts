import { describe, expect, it, vi } from 'vitest';
import { PersistedStateKey } from '../persisted-state';

/** Beschreibt einen persistierten Zustandsteil eines Session-Service für den Vertragstest. */
export interface PersistedStateContract<S, T> {
  key: PersistedStateKey;
  /** Erzeugt den Service frisch (localStorage ist vorher schon vorbereitet). */
  create: () => S;
  /** Liest den Zustand über das öffentliche Signal. */
  read: (service: S) => T;
  /** Erwarteter Wert, wenn nichts oder Ungültiges gespeichert ist. */
  fallback: T;
  /** Roher Storage-Inhalt (JSON-Form) und der daraus erwartete Signal-Wert. */
  stored: { raw: unknown; expected: T };
  /** Eine Mutation, die den Zustand ändert. */
  mutate: (service: S) => void;
  /** Storage-Form eines Werts, falls ein Codec verwendet wird. */
  encode?: (value: T) => unknown;
}

const readRaw: (key: string) => unknown = (key: string): unknown =>
  JSON.parse(localStorage.getItem(key) ?? 'null');

/**
 * Prüft Architekturregel 8 einheitlich: Init aus Storage, Default-Fallback bei fehlendem
 * und ungültigem Wert, Mutation aktualisiert Signal und Storage.
 * Erwartet, dass der Aufrufer localStorage und TestBed in `beforeEach` zurücksetzt.
 */
export function describePersistedState<S, T>(
  name: string,
  contract: PersistedStateContract<S, T>,
): void {
  const { key, create, read, fallback, stored, mutate, encode }: PersistedStateContract<S, T> =
    contract;

  describe(`persisted state "${name}" (${key})`, () => {
    it('should initialise from storage', () => {
      localStorage.setItem(key, JSON.stringify(stored.raw));
      expect(read(create())).toEqual(stored.expected);
    });

    it('should fall back to the default when nothing is stored', () => {
      expect(read(create())).toEqual(fallback);
    });

    it('should fall back to the default when the stored JSON is invalid', () => {
      vi.spyOn(console, 'warn').mockImplementation(() => undefined);
      localStorage.setItem(key, '{kaputt');
      expect(read(create())).toEqual(fallback);
      vi.restoreAllMocks();
    });

    it('should update signal and storage together on mutation', () => {
      const service: S = create();
      const before: T = read(service);
      mutate(service);
      const after: T = read(service);
      expect(after).not.toEqual(before);
      const expectedRaw: unknown = JSON.parse(JSON.stringify(encode ? encode(after) : after));
      expect(readRaw(key)).toEqual(expectedRaw);
    });
  });
}
