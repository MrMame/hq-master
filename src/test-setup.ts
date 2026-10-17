import { beforeEach } from 'vitest';

// Globales Vitest-Setup (angular.json → test.options.setupFiles), läuft vor jeder Spec-Datei.
// Jeder Test startet mit leerem localStorage, damit kein persistierter Session-Zustand
// zwischen Tests durchsickert.
beforeEach(() => localStorage.clear());
