# Feature Request: Charakter-Zustände mit zeitlichem Effekt

**Datum:** 2026-11-01 (Interview 2026-11-01)  
**Priorität:** Hoch  
**Status:** done (2026-11-01 10:55)  
**Bezug:** `REQUIREMENTS.md` (0. Übersicht: „welche Effekte in der aktuellen Spielzeit Schaden verursachen“,

1. Time Tracker: „Änderungen an der InGame-Zeit führen automatisch zur Ermittlung zeitabhängiger
   Zustandsveränderungen“), `.claude/rules/architecture.md` → „Session-State-Services“ (Regel 4, 6, 7, 9),
   `docs/feature-requests/done/dungeon-token-damage.md` (`CharacterStatus` ist für Statuseffekte vorbereitet)

---

## Problem

Der DM muss sich merken, welcher Charakter vergiftet, benommen oder blind ist, wie lange noch, und wann
Gift wieder Schaden macht. Die App kennt nur die InGame-Zeit (`GameTimeService`) und die Werte eines
Charakters. Zustände gibt es nicht, und eine Zeitänderung löst nichts aus.

---

## Ziel

- Im Charakter-Editor schaltet der DM die Zustände **Gift**, **Benommen** und **Blind** per Checkbox ein
  und aus. Die Werte jedes Zustands kommen aus einer Vorlage und lassen sich pro Charakter anpassen.
- Wenn die InGame-Zeit vorrückt, macht die App bei jedem fälligen Wirkmoment automatisch Schaden
  und entfernt abgelaufene Zustände.
- Aktive Zustände sieht der DM am Token, unter dem markierten Token, in der Legende und im TimeTracker.

```
Editor ─► Checkbox „Gift“ ─► Werte aus Vorlage (anpassbar) ─► Übernehmen: startedAt = Spielzeit
                                                                 │
GameTimeService.gameTime ──(effect)──► ConditionTickService ─────┘
        +10 s / +1 h / +8 h                │  advanceConditions(character, now)
                                           ├─► Schaden je fälligem Wirkmoment (direkt aufs Leben)
                                           ├─► abgelaufene Zustände entfernen
                                           └─► CharactersDbService.writeCharacter(...)
                                                   └─► Token, Legende, Editor, TimeTracker, Snapshot
```

---

## Entscheidungen aus dem Interview (2026-11-01)

| Thema               | Entscheidung                                                                                         |
| ------------------- | ---------------------------------------------------------------------------------------------------- |
| Zeitbasis           | Alles in InGame-Sekunden. Eine Runde ist nur eine Zeitspanne, es gibt keinen eigenen Rundenzähler.   |
| Effektmodell        | Intervall + Schaden je Wirkmoment + Dauer + Beschreibung. Aus „Abklingzeitpunkt“ wird das Intervall. |
| Werte               | Vorlage im Code mit Standardwerten. Beim Ankreuzen kopiert und pro Charakter änderbar.               |
| Benommen / Blind    | Kein Schaden (0), nur Anzeige und Ablauf. Die Wirkung regelt der DM am Brett laut Beschreibung.      |
| Zustandswechsel     | Nur Ein/Aus mit automatischem Ablauf. Keine Folgezustände.                                           |
| Schadensart         | Direkt aufs Leben (wie `DamageTypes.Critical`). Die Rüstung schützt nicht.                           |
| Zeitsprung          | Alle Wirkmomente im übersprungenen Zeitraum nachholen, höchstens bis zum Ende der Dauer.             |
| Zeit zurück         | Nichts rückgängig machen. Wirkmomente nur bei Vorlauf.                                               |
| Start / erster Tick | Start ist die Spielzeit bei „Übernehmen“. Erster Wirkmoment nach einem Intervall.                    |
| 0 Leben             | Kein weiterer Schaden. Der Ablauf der Zustände geht weiter.                                          |
| Unbegrenzt          | Dauer 0 bedeutet unbegrenzt: kein automatischer Ablauf, der Schaden wirkt weiter.                    |
| Aktiver Zustand     | Werte änderbar, die Startzeit bleibt. Abhaken und neu ankreuzen startet neu. Pro Zustand nur einmal. |
| Anzeige             | Symbol am Token (immer), Zustände unter dem markierten Token, in der Legende und im TimeTracker.     |
| Symbole             | Eigene SVGs unter `public/img/conditions/`, der Pfad steht in der Vorlage.                           |
| TimeTracker         | Nur Anzeige, sortiert nach dem nächsten Wirkmoment.                                                  |
| Eingabe             | Dauer und Intervall als Minuten + Sekunden, Anzeige `m:ss`.                                          |
| Log                 | Nicht Teil dieses Requests. Folge-Request: `docs/feature-requests/game-event-log.md`.                |

