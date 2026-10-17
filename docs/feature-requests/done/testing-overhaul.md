# Feature Request: Testing überarbeiten

**Datum:** 2026-10-16  
**Priorität:** Hoch  
**Status:** done (2026-10-17 21:37) – #1–#4 umgesetzt, #5 rejected  
**Bezug:** `.claude/rules/testing.md` („Ensure all new logic has test coverage“)

---

## Problem

Die Test-Suite ist aktuell **nicht lauffähig** und deckt die Logik der App nur oberflächlich ab.

### 1. Test-Suite bricht beim Build ab

`npm run test` (= `ng test`) scheitert, bevor ein einziger Test läuft:

```
TS2304: Cannot find name 'jasmine'.
src/app/features/character-tracker/components/damage-taken-dialog/damage-taken-dialog.spec.ts:13
  providers: [{ provide: MatDialogRef, useValue: { close: jasmine.createSpy('close') } }],
```

- Das Projekt nutzt Vitest (`@angular/build:unit-test`, `tsconfig.spec.json` → `types: ["vitest/globals"]`). `jasmine` existiert dort nicht.
- Weil der Angular-Builder alle Specs gemeinsam kompiliert, blockiert **ein** fehlerhafter Spec die **gesamte** Suite – auch bei `--include` auf einzelne Ordner.

> **Stand 2026-10-17:** Problem 1 ist behoben (32 Spec-Dateien, 193 Tests grün, kein `jasmine` mehr in `src/`). Die Tabellen unten zeigen den aktualisierten Rest.

### 2. Fehlende Spec-Dateien

Folgende Klassen mit Logik haben **keinen** Spec:

| Feature      | Datei                                     |
| ------------ | ----------------------------------------- |
| card-manager | `services/deck-xml-loader.service.ts`     |
| card-manager | `components/card-display/card-display.ts` |

Bereits nachgezogen (done 2026-10-17 21:27, im Zuge anderer Requests): `card-manager.service.ts`, `dungeon-board.service.ts`, `dungeon-tracker-page.ts`, `dungeon-token.ts`.

### 3. Vorhandene Specs sind teilweise noch Platzhalter

Folgende Specs prüfen nur `should create` / `should be created`:

- `features/character-tracker/services/character-creators/hero-character-creator.service.spec.ts`
- `features/character-tracker/services/character-creators/monster-character-creator.service.spec.ts`
- `shared/components/confirmation-dialog/confirmation-dialog.spec.ts`
- `features/card-manager/components/card-manager-page/card-manager-page.spec.ts`
- `app.spec.ts`

Bereits ausgebaut (done 2026-10-17 21:27): `game-time.service.spec.ts` (13 Tests), `storage.service.spec.ts` (4), `characters-db.service.spec.ts` (6).

---

## Ziel

Eine **grüne, lauffähige** Test-Suite, die jede Klasse mit Logik abdeckt und Regressionen zuverlässig erkennt. Neuer Code wird künftig nur mit passenden Tests eingecheckt.

---

## Anforderungen

### 1. Test-Suite wieder lauffähig machen (Sofortmaßnahme) ✅ done (2026-10-17 21:27)

- `jasmine.createSpy(...)` → `vi.fn()` in `damage-taken-dialog.spec.ts`.
- Alle Specs auf weitere Jasmine-Reste prüfen (`jasmine.*`, `spyOn` ohne `vi.`, `toHaveBeenCalledOnceWith` o.ä.).

**Erwartetes Verhalten:** `npm run test -- --watch=false` läuft ohne Build-Fehler durch, alle Tests grün.

---

### 2. Fehlende Specs anlegen ✅ done (2026-10-17 21:37)

Für jede Datei aus Problem-Tabelle 2 einen Spec erstellen. Mindestumfang:

- **`DeckXmlLoaderService`:** `parseXml` mit gültigem XML, fehlendem `<deck>`-Element (Fehler), Default-`type`, `combat`-Karten mit `attack`/`defense`. `loadFromUrl` mit `provideHttpClientTesting()` / `HttpTestingController`.
- **`CardManagerService`:** Deck laden, Karten ziehen, State-Änderungen (Loader gemockt).
- **`DungeonBoardService`:** Token platzieren/verschieben/entfernen, Persistenz in localStorage.
- **Komponenten:** Rendering der wichtigsten Zustände und Reaktion auf User-Interaktion (nicht nur `should create`).

---

### 3. Vorhandene Platzhalter-Specs ausbauen ✅ done (2026-10-17 21:37)

- Jede öffentliche Methode der Services erhält mindestens einen Test für den Normalfall und, wo sinnvoll, für Grenz-/Fehlerfälle.
- `StorageService` / `CharactersDatabaseService`: Lesen, Schreiben, Löschen, leerer bzw. kaputter localStorage-Inhalt.
- `GameTimeService`: `addHours`, `addMinutes`, `setGameTime` inkl. Tageswechsel.
- Dialog-Komponenten: Button-Klicks rufen `dialogRef.close(...)` mit dem richtigen Wert auf.

---

### 4. Einheitliche Test-Konventionen festlegen ✅ done (2026-10-17 21:37)

In `.claude/rules/testing.md` ergänzen:

- Nur Vitest-APIs verwenden (`vi.fn()`, `vi.spyOn()`, `vi.useFakeTimers()`), **niemals** Jasmine.
- localStorage vor jedem Test zurücksetzen (`beforeEach(() => localStorage.clear())`).
- HTTP ausschließlich über `provideHttpClient()` + `provideHttpClientTesting()` testen, keine echten Requests.
- Dialoge: `MatDialogRef` / `MAT_DIALOG_DATA` per `useValue` mit `vi.fn()` mocken.
- Neue Komponenten/Services gelten erst als fertig, wenn ihr Spec mehr als `should create` prüft.

---

### 5. (Optional) Coverage messen und absichern — rejected (2026-10-17 21:37)

> **Verworfen:** Entscheidung des Nutzers. `@vitest/coverage-v8` ist nicht installiert; Tests laufen bereits automatisch über den Stop-Hook (`.claude/hooks/stop-run-tests.mjs`).

- Coverage-Report aktivieren (`ng test --coverage`).
- Mindest-Schwelle definieren (Vorschlag: 70 % Lines für `core/` und `features/*/services/`).
- Optional: Test-Lauf als Pre-Commit-Hook oder im Deploy-Script vor `ng deploy` ausführen, damit kaputte Tests nicht unbemerkt bleiben.

---

## Akzeptanzkriterien

- [x] `npm run test -- --watch=false` läuft fehlerfrei und grün. (done 2026-10-17 21:27)
- [x] Kein Vorkommen von `jasmine` mehr in `src/`. (done 2026-10-17 21:27)
- [x] Jede Service- und Komponentenklasse in `src/app` hat einen Spec. (done 2026-10-17 21:37)
- [x] Kein Spec besteht nur aus `should create`. (done 2026-10-17 21:37)
- [x] Testkonventionen sind in `.claude/rules/testing.md` dokumentiert. (done 2026-10-17 21:37)

---

## Empfohlene Reihenfolge

1. Anforderung 1 (blockiert alles andere)
2. Anforderung 4 (Konventionen, bevor neue Tests geschrieben werden)
3. Anforderung 2 + 3, Feature für Feature: `core` → `character-tracker` → `card-manager` → `dungeon-tracker` → `time-tracker`
4. Anforderung 5
