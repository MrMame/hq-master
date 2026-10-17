# Refactoring Request: Interaktions- und Fehlerfall-Tests für Komponenten nachziehen

**Datum:** 2026-10-17  
**Priorität:** Mittel  
**Status:** Offen  
**Bezug:** `.claude/rules/testing.md` (Definition of Done), `docs/feature-requests/done/testing-overhaul.md`

---

## Problem

Alle Specs prüfen formal mehr als `should create`. Der Coverage-Report (`npm run test -- --watch=false --coverage`, Stand 2026-10-17) zeigt aber, dass bei mehreren Komponenten User-Interaktion oder Fehlerfälle ungetestet sind. Das verlangt die Definition of Done. Teilweise rufen Specs Handler-Methoden direkt auf, sodass die Verdrahtung im Template (`(click)`, `(ngModelChange)`, Output-Events) ungeprüft bleibt.

| Komponente             | Lücke laut Coverage                                     |
| ---------------------- | ------------------------------------------------------- |
| `DungeonTrackerPage`   | 50 % Lines; Zeilen 42–65 (alle Handler) ungetestet      |
| `CharacterCard`        | Template-Zeilen 30, 40, 50, 60 (`updateField`-Eingaben) |
| `CardManagerPage`      | Template-Zeilen 34, 42–46, 57–61 (Karten-Klicks)        |
| `CharacterTrackerPage` | Template-Zeilen 30–32 (Layout-Events der Karte)         |
| `GameSessionPage`      | `.ts` Zeilen 39–40 (ungültige Startzeit)                |
| `TimeTrackerPage`      | `.ts` Zeile 24 (`addTime8Hour`)                         |

Es wird kein Produktivcode geändert, nur Specs ergänzt.

---

## Anforderungen

### 1. `DungeonTrackerPage`: Handler testen

- `onImageUpload`: mit Datei wird `DungeonBoardService.setBoardImage` mit der Data-URL aufgerufen; ohne Datei passiert nichts.
- `onGridSettingChange`: ruft `updateGridSettings` mit genau dem geänderten Schlüssel auf.
- `onTokenMoved`: ruft `updatePosition(characterId, col, row)` auf.
- `onTokenDoubleClick`: navigiert zu `/charactertracker` (Router per `vi.spyOn`).
- Wo möglich über das Template auslösen (Input-Event, Outputs `tokenMoved` / `tokenDoubleClicked` des `DungeonToken`), nicht per Direktaufruf.

### 2. `CharacterCard`: Feld-Eingaben über das Template

- Eingabe in Health, Defense, Speed und Attack löst jeweils ein `characterChange`-Event mit einer geänderten Kopie aus; das Input-Objekt bleibt unverändert.

### 3. `CardManagerPage`: Karten-Klicks im DOM

- Klick auf aktive Karte, Ablagestapel-Karte und Bank-Karte im DOM auslösen und den jeweiligen Service-Aufruf prüfen.
- Prüfen, dass `stopPropagation` greift (kein zusätzlicher Klick-Handler des Containers ausgelöst).

### 4. `CharacterTrackerPage`: Layout-Events weiterreichen

- `moved`, `focused` und `minimiseToggled` einer `MovableCharacterCard` rufen `moveBy`, `bringToFront` und `toggleMinimised` auf `CharacterCardLayoutService` mit der richtigen Id auf.
- Der bestehende Spec hat 139 Zeilen; die neuen Tests in eine eigene Datei auslagern (z. B. `character-tracker-page-layout.spec.ts`), damit die 150-Zeilen-Grenze eingehalten wird.

### 5. `GameSessionPage`: ungültige Startzeit

- Bei leerer oder ungültiger Startzeit wird die Fehlermeldung `Bitte eine gültige Ingame-Startzeit angeben.` angezeigt und keine Session gestartet.

### 6. `TimeTrackerPage`: 8 Stunden hinzufügen

- `addTime8Hour` (bzw. der zugehörige Button) erhöht die Spielzeit um 8 Stunden; Label wird aktualisiert.

---

## Betroffene Dateien

- `src/app/features/dungeon-tracker/components/dungeon-tracker-page/dungeon-tracker-page.spec.ts`
- `src/app/features/character-tracker/components/character-card/character-card.spec.ts`
- `src/app/features/card-manager/components/card-manager-page/card-manager-page-clicks.spec.ts`
- `src/app/features/character-tracker/components/character-tracker-page/` (neuer Spec für Layout-Events)
- `src/app/features/game-session/components/game-session-page/game-session-page.spec.ts`
- `src/app/features/time-tracker/components/time-tracker-page/time-tracker-page.spec.ts`

---

## Akzeptanzkriterien

- [ ] Die in der Tabelle genannten Zeilen sind im Coverage-Report abgedeckt oder die Lücke ist im Abschlussbericht begründet.
- [ ] `DungeonTrackerPage` erreicht mindestens 90 % Lines.
- [ ] Interaktionen werden über das Template ausgelöst, nicht nur per Direktaufruf der Handler.
- [ ] Kein Produktivcode geändert.
- [ ] Nur Vitest-APIs, kein `any`, alle Dateien ≤ 150 Zeilen.
- [ ] `npm run lint`, `npm run test -- --watch=false --coverage` und `npm run build` fehlerfrei.
