# Feature Request: Rundensteuerung im Dungeon Tracker

**Datum:** 2026-11-01  
**Priorität:** Mittel  
**Status:** offen  
**Bezug:** `REQUIREMENTS.md` (Dungeon Tracker), `docs/feature-requests/done/quick-access-new-character.md`,
`docs/feature-requests/done/game-event-log.md`, `docs/feature-requests/done/character-conditions.md`

---

## Problem

- Während einer Runde zieht der DM die Figuren nacheinander auf dem Spielbrett. Im Dungeon Tracker
  sieht er nicht, welche Figur er in dieser Runde schon gezogen hat.
- Eine neue Runde löst er bisher von Hand aus: Er wechselt in den Zeit-Tracker und klickt „+10 s“.

---

## Ziel

- Jeder Charakter bekommt das Flag `movedThisRound` (UI-Text „In dieser Runde bewegt“).
- Zieht der DM einen Token auf ein anderes Feld, wird das Flag gesetzt. Der Token-Ring wechselt dann
  von Gelb zu Grau.
- Unter dem „+“ in der Schnellzugriffsleiste öffnet ein neuer Button ⏳ das Runden-Menü. Dessen Button
  „Neue Runde“ rückt die Spielzeit um 10 s vor und setzt das Flag für alle Charaktere zurück.

```
┌───┬──────┬──────────────┬──────────────────┐
│ › │ [ + ]│              │ (Ork)  (Elf)     │  ← gelb = offen, grau = bewegt
│   │ [⏳] │▸[Neue Runde] │                  │  ← Runden-Menü (Flyout)
│   │100 % │              │   Spielbrett     │
│   │  ●   │              │                  │
└───┴──────┴──────────────┴──────────────────┘
```

---

## Anforderungen

### 1. Flag `movedThisRound` am Charakter

- `CharacterInfo` bekommt `movedThisRound: boolean`. Es wird wie die übrigen Felder mit den
  Charakteren gespeichert und geladen.
- Ältere Spielstände ohne das Feld laden mit `false`. Das ergänzt `characters-codec.util.ts`, so wie
  es dort schon bei `conditions` geschieht.
- Neue Charaktere starten mit `false`, auch zufällig erzeugte.

### 2. Flag beim Ziehen setzen

- Endet ein Drag auf einem **anderen** Feld, wird `movedThisRound = true` gesetzt (mit der neuen
  Position).
- Kein Flag setzen:
  - Drag endet auf dem Ausgangsfeld, oder der Token wird nur angeklickt.
  - Der Sync-Effekt des `DungeonBoardService` platziert einen neuen Charakter automatisch.
  - Der Nullpunkt des Rasters wird verschoben; die Tokens wandern dabei mit.
- Ein bereits gesetztes Flag bleibt gesetzt. Das gilt auch, wenn der Token in derselben Runde auf das
  Ausgangsfeld zurückgezogen wird.

### 3. Grauer Ring bei gesetztem Flag

- Ist das Flag gesetzt, werden Ring und Schein des Porträts grau statt gelb. Es werden nur Tokens aus
  `tokens.css` verwendet, z. B. `--color-gray-400`.
- Ist der Token markiert, bleibt der Ring dicker als sonst. Seine Farbe richtet sich trotzdem nach dem
  Flag, er ist also grau.
- Der Avatar im Legenden-Eintrag wird ebenfalls grau umrandet bzw. abgedimmt.
- Zur Prüfung in Tests: Modifier-Klasse (z. B. `dungeon-token--moved`, `legend-entry--moved`).

### 4. Checkbox im Charakter-Editor

- Neue Checkbox „In dieser Runde bewegt“. Damit lässt sich das Flag setzen und entfernen.
- Die Änderung gilt wie alle Editor-Felder erst nach „Übernehmen“. „Abbrechen“ verwirft sie.
- Im Modus „Neuer Charakter“ ist die Checkbox nicht angehakt.

### 5. Runden-Menü in der Schnellzugriffsleiste

- Neuer `appQuickAccessButton` direkt unter „+“ (Neuer Charakter) und über dem Zoom-Regler:
  - Inhalt ⏳, `variant="toggle"`, `label` „Runden-Menü“
  - `active`, solange das Menü offen ist
- Ein Klick klappt rechts neben der Leiste ein Flyout auf, das das Spielbrett überlagert. Ein erneuter
  Klick auf ⏳, ein Klick außerhalb oder Escape schließt es.
