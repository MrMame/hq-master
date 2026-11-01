# Feature Request: Ereignis-Log der Spielesession im TimeTracker

**Datum:** 2026-11-01  
**Priorität:** Mittel  
**Status:** offen  
**Bezug:** `REQUIREMENTS.md` (1. Time Tracker: „Loggen aller zeitrelevanten Dinge“, „Jede Änderung oder zeitlich
abhängige und ausgelöste Aktion soll in einem einsehbaren Log für den Dungeon Master einsehbar sein“),
Voraussetzung `docs/feature-requests/done/character-conditions.md` #3/#4 (`ConditionEvent`, `ConditionTickService`),
`.claude/rules/architecture.md` → „Session-State-Services“ (Regel 1–9)

---

## Problem

Wenn die Zeit vorrückt, wendet die App Schaden durch Zustände automatisch an und lässt Zustände ablaufen
(`character-conditions.md`). Der DM sieht danach aber nur das neue Leben. Er erfährt nicht, **wann** und
**warum** sich ein Wert geändert hat. Vor allem nach einem großen Zeitsprung (+1 h, +8 h) kann er den
Verlauf nicht nachvollziehen.

---

## Ziel

- Ein Log in der Spielesession sammelt jedes zeitabhängige und manuelle Ereignis mit Spielzeit:
  Zeitschritte, Schaden durch Zustände, abgelaufene Zustände, gesetzte und entfernte Zustände sowie manueller
  Schaden.
- Der TimeTracker zeigt das Log, die neuesten Einträge oben.
- Das Log wird mit der Session gespeichert, übersteht einen Reload und steht im XML-Spielstand.

```
GameTimeService.addTime() ─────────────► GameLogService.append({ type: 'time', … })
ConditionTickService (Tick) ───────────► GameLogService.append(ConditionEvent → Eintrag)
CharacterEditorDialog (Übernehmen) ────► append({ type: 'condition-set' | 'condition-removed', … })
CharacterDamageService (Dialog) ───────► append({ type: 'damage', … })
                                              │
                                              ▼
                      PersistedState<GameLogEntry[]> ─► TimeTracker-Liste, Snapshot, XML
```

---

## Anforderungen

### 1. Modell

- `core/models/game-log-entry.model.ts`:
  - `GameLogEntryType` = `'time' | 'condition-damage' | 'condition-expired' | 'condition-set' |
'condition-removed' | 'damage'`.
  - `GameLogEntry`: `id`, `type`, `gameTime: string` (ISO-Spielzeit des Ereignisses), `characterId?`,
    `characterName?` (zum Zeitpunkt des Ereignisses, damit der Eintrag nach dem Entfernen des Charakters
    lesbar bleibt), `conditionId?`, `value?` (Schaden bzw. Sekunden), `text` (fertiger Anzeigetext).
- Der Anzeigetext wird beim Schreiben erzeugt, z. B. „Grimgor: 1 Schaden durch Gift“, „Blind bei Lyra
  abgelaufen“, „+1 h (12:00:00 → 13:00:00)“. Dafür gibt es eine reine Funktion in
  `shared/utils/game-log-text.util.ts`.

---

### 2. Session-Service `GameLogService`

- Per CLI: `ng g s core/services/game-log/game-log` → `GameLogService`, `SessionStateSlice<GameLogEntry[]>`.
  - `_entries = persistedState(SESSION_KEYS.gameLog, () => [], GAME_LOG_CODEC)`. Der Codec verwirft
    ungültige Einträge.
  - `readonly entries: Signal<GameLogEntry[]>`, `append(...entries)`, `clear()`, `restore()`, `reset()`.
  - Es bleiben höchstens 1000 Einträge, die ältesten fallen zuerst weg. So bleibt der LocalStorage klein.
- Eintrag in `SessionSliceData`. Eine neue Session (`reset()`) leert das Log.

**Erwartetes Verhalten:** Das Log ist ein normaler Teil der Spielesession: Es übersteht einen Reload, wird
beim Session-Start geleert und beim Laden eines Spielstands ersetzt.

---

### 3. Ereignisse schreiben

- **Zustände:** `ConditionTickService` übergibt seine `ConditionEvent`s direkt an `GameLogService.append()`.
  Das Signal `lastEvents` aus `character-conditions.md` #4 fällt weg: Mehrere Ticks vor dem nächsten
  `effect()`-Lauf würden sonst Ereignisse verschlucken. Der Zeitpunkt jedes Eintrags ist der Wirkmoment,
  nicht die neue Spielzeit. Bei +1 h stehen also 10 Gift-Einträge mit ihrer jeweiligen Minute im Log.
- **Zeitschritte:** `addTime()` und `setGameTime()` schreiben je einen Eintrag (alte → neue Spielzeit).
  Damit das Log in der richtigen Reihenfolge steht, steht der Zeiteintrag **vor** den Tick-Einträgen, die
  er auslöst. `restore()` und `reset()` schreiben keinen Eintrag.