---

## Anforderungen

### 1. Modelle und Vorlage ✅ done (2026-11-01 10:55)

- `core/models/character-condition.model.ts`:
  - `ConditionId` = `'poison' | 'dazed' | 'blind'`.
  - `ConditionTemplate`: `id`, `label` („Gift“, „Benommen“, „Blind“), `icon` (Pfad), `intervalSeconds`,
    `damagePerTick`, `durationSeconds` (0 = unbegrenzt), `description`.
  - `ActiveCondition`: `id: ConditionId`, `intervalSeconds`, `damagePerTick`, `durationSeconds`,
    `description`, `startedAt: string` (ISO-Spielzeit), `lastTickAt: string` (ISO, anfangs = `startedAt`).
- `core/models/condition-templates.model.ts`: `CONDITION_TEMPLATES` mit den Standardwerten:
  - Gift: alle 60 s 1 Schaden, Dauer 10 min
  - Benommen: Intervall 0, Schaden 0, Dauer 30 s
  - Blind: Intervall 0, Schaden 0, Dauer 1 min
  - Ein Intervall von 0 bedeutet: keine Wirkmomente, nur Ablauf.
- `CharacterInfo` bekommt `conditions: ActiveCondition[]`. `createNewCharacter()` und
  `createRandomCharacter()` liefern `[]`.
- Symbole `public/img/conditions/poison.svg`, `dazed.svg`, `blind.svg` (Tropfen/Totenkopf, Spirale,
  durchgestrichenes Auge). Sie sind einfarbig und auf dunklem Grund gut lesbar.

**Erwartetes Verhalten:** Jeder Charakter hat eine (anfangs leere) Liste aktiver Zustände. Neue Zustände
kommen später über einen Eintrag in `CONDITION_TEMPLATES` und ein Symbol dazu.

---

### 2. Persistenz und Spielstand ✅ done (2026-11-01 10:55)

- `CharactersDbService` erhält einen `StorageCodec`. Gespeicherte Charaktere ohne `conditions` (ältere
  Sessions) bekommen `[]`, ungültige Einträge werden verworfen.
- `characters.xml-mapper.ts` schreibt je Zustand ein Element
  `<condition id interval damage duration startedAt lastTickAt>` mit `<description>`. Beim Lesen bekommen
  ältere Spielstände ohne Zustände `[]`.

**Erwartetes Verhalten:** Zustände bleiben nach einem Reload erhalten und sind im XML-Spielstand
enthalten. Ältere Sessions und Spielstände lassen sich weiter laden.

---

### 3. Zeitberechnung als reine Funktion ✅ done (2026-11-01 10:55)

- `shared/utils/condition-tick.util.ts` (neben `damage.util.ts`, das es nutzt):
  `advanceConditions(character, now: Date): { character: CharacterInfo; events: ConditionEvent[] }`.
  - Ende eines Zustands: `startedAt + durationSeconds` (bei 0 kein Ende).
  - Fällige Wirkmomente: `lastTickAt + k × intervalSeconds ≤ min(now, Ende)`. Jeder fällige Wirkmoment
    macht `damagePerTick` direkt aufs Leben (`applyDamage(…, DamageTypes.Critical, …)`), danach wird
    `lastTickAt` auf den letzten Wirkmoment gesetzt.
  - Bei 0 Leben gibt es keinen Schaden mehr, aber `lastTickAt` wird trotzdem fortgeschrieben.
  - Ist `now ≥ Ende`, wird der Zustand entfernt. Der Wirkmoment genau zum Ende zählt noch.
  - Ist `now ≤ lastTickAt` (Zeit zurückgesetzt), ändert sich nichts.
- `core/models/condition-event.model.ts`: `ConditionEvent` = `{ type: 'damage' | 'expired',
characterId, conditionId, gameTime: string, damage? }`. `docs/feature-requests/game-event-log.md` loggt diese Ereignisse.
- Ohne Änderung kommt dasselbe Objekt zurück, damit kein unnötiges Schreiben entsteht.

**Erwartetes Verhalten:** Gift (60 s / 1 / 10 min), gesetzt um 12:00:00, macht bei +1 h genau
10 Schaden und ist danach weg. Bei +30 s passiert nichts, bei weiteren +30 s gibt es 1 Schaden.

---

### 4. Automatischer Tick bei Zeitänderung ✅ done (2026-11-01 10:55)

