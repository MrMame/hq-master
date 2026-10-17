- **Unit Tests**: Written in Vitest (`vitest` ^4.0.0) using `jsdom`. Ensure all new logic has test coverage.
- **Code Style**: Code formatting is enforced via Prettier (`prettier`). Format files before committing.
- **TypeScript**: Strict mode enabled. No `any` type allowed. Use precise interfaces or types.

## Test-Konventionen

- **Nur Vitest-APIs:** `vi.fn()`, `vi.spyOn()`, `vi.useFakeTimers()` – **niemals** Jasmine (`jasmine.*`, `spyOn` ohne `vi.`).
- **localStorage isolieren:** In jedem Spec, der Storage berührt, `beforeEach(() => localStorage.clear())`.
- **HTTP:** Ausschließlich über `provideHttpClient()` + `provideHttpClientTesting()` mit `HttpTestingController` testen, keine echten Requests.
- **Dialoge:** `MatDialogRef` / `MAT_DIALOG_DATA` per `useValue` mocken, `close` als `vi.fn()`; Button-Klicks prüfen `close(...)` mit dem richtigen Wert.
- **Definition of Done:**
  - Neue Komponenten/Services gelten erst als fertig, wenn ihr Spec mehr als `should create` prüft (Rendering der wichtigsten Zustände, User-Interaktion, Normal- und Grenz-/Fehlerfälle).
  - Die Tests laufen mit Coverage (`npm run test -- --watch=false --coverage`). Neue und geänderte Dateien mit Logik werden im Report geprüft: Nicht abgedeckte Zeilen/Zweige werden getestet oder im Abschlussbericht begründet (z. B. reine Typen/Konstanten, nur manuell prüfbare UI).

## Git-Hooks (husky)

`npm install` aktiviert die Hooks automatisch (`prepare` → `core.hooksPath` = `.husky/_`). Sie greifen bei jedem Commit/Push – von Hand, aus VS Code oder durch Claude. Die Logik liegt in `scripts/git-hooks/*.mjs`.

- **`pre-commit`** (Ziel < ~15 s): Prettier-Check auf den gestagten Inhalt (Index) und `npm run lint`.
- **`pre-push`**: `npm run test -- --watch=false --coverage` und `npm run build`.
- **Coverage-Schwellen** in `vitest.config.ts` (über `runnerConfig` in `angular.json`): Lines 95, Branches 90, Functions 85, Statements 95. Unterschreitung bricht den Push ab.
- **Umgehung** mit `--no-verify` nur in begründeten Ausnahmen; Begründung in der Commit-Nachricht.
- Während der Arbeit mit Claude laufen zusätzlich der Stop-Hook (`.claude/hooks/stop-run-tests.mjs`, Tests ohne Coverage) und die Prettier-Formatierung nach Edit/Write.
