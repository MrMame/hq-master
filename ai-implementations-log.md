# Projekt-Status & KI-Logbuch

## 🛠️ Letzte Änderungen (Chronologisch)

### (2026-10-17 21:19) - Refactoring: DungeonToken mit Pflicht-Charakter und einheitlichem Rahmen (dungeon-token-required-character #1–#3)

- **Was wurde gemacht:** `DungeonToken.character` ist Pflicht-Input; Optional-Chaining und Non-Null-Assertions in Template und `initials` entfallen. `tokenBorderClass` (Held/Monster per Namensanfang „hero“) ist entfernt, alle Tokens tragen fest den goldenen Rahmen. Neue Spec deckt Pixelposition, Initialen/Bild, Rahmen, Drag-Ende (gerundet, nie negativ, `reset()`) und Doppelklick ab.
- **Dateien geändert:** `dungeon-token.ts`, `dungeon-token.spec.ts` (neu), `docs/refactoring-requests/dungeon-token-required-character.md` (→ done/)
- **Wichtige Entscheidung:** Keine Unterscheidung zwischen Helden und Monstern (Nutzerentscheidung, `character-kind-hero-monster` rejected); bisher rot umrandete Tokens sind jetzt gold. Creator-Services und Buttons „Add Hero“/„Add Monster“ bleiben unverändert. Lint, Build und Tests (193/193) grün; die manuelle UI-Prüfung ist noch offen.

### (2026-10-17 20:36) - Feature: DungeonBoard synchronisiert Positionen selbstständig (dungeon-board-reactive-character-sync #1–#7)

- **Was wurde gemacht:** `DungeonBoardService` gleicht seine Positionen per `effect()` auf `CharactersDbService.characters` selbst ab (private `syncPositionsWithCharacters()`, schreibt nur bei hinzugefügten/entfernten Charakteren). Neue Tokens landen über die reine Funktion `placeNewTokens()` auf dem ersten freien Feld. Neues `tokens`-computed (`BoardToken`) verknüpft Position und Charakter und filtert verwaiste Positionen; die Page nutzt nur noch `tokens()`, Effekt und `getCharacter()` entfallen. `app.config.ts` erzeugt den `GameSessionService` per `provideAppInitializer`, damit alle Session-Slices samt Effekten beim App-Start laufen.
- **Dateien geändert:** `dungeon-board.service.ts` (+spec), `dungeon-board-sync.service.spec.ts` (neu), `board-token.model.ts` (neu), `utils/token-placement.util.ts` (+spec, neu), `dungeon-tracker-page.ts|.html|.spec.ts`, `app.config.ts`, `app.config.spec.ts` (neu), `.claude/rules/architecture.md`, `docs/feature-requests/dungeon-board-reactive-character-sync.md` (→ done/)
- **Wichtige Entscheidung:** Die Sync-Tests liegen wegen des 150-Zeilen-Limits in einer eigenen Spec `dungeon-board-sync.service.spec.ts` statt im Spec gleichen Stamms. Positionen außerhalb des 5-Spalten-Startbereichs blockieren keine neuen Felder. Lint, Build und Tests (186/186) grün; die manuelle UI-Prüfung ist noch offen.

### (2026-10-17 20:11) - Fix: Pre-Commit- und Stop-Hook robuster (pre-commit-hook-fixes #1–#3)