- Neuer Service per CLI, z. B. `ng g s shared/services/condition-tick` (wie `CharacterDamageService` unter `shared/`) → `ConditionTickService`.
  - Ein `effect()` liest `GameTimeService.gameTime()`. Die Charaktere liest er untracked (siehe Memory
    „Effect loop test hang“ und Regel 4). Für jeden Charakter ruft er `advanceConditions()` auf und
    schreibt nur geänderte Charaktere über `CharactersDbService.writeCharacter()` (Regel 7).
  - Er hat keinen eigenen Session-Zustand. Der Fortschritt steht in `lastTickAt` am Charakter.
  - Die Ereignisse stellt er als Signal `lastEvents: Signal<ConditionEvent[]>` bereit (ohne Persistenz).
    `docs/feature-requests/game-event-log.md` ersetzt das Signal später durch einen direkten Aufruf von `GameLogService.append()`.
- Der Service wird app-weit beim Start erzeugt (z. B. `provideAppInitializer` oder Injektion in `App`),
  damit er auf jeder Seite wirkt.
- Wird ein Spielstand geladen oder eine neue Session gestartet, entstehen keine zusätzlichen Wirkmomente.
  Der geladene `lastTickAt` liegt nicht hinter der geladenen Spielzeit.

**Erwartetes Verhalten:** Jeder Zeitschritt im TimeTracker wendet fällige Wirkmomente sofort an.
Token, Legende und Editor zeigen das neue Leben, auch wenn der DM gerade auf einer anderen Seite ist.

---

### 5. Zustände im Charakter-Editor ✅ done (2026-11-01 10:55)

- Neue Kindkomponente per CLI, z. B. `ng g c shared/components/character-conditions-editor`.
  `character-editor-dialog.html` hat schon 127 Zeilen.
  - Abschnitt „Zustände“ zwischen Fähigkeiten und Bild, mit einer Checkbox je Eintrag in
    `CONDITION_TEMPLATES`.
  - Beim Ankreuzen wird die Vorlage in die Arbeitskopie kopiert. Darunter erscheinen die Felder
    Intervall (min + s), Schaden je Wirkmoment, Dauer (min + s, 0 = unbegrenzt) und Beschreibung.
  - Bei einem schon aktiven Zustand steht die Restdauer daneben (`m:ss` bzw. „unbegrenzt“).
  - Abhaken entfernt den Zustand aus der Arbeitskopie. Wird er erneut angekreuzt, startet er neu mit
    den Werten der Vorlage.
- „Übernehmen“: Neu angekreuzte Zustände bekommen `startedAt = lastTickAt = aktuelle Spielzeit`.
  Geänderte aktive Zustände behalten `startedAt` und `lastTickAt`. Ist ein Zustand nach der neuen Dauer
  schon abgelaufen, wird er beim Übernehmen entfernt. „Abbrechen“ verwirft alles.
- Eingaben: ganze Zahlen ≥ 0, Sekunden 0–59. Bei ungültigen Werten ist „Übernehmen“ gesperrt.

**Erwartetes Verhalten:** Der DM setzt Gift mit zwei Klicks (Checkbox, Übernehmen). Starkes Gift
bekommt er durch Ändern der Werte vor dem Übernehmen.

---

### 6. Anzeige an Token und Legende ✅ done (2026-11-01 10:55)

- `CharacterStatus` (oder eine neue Komponente `CharacterConditions`, die beide Stellen nutzen) zeigt die
  Zustände:
  - **Am Token immer:** kleine Symbole am oberen Rand des Tokens, ohne Text. `title`/`aria-label` mit
    Name und Restdauer, z. B. „Gift – noch 7:30“.
  - **Unter dem markierten Token:** Symbol, Name und Restdauer bei Leben und Rüstung bzw. der
    Menüleiste.
  - **Legende:** eine zweite Zeile unter dem Namen mit Symbol und Restdauer je Zustand.
- Die Restdauer wird aus `gameTime()` und dem Zustand per `computed()` abgeleitet, ohne Kopie (Regel 6).
- Bei der Standard-Zellgröße von 60 px verdecken die Symbole keine Nachbarzelle. Bei mehr als
  3 Zuständen gibt es kein Überlaufen: Der Rest wird als „+n“ angezeigt.

**Erwartetes Verhalten:** Der DM sieht auf einen Blick, wer welchen Zustand hat und wie lange noch.

---

### 7. Übersicht im TimeTracker ✅ done (2026-11-01 10:55)

