- **Unit Tests**: Written in Vitest (`vitest` ^4.0.0) using `jsdom`. Ensure all new logic has test coverage.
- **Code Style**: Code formatting is enforced via Prettier (`prettier`). Format files before committing.
- **TypeScript**: Strict mode enabled. No `any` type allowed. Use precise interfaces or types.

## Test-Konventionen

- **Nur Vitest-APIs:** `vi.fn()`, `vi.spyOn()`, `vi.useFakeTimers()` – **niemals** Jasmine (`jasmine.*`, `spyOn` ohne `vi.`).
- **localStorage-Isolation ist global:** `src/test-setup.ts` (eingebunden über `setupFiles` in `angular.json`) leert `localStorage` vor jedem Test; abgesichert durch `src/test-setup.spec.ts`. In Specs kein eigenes `localStorage.clear()` – nur gezielt Ausgangsdaten setzen.
- **HTTP:** Ausschließlich über `provideHttpClient()` + `provideHttpClientTesting()` mit `HttpTestingController` testen, keine echten Requests.
- **Dialoge:** `MatDialogRef` / `MAT_DIALOG_DATA` per `useValue` mocken, `close` als `vi.fn()`; Button-Klicks prüfen `close(...)` mit dem richtigen Wert.
- **Komponenten über DOM/Harnesses testen, nicht über öffentliche Handler-Methoden:** Handler per Klick, `input`/`change`-Event oder Output-Event der Kindkomponente auslösen, damit die Template-Bindung mitgeprüft wird. Für Angular-Material-Elemente CDK-Harnesses verwenden (`TestbedHarnessEnvironment`, `MatButtonHarness`, …) statt `querySelector` auf interne Material-Struktur. Direktaufrufe nur, wo ein Event in jsdom nicht sinnvoll erzeugbar ist – im Spec kommentieren.
- **Zeit:** Nie real warten (`setTimeout(resolve, …)`); `vi.useFakeTimers()` + `vi.advanceTimersByTime()`/`vi.runAllTimers()`, `vi.useRealTimers()` in `afterEach`.
- **Wiederverwendbares Test-Setup:** Feature-spezifisch unter `<feature>/testing/*.fixtures.ts`, feature-übergreifende DOM-Helfer unter `shared/testing/`. Diese Dateien werden auch vom App-Build kompiliert: `vi` & Co. dort explizit aus `vitest` importieren.
- **Verhalten statt Implementierung:** Testnamen und Assertions beschreiben beobachtbares Verhalten (Signal-Zustände, Persistenz, gerendertes DOM, Fehlerpfade), nicht interne Details. Vor einem neuen Testmuster die benachbarten Specs als Vorbild nehmen.
- **Fehler im Produktivcode beheben:** Deckt ein Test einen Fehler auf, wird der Produktivcode korrigiert – die Assertion wird nicht abgeschwächt.
- **Kleinster Lauf zuerst:** Erst die betroffene Spec ausführen (`npm run test -- --watch=false --include <pfad>`), danach die ganze Suite, wenn geteiltes Verhalten betroffen ist.
- **E2E (Playwright):** Wenige stabile Smoke-Szenarien unter `e2e/` (`npm run e2e`, startet `ng serve` auf Port 4321). Locator über Rolle/Text/`data-testid`, nie feste Wartezeiten (`waitForTimeout`). Nicht Teil der Git-Hooks.
- **Playwright-Proben:** Lokale Ad-hoc-Prüfungen von UI-Verhalten unter `e2e/probe/` (gitignored, Projekt `probe`, nicht in `npm run e2e`): `npx playwright test --project=probe e2e/probe/<datei>`. UI-Verhalten wird damit automatisch geprüft, statt einen manuellen Prüfschritt zu nennen.
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