- **Was wurde gemacht:** `pre-commit-check.mjs` prüft den gestagten Inhalt per `git show :<datei>` statt der Working Copy (#1) und endet sofort mit Exit 0, wenn `tool_input.command` kein `git commit` enthält (#2). `stop-run-tests.mjs` startet die Tests per `spawn` mit eigenem Timeout (240 s, per `HQ_STOP_HOOK_TIMEOUT_S` überschreibbar), beendet bei Ablauf den gesamten Prozessbaum (Windows `taskkill /T /F`, sonst Prozessgruppe) und meldet den Hänger mit Exit 2 und den letzten 30 Ausgabezeilen (#3).
- **Dateien geändert:** `.claude/hooks/pre-commit-check.mjs`, `.claude/hooks/stop-run-tests.mjs`, `docs/feature-requests/pre-commit-hook-fixes.md` (→ done/)
- **Wichtige Entscheidung:** #1 war durch die `.gitattributes` (`eol=lf`) nur teilweise erfüllt und wurde auf Wunsch trotzdem umgesetzt (deckt CRLF schreibende Editoren und teilweise gestagte Dateien ab). `.prettierrc` und die `if`-Bedingung in `settings.json` sind unverändert; die Prüfung im Skript fängt Fehlauslösungen ab. Die optionale Prüfung auf schon laufende Testprozesse ist auf Wunsch weggelassen. Verifiziert per Skript: Spec mit Endlosschleife nach 60 s abgebrochen, keine verwaisten node-Prozesse; Lint, Build und Tests (172/172) grün.

### (2026-10-17 18:16) - Feature: CharacterTrackerPage refaktoriert (character-tracker-page-refactoring #1–#8)

- **Was wurde gemacht:** Kartenlayout (Position, Minimierung, oberste Karte) liegt im neuen `CharacterCardLayoutService` als Session-Slice und gleicht sich per `effect()` mit den Charakteren ab. Dialoge laufen über `CharacterDialogsService` mit gemeinsamer Größe und typisiertem Ergebnis. Die Page bindet das `characters`-Signal direkt, alle Anlege-, Schadens- und Änderungspfade schreiben nur über `writeCharacter()`. Schaden wird von der reinen Funktion `applyDamage` in `damage.util.ts` berechnet. Das Template ist auf `MovableCharacterCard` und `CharacterCardMinimised` aufgeteilt. `CharacterCard` gibt Änderungen nur noch per `output()` aus und schreibt nicht mehr selbst (#8).
- **Dateien geändert:** `character-tracker-page.ts|.html|.scss|.spec.ts`, `character-card.ts` (+spec), `movable-character-card/*` (neu), `character-card-minimised/*` (neu), `character-card-layout.service.ts` (+spec, neu), `character-dialogs.service.ts` (+spec, neu), `card-layout.model.ts` (neu), `utils/damage.util.ts` (+spec, neu), `add-character-dialog.ts` (+spec), `damage-taken-dialog.ts` (+spec), `session-keys.ts`, `session-slices.ts`, `game-session.service.ts` (+spec), `session-xml.service.ts` (+spec), `card-layout.xml-mapper.ts` (neu), `session.fixtures.ts`, `.claude/rules/architecture.md`, `docs/feature-requests/character-tracker-page-refactoring.md` (→ done/), `docs/feature-requests/characters-db-reactive-read-api.md`, `docs/refactoring-requests/character-tracker-page-cleanup.md` (→ done/); entfernt: `combat-calculator.service.ts` (+spec), `movable-character-item.model.ts`, `movable-item.model.ts`
- **Wichtige Entscheidung:** Auf Wunsch des Nutzers wird das Layout als Session-Slice persistiert (Key `character_card_layout`). Ältere Spielstände ohne `<characterCards>` laden mit leerem Layout, die Formatversion bleibt 1. Neue Karten erscheinen versetzt statt alle bei 50/50. In #8 entfällt der Debounce von 300 ms, jede Eingabe wird sofort einmal gespeichert. Auf Wunsch als bereits erfüllt markiert: `characters-db-reactive-read-api` §2 und `character-tracker-page-cleanup` #1–#3. Die manuelle UI-Prüfung ist noch offen.

### (2026-10-17 17:18) - Refactoring: Ungenutzte Methoden nach session-state-primitive entfernt

- **Was wurde gemacht:** `StorageService.readTableFromLocalStorage()`/`writeTableToLocalStorage()` samt Tests und `MonsterCharacterCreatorService.getInitMonsterCharacters()` entfernt. Seit der Umstellung auf `persistedState` bzw. dem Wegfall des Init-Monster-Fallbacks hatten sie keine Aufrufer mehr.
- **Dateien geändert:** `storage.service.ts` (+spec), `monster-character-creator.service.ts`
- **Wichtige Entscheidung:** Auf Wunsch des Nutzers entfernt statt als neuer Punkt erfasst. Der entsprechende Teil von `characters-db-reactive-read-api` (Init-Monster umstellen oder entfernen) ist damit erledigt; die Datei selbst wurde nicht geändert.

### (2026-10-17 17:11) - Refactoring: Session-State-Muster als expliziter Baustein (session-state-primitive #1–#3)

- **Was wurde gemacht:** Neuer Ordner `core/session-state/` mit `persistedState<T>()` (Signal + Storage gemeinsam, `current()`/`update()` untracked, optionaler `StorageCodec`), `SESSION_KEYS`, `SessionStateSlice<T>` und `SessionSliceData`/`SessionSlices`. Alle Session-Services sind darauf umgestellt; `CharactersDbService`, `GameTimeService`, `DungeonBoardService` und `CardManagerService` implementieren den Slice. `GameSessionService` ruft für jeden Slice nur noch `reset()`/`restore()` auf. Vertragstest `describePersistedState` prüft Regel 8 für jeden Zustandsteil. Architekturregel angepasst.
- **Dateien geändert:** `core/session-state/*` (neu), `characters-db.service.ts`, `game-time.service.ts`, `dungeon-board.service.ts`, `card-manager.service.ts`, `game-session.service.ts` (jeweils +spec), `dungeon-session-state.model.ts` (neu), `session-snapshot.model.ts`, `session-xml.service.ts` (+spec), `dungeon.xml-mapper.ts`, `session.fixtures.ts`, `card-manager-page.ts`, `character-tracker-page.ts` (+spec), `.claude/rules/architecture.md`, `docs/refactoring-requests/session-state-primitive.md`
- **Wichtige Entscheidung:** `CardManagerService.reset()` heißt jetzt `reshuffleAll()`, damit `reset()` den Slice-Vertrag erfüllt. Der Init-Monster-Fallback der CharacterTrackerPage ist auf Wunsch entfernt. `startSession` setzt alle Slices zurück und setzt die Startzeit danach über `setGameTime()`, da `startTime` ein partielles `GameTime` ist. Storage-Keys und XML-Format sind unverändert.

### (2026-10-17 10:31) - Fix: Stop-Hook normalisiert Laufwerksbuchstaben (pre-commit-hook-fixes #4)

- **Was wurde gemacht:** `stop-run-tests.mjs` startet den Testlauf mit einem `cwd`, dessen Laufwerksbuchstabe großgeschrieben ist. Läuft die Sitzung in `f:\…`, fand Vitest sonst seinen Runner nicht und alle 23 Spec-Dateien schlugen fehl.
- **Dateien geändert:** `.claude/hooks/stop-run-tests.mjs`, `docs/feature-requests/pre-commit-hook-fixes.md` (Punkt #4 neu, done)
- **Wichtige Entscheidung:** Verifiziert aus `f:\`: mit Normalisierung 110/110 grün, ohne 23/23 Dateien rot. Punkt #4 wurde während shared-session-state #9 entdeckt und auf Wunsch direkt aufgenommen und umgesetzt; #1–#3 bleiben offen.

### (2026-10-17 10:14) - Feature: Persistenz-Muster und Init-Tests für DungeonBoard/CardManager (shared-session-state #9)

- **Was wurde gemacht:** `DungeonBoardService` liest den Startwert über `loadBoard()`/`loadPositions()` und schreibt jede Mutation über `persistBoard()`/`persistPositions()`, die Signal und Storage gemeinsam setzen. `CardManagerService`: `setState` in `persist` umbenannt, `load()` ergänzt. Specs decken Init, Default-Fallback (leer/ungültiges JSON) und alle Mutationen ab.
- **Dateien geändert:** `dungeon-board.service.ts` (+spec), `dungeon-tracker-page.ts`, `card-manager.service.ts` (+spec), `docs/feature-requests/shared-session-state.md`
- **Wichtige Entscheidung:** Der erste Versuch hing wahrscheinlich in einer Endlosschleife des effects: `initPositionsForCharacters` wird aus einem `effect()` aufgerufen; liest es `_positions()` tracked und setzt dann einen neuen Wert, löst sich der effect immer wieder aus. Abgesichert doppelt: Mutationen lesen den eigenen State mit `untracked()`, die Page ruft die Methode in `untracked()` auf. Dass `draw()` eine aktive Karte überschreibt, ist bekannt, aber nicht behoben (UI nutzt `draw()` nicht).

### (2026-10-17 10:03) - Feature: StorageService robust gegen ungültiges JSON, ungenutzte Injection entfernt (shared-session-state #7, #8)

- **Was wurde gemacht:** `StorageService` liest über eine private Methode `parse()`, die Parse-Fehler abfängt, eine Warnung loggt und `null` zurückgibt. Ein manipulierter localStorage-Eintrag verhindert so nicht mehr den Start der Services, diese fallen auf ihre Default-Werte zurück. Die ungenutzte `GameTimeService`-Injection in `App` ist entfernt.
- **Dateien geändert:** `storage.service.ts` (+spec), `characters-db.service.spec.ts`, `app.ts`, `docs/feature-requests/shared-session-state.md`
- **Wichtige Entscheidung:** Die Umsetzung lag bereits uncommittet im Arbeitsbaum und wurde nach Prüfung übernommen. #8 wurde auf Wunsch in denselben Commit aufgenommen. Ein Eintrag mit gültigem JSON, aber falschem Aufbau, wird weiterhin nicht abgefangen (nicht Teil von #7).

### (2026-10-17 09:31) - Feature: Dialog-Charaktere persistieren (shared-session-state #5)

- **Was wurde gemacht:** `CharacterTrackerPage.addCharacter()` schreibt das Dialog-Ergebnis über `CharactersDbService.writeCharacter()` in die DB, dadurch erscheint der Charakter sofort im Dungeon-Tracker. Die eindeutige String-`id` aus `MonsterCharacterCreatorService` bleibt erhalten. Das Dialog-Ergebnis ist als `CharacterInfo | false` typisiert.
- **Dateien geändert:** `character-tracker-page.ts` (+spec), `docs/feature-requests/shared-session-state.md`, `docs/refactoring-requests/character-tracker-page-cleanup.md` (neu)
- **Wichtige Entscheidung:** Die numerische Item-ID der Karte bleibt vorerst (`length + 1`), wie bei Hero/Monster. Dateilänge (184 > 150), Snapshot-Kopie im Constructor und doppelte Item-IDs sind als Refactoring Request character-tracker-page-cleanup #1–#3 erfasst statt im Scope behoben.

### (2026-10-17 08:58) - Refactoring: Klassen- und Funktionsnamen an Konvention angleichen (file-naming-convention #7)

- **Was wurde gemacht:** `GametimeService` in `GameTimeService` umbenannt (Klassenname folgt jetzt `game-time.service.ts`), Felder einheitlich `gameTimeService`. `ConfirmationDialogComponent` in `ConfirmationDialog` umbenannt (Angular-21-Default ohne Suffix). `parseDateTimeLocal` aus der Komponente in `game-session/utils/date-time-local.util.ts` ausgelagert, Tests mitverschoben.
- **Dateien geändert:** `game-time.service.ts` (+spec), `confirmation-dialog.ts` (+spec), `game-session-page.ts|.html|.spec.ts`, `game-session.service.ts` (+spec), `time-tracker-page.ts`, `app.ts`, `utils/date-time-local.util.ts` (+spec, neu), `.claude/rules/architecture.md`, `docs/feature-requests/shared-session-state.md`, `testing-overhaul.md`, `docs/refactoring-requests/file-naming-convention.md`
- **Wichtige Entscheidung:** Das ungenutzte Feld `gametimeService` in `app.ts` behält seinen Namen, da dessen Entfernung in shared-session-state #8 geregelt wird. Erledigte Abschnitte in Feature Requests behalten den alten Klassennamen (Historie).

### (2026-10-17 08:44) - Refactoring: Einheitliche Dateinamen-Konvention (file-naming-convention #1–#6)

- **Was wurde gemacht:** Alle Dateien unter `src/app/` folgen jetzt der Konvention Kebab-Case + Rollen-Suffix (`*.service.ts`, `*.model.ts`, `*.xml-mapper.ts`, `*.util.ts`, `*.fixtures.ts`). Models aus `core/services/gaming/` nach `core/models/` verschoben, XML-Funktionen aus `game-session/services/xml/` nach `game-session/xml/`, Testdaten nach `game-session/testing/`. `ng g s` erzeugt per `angular.json` automatisch `*.service.ts`.
- **Dateien geändert:** 40 Dateien per `git mv` umbenannt (core, character-tracker, dungeon-tracker, game-session) samt Imports, `angular.json`, `.claude/rules/architecture.md`, offene Feature Requests, `docs/refactoring-requests/file-naming-convention.md`
- **Wichtige Entscheidung:** Reines Umbenennen ohne Klassen- oder Logikänderungen; Imports per Skript aus alten/neuen Pfaden neu berechnet. Abweichende Klassennamen (`GametimeService`, `ConfirmationDialogComponent`) und `parseDateTimeLocal` als eigener Punkt #7 erfasst. Log-Historie bleibt mit alten Pfaden unverändert.

### (2026-10-16 18:37) - GameSession-Feature: Starten/Beenden, Speichern/Laden als XML (shared-session-state #4)

- **Was wurde gemacht:** Neue Seite `/gamesession`. Starten setzt alle Feature-States zurück (Charaktere, Dungeon-Board inkl. Positionen, Kartendeck) und setzt die gewählte Ingame-Startzeit; Beenden markiert die Session nur als inaktiv. Der gesamte Session-Zustand kann als strukturierte XML-Datei gespeichert und wieder geladen werden.
- **Dateien geändert:** `src/app/features/game-session/**` (neu), `dungeon-board-service.ts` (+spec), `card-manager.service.ts` (+spec), `core/services/gaming/game-time.ts` (+spec), `app.routes.ts`, `app.ts`, `docs/feature-requests/shared-session-state.md`
- **Wichtige Entscheidung:** Der `GameSessionService` ändert fremde Zustände nur über die öffentlichen Methoden der jeweils verantwortlichen Services (Architekturregel 7). Der Gesamtzustand ist ein `computed`-Signal `snapshot` statt einer Lesemethode. Das XML ist versioniert (`version="1"`), nach Bereichen in reine Serializer-Funktionen aufgeteilt und wird beim Laden validiert.

### (2026-10-16 18:00) - Spielzeit als reaktives Date-Signal (shared-session-state #3)

- **Was wurde gemacht:** GametimeService exponiert die Spielzeit als öffentliches `gameTime: Signal<Date>` (via `asReadonly()`), damit andere Services per `effect()`/`computed()` auf Zeitänderungen reagieren können (Vorbereitung Schaden-Tick, REQUIREMENTS §2). `gameTimeAsString` leitet sich vom neuen Signal ab.
- **Dateien geändert:** `src/app/core/services/gaming/gametime-service.ts`, `gametime-service.spec.ts`, `docs/feature-requests/shared-session-state.md`
- **Wichtige Entscheidung:** `asReadonly()` statt defensiver Kopie (gemäß Architekturregel). Da `Date` veränderbar ist, gilt die Konvention „gelieferte Date-Instanz nicht verändern“ (JSDoc); jede Änderung erzeugt eine neue Instanz, sodass Abhängige zuverlässig feuern.

### (2026-10-16 15:34) - Spielzeit-Persistenz & TimeTracker-Ausbau (shared-session-state #2, #6)

- **Was wurde gemacht:** GametimeService lädt die Spielzeit beim Start aus localStorage (Key `game_time`) und speichert jede Änderung über den StorageService. TimeTracker zeigt die Spielzeit als Label und hat Buttons für +1/+5/+10 Sekunden. `addTime` nimmt ein `GameTimeSpan`-Objekt, `setGameTime` ein `GameTime`-Objekt inkl. Datum; `addHours`/`addMinutes`/`addSeconds` entfernt.
- **Dateien geändert:** `src/app/core/services/gaming/gametime-service.ts`, `gametime-service.spec.ts`, `game-time.ts` (neu), `game-time-span.ts` (neu), `src/app/features/time-tracker/components/time-tracker-page/time-tracker-page.ts|.html|.spec.ts`, `docs/feature-requests/shared-session-state.md`
- **Wichtige Entscheidung:** Speicherung als ISO-String mit Fallback auf die Standardzeit. Benannte Objekt-Parameter statt positioneller Argumente; getrennte Typen für Zeitspanne (`GameTimeSpan`) und Zeitpunkt (`GameTime`). In `GameTime` ist `month` 1-basiert, fehlende Datumsteile bleiben unverändert, fehlende Uhrzeitteile zählen als 0.