- Neue Komponente per CLI, z. B. `ng g c features/time-tracker/components/active-conditions-list`.
- Eine Zeile je aktivem Zustand aller Charaktere: Charakter, Symbol und Name des Zustands, Schaden je
  Wirkmoment, nächster Wirkmoment (Spielzeit, „–“ ohne Schaden) und Restdauer.
- Sortiert nach dem nächsten Wirkmoment, Zustände ohne Wirkmoment nach der Restdauer.
- Ohne aktive Zustände steht dort „Keine aktiven Zustände“. Die Liste ist nur eine Anzeige.

**Erwartetes Verhalten:** Vor jedem Zeitschritt sieht der DM, was als Nächstes passiert.

---

### 8. Dokumentation ✅ done (2026-11-01 10:55)

- `REQUIREMENTS.md`: Zustände unter 0 (Übersicht), 1 (TimeTracker) und 2 (Dungeon Tracker, Editor)
  ergänzen.
- `.claude/rules/architecture.md`: neue Modelle, den Service, die Util und die Komponenten eintragen.

---

### 9. Tests ✅ done (2026-11-01 10:55)

- `condition-tick.util.spec.ts`: einzelner Wirkmoment, Zeitsprung mit Nachholen bis zum Ende, Wirkmoment
  genau zum Ende, Ablauf, unbegrenzte Dauer, Intervall 0, 0 Leben, Zeit zurück, keine Änderung ergibt
  dasselbe Objekt, Ereignisse.
- `condition-tick.service.spec.ts`: `addTime()` ändert Leben und Zustände in `CharactersDbService`.
  Schreiben nur bei Änderung. Kein Tick nach `restore()` eines Spielstands.
- `characters-db.service.spec.ts` und `characters.xml-mapper.spec.ts`: Round-Trip mit Zuständen, ältere
  Daten ohne `conditions`.
- Editor-Specs über DOM: Ankreuzen übernimmt die Vorlage, Werte ändern, Abhaken, Startzeit beim
  Übernehmen, Sperre bei ungültigen Werten, Abbrechen.
- Anzeige-Specs: Symbole am Token, Restdauer im Tooltip, „+n“, Legende, TimeTracker-Liste mit Sortierung
  und leerem Zustand.
- Optional ein E2E-Smoke-Test: Gift setzen, im TimeTracker +1 h, Leben am Token um 10 gesunken.

---

### 10. Platzhalter im TimeTracker entfernen ✅ done (2026-11-01 10:55)

- Bei der Umsetzung entdeckt: `time-tracker-page.html` zeigte noch den CLI-Platzhalter
  „time-tracker-page works!“. Er wird entfernt (Freigabe im Plan, 2026-11-01).

**Erwartetes Verhalten:** Der TimeTracker zeigt nur Spielzeit, Zeitschritte und die Zustandsübersicht.

---

## Akzeptanzkriterien

- [x] Im Editor lassen sich Gift, Benommen und Blind per Checkbox setzen und entfernen. Die Werte kommen
      aus der Vorlage und sind pro Charakter änderbar.
- [x] Gift mit Standardwerten macht nach jeder vollen InGame-Minute 1 Schaden direkt aufs Leben und
      verschwindet nach 10 Minuten von selbst.
- [x] +1 h im TimeTracker holt alle fälligen Wirkmomente nach, höchstens bis zum Ende der Dauer.
- [x] Benommen und Blind machen keinen Schaden und verschwinden nach ihrer Dauer. Dauer 0 bleibt, bis
      der DM den Zustand abwählt.
- [x] Bei 0 Leben entsteht kein weiterer Schaden. Zeit zurücksetzen oder einen Spielstand laden löst
      keine Wirkmomente aus.
- [x] Zustände erscheinen am Token, unter dem markierten Token, in der Legende und im TimeTracker, jeweils
      mit Restdauer.
- [x] Zustände bleiben nach einem Reload erhalten und sind im XML-Spielstand enthalten. Ältere Daten
      lassen sich laden.
- [x] Tests und Coverage-Schwellen sind grün, keine Datei über 150 Zeilen.

---

## Annahmen (zur Verifikation)

- Eine „Runde“ ist kein eigener Begriff in den Daten. Ein späterer Button „Nächste Runde (+10 s)“ wirkt
  über die Spielzeit automatisch mit.
- Werteänderungen an einem aktiven Zustand gelten ab dem nächsten Wirkmoment: `lastTickAt` + neues
  Intervall. Schon angewendeter Schaden bleibt.
- Zustände gelten gleich für Helden und Monster.
- Den Ereignis-Log (Spielzeit, Charakter, „1 Schaden durch Gift“, „Blind abgelaufen“) liefert ein eigener
  Feature Request auf Basis von `ConditionEvent`.
