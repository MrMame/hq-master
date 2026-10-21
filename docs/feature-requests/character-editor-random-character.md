# Feature Request: Zufälligen Charakter im Charakter-Editor erstellen

**Datum:** 2026-10-21  
**Priorität:** Mittel  
**Status:** open  
**Bezug:** `REQUIREMENTS.md` (Dungeon Tracker, „Character Neu“), `.claude/rules/architecture.md` → „Dateinamen“ (reine Funktionen in `*.util.ts`), `docs/feature-requests/done/character-kind-hero-monster.md` (rejected: keine Unterscheidung Held/Monster), Voraussetzung `docs/feature-requests/done/character-tracker-removal.md` #1

---

## Problem

Im Character Tracker legten „Add Hero“ und „Add Monster“ mit einem Klick einen Charakter mit
zufälligen Werten an. Das ist praktisch, wenn der DM schnell einen Gegner braucht. Mit dem Entfernen
des Character Trackers fällt das weg. Die beiden Creator-Services liegen danach unter
`shared/services/character-creators/`, haben aber keinen Aufrufer.

Die beiden Services sind bis auf Namenspräfix und Bildliste identisch. Die App unterscheidet nicht
zwischen Helden und Monstern (`character-kind-hero-monster.md`, rejected).

---

## Ziel

Im Charakter-Editor im Modus **„Neuer Charakter“** steht links in der Aktionsleiste der Button
**„Zufälliger Charakter erstellen“**. Er füllt die Arbeitskopie mit zufälligen Werten. Der DM kann sie
anpassen; „Übernehmen“ speichert wie bisher, „Abbrechen“ verwirft. Im Bearbeiten-Modus steht an
dieser Stelle weiterhin „Entfernen“.

```
│ ──────────────────────────────────────────────────────────────── │
│ Zufälliger Charakter erstellen          Abbrechen  [ Übernehmen ]  │   Neuer Charakter
│ Entfernen                               Abbrechen  [ Übernehmen ]  │   Charakter bearbeiten
└───────────────────────────────────────────────────────────────────┘
```

---

## Anforderungen

### 1. Zufallswerte als reine Funktion

- Neue Datei `shared/utils/random-character.util.ts` mit
  `createRandomCharacter(id: string): CharacterInfo`. Wertebereiche wie bisher in den
  Creator-Services: Leben 50–249, Rüstung 5–54, Angriff 10–59, Abwehr 5–54, Tempo 5–34, zufälliger
  Element-Typ, die ersten 1…n Fähigkeiten, Beschreibung „Dies ist eine zufällige Beschreibung für …“.
- Das Bild kommt zufällig aus `CHARACTER_IMAGES`.
- Der Name ist lesbar, nicht „Hero 1729…-123“: Er wird aus dem Bild abgeleitet, z. B.
  `hero-icon-barbarian.jpeg` → „Barbarian“, `monster-icon-ChaosWarrior.png` → „ChaosWarrior“.
- Die ID wird übergeben, damit die Arbeitskopie ihre ID behält.
- `HeroCharacterCreatorService`, `MonsterCharacterCreatorService` und ihre Specs werden gelöscht.
  `HERO_IMAGES` und `MONSTER_IMAGES` bleiben als Bestandteile von `CHARACTER_IMAGES`; ihre Kommentare
  nennen die Creator nicht mehr.

**Erwartetes Verhalten:** Ein Aufruf liefert einen gültigen Charakter mit Name, Bild und Werten in
den genannten Bereichen.

---

### 2. Button im Neu-Modus

- `character-editor-dialog.html`: In `mat-dialog-actions` steht als erster Button

  ```html
  @if (!isEditMode) {
  <button mat-button class="character-editor__random" (click)="randomize()">
    Zufälliger Charakter erstellen
  </button>
  }
  ```

- `character-editor-dialog.ts`:
  `randomize(): void { this.draft.set(createRandomCharacter(this.draft().id)); }`
- `character-editor-dialog.css`: `.character-editor__random` mit `margin-inline-end: auto` (wie
  `.character-editor__remove`) und gelber Schrift (`--color-yellow-400`). Keine neuen Tokens.
- Jeder Klick würfelt neu und überschreibt bisherige Eingaben ohne Rückfrage. Gespeichert ist zu
  diesem Zeitpunkt noch nichts.

**Erwartetes Verhalten:** Nach einem Klick zeigen alle Felder zufällige Werte, und „Übernehmen“ ist
aktiv, weil Name und Bild gesetzt sind. Im Bearbeiten-Modus gibt es den Button nicht.

---

### 3. Tests

- `random-character.util.spec.ts`: `Math.random` per `vi.spyOn` festlegen; Grenzwerte der
  Wertebereiche (0 und knapp unter 1), Name aus dem Bild, übergebene ID bleibt erhalten.
- `character-editor-dialog-create.spec.ts`: Button nur im Neu-Modus (Harness); Klick füllt Name und
  Bild, die ID bleibt gleich, „Übernehmen“ ist aktiv und speichert den Zufallscharakter; „Abbrechen“
  speichert nichts.
- E2E (`character-editor.spec.ts`): „Character Neu“ → „Zufälliger Charakter erstellen“ →
  „Übernehmen“ → Token und Legendeneintrag erscheinen.

---

### 4. Dokumentation

- `REQUIREMENTS.md`, Dungeon Tracker: Nach dem Satz zu „Character Neu“ ergänzen: „Im Dialog kann er
  über ‚Zufälliger Charakter erstellen‘ alle Felder mit Zufallswerten füllen und vor dem Übernehmen
  anpassen.“
- `.claude/rules/architecture.md`: `shared/utils/random-character.util.ts` eintragen,
  `shared/services/character-creators/` entfernen.

---

## Hinweise

- **Zusammenlegen der Creator-Services:** Die Services enthalten nur Zufallslogik ohne Abhängigkeiten.
  Nach `architecture.md` gehören reine Funktionen in eine `*.util.ts`. Ein gemeinsamer Generator
  entspricht der Entscheidung, nicht zwischen Helden und Monstern zu unterscheiden. Sollen Helden und
  Monster doch getrennt würfelbar bleiben, wären zwei Buttons nötig; das wäre eine Änderung dieses
  Requests vor der Umsetzung.
- **E2E-Helfer:** `e2e/support/create-character.ts` (aus `character-tracker-removal.md` #6) könnte
  danach den Zufallsbutton nutzen. Das ist nicht Teil dieses Requests.
- **Dateilimit 150 Zeilen:** `character-editor-dialog.html` hat 123 Zeilen (+ etwa 5),
  `.css` 103 (+ etwa 5), `.ts` 107 (+ etwa 4).

---

## Akzeptanzkriterien

- [ ] Im Modus „Neuer Charakter“ steht links in der Aktionsleiste „Zufälliger Charakter erstellen“, im Bearbeiten-Modus nicht
- [ ] Ein Klick füllt die Arbeitskopie mit Zufallswerten; die ID bleibt, Name und Bild sind gesetzt
- [ ] „Übernehmen“ speichert den Zufallscharakter, „Abbrechen“ speichert nichts
- [ ] Die Zufallslogik liegt als reine Funktion in `shared/utils/random-character.util.ts`; die beiden Creator-Services sind gelöscht
- [ ] Keine neuen Tokens; jede Datei hat höchstens 150 Zeilen
- [ ] `REQUIREMENTS.md` und `architecture.md` sind angepasst
- [ ] `npm run lint`, `npm run test -- --watch=false --coverage` (Schwellen eingehalten), `npm run build` und `npm run e2e` laufen grün
