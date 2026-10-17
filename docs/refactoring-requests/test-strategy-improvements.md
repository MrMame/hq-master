# Refactoring Request: Teststrategie verbessern (Timer, XML-Fehlerpfade, DOM-Tests, E2E)

**Datum:** 2026-10-17  
**Priorität:** Mittel  
**Status:** offen  
**Bezug:** `.claude/rules/testing.md`, `docs/refactoring-requests/git-hooks-quality-gate.md` (CI-Ersatz und Coverage-Schwellen – dort, nicht hier), `docs/refactoring-requests/done/component-interaction-tests.md`

---

## Problem

Die Suite ist grün und schnell (37 Dateien, 257 Tests, ~4 s) und hoch abgedeckt (Stand 2026-10-17: 98,3 % Lines, 94,0 % Branches, 89,8 % Functions). Die Analyse der Teststrategie zeigt trotzdem Schwachstellen in der _Art_ der Tests:

| Bereich                 | Beobachtung                                                                                                          |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------- |
| Timer                   | 3 Specs warten real (`setTimeout(resolve, 350/50)`); `vi.useFakeTimers()` wird nirgends verwendet                    |
| XML-Import              | Mapper unter `game-session/xml/` nur indirekt per Round-Trip getestet; `xml.util.ts` 79 %, Mapper 83 % Branch        |
| Komponententests        | 35 Direktaufrufe `component.xxx()`; Template-Verdrahtung teils ungeprüft (z. B. `game-session-page.html` 33 % Funct) |
| Realistische UI-Abläufe | Keine E2E-Tests; Drag & Drop, Datei-Import/-Export, Reload-Persistenz, Routing (`app.routes.ts` 9 %) ungetestet      |
| Regeln                  | Testkonventionen doppelt in `.claude/rules/testing.md` und `.github/instructions/testing.instructions.md`            |
| Isolation               | `localStorage.clear()` muss in jeder Spec von Hand stehen                                                            |

Produktivcode wird nicht geändert, außer wo eine Testbarkeit es zwingend erfordert (dann im Abschlussbericht begründen).

---

## Anforderungen

### 1. Fake-Timer statt echter Wartezeiten

- Betroffen:
  - `character-tracker/components/character-card/character-card.spec.ts:74` (350 ms)
  - `character-tracker/components/character-tracker-page/character-tracker-page.spec.ts:136` (350 ms)
  - `dungeon-tracker/components/dungeon-tracker-page/dungeon-tracker-page-interactions.spec.ts:57` (50 ms)
- Auf `vi.useFakeTimers()` + `vi.advanceTimersByTime(...)` umstellen; `vi.useRealTimers()` in `afterEach`.
- Wartezeit nicht als Magic Number duplizieren: Debounce-Dauer aus dem Produktivcode referenzieren (ggf. als exportierte Konstante), damit der Test bei Änderung der Debounce nicht still falsch wird.
- Grenzfall prüfen: kurz _vor_ Ablauf der Debounce noch kein Aufruf, _nach_ Ablauf genau einer.

### 2. Fehler- und Fallback-Pfade beim XML-Import testen

- Neue Spec `game-session/xml/xml.util.spec.ts`: `readString`, `readNumber` (fehlend, leer, nicht numerisch, `Infinity`), `readBoolean`, `textOf(null)`, `indentXml` (leeres Element, verschachtelt).
- Je Mapper mit nicht abgedeckten Zweigen (laut Coverage-Report) eine Spec gleichen Stamms, z. B. `characters.xml-mapper.spec.ts`, mit tabellarischen Fällen (`it.each`) für fehlende Attribute, falsche Typen und leere Abschnitte – also Dateien aus älteren Versionen oder von Hand bearbeitete Dateien.
- Erwartung je Fall explizit: Fallback-Wert oder sprechender Fehler.

### 3. Komponententests über DOM bzw. Component Harnesses

