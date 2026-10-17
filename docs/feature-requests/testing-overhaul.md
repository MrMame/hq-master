# Feature Request: Testing überarbeiten

**Datum:** 2026-10-16  
**Priorität:** Hoch  
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

### 2. Fehlende Spec-Dateien

Folgende Klassen mit Logik haben **keinen** Spec:

| Feature         | Datei                                                     |
| --------------- | --------------------------------------------------------- |
| card-manager    | `services/card-manager.service.ts`                        |
| card-manager    | `services/deck-xml-loader.service.ts`                     |
| card-manager    | `components/card-display/card-display.ts`                 |
| dungeon-tracker | `services/dungeon-board.service.ts`                       |
| dungeon-tracker | `components/dungeon-tracker-page/dungeon-tracker-page.ts` |
| dungeon-tracker | `components/dungeon-token/dungeon-token.ts`               |

Das Feature **dungeon-tracker** ist komplett ungetestet.

### 3. Vorhandene Specs sind fast nur Platzhalter

Von 14 Spec-Dateien enthalten 13 genau **einen** Test – meist nur den CLI-generierten `should create`. Einzige Ausnahme: `combat-calculator.service.spec.ts` (7 Tests).

Betroffen sind u.a. Kernservices mit Persistenz- bzw. Zeitlogik:

- `core/services/game-time/game-time.service.spec.ts`
- `core/services/storage/storage.service.spec.ts`
- `core/services/characters/characters-db.service.spec.ts`
- `character-tracker/services/character-creators/*.spec.ts`

---

## Ziel

Eine **grüne, lauffähige** Test-Suite, die jede Klasse mit Logik abdeckt und Regressionen zuverlässig erkennt. Neuer Code wird künftig nur mit passenden Tests eingecheckt.

---

## Anforderungen

### 1. Test-Suite wieder lauffähig machen (Sofortmaßnahme)

- `jasmine.createSpy(...)` → `vi.fn()` in `damage-taken-dialog.spec.ts`.
- Alle Specs auf weitere Jasmine-Reste prüfen (`jasmine.*`, `spyOn` ohne `vi.`, `toHaveBeenCalledOnceWith` o.ä.).

**Erwartetes Verhalten:** `npm run test -- --watch=false` läuft ohne Build-Fehler durch, alle Tests grün.

---

### 2. Fehlende Specs anlegen

Für jede Datei aus Problem-Tabelle 2 einen Spec erstellen. Mindestumfang:

- **`DeckXmlLoaderService`:** `parseXml` mit gültigem XML, fehlendem `<deck>`-Element (Fehler), Default-`type`, `combat`-Karten mit `attack`/`defense`. `loadFromUrl` mit `provideHttpClientTesting()` / `HttpTestingController`.
- **`CardManagerService`:** Deck laden, Karten ziehen, State-Änderungen (Loader gemockt).
- **`DungeonBoardService`:** Token platzieren/verschieben/entfernen, Persistenz in localStorage.
- **Komponenten:** Rendering der wichtigsten Zustände und Reaktion auf User-Interaktion (nicht nur `should create`).

---

### 3. Vorhandene Platzhalter-Specs ausbauen

- Jede öffentliche Methode der Services erhält mindestens einen Test für den Normalfall und, wo sinnvoll, für Grenz-/Fehlerfälle.
- `StorageService` / `CharactersDatabaseService`: Lesen, Schreiben, Löschen, leerer bzw. kaputter localStorage-Inhalt.
- `GametimeService`: `addHours`, `addMinutes`, `setGameTime` inkl. Tageswechsel.
- Dialog-Komponenten: Button-Klicks rufen `dialogRef.close(...)` mit dem richtigen Wert auf.

---

### 4. Einheitliche Test-Konventionen festlegen

In `.claude/rules/testing.md` ergänzen:

- Nur Vitest-APIs verwenden (`vi.fn()`, `vi.spyOn()`, `vi.useFakeTimers()`), **niemals** Jasmine.
- localStorage vor jedem Test zurücksetzen (`beforeEach(() => localStorage.clear())`).
- HTTP ausschließlich über `provideHttpClient()` + `provideHttpClientTesting()` testen, keine echten Requests.
- Dialoge: `MatDialogRef` / `MAT_DIALOG_DATA` per `useValue` mit `vi.fn()` mocken.
- Neue Komponenten/Services gelten erst als fertig, wenn ihr Spec mehr als `should create` prüft.

---

### 5. (Optional) Coverage messen und absichern

- Coverage-Report aktivieren (`ng test --coverage`).
- Mindest-Schwelle definieren (Vorschlag: 70 % Lines für `core/` und `features/*/services/`).
- Optional: Test-Lauf als Pre-Commit-Hook oder im Deploy-Script vor `ng deploy` ausführen, damit kaputte Tests nicht unbemerkt bleiben.

---

## Akzeptanzkriterien

- [ ] `npm run test -- --watch=false` läuft fehlerfrei und grün.
- [ ] Kein Vorkommen von `jasmine` mehr in `src/`.
- [ ] Jede Service- und Komponentenklasse in `src/app` hat einen Spec.
- [ ] Kein Spec besteht nur aus `should create`.
- [ ] Testkonventionen sind in `.claude/rules/testing.md` dokumentiert.

---

## Empfohlene Reihenfolge

1. Anforderung 1 (blockiert alles andere)
2. Anforderung 4 (Konventionen, bevor neue Tests geschrieben werden)
3. Anforderung 2 + 3, Feature für Feature: `core` → `character-tracker` → `card-manager` → `dungeon-tracker` → `time-tracker`
4. Anforderung 5
