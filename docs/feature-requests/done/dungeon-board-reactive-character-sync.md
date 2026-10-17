# Feature Request: `DungeonBoardService` — Token-Positionen selbstständig mit Charakteren synchronisieren

**Datum:** 2026-10-16 (überarbeitet 2026-10-17 nach Umsetzung von `shared-session-state`)  
**Priorität:** Mittel  
**Status:** done (2026-10-17 20:36)  
**Bezug:** `.claude/rules/architecture.md` → „Session-State-Services: reaktive Schnittstelle“, Punkte 4, 6, 7, 8 und 9

---

## Problem

`DungeonBoardService` verantwortet die Token-Positionen (`positions`). Welche Positionen es geben muss, hängt aber vom Charakterbestand in `CharactersDbService.characters` ab.

Aktuell reagiert **nicht der Service** auf Charakter-Änderungen, sondern die Komponente:

```typescript
// dungeon-tracker-page.ts:28
constructor() {
  effect(() => {
    const characters: CharacterInfo[] = this.characters();
    untracked(() => this.dungeonBoardService.initPositionsForCharacters(characters));
  });
}
```

Folgen:

- Die Synchronisation läuft **nur, solange die `DungeonTrackerPage` geöffnet ist**. Wird ein Charakter im Character-Tracker gelöscht, bleibt seine Position im Storage (`dungeon_positions`) bestehen, bis jemand den Dungeon-Tracker öffnet.
- Der persistierte Session-Zustand ist damit zeitweise inkonsistent — auch im `snapshot` des `GameSessionService`, der beim Speichern als XML verwendet wird.
- `initPositionsForCharacters()` ist `public`. Die Konsistenz des Service-Zustands hängt davon ab, dass ein Konsument daran denkt, die Methode aufzurufen.

---

## Anforderungen

### 1. Synchronisations-`effect()` in den Service verlagern ✅ done (2026-10-17 20:36)

- `DungeonBoardService` injiziert `CharactersDbService` und registriert selbst einen `effect()` auf `charactersDbService.characters`.
- Der Effekt entfernt Positionen gelöschter Charaktere und legt Positionen für neue Charaktere an.
- Eigene Positionen in der Sync-Logik nur über `_positions.current()` lesen (untracked), damit der Effekt nicht auf `positions` reagiert und keine Schleife entsteht.
- Der `effect()` in `DungeonTrackerPage` entfällt ersatzlos.

**Erwartetes Verhalten:** Der Konsument muss nichts aufrufen; der Service hält seine Positionen eigenständig konsistent.

---

### 2. `initPositionsForCharacters()` privatisieren ✅ done (2026-10-17 20:36)

- **Fund:** Die Methode ist öffentliche API, obwohl sie keine fachliche Nutzeraktion ist, sondern interne Konsistenzpflege.
- Umbenennen in z. B. `private syncPositionsWithCharacters(characters: CharacterInfo[]): void`.
- Öffentliche Schreib-API bleibt auf fachliche Aktionen und den Session-Vertrag beschränkt (`updatePosition`, `setBoardImage`, `updateGridSettings`, `restore`, `reset`).

**Erwartetes Verhalten:** Kein Aufrufer außerhalb des Service.

---

### 3. Session-Services beim App-Start eager instanziieren ✅ done (2026-10-17 20:36)

- **Fund:** Root-Services werden erst beim ersten `inject()` erzeugt. `DungeonBoardService` wird nur von `DungeonTrackerPage` und `GameSessionService` injiziert; Letzterer nur von der lazy geladenen `GameSessionPage`. Ein Effekt im Service liefe also erst, wenn eine dieser Pages einmal geöffnet wurde.
- In `app.config.ts` per `provideAppInitializer(() => { inject(GameSessionService); })` den Orchestrator beim Start erzeugen. Da er alle Slices für seine Slice-Map injiziert, werden damit sämtliche Session-Services (inkl. `DungeonBoardService`) eager gestartet.

