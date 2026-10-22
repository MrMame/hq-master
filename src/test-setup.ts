import { beforeEach } from 'vitest';

// Globales Vitest-Setup (angular.json → test.options.setupFiles), läuft vor jeder Spec-Datei.
// Jeder Test startet mit leerem localStorage, damit kein persistierter Session-Zustand
// zwischen Tests durchsickert.
beforeEach(() => localStorage.clear());

// jsdom kennt keinen ResizeObserver und misst kein Layout. Ohne Stub bricht jede Komponente ab,
// die Größen beobachtet; Specs, die Größen brauchen, ersetzen ihn per `vi.stubGlobal`.
globalThis.ResizeObserver ??= class {
  observe(): void {
    // bewusst leer: es gibt keine Größenänderungen zu melden
  }
  unobserve(): void {
    // bewusst leer
  }
  disconnect(): void {
    // bewusst leer
  }
};
