# Refactoring Request: Session-State-Muster als expliziter Baustein

**Datum:** 2026-10-17  
**Priorität:** Mittel  
**Status:** offen  
**Bezug:** `.claude/rules/architecture.md` (Session-State-Services, Regeln 1–8), `docs/feature-requests/shared-session-state.md`

---

## Problem

Das Shared-Session-State-Muster existiert nur als Konvention. Jeder Session-Service baut es von Hand nach – mit jeweils anderen Namen. Am Code ist nicht erkennbar, welche Services zur Session gehören und dass sie demselben Muster folgen.

| Service               | Laden                             | Schreiben                                     | Key                           |
| --------------------- | --------------------------------- | --------------------------------------------- | ----------------------------- |
| `CardManagerService`  | `load()`                          | `persist()`                                   | `KEY_DECK_STATE`              |
| `DungeonBoardService` | `loadBoard()` / `loadPositions()` | `persistBoard()` / `persistPositions()`       | `KEY_BOARD`, `KEY_POSITIONS`  |
| `GameTimeService`     | `loadGameTime()`                  | `updateAndPersist()`                          | `KEY_GAME_TIME`               |
| `GameSessionService`  | `loadMeta()`                      | `persist()`                                   | `KEY_SESSION_META`            |
| `CharactersDbService` | **public** `readCharacters()`     | `writeCharacters()` (public, schreibt direkt) | `TABLENAME_CHARACTERS` (Feld) |

Weitere Funde:

- `CharactersDbService.readCharacters()` ist eine öffentliche Snapshot-Methode (Verstoß gegen Architekturregel 2).
- `CharactersDbService.writeCharacter()` / `removeCharacter()` lesen `this._characters()` getrackt. Aus einem `effect()` aufgerufen droht dieselbe Endlosschleife wie in shared-session-state #9 (dort nur in `DungeonBoardService` per `untracked` gelöst).
- Die Storage-Keys sind über die Features verteilt; es gibt keine zentrale Übersicht, was zur Session gehört.
- `GameSessionService` kennt jeden Session-Service einzeln und ruft je Service unterschiedlich benannte Methoden auf (`writeCharacters([])`, `reset()`, `restoreState(null)`, `setGameTime(...)`).

---

## Ziel

Zwei voneinander unabhängige Bausteine machen das Muster explizit:

| Baustein               | Ebene                                          | Granularität | Nutzer                          |
| ---------------------- | ---------------------------------------------- | ------------ | ------------------------------- |
| `PersistedState<T>`    | Technik: ein Wert in Signal + Storage          | pro Signal   | nur der Service selbst (privat) |
| `SessionStateSlice<T>` | Fachlich: was ein Service zur Session beiträgt | pro Service  | `GameSessionService`            |

Ein Slice wird mit einem oder mehreren `PersistedState`s **implementiert**, exponiert sie aber nicht (sonst könnte der Orchestrator beliebig schreiben – Verstoß gegen Regel 7).

---

## Anforderungen

### 1. `persistedState<T>()` und `SESSION_KEYS` einführen

- Neuer Ordner `src/app/core/session-state/`.
- `session-keys.ts`: zentrale Konstante `SESSION_KEYS` mit allen bestehenden Storage-Keys (Werte unverändert, damit vorhandene localStorage-Daten weiter gelesen werden: `characters`, `game_time`, `dungeon_board`, `dungeon_positions`, `card_manager_deck_state`, `game_session_meta`) und Typ `SessionStateKey`.
- `persisted-state.ts`:

  ```ts
  export interface PersistedState<T> {
    readonly value: Signal<T>; // öffentliche Lese-Schnittstelle
    current(): T; // untracked – sicher in Mutationen, die aus effect() kommen
    set(next: T): void; // Signal + Storage gemeinsam
    update(fn: (current: T) => T): void;
  }

  export function persistedState<T>(
    key: SessionStateKey,
    fallback: () => T,
    codec?: StorageCodec<T>, // z. B. Date <-> ISO-String für GameTime
  ): PersistedState<T>;
  ```

  - Muss im Injection Context aufgerufen werden (Feld-Initializer eines Service), nutzt intern `inject(StorageService)`.
  - Initialisierung: Storage lesen, bei fehlendem/ungültigem Wert `fallback()`.
  - `update()` liest den aktuellen Wert `untracked`.

- Alle Session-Services auf `persistedState` umstellen; private `load*`/`persist*`/`updateAndPersist`-Methoden und lokale `KEY_*`-Konstanten entfallen:
  - `CharactersDbService`: `readCharacters()` entfernen; `writeCharacters()` wird privat bzw. in Anforderung 2 durch `restore()` ersetzt.
  - `GameTimeService`: `codec` für `Date` ↔ ISO-String, Default bleibt `DEFAULT_GAME_TIME`.
  - `DungeonBoardService`: zwei `persistedState`s; `currentBoard()`/`currentPositions()` entfallen zugunsten `current()`.
  - `CardManagerService`, `GameSessionService` (Meta).
- Gemeinsamer Vertragstest-Helfer (z. B. `core/session-state/testing/describe-persisted-state.ts`), der Regel 8 einheitlich prüft: Init aus Storage, Default-Fallback bei fehlendem und ungültigem Wert, Mutation aktualisiert Signal **und** Storage. Specs von `persisted-state.ts` decken zusätzlich `codec` und `untracked`-Verhalten ab (Mutation aus `effect()` löst keine Schleife aus).

**Erwartetes Verhalten:** Keine fachliche Änderung. Bestehende localStorage-Daten werden unverändert geladen. Jeder Session-Zustand ist an der Feldinitialisierung `persistedState(SESSION_KEYS.x, …)` erkennbar.

---

### 2. `SessionStateSlice<T>`-Vertrag einführen