- Direktaufrufe von Handler-Methoden durch Interaktionen ersetzen (Klick, `input`-Event, Output-Event der Kindkomponente), damit die Template-Bindung mitgeprüft wird. Betroffen (Anzahl Direktaufrufe):
  - `character-tracker-page.spec.ts` (19)
  - `game-session-page.spec.ts` (7), inkl. `loadSession({ target } as unknown as Event)` → echtes `change`-Event am File-Input
  - `add-character-dialog.spec.ts`, `damage-taken-dialog.spec.ts`, `character-card.spec.ts`, `dungeon-token.spec.ts` (je 2), `dungeon-tracker-page.spec.ts` (1)
- Für Angular-Material-Elemente (Dialog-Buttons, Inputs, Selects) die CDK-Harnesses verwenden (`TestbedHarnessEnvironment`, `MatButtonHarness`, `MatInputHarness`, …) statt `querySelector` auf interne Material-Struktur.
- Direktaufrufe bleiben zulässig, wo ein Event in jsdom nicht sinnvoll erzeugbar ist (z. B. `CdkDragEnd`); im Spec kurz kommentieren.
- Konvention in `.claude/rules/testing.md` ergänzen: „Komponenten über DOM/Harnesses testen, nicht über öffentliche Handler-Methoden."

### 4. E2E-Smoke-Tests mit Playwright

- Playwright als devDependency, Konfiguration startet `ng serve`; Script `npm run e2e`; Tests unter `e2e/` (nicht unter `src/`).
- Wenige, stabile Szenarien:
  1. Jede Route lädt (inkl. Redirect von `''` und `**` auf `/charactertracker`).
  2. Charakter anlegen → Seite neu laden → Charakter ist noch da (localStorage-Persistenz).
  3. Token auf dem Dungeon-Board per Drag & Drop verschieben → Position bleibt nach Reload erhalten.
  4. Session als XML exportieren und wieder importieren → Zustand identisch.
- Nicht in den `pre-commit`-Hook; Aufnahme in `pre-push` erst nach Messung der Laufzeit entscheiden.
- Architektur-Doku (`.claude/rules/architecture.md`) um den Ordner `e2e/` ergänzen.

### 5. Testregeln an einer Stelle pflegen

- `.claude/rules/testing.md` ist die führende Quelle.
- `.github/instructions/testing.instructions.md` auf einen Verweis plus Copilot-spezifische Hinweise reduzieren, damit die Konventionen nicht auseinanderlaufen.

### 6. localStorage zentral isolieren

- Globale Test-Setup-Datei (z. B. `src/test-setup.ts`) mit `beforeEach(() => localStorage.clear())`, eingebunden über die Builder-Option `setupFiles` von `@angular/build:unit-test` (vorher prüfen, ob unterstützt).
- Danach die manuellen `localStorage.clear()` in den Specs entfernen und Regel in `testing.md` entsprechend anpassen.

### 7. (Optional) Mutation Testing evaluieren

- Einmaliger Probelauf mit StrykerJS (Vitest-Runner) auf `core/` und `features/*/utils/`, um Tests zu finden, die Code ausführen, aber keine relevanten Assertions haben.
- Ergebnis (Mutation Score, auffällige Specs) im Abschlussbericht festhalten; dauerhafte Einbindung nur bei vertretbarer Laufzeit.

---

## Akzeptanzkriterien

- Kein Spec wartet mehr auf echte Zeit (`grep "setTimeout(resolve" src` liefert nichts).
- `xml.util.ts` und alle XML-Mapper erreichen 100 % Branch-Coverage oder nicht abgedeckte Zweige sind begründet.
- In den genannten Komponenten-Specs werden Handler nur noch über DOM/Harness/Outputs ausgelöst (begründete Ausnahmen kommentiert); Function-Coverage der zugehörigen Templates steigt entsprechend.
- `npm run e2e` führt die vier Smoke-Szenarien lokal grün aus.
- Testkonventionen stehen inhaltlich nur noch in `.claude/rules/testing.md`.
- `localStorage` wird global vor jedem Test geleert; keine Spec hängt mehr von manuellem Aufräumen ab.
- `npm run test -- --watch=false --coverage` grün, Gesamtabdeckung nicht gesunken.