- Das Menü sammelt die Schnellsteuerung der Zeit. Vorerst enthält es nur den Button „Neue Runde“.
- Nach „Neue Runde“ bleibt das Menü offen.
- Ob das Menü offen ist, ist reiner UI-Zustand und wird nicht gespeichert. Beim Aufruf der Seite ist
  es geschlossen.
- Kein Tastenkürzel.

### 6. Aktion „Neue Runde“

- In dieser Reihenfolge:
  1. Log-Eintrag „Neue Runde“ (neuer `GameLogEntryType` `'round'`) zur aktuellen Spielzeit
  2. `GameTimeService.addTime({ seconds: 10 })`; das schreibt wie bisher den Eintrag „+10 s (…)“ und
     löst den Zustands-Tick aus
  3. `movedThisRound = false` für alle Charaktere
- Andere Zeitänderungen setzen das Flag nicht zurück. Das gilt für die Zeitschritte im Zeit-Tracker,
  „+1 h“, „+8 h“ und das Setzen der Spielzeit.
- Es gibt keinen Rundenzähler.
- Die Logik liegt in einem Service, nicht in der Page, z. B. `RoundService` unter `shared/services/`
  oder `core/services/`. So bleibt sie ohne den Dungeon Tracker testbar.

### 7. Tests und Doku

- Specs:
  - Codec: alter Stand ohne Feld → `false`
  - Flag beim Feldwechsel; kein Flag beim gleichen Feld bzw. Auto-Platzieren
  - Ring- und Legenden-Klasse
  - Editor-Checkbox mit „Übernehmen“/„Abbrechen“
  - Menü öffnen/schließen (Klick, außerhalb, Escape)
  - „Neue Runde“: +10 s, Reset aller Flags, Log-Reihenfolge
- Eine Playwright-Probe prüft: Token ziehen → grau, „Neue Runde“ → gelb, Spielzeit +10 s.
- `REQUIREMENTS.md` (Dungeon Tracker) ergänzen.

---

## Akzeptanzkriterien

- [ ] Zieht der DM einen Token auf ein anderes Feld, wird dessen Ring grau. Auch der Avatar in der
      Legende wird grau.
- [ ] Ein Drag zurück aufs gleiche Feld, das Platzieren neuer Charaktere und das Verschieben des
      Nullpunkts setzen das Flag nicht.
- [ ] Ein markierter, bewegter Token hat einen dicken grauen Ring.
- [ ] Über die Checkbox im Charakter-Editor lässt sich das Flag setzen und entfernen. Es wirkt erst
      nach „Übernehmen“.
- [ ] Der Button ⏳ unter „+“ öffnet und schließt das Runden-Menü (auch per Klick außerhalb oder
      Escape).
- [ ] „Neue Runde“ rückt die Spielzeit um 10 s vor und setzt alle Ringe auf Gelb zurück. Im Log stehen
      danach „Neue Runde“ und „+10 s (…)“.
- [ ] Die Zeitschritte im Zeit-Tracker lassen das Flag unverändert.
- [ ] Alte Spielstände laden ohne Fehler, alle Charaktere mit `movedThisRound = false`.
- [ ] Dateien bleiben unter 150 Zeilen; die Coverage-Schwellen werden eingehalten.

---

## Annahmen (aus dem Interview vom 2026-11-01)

- Name `movedThisRound`; gespeichert am Charakter, nicht an der Board-Position.
- Als „bewegt“ zählt nur ein Feldwechsel per Drag.
- Farbe für „bewegt“: Grau. Gelb bedeutet „noch offen“.
- Runden-Menü: Flyout, vorerst nur „Neue Runde“, bleibt nach der Aktion offen, kein Tastenkürzel.
- Nur „Neue Runde“ setzt das Flag zurück. Reine Zeitsprünge setzen es nicht zurück.
- Eigener Log-Eintrag „Neue Runde“, kein Rundenzähler.

---

## Umsetzungshinweise

- Den Feldwechsel prüft am besten `DungeonBoard.onTokenMoved`: alte Position (aus `tokens()`) gegen
  neue `col`/`row`. Bei einem Wechsel `updatePosition` aufrufen und das Flag per
  `CharactersDbService.writeCharacter` setzen.
- Das Flyout könnte `@angular/cdk/overlay` (`cdkConnectedOverlay`) nutzen; Klick außerhalb und
  Escape gibt es dort fertig. Alternativ ein eigenes, absolut positioniertes Panel.
- Bei `effect()`-Aufrufern auf `untracked()` achten (siehe Memory „Effect loop test hang“).