Setzt Anforderung 1 voraus.

- `core/session-state/session-state-slice.ts`:

  ```ts
  export interface SessionStateSlice<T> {
    readonly sessionState: Signal<T>; // kompletter Zustand des Slice
    restore(state: T): void; // Session laden
    reset(): void; // neue Session
  }
  ```

  Feldname `sessionState` (nicht `state`), um Kollisionen mit fachlichen Signals (`characters`, `boardState`, `CardManagerService.state`) zu vermeiden. Keine Methode `snapshot(): T` (Regel 2).

- `core/session-state/session-slices.ts`: `SessionSliceData` (`gameTime`, `characters`, `dungeon`, `deck`) und Mapped Type `SessionSlices = { [K in keyof SessionSliceData]: SessionStateSlice<SessionSliceData[K]> }`.
- Implementierungen:
  - `CharactersDbService implements SessionStateSlice<CharacterInfo[]>`
  - `GameTimeService implements SessionStateSlice<Date>`
  - `DungeonBoardService implements SessionStateSlice<DungeonSessionState>` mit `DungeonSessionState { board; positions }` als `computed()`; ersetzt `restore(board, positions)`. `DungeonXmlData` wird durch `DungeonSessionState` ersetzt (identische Struktur).
  - `CardManagerService implements SessionStateSlice<DeckState | null>`; ersetzt `restoreState()`.
- `GameSessionService` als Orchestrator:
  - Hält die Slices in einer typisierten `SessionSlices`-Map.
  - `startSession`: alle Slices `reset()`, danach `gameTime.restore(startTime)`.
  - `restoreSnapshot`: je Slice `restore()` über generische Hilfsmethode `restoreSlice<K>()` (typsicher ohne Cast).
  - `snapshot`: `computed()` aus Meta + `sessionState()` aller Slices (bewusst ausgeschrieben, kein `mapValues` mit Cast).
  - Meta bleibt Eigentum des Orchestrators und ist kein Slice.
- `SessionSnapshot` = `SessionSliceData & { meta: SessionMeta }`; `SessionXmlService` und Fixtures auf `snapshot.dungeon` anpassen.
- XML-Dateiformat bleibt unverändert (`<dungeonBoard>` enthält bereits Board + Positionen); bestehende Spielstände laden weiterhin.
- Tests: je Slice `restore()`/`reset()`; `GameSessionService` ruft für jeden Slice `reset()` bzw. `restore()` auf.

**Erwartetes Verhalten:** Keine fachliche Änderung. Ein neuer Session-Zustand erfordert einen Eintrag in `SessionSliceData`; der Compiler meldet dann alle fehlenden Stellen (Slice-Map, Snapshot, XML).

---

### 3. Architekturregel anpassen

- `.claude/rules/architecture.md`, Abschnitt „Session-State-Services“: Referenzmuster durch `persistedState` + `SessionStateSlice` ersetzen; Regeln 3–5 verweisen auf den Baustein statt auf manuelle `persist()`/`load()`-Methoden.
- Verzeichnisstruktur um `core/session-state/` ergänzen.
- Anti-Pattern ergänzen: Session-Zustand nicht per `signal()` + manuellem Storage-Zugriff, sondern über `persistedState`.

---

## Betroffene Dateien

| Datei                                                                                                                       | Änderung                                                     |
| --------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| `src/app/core/session-state/*` (neu)                                                                                        | `persistedState`, `SESSION_KEYS`, Slice-Vertrag, Test-Helfer |
| `src/app/core/services/characters/characters-db.service.ts`                                                                 | Umstellung, `readCharacters()` entfernen, Slice              |
| `src/app/core/services/game-time/game-time.service.ts`                                                                      | Umstellung mit Date-Codec, Slice                             |
| `src/app/features/dungeon-tracker/services/dungeon-board.service.ts`                                                        | Umstellung, Slice mit `DungeonSessionState`                  |
| `src/app/features/card-manager/services/card-manager.service.ts`                                                            | Umstellung, Slice                                            |
| `src/app/features/game-session/services/game-session.service.ts`                                                            | Orchestrator über `SessionSlices`                            |
| `src/app/features/game-session/models/session-snapshot.model.ts`                                                            | `SessionSliceData & { meta }`                                |
| `src/app/features/game-session/services/session-xml.service.ts`, `xml/dungeon.xml-mapper.ts`, `testing/session.fixtures.ts` | `dungeon`-Feld statt `board`/`positions`                     |
| Aufrufer von `readCharacters()`, `writeCharacters()`, `restoreState()`, `restore(board, positions)`                         | auf neue API umstellen                                       |
| `.claude/rules/architecture.md`                                                                                             | Regel und Referenzmuster aktualisieren                       |

---

## Akzeptanzkriterien

- [ ] Kein Session-Service enthält mehr eigene `load*`/`persist*`-Methoden oder lokale `KEY_*`-Konstanten.
- [ ] Alle Session-Storage-Keys stehen ausschließlich in `SESSION_KEYS`; Werte unverändert.
- [ ] Kein Session-Service exponiert eine öffentliche Snapshot-Lesemethode.
- [ ] Alle vier Feature-Session-Services implementieren `SessionStateSlice<T>`; `GameSessionService` ruft keine service-spezifischen Reset-/Restore-Methoden mehr auf.
- [ ] Vorhandene localStorage-Daten und bestehende XML-Spielstände werden unverändert geladen.
- [ ] Alle Dateien ≤ 150 Zeilen.
- [ ] Alle Vitest-Tests laufen durch (`npm run test`).
- [ ] TypeScript strict-mode: kein `any`, keine Casts in der Slice-Orchestrierung außer `Object.keys`, Build fehlerfrei (`npm run build`).