**Erwartetes Verhalten:** Charakter im Character-Tracker löschen, **ohne** den Dungeon-Tracker je geöffnet zu haben → Position ist trotzdem aus `dungeon_positions` entfernt.

---

### 4. Nur bei echter Änderung schreiben ✅ done (2026-10-17 20:36)

- **Fund:** Die Sync-Logik ruft bei **jedem** Lauf `_positions.set()` auf — auch wenn sich keine Position geändert hat. `PersistedState.set()` prüft nicht auf Gleichheit: Es entsteht ein neues Array (Abhängige wie `sessionState`/`snapshot` feuern unnötig) und ein Storage-Write.
- `_positions.set()` nur aufrufen, wenn Positionen entfernt oder hinzugefügt wurden; andernfalls weder Signal noch Storage anfassen.
- Kein eigener `persist*()`-Weg (Regel Punkt 4) — geschrieben wird ausschließlich über `_positions.set()`.

**Erwartetes Verhalten:** Änderung an einem bestehenden Charakter (z. B. Schaden) → `positions` bleibt dasselbe Array, kein Storage-Write.

---

### 5. Neue Tokens nicht auf belegte Felder setzen ✅ done (2026-10-17 20:36)

- **Fund:** Neue Positionen werden mit `col: index % 5, row: Math.floor(index / 5)` platziert, wobei `index` nur über die **neuen** Charaktere läuft. Ein einzelner neuer Charakter landet daher immer auf `[0,0]` — auch wenn dort bereits ein Token steht.
- Platzierung sucht das erste freie Feld (zeilenweise, 5 Spalten breit), das weder von einer bestehenden noch von einer im selben Lauf neu vergebenen Position belegt ist.
- Platzierungslogik als reine Funktion in `features/dungeon-tracker/utils/token-placement.util.ts` mit Spec gleichen Stamms (Regel „Dateinamen“).

**Erwartetes Verhalten:** Zwei Charaktere nacheinander anlegen → Tokens liegen auf unterschiedlichen Feldern. Mehrere Charaktere auf einmal → ebenfalls alle auf unterschiedlichen Feldern.

---

### 6. Abgeleitete Token-Liste als `computed()` ✅ done (2026-10-17 20:36)

- **Fund:** Die Page verknüpft Positionen und Charaktere im Template per `getCharacter(pos.characterId)` — zweimal pro Position und pro Change-Detection-Lauf eine lineare Suche.
- **Fund:** Zwischen dem Löschen eines Charakters und dem nächsten Effekt-Lauf existieren kurzzeitig Positionen ohne Charakter. `DungeonToken` erhält dann `character = undefined`, und die Sidebar zählt diese Positionen in `positions().length` mit.
- Im Service ein `readonly tokens: Signal<{ position: DungeonPosition; character: CharacterInfo }[]>` als `computed()` aus `positions` und `characters` anbieten; Positionen ohne zugehörigen Charakter werden ausgefiltert.
- Template (Sidebar und Spielbrett) iteriert über `tokens()`; `getCharacter()` entfällt.

**Erwartetes Verhalten:** Unverändertes UI-Verhalten, keine Tokens ohne Charakter, weniger Logik in der Komponente.

---

### 7. Tests anpassen und ergänzen ✅ done (2026-10-17 20:36)

`dungeon-board.service.spec.ts` existiert bereits und deckt Init/Fallback (`describePersistedState`) sowie `updatePosition`, `setBoardImage`, `updateGridSettings`, `restore`, `reset` und `sessionState` ab.

- Test `should add positions for new and drop positions of removed characters` umschreiben: nicht mehr die (dann private) Methode aufrufen, sondern über `CharactersDbService.writeCharacter`/`removeCharacter` + `TestBed.tick()` den Effekt auslösen.
- Neue Testfälle im Service-Spec:
  - Charakter hinzufügen → Position entsteht und wird persistiert.
  - Charakter entfernen → Position verschwindet und wird persistiert.
  - Unveränderter Charakterbestand (z. B. nur Schaden geändert) → `positions` behält die Referenz, kein Storage-Write (Punkt 4).
  - `restoreSnapshot` bzw. `restore` mit konsistenten Charakteren und Positionen → Positionen bleiben nach dem Effekt-Lauf unverändert.
  - `tokens` filtert Positionen ohne Charakter aus (Punkt 6).
