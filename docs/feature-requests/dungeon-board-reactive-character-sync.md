# Feature Request: `DungeonBoardService` — Token-Positionen selbstständig mit Charakteren synchronisieren

**Datum:** 2026-10-16  
**Priorität:** Mittel  
**Status:** Offen  
**Bezug:** `.claude/rules/architecture.md` → „Session-State-Services: reaktive Schnittstelle“, Punkte 4, 6, 7 und 8

---

## Problem

`DungeonBoardService` verantwortet die Token-Positionen (`positions`). Welche Positionen es geben muss, hängt aber vom Charakterbestand in `CharactersDbService.characters` ab.

Aktuell reagiert **nicht der Service** auf Charakter-Änderungen, sondern die Komponente:

```typescript
// dungeon-tracker-page.ts:29
constructor() {
  effect(() => this.dungeonBoardService.initPositionsForCharacters(this.characters()));
}
```

Folgen:

- Die Synchronisation läuft **nur, solange die `DungeonTrackerPage` geöffnet ist**. Wird ein Charakter im Character-Tracker gelöscht, bleibt seine Position im Storage (`dungeon_positions`) bestehen, bis jemand den Dungeon-Tracker öffnet.
- Der persistierte Session-Zustand ist damit zeitweise inkonsistent — relevant für das spätere Session-Speichern/-Laden (`shared-session-state.md` §4).
- `initPositionsForCharacters()` ist `public`. Die Konsistenz des Service-Zustands hängt davon ab, dass ein Konsument daran denkt, die Methode aufzurufen.

---

## Anforderungen

### 1. Synchronisations-`effect()` in den Service verlagern

- `DungeonBoardService` injiziert `CharactersDbService` und registriert selbst einen `effect()` auf `charactersDbService.characters`.
- Der Effekt entfernt Positionen gelöschter Charaktere und legt Positionen für neue Charaktere an (bisherige Logik von `initPositionsForCharacters()`).
- Der `effect()` in `DungeonTrackerPage` entfällt ersatzlos.

**Erwartetes Verhalten:** Der Konsument muss nichts aufrufen; der Service hält seine Positionen eigenständig konsistent.

---

### 2. `initPositionsForCharacters()` privatisieren

- **Fund:** Die Methode ist öffentliche API, obwohl sie keine fachliche Nutzeraktion ist, sondern interne Konsistenzpflege.
- Umbenennen in z. B. `private syncPositionsWithCharacters(characters: CharacterInfo[]): void`.
- Öffentliche Schreib-API bleibt auf fachliche Aktionen beschränkt (`updatePosition`, `setBoardImage`, `updateGridSettings`).

**Erwartetes Verhalten:** Kein Aufrufer außerhalb des Service.

---

### 3. Service beim App-Start eager instanziieren

- **Fund:** Root-Services werden erst beim ersten `inject()` erzeugt. `DungeonBoardService` wird ausschließlich von `DungeonTrackerPage` injiziert — ein Effekt im Service liefe also ebenfalls erst, wenn die Page einmal geöffnet wurde.
- Service in `app.config.ts` per `provideAppInitializer(() => { inject(DungeonBoardService); })` beim Start erzeugen.
- Alternativ prüfen, ob ein zentraler Session-Initializer sinnvoll ist, der alle Session-Services eager startet (Vorbereitung für `shared-session-state.md` §4).

**Erwartetes Verhalten:** Charakter im Character-Tracker löschen, **ohne** den Dungeon-Tracker je geöffnet zu haben → Position ist trotzdem sofort aus `dungeon_positions` entfernt.

---

### 4. Nur bei echter Änderung schreiben

- **Fund:** `initPositionsForCharacters()` setzt das Signal und schreibt in den Storage bei **jedem** Aufruf — auch wenn sich keine Position geändert hat (neues Array-Objekt → Abhängige feuern unnötig).
- Vor `set()` prüfen, ob Positionen entfernt oder hinzugefügt wurden; andernfalls weder Signal noch Storage anfassen.
- Signal-Update und Persistenz über **eine** private Methode bündeln (Regel Punkt 4), analog zu `CharactersDbService.writeCharacters()`.

**Erwartetes Verhalten:** Änderung an einem bestehenden Charakter (z. B. Schaden) → `positions` bleibt dasselbe Array, kein Storage-Write.

---

### 5. Neue Tokens nicht auf belegte Felder setzen

