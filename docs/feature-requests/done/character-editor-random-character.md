# Feature Request: Zufälligen Charakter im Charakter-Editor erstellen

**Datum:** 2026-10-21 (überarbeitet 2026-10-24: Zufallsnamen je Charakterklasse)  
**Priorität:** Mittel  
**Status:** done (2026-10-24 20:51)  
**Bezug:** `REQUIREMENTS.md` (Dungeon Tracker, „Neuer Charakter“), `.claude/rules/architecture.md` → „Dateinamen“ (reine Funktionen in `*.util.ts`), `docs/feature-requests/done/character-kind-hero-monster.md` (rejected: keine Unterscheidung Held/Monster), Voraussetzung `docs/feature-requests/done/character-tracker-removal.md` #1

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

### 1. Zufallswerte als reine Funktion ✅ done (2026-10-24 20:51)

- Neue Datei `shared/utils/random-character.util.ts` mit
  `createRandomCharacter(id: string): CharacterInfo`. Wertebereiche wie bisher in den
  Creator-Services: Leben 50–249, Rüstung 5–54, Angriff 10–59, Abwehr 5–54, Tempo 5–34, zufälliger
  Element-Typ, die ersten 1…n Fähigkeiten, Beschreibung „Dies ist eine zufällige Beschreibung für …“.
- Das Bild kommt zufällig aus `CHARACTER_IMAGES`.
- Der Name besteht aus einem zufälligen Vor- und Nachnamen der Charakterklasse des gezogenen Bildes
  (siehe #2), z. B. Barbar → „Ragnar Eisenfaust“, Goblin → „Grutz Schlammzahn“.
- Die ID wird übergeben, damit die Arbeitskopie ihre ID behält.
- `HeroCharacterCreatorService`, `MonsterCharacterCreatorService` und ihre Specs werden gelöscht.
  `HERO_IMAGES` und `MONSTER_IMAGES` bleiben als Bestandteile von `CHARACTER_IMAGES`; ihre Kommentare
  nennen die Creator nicht mehr.

**Erwartetes Verhalten:** Ein Aufruf liefert einen gültigen Charakter mit Name, Bild und Werten in
den genannten Bereichen. Der Name passt zur Klasse des Bildes.

---

### 2. Namenslisten je Charakterklasse ✅ done (2026-10-24 20:51)

- Die Charakterklasse ergibt sich aus dem Bild (13 Klassen: 4 Helden, 9 Monster).
- Pro Klasse eine editierbare Datei `core/models/character-names/<klasse>-names.model.ts` mit je
  50 Vor- und 50 Nachnamen (`CharacterNameList` aus `character-name-list.model.ts`). Stil:
  Fantasy-Vorname + deutscher, sprechender Nachname.
- `character-names.model.ts` ordnet jedem Bild aus `CHARACTER_IMAGES` seine Liste zu
  (`CHARACTER_NAMES_BY_IMAGE`).
- **Bereits angelegt (2026-10-24):** alle 13 Listen, das Interface und die Zuordnung.
- **Länge:** Vorname höchstens 8, Nachname höchstens 11 Zeichen; Vorname + Leerzeichen + Nachname
  sind damit höchstens 20 Zeichen lang. Ist eine Kombination kürzer als 12 Zeichen, wird neu gezogen.
- Die Namenslisten sind vom Dateilimit (150 Zeilen) ausgenommen (Entscheidung des Nutzers); derzeit
  haben sie je 109 Zeilen.

**Erwartetes Verhalten:** Ein Zufallsname ist 12–20 Zeichen lang und stammt aus den Listen der
Klasse des Bildes. Wer eine Liste ändert, ändert damit die künftig gewürfelten Namen.

---

### 3. Button im Neu-Modus ✅ done (2026-10-24 20:51)

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

- Der gewürfelte Name steht sofort im Namensfeld und kann dort überschrieben werden.

**Erwartetes Verhalten:** Nach einem Klick zeigen alle Felder zufällige Werte, der neue Name steht im
Namensfeld, und „Übernehmen“ ist
aktiv, weil Name und Bild gesetzt sind. Im Bearbeiten-Modus gibt es den Button nicht.

---

### 4. Tests ✅ done (2026-10-24 20:51)

- `random-character.util.spec.ts`: `Math.random` per `vi.spyOn` festlegen; Grenzwerte der
  Wertebereiche (0 und knapp unter 1), Name aus den Listen der Bildklasse, übergebene ID bleibt erhalten; eine zu kurze Kombination
  (< 12 Zeichen) wird neu gezogen.
- `character-names.model.spec.ts`: Jedes Bild aus `CHARACTER_IMAGES` hat eine Liste; jede Liste
  hat 50 eindeutige Vor- und Nachnamen; Vornamen ≤ 8, Nachnamen ≤ 11 Zeichen; pro Klasse ist eine
  Kombination mit mindestens 12 Zeichen möglich.
- `character-editor-dialog-create.spec.ts`: Button nur im Neu-Modus (Harness); Klick füllt Name und
  Bild (der Name steht im Namensfeld), die ID bleibt gleich, „Übernehmen“ ist aktiv und speichert den Zufallscharakter; „Abbrechen“
  speichert nichts.
- E2E (`character-editor.spec.ts`): „Neuer Charakter“ → „Zufälliger Charakter erstellen“ →
  „Übernehmen“ → Token und Legendeneintrag erscheinen.

---

### 5. Dokumentation ✅ done (2026-10-24 20:51)

- `REQUIREMENTS.md`, Dungeon Tracker: Nach dem Satz zu „Neuer Charakter“ ergänzen: „Im Dialog kann er
  über ‚Zufälliger Charakter erstellen‘ alle Felder mit Zufallswerten füllen und vor dem Übernehmen
  anpassen. Der Name passt zur Charakterklasse.“
- `.claude/rules/architecture.md`: `shared/utils/random-character.util.ts` und
  `core/models/character-names/` (Namenslisten je Klasse, Ausnahme vom Dateilimit) eintragen,
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

- [x] Im Modus „Neuer Charakter“ steht links in der Aktionsleiste „Zufälliger Charakter erstellen“, im Bearbeiten-Modus nicht
- [x] Ein Klick füllt die Arbeitskopie mit Zufallswerten; die ID bleibt, Name und Bild sind gesetzt
- [x] Der Name besteht aus Vor- und Nachname der Bildklasse, ist 12–20 Zeichen lang und steht sofort im Namensfeld
- [x] Je Charakterklasse liegt eine editierbare Liste mit 50 Vor- und 50 Nachnamen unter `core/models/character-names/`
- [x] „Übernehmen“ speichert den Zufallscharakter, „Abbrechen“ speichert nichts
- [x] Die Zufallslogik liegt als reine Funktion in `shared/utils/random-character.util.ts`; die beiden Creator-Services sind gelöscht
- [x] Keine neuen Tokens; jede Datei hat höchstens 150 Zeilen (Ausnahme: Namenslisten)
- [x] `REQUIREMENTS.md` und `architecture.md` sind angepasst
- [x] `npm run lint`, `npm run test -- --watch=false --coverage` (Schwellen eingehalten), `npm run build` und `npm run e2e` laufen grün