- `token-placement.util.spec.ts`: freies Feld neben belegten Feldern, mehrere neue Tokens in einem Lauf, Umbruch nach 5 Spalten (Punkt 5).
- `dungeon-tracker-page.spec.ts` an entfernten Page-Effekt und entfallenes `getCharacter()` anpassen (z. B. über `tokens()` prüfen).
- `app.config`: Test, dass `DungeonBoardService` nach App-Initialisierung existiert bzw. die Sync ohne Page läuft (Punkt 3).

---

## Betroffene Dateien

| Datei                                                                                           | Änderung                                                   |
| ----------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| `src/app/features/dungeon-tracker/services/dungeon-board.service.ts`                            | Effekt, private Sync-Methode, Change-Check, `tokens`       |
| `src/app/features/dungeon-tracker/services/dungeon-board.service.spec.ts`                       | Sync-Test umschreiben, neue Fälle (Punkt 7)                |
| `src/app/features/dungeon-tracker/utils/token-placement.util.ts`                                | Neu: Platzierung auf freiem Feld (Punkt 5)                 |
| `src/app/features/dungeon-tracker/utils/token-placement.util.spec.ts`                           | Neu: Tests zur Platzierung                                 |
| `src/app/features/dungeon-tracker/components/dungeon-tracker-page/dungeon-tracker-page.ts`      | Page-Effekt und `getCharacter()` entfernen                 |
| `src/app/features/dungeon-tracker/components/dungeon-tracker-page/dungeon-tracker-page.html`    | Iteration über `tokens()` (Punkt 6)                        |
| `src/app/features/dungeon-tracker/components/dungeon-tracker-page/dungeon-tracker-page.spec.ts` | Anpassen an entfernten Page-Effekt / `getCharacter()`      |
| `src/app/app.config.ts`                                                                         | `provideAppInitializer` mit `GameSessionService` (Punkt 3) |
| `.claude/rules/architecture.md`                                                                 | Verzeichnisstruktur um `dungeon-tracker/utils/` ergänzen   |

---

## Hinweise

- Dateilimit 150 Zeilen beachten: `dungeon-board.service.ts` hat bereits ~80 Zeilen; die Platzierungslogik gehört deshalb in die Util (Punkt 5).
- Regel Punkt 7 bleibt gewahrt: `DungeonBoardService` **liest** `characters` und schreibt nur seinen eigenen Key `dungeon_positions`.
- Effekte in Root-Services laufen verzögert (bei der nächsten Change Detection bzw. `TestBed.tick()`). Bei `restoreSnapshot` und `startSession` sieht der Effekt daher erst den vollständig wiederhergestellten Zustand — die Reihenfolge der Slices im `GameSessionService` ist unerheblich.
- Specs mit Effekten mit Timeout ausführen (siehe Effekt-Loop-Problem aus `shared-session-state` #9).

---

## Akzeptanzkriterien

- [x] `DungeonTrackerPage` enthält keinen `effect()` zur Positions-Synchronisation mehr
- [x] `initPositionsForCharacters()` ist nicht mehr öffentlich
- [x] Charakter löschen ohne geöffneten Dungeon-Tracker → Position ist aus `dungeon_positions` entfernt
- [x] Unveränderter Charakterbestand löst weder neues `positions`-Array noch Storage-Write aus
- [x] Neue Tokens werden nie auf ein belegtes Feld gesetzt (auch nicht bei mehreren gleichzeitig)
- [x] Snapshot laden lässt die geladenen Positionen unverändert
- [x] Template nutzt `tokens()`; `getCharacter()` existiert nicht mehr
- [x] Testfälle aus Punkt 7 vorhanden
- [x] Alle Vitest-Tests laufen durch (`npm run test`), Build fehlerfrei (`npm run build`)