- **Fund:** Neue Positionen werden mit `col: index % 5, row: Math.floor(index / 5)` platziert, wobei `index` nur über die **neuen** Charaktere läuft. Ein einzelner neuer Charakter landet daher immer auf `[0,0]` — auch wenn dort bereits ein Token steht.
- Platzierung sucht das erste freie Feld (zeilenweise, 5 Spalten breit), das von keiner bestehenden Position belegt ist.

**Erwartetes Verhalten:** Zwei Charaktere nacheinander anlegen → Tokens liegen auf unterschiedlichen Feldern.

---

### 6. (Optional) Abgeleitete Token-Liste als `computed()`

- **Fund:** Die Page verknüpft Positionen und Charaktere im Template per `getCharacter(pos.characterId)` — zweimal pro Position und pro Change-Detection-Lauf eine lineare Suche.
- Im Service ein `readonly tokens: Signal<{ position: DungeonPosition; character: CharacterInfo }[]>` als `computed()` aus `positions` und `characters` anbieten.
- Template iteriert über `tokens()`; `getCharacter()` entfällt.

**Erwartetes Verhalten:** Unverändertes UI-Verhalten, weniger Logik in der Komponente.

---

### 7. Tests für `DungeonBoardService` anlegen

- **Fund:** Für `dungeon-board-service.ts` existiert keine `.spec.ts` (Regel Punkt 8).
- Testfälle:
  - Init aus Storage inkl. Default-Fallback (`DEFAULT_DUNGEON_BOARD_STATE`, `[]`).
  - Charakter hinzufügen → Position entsteht und wird persistiert.
  - Charakter entfernen → Position verschwindet und wird persistiert.
  - Unveränderter Charakterbestand → kein Storage-Write (Punkt 4).
  - Neuer Token landet auf freiem Feld (Punkt 5).
  - `updatePosition`, `setBoardImage`, `updateGridSettings` aktualisieren Signal und Storage.
- `DungeonTrackerPage`-Spec anpassen, falls sie den bisherigen Page-Effekt voraussetzt.

---

## Betroffene Dateien

| Datei                                                                                           | Änderung                                                          |
| ----------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| `src/app/features/dungeon-tracker/services/dungeon-board-service.ts`                            | Effekt, private Sync-Methode, Change-Check, Platzierung, `tokens` |
| `src/app/features/dungeon-tracker/services/dungeon-board-service.spec.ts`                       | Neu: Tests (Punkt 7)                                              |
| `src/app/features/dungeon-tracker/components/dungeon-tracker-page/dungeon-tracker-page.ts`      | Page-Effekt entfernen, ggf. `getCharacter()` entfernen            |
| `src/app/features/dungeon-tracker/components/dungeon-tracker-page/dungeon-tracker-page.html`    | Ggf. Iteration über `tokens()` (Punkt 6)                          |
| `src/app/features/dungeon-tracker/components/dungeon-tracker-page/dungeon-tracker-page.spec.ts` | Anpassen an entfernten Page-Effekt                                |
| `src/app/app.config.ts`                                                                         | `provideAppInitializer` für eager Instanziierung (Punkt 3)        |

---

## Hinweise

- Dateilimit 150 Zeilen beachten: `dungeon-board-service.ts` hat bereits ~80 Zeilen. Platzierungslogik (Punkt 5) ggf. in eine reine Funktion unter `features/dungeon-tracker/models/` oder einen Helper auslagern — erleichtert zugleich das Testen.
- Regel Punkt 7 bleibt gewahrt: `DungeonBoardService` **liest** `characters` und schreibt nur seinen eigenen Key `dungeon_positions`.

---

## Akzeptanzkriterien

- [ ] `DungeonTrackerPage` enthält keinen `effect()` zur Positions-Synchronisation mehr
- [ ] `initPositionsForCharacters()` ist nicht mehr öffentlich
- [ ] Charakter löschen ohne geöffneten Dungeon-Tracker → Position ist aus `dungeon_positions` entfernt
- [ ] Unveränderter Charakterbestand löst keinen Storage-Write aus
- [ ] Neue Tokens werden nie auf ein belegtes Feld gesetzt
- [ ] `dungeon-board-service.spec.ts` existiert und deckt die Fälle aus Punkt 7 ab
- [ ] Alle Vitest-Tests laufen durch (`npm run test`), Build fehlerfrei (`npm run build`)
