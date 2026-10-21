# Feature Request: Schaden direkt am Token im Dungeon Tracker

**Datum:** 2026-10-21  
**Priorität:** Hoch  
**Status:** open  
**Bezug:** `REQUIREMENTS.md` (Dungeon Tracker), `.claude/rules/architecture.md` → „Komponenten“ (Shared-Dialoge im dunklen Look) und „Session-State-Services“ (Regel 4, 6), Voraussetzung `docs/feature-requests/done/character-tracker-removal.md` #1

---

## Problem

Schaden konnte der DM bisher nur im Character Tracker eintragen. Die minimierte Charakterkarte hatte
zwei Treffer-Buttons:

| Button                            | Icon                     | Wirkung (`applyDamage()`)                                     |
| --------------------------------- | ------------------------ | ------------------------------------------------------------- |
| Normal (`DamageTypes.Normal`)     | `./img/hit-normal.svg`   | Rüstung fängt den Schaden zuerst ab, der Rest geht aufs Leben |
| Kritisch (`DamageTypes.Critical`) | `./img/hit-critical.svg` | Schaden geht direkt aufs Leben                                |

Ein Klick öffnete den Schadensauswahl-Dialog (1–100). Mit dem Entfernen des Character Trackers
fällt diese Bedienung weg; die Bausteine liegen danach unter `core/models/` und `shared/`.

---

## Ziel

Der DM markiert ein Token per Klick oder Tipp. Unter dem markierten Token erscheinen zwei kleine
Buttons: **blau** für Schaden auf Rüstung, **rot** für Schaden direkt auf das Leben. Ein Klick öffnet
den Schadensauswahl-Dialog im dunklen Look. Der gewählte Wert wird sofort über `applyDamage()` und
`CharactersDbService.writeCharacter()` in die Spielesession geschrieben.

```
Klick/Tipp auf Token ─► markiert (nur ein Token zugleich)
                         │
                         ▼
          ┌──────┐
          │ Token│
          └──────┘
         [🛡 blau] [♥ rot]
             │        │
             ▼        ▼
   CharacterDamageService.requestDamage(character, Normal | Critical)
             │
             ▼
   DamageTakenDialog (general-dialog) ─► Wert 1–100 │ Abbrechen
             │
             ▼
   CharactersDbService.writeCharacter(applyDamage(character, type, value))
             └─► tokens (computed), Legende, Editor, Snapshot
```

---

## Anforderungen

### 1. Token markieren

- `DungeonTrackerPage` hält die Markierung als reinen UI-Zustand:
  `selectedCharacterId: WritableSignal<string | null>`. Sie gehört nicht zur Spielesession und
  wird nicht persistiert.
- Ein Klick oder Tipp auf ein Token markiert es. Ein Klick auf ein anderes Token verschiebt die
  Markierung, ein Klick auf eine freie Stelle des Spielbretts hebt sie auf. Es gibt kein Umschalten
  durch erneuten Klick, damit der Doppelklick (Editor öffnen) das Token markiert lässt.
- Ziehen eines Tokens ändert die Markierung nicht.
- Wird der markierte Charakter entfernt, ist keine Markierung mehr sichtbar (aus `tokens()`
  abgeleitet, kein Aufräumen von Hand).
- Das markierte Token ist sichtbar hervorgehoben, z. B. durch einen stärkeren gelben Ring.

**Erwartetes Verhalten:** Immer höchstens ein Token ist markiert. Doppelklick und Drag & Drop
funktionieren wie bisher.

---

### 2. Schadens-Buttons unter dem markierten Token

- `DungeonToken` bekommt den Input `selected: boolean` und den Output
  `damageRequested: DamageTypes`.
- Nur wenn `selected()` gilt, liegen direkt unter dem Token, mittig, zwei kleine Buttons:
  - **Blau**, Icon `./img/hit-normal.svg`, `aria-label="Schaden auf Rüstung"` → `DamageTypes.Normal`
  - **Rot**, Icon `./img/hit-critical.svg`, `aria-label="Schaden auf Leben"` → `DamageTypes.Critical`
- Farben nur über vorhandene Tokens (z. B. `--color-blue-600` / `--color-red-600`, Hover eine Stufe
  dunkler). Keine neuen Tokens.
- Die Buttons sind auf dem Tablet sicher antippbar (mindestens `--space-6`, 24 px).
- Das Token-Element ist rund und hat `overflow: hidden`; die Buttons liegen deshalb außerhalb dieses
  Elements, bewegen sich aber mit dem Token. Ein Klick auf einen Button startet keinen Drag und
  ändert die Markierung nicht.

**Erwartetes Verhalten:** Unter dem markierten Token erscheinen die zwei Buttons, unter allen anderen
nicht.

---

### 3. Schadensauswahl-Dialog als Shared-Dialog im dunklen Look