- **Zustände im Editor:** Beim „Übernehmen“ kommt je neu gesetztem oder entferntem Zustand ein Eintrag ins
  Log. Reine Werteänderungen werden nicht geloggt.
- **Manueller Schaden:** `CharacterDamageService` loggt Wert und Art („3 Schaden auf Rüstung“ / „auf Leben“).
- Querbezug nach Regel 7: Jeder Service schreibt nur über `GameLogService.append()`, nie direkt in den
  Storage-Key.

---

### 4. Anzeige im TimeTracker

- Neue Komponente per CLI: `ng g c features/time-tracker/components/game-log-list` → `GameLogList`.
- Die Liste steht unter der Übersicht der aktiven Zustände. Jede Zeile zeigt die Spielzeit (`HH:mm:ss`, das
  Datum nur beim Tageswechsel als Trennzeile), ein Symbol je Typ (Zustandssymbol aus `CONDITION_TEMPLATES`,
  sonst Uhr bzw. `hit-*.svg`) und den Text.
- Die neuesten Einträge stehen oben. Die Liste scrollt in sich, der Rest der Seite bleibt stehen.
- Filter als Chips: „Alle“, „Zeit“, „Zustände“, „Schaden“ (UI-Zustand, nicht persistiert).
- Ohne Einträge steht dort „Noch keine Ereignisse“.
- Der Button „Log leeren“ leert das Log erst nach einer Rückfrage (`ConfirmationService`).

**Erwartetes Verhalten:** Nach +1 h mit einem vergifteten Charakter zeigt die Liste oben den Zeitschritt,
darunter 10 Gift-Einträge mit je einer Minute Abstand und „Gift abgelaufen“.

---

### 5. Spielstand (XML)

- Neuer Mapper `features/game-session/xml/game-log.xml-mapper.ts` (`writeGameLog` / `readGameLog`):
  `<gameLog><entry id type gameTime characterId characterName conditionId value>text</entry></gameLog>`.
- Fehlt `<gameLog>` (ältere Spielstände), wird das Log geleert und nicht als Fehler behandelt.

---

### 6. Dokumentation

- `REQUIREMENTS.md` 1. Time Tracker: die Log-Funktion konkretisieren (welche Ereignisse, Filter, Leeren).
- `.claude/rules/architecture.md`: Modell, Service, Util, Mapper und Komponente eintragen.
- In `character-conditions.md` #4 den Hinweis auf `lastEvents` durch `GameLogService.append()` ersetzen,
  falls jener Request zuerst umgesetzt ist.

---

### 7. Tests

- `game-log.service.spec.ts`: `describePersistedState`, `append` mit Höchstgrenze, `clear`, `restore`,
  `reset`.
- `game-log-text.util.spec.ts`: Texte je Typ, auch mit fehlendem Charakternamen.
- Bei den Schreibern prüfen: Zeitschritt vor den Tick-Einträgen, Wirkmoment als Zeitpunkt, kein Eintrag
  bei `restore()`/`reset()`, Editor loggt nur Setzen und Entfernen, Eintrag bei manuellem Schaden.
- `game-log-list.spec.ts` über DOM: Reihenfolge, Datums-Trennzeile, Filter, leerer Zustand, Leeren mit
  Rückfrage (bestätigt und abgebrochen).
- `game-log.xml-mapper.spec.ts`: Round-Trip, älterer Spielstand ohne `<gameLog>`.

---

## Akzeptanzkriterien

- [ ] Zeitschritte, Schaden durch Zustände, abgelaufene, gesetzte und entfernte Zustände sowie manueller
      Schaden erscheinen im Log mit der Spielzeit des Ereignisses.
- [ ] Bei einem Zeitsprung steht jeder nachgeholte Wirkmoment als eigener Eintrag zu seiner Minute im Log.
- [ ] Der TimeTracker zeigt das Log mit den neuesten Einträgen oben, filterbar und nach Rückfrage leerbar.
- [ ] Das Log übersteht einen Reload, wird beim Start einer neuen Session geleert und ist im XML-Spielstand
      enthalten. Ältere Spielstände lassen sich laden.
- [ ] Es bleiben höchstens 1000 Einträge, die ältesten fallen weg.
- [ ] Tests und Coverage-Schwellen sind grün, keine Datei über 150 Zeilen.

---

## Annahmen (zur Verifikation, nicht im Interview geklärt)

- Geloggt werden nur fachliche Ereignisse. Bewegungen auf dem Spielbrett, Editor-Änderungen an Werten und
  Raster-Einstellungen gehören nicht dazu.
- „Ereignisse per Knopfdruck registrieren“ (REQUIREMENTS 1, z. B. „Falle ausgelöst“, „Fackel entzündet“) ist
  ein eigener Request. Das Log ist dafür vorbereitet (ein neuer `GameLogEntryType`).
- Die Grenze von 1000 Einträgen reicht für eine Session. Ältere Einträge braucht der DM nur im
  XML-Spielstand.
- Einträge lassen sich nicht einzeln bearbeiten oder löschen, nur das ganze Log leeren.