- `shared/components/damage-taken-dialog/` (aus `character-tracker-removal.md` #1) nutzt den
  gemeinsamen Look wie `ConfirmationDialog` und `CharacterEditorDialog`:
  - `host: { class: 'general-dialog' }`, Titel mit `general-dialog__title`, „Abbrechen“ mit
    `general-dialog__cancel`.
  - Die eigenen Klassen `.dialog-title` und `.dialog-action` entfallen.
  - Das Raster `.damage-grid` bekommt einen dunklen Hintergrund und Rahmen (z. B. `--color-gray-900`
    / `--color-gray-700`). Die Farbstufen der Schadens-Buttons nach Höhe bleiben.
- Der Titel nennt Schadensart und Charakter, z. B. „Schaden auf Rüstung: Ork“. Dazu neues Model
  `shared/models/damage-dialog-data.model.ts` (`characterName`, `damageType`), übergeben per
  `MAT_DIALOG_DATA`.
- Der Dialog bleibt eine reine Auswahl: Er schließt mit der Zahl oder ohne Wert und schreibt nichts
  selbst.
- `CharacterDialogsService` und `CHARACTER_DIALOG_CONFIG` gibt es nicht mehr. Die Dialoggröße steht in
  einer neuen Konstante im Service aus #4 (Tablet 1024×768: das Raster ist ohne Scrollen bedienbar).

**Erwartetes Verhalten:** Der Dialog sieht aus wie die anderen Shared-Dialoge, und der Titel zeigt,
welcher Schaden bei welchem Charakter eingetragen wird.

---

### 4. Schaden anwenden über einen Shared-Service

- Neuer Service per CLI: `ng g s shared/services/character-damage` → `CharacterDamageService`.
  - `requestDamage(character: CharacterInfo, damageType: DamageTypes): void` öffnet den Dialog. Bei
    einem Wert schreibt er
    `CharactersDbService.writeCharacter(applyDamage(character, damageType, value))`, bei Abbruch
    nichts.
- `DungeonTrackerPage`: `(damageRequested)` jedes Tokens ruft
  `requestDamage(token.character, $event)` auf.
- Die Seite hält keine Kopie von Leben oder Rüstung. Token, Legende, Editor und Snapshot folgen über
  `characters()` (Regel 6).

**Erwartetes Verhalten:** Nach Auswahl eines Werts sind Leben und Rüstung des Charakters sofort und
nach einem Reload geändert, nach „Abbrechen“ unverändert.

---

### 5. Tests

- `dungeon-token.spec.ts`: Buttons nur bei `selected`; Klick auf den blauen bzw. roten Button gibt
  `DamageTypes.Normal` bzw. `DamageTypes.Critical` aus; Klick auf das Token meldet die Markierung.
- `dungeon-tracker-page` (eigene Aspekt-Spec, falls die bestehenden Specs 150 Zeilen überschreiten):
  Klick markiert, Klick auf ein anderes Token verschiebt, Klick aufs freie Brett hebt auf, ein
  entfernter Charakter hinterlässt keine Markierung, `damageRequested` ruft den Service (gemockt).
- `damage-taken-dialog.spec.ts`: Host-Klasse `general-dialog`, Titel aus den Dialogdaten, bisherige
  Tests (Werte, Farbstufen, Abbrechen) bleiben.
- `character-damage.service.spec.ts`: `MatDialog` gemockt; Wert → `characters()` enthält das
  Ergebnis von `applyDamage()`; Abbruch → keine Änderung.
- E2E (`e2e/dungeon-damage.spec.ts`): Charakter anlegen, Token markieren, roten Button, Wert wählen →
  Leben im Editor um den Wert reduziert, auch nach einem Reload. Einmal mit `click()` (PC), einmal
  mit `tap()` (Tablet, `hasTouch`), wie in `character-editor.spec.ts`.

---

### 6. Dokumentation

- `REQUIREMENTS.md`, Dungeon Tracker: „Ein Klick auf ein Charaktersymbol markiert es. Unter dem
  markierten Symbol trägt der DM über einen blauen Button Schaden auf die Rüstung und über einen roten
  Button Schaden direkt auf die Lebensenergie ein; der Wert wird in einem Dialog gewählt.“
- `.claude/rules/architecture.md`: `CharacterDamageService` unter `shared/services/`,
  `damage-dialog-data.model.ts` unter `shared/models/`.

---

## Hinweise

- **Offen vor der Umsetzung: Werte anzeigen.** Leben und Rüstung sind auf dem Spielbrett nicht zu
  sehen; der DM sieht die Wirkung nur im Editor. Die minimierte Karte zeigte beide Werte. Vorschlag:
  Leben (rot) und Rüstung (blau) in der Legende der Seitenleiste anzeigen. Als eigener Punkt
  ergänzen oder als eigener Request.
- **Kritischer Multiplikator:** `CRITICAL_DAMAGE_MULTIPLIER` in `damage.util.ts` ist `1.0`. Das Verhalten
  bleibt unverändert.
- **Klick und Drag:** Ob die CDK nach einem Drag noch ein `click` auslöst, wird bei der Umsetzung per
  Playwright-Probe geprüft (Anforderung #1: Ziehen ändert die Markierung nicht).
- **Dateilimit 150 Zeilen:** `dungeon-token.ts` hat 75 Zeilen und ein Inline-Template. Wird es
  größer als 100 Zeilen, Template und Styles in eigene Dateien auslagern.

---

## Akzeptanzkriterien

- [ ] Klick oder Tipp markiert genau ein Token; ein Klick aufs freie Brett hebt die Markierung auf
- [ ] Unter dem markierten Token erscheinen ein blauer Button (Schaden auf Rüstung) und ein roter Button (Schaden auf Leben), unter anderen Tokens nicht
- [ ] Doppelklick öffnet weiterhin den Editor; Ziehen ändert die Markierung nicht
- [ ] Der Schadensauswahl-Dialog liegt unter `shared/`, nutzt den `general-dialog`-Look und nennt Schadensart und Charakter
- [ ] Ein gewählter Wert ändert Leben und Rüstung nach `applyDamage()` sofort und nach einem Reload; „Abbrechen“ ändert nichts
- [ ] Keine neuen Tokens, keine Kopie von Charakterwerten in der Seite
- [ ] Jede Datei hat höchstens 150 Zeilen; die Specs prüfen das Verhalten über DOM und Harnesses
- [ ] E2E für PC und Tablet grün
- [ ] `REQUIREMENTS.md` und `architecture.md` sind angepasst
- [ ] `npm run lint`, `npm run test -- --watch=false --coverage` (Schwellen eingehalten), `npm run build` und `npm run e2e` laufen grün
