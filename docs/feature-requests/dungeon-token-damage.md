# Feature Request: Lebens- und Rüstungswerte sowie Schaden am Token im Dungeon Tracker

**Datum:** 2026-10-21 (ergänzt 2026-10-21: Werte am Token und in der Legende)  
**Priorität:** Hoch  
**Status:** open  
**Bezug:** `REQUIREMENTS.md` (Dungeon Tracker), `.claude/rules/architecture.md` → „Komponenten“ (Shared-Dialoge im dunklen Look) und „Session-State-Services“ (Regel 4, 6), Voraussetzung `docs/feature-requests/done/character-tracker-removal.md` #1

---

## Problem

Seit dem Entfernen des Character Trackers sieht der DM Leben und Rüstung eines Charakters nur noch im
Charakter-Editor. Schaden eintragen kann er gar nicht mehr. Die minimierte Charakterkarte zeigte beide
Werte und hatte zwei Treffer-Buttons:

| Button                            | Icon                     | Wirkung (`applyDamage()`)                                     |
| --------------------------------- | ------------------------ | ------------------------------------------------------------- |
| Normal (`DamageTypes.Normal`)     | `./img/hit-normal.svg`   | Rüstung fängt den Schaden zuerst ab, der Rest geht aufs Leben |
| Kritisch (`DamageTypes.Critical`) | `./img/hit-critical.svg` | Schaden geht direkt aufs Leben                                |

Ein Klick öffnete den Schadensauswahl-Dialog (1–100). Die Bausteine dafür liegen inzwischen unter
`core/models/` und `shared/`.

---

## Ziel

- **Immer sichtbar:** Unter jedem Token steht eine kleine Werteleiste mit dem Leben (**rote** Zahl) und
  der Rüstung (**blaue** Zahl). Dieselben Werte stehen im Eintrag des Charakters in der Legende der
  Seitenleiste.
- **Schaden:** Der DM markiert ein Token per Klick oder Tipp. Unter der Werteleiste erscheinen zwei
  kleine Buttons: **blau** für Schaden auf die Rüstung, **rot** für Schaden direkt auf das Leben. Ein
  Klick öffnet den Schadensauswahl-Dialog im dunklen Look. Der gewählte Wert wird sofort über
  `applyDamage()` und `CharactersDbService.writeCharacter()` in die Spielesession geschrieben.
- **Vorbereitet für Statuseffekte:** Später zeigen Token und Legende auch Statuseffekte wie
  „vergiftet“. Die Werteanzeige ist deshalb **eine** Komponente (`CharacterStatus`), die beide Stellen
  nutzen; Statuseffekte kommen später dort hinzu.

```
        ☠ 🔥               ← später: Statuseffekte am oberen Rand (nicht Teil dieses Requests)
      ╭──────╮
      │  🧙  │           ← Bild, Ziehen nur hier (cdkDragHandle)
     ┌┴──────┴┐
     │120   30│          ← CharacterStatus: Leben rot, Rüstung blau – immer sichtbar
     └────────┘
     [🛡]  [♥]           ← nur beim markierten Token
     blau  rot
       │     │
       ▼     ▼
CharacterDamageService.requestDamage(character, Normal | Critical)
       │
       ▼
DamageTakenDialog (general-dialog) ─► Wert 1–100 │ Abbrechen
       │
       ▼
CharactersDbService.writeCharacter(applyDamage(character, type, value))
       └─► tokens (computed) → Werteleiste, Legende, Editor, Snapshot

Legende:  [Bild] Ork            120  30   [3,4]
                 (später: Statuseffekte als zweite Zeile unter dem Namen)
```

---

## Anforderungen

### 1. Werteanzeige `CharacterStatus`

- Neue Komponente per CLI: `ng g c features/dungeon-tracker/components/character-status` →
  `CharacterStatus` (entschieden 2026-10-21: im Dungeon Tracker, weil beide Nutzer dort liegen; bei
  Bedarf später nach `shared/`).
- Input `character: InputSignal<CharacterInfo>`. Die Komponente zeigt in einer Zeile:
  - Leben als rote Zahl: Klasse `character-status__health`, `aria-label` und `title` „Leben“.
  - Rüstung als blaue Zahl: Klasse `character-status__armor`, `aria-label` und `title` „Rüstung“.
- Farben nur über vorhandene Tokens, gut lesbar auf dunklem Grund, z. B. `--color-red-400` und
  `--color-blue-500`. Schrift `--text-xs`, fett. Keine neuen Tokens.
- Die Komponente legt weder Hintergrund noch Position fest; das übernehmen Token und Legende.
- Sie hält keinen eigenen Zustand und liest die Werte direkt aus dem Input (Regel 6).

**Erwartetes Verhalten:** Wo die Komponente eingebunden ist, zeigt sie stets die aktuellen Werte des
Charakters.

---

### 2. Werteleiste am Token, immer sichtbar

- `DungeonToken` wird umgebaut:
  - Das `cdkDrag`-Element ist ein Container ohne `overflow: hidden`. Er trägt weiterhin
    `tokenLeft()`/`tokenTop()` und enthält das runde Bild, die Werteleiste und (#5) die
    Schadens-Buttons. So bewegt sich alles beim Ziehen mit.
  - Gezogen wird nur über das runde Bild (`cdkDragHandle`). Werteleiste und Buttons starten keinen
    Drag.
  - Das Template wandert in `dungeon-token.html`, weil die Komponente sonst über 100 Zeilen wächst
    (`architecture.md` → „Komponenten“).
- Die Werteleiste (`<app-character-status>`) sitzt mittig unter dem Bild und überlappt dessen unteren
  Rand leicht (entschieden 2026-10-21). Hintergrund dunkel und halbtransparent, z. B. `--color-gray-900`
  per `color-mix`, kleine Rundung (`--radius-sm`).
- Bei der Standard-Zellgröße von 60 px bleibt die Leiste innerhalb der Zelle des Tokens.
- Ändern sich Leben oder Rüstung (Schaden, Editor, geladener Spielstand), zeigt die Leiste sofort die
  neuen Werte.

**Erwartetes Verhalten:** Jedes Token zeigt jederzeit Leben (rot) und Rüstung (blau), auch während des
Ziehens. Drag & Drop und Doppelklick funktionieren wie bisher.

---

### 3. Werte in der Legende

- Der Legendeneintrag wird eine eigene Komponente: `ng g c features/dungeon-tracker/components/dungeon-legend-entry`
  → `DungeonLegendEntry` mit Input `token: BoardToken`. `dungeon-tracker-page.html` hat schon
  140 Zeilen und würde sonst das Limit von 150 überschreiten.
- Der Eintrag zeigt Bild, Name, `<app-character-status>` und die Position. Die Position behält
  `data-testid="token-position"` (genutzt von `e2e/dungeon-drag.spec.ts`).
- Die Legende bleibt in der Seitenleiste: Ein langer Name wird gekürzt (`text-overflow: ellipsis`),
  die Werte und die Position bleiben vollständig sichtbar.

**Erwartetes Verhalten:** Jeder Legendeneintrag zeigt Leben (rot) und Rüstung (blau) des Charakters,
immer gleich zu den Werten am Token.

---

### 4. Token markieren

- `DungeonTrackerPage` hält die Markierung als reinen UI-Zustand:
  `selectedCharacterId: WritableSignal<string | null>`. Sie gehört nicht zur Spielesession und
  wird nicht persistiert.
- Ein Klick oder Tipp auf ein Token markiert es. Ein Klick auf ein anderes Token verschiebt die
  Markierung, ein Klick auf eine freie Stelle des Spielbretts hebt sie auf. Es gibt kein Umschalten
  durch erneuten Klick, damit der Doppelklick (Editor öffnen) das Token markiert lässt.
- Ziehen eines Tokens ändert die Markierung nicht.
- Wird der markierte Charakter entfernt, ist keine Markierung mehr sichtbar (aus `tokens()`
  abgeleitet, kein Aufräumen von Hand).
- Das markierte Token ist sichtbar hervorgehoben, z. B. durch einen stärkeren gelben Ring, und liegt
  über den anderen Tokens.

**Erwartetes Verhalten:** Immer höchstens ein Token ist markiert. Doppelklick und Drag & Drop
funktionieren wie bisher.

---

### 5. Schadens-Buttons unter der Werteleiste

- `DungeonToken` bekommt den Input `selected: boolean` und den Output
  `damageRequested: DamageTypes`.
- Nur wenn `selected()` gilt, liegen mittig unter der Werteleiste zwei kleine Buttons
  (entschieden 2026-10-21):
  - **Blau**, Icon `./img/hit-normal.svg`, `aria-label="Schaden auf Rüstung"` → `DamageTypes.Normal`
  - **Rot**, Icon `./img/hit-critical.svg`, `aria-label="Schaden auf Leben"` → `DamageTypes.Critical`
- Farben nur über vorhandene Tokens (z. B. `--color-blue-600` / `--color-red-600`, Hover
  `--color-blue-700` / `--color-red-700`). Keine neuen Tokens.
- Die Buttons sind auf dem Tablet sicher antippbar (mindestens `--space-6`, 24 px).
- Ein Klick auf einen Button startet keinen Drag und ändert die Markierung nicht.

**Erwartetes Verhalten:** Unter dem markierten Token erscheinen die zwei Buttons, unter allen anderen
nicht.

---

### 6. Schadensauswahl-Dialog als Shared-Dialog im dunklen Look

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
  einer neuen Konstante im Service aus #7 (Tablet 1024×768: das Raster ist ohne Scrollen bedienbar).

**Erwartetes Verhalten:** Der Dialog sieht aus wie die anderen Shared-Dialoge, und der Titel zeigt,
welcher Schaden bei welchem Charakter eingetragen wird.

---

### 7. Schaden anwenden über einen Shared-Service

- Neuer Service per CLI: `ng g s shared/services/character-damage` → `CharacterDamageService`.
  - `requestDamage(character: CharacterInfo, damageType: DamageTypes): void` öffnet den Dialog. Bei
    einem Wert schreibt er
    `CharactersDbService.writeCharacter(applyDamage(character, damageType, value))`, bei Abbruch
    nichts.
- `DungeonTrackerPage`: `(damageRequested)` jedes Tokens ruft
  `requestDamage(token.character, $event)` auf.
- Die Seite hält keine Kopie von Leben oder Rüstung. Werteleiste, Legende, Editor und Snapshot folgen
  über `characters()` (Regel 6).

**Erwartetes Verhalten:** Nach Auswahl eines Werts zeigen Werteleiste und Legende sofort die neuen
Werte, auch nach einem Reload. Nach „Abbrechen“ bleibt alles unverändert.

---

### 8. Tests

- `character-status.spec.ts`: zeigt Leben und Rüstung mit den Klassen und `aria-label`s; aktualisiert
  sich, wenn sich der Input ändert; zeigt auch den Wert 0.
- `dungeon-token.spec.ts`: Werteleiste immer sichtbar; Buttons nur bei `selected`; Klick auf den
  blauen bzw. roten Button gibt `DamageTypes.Normal` bzw. `DamageTypes.Critical` aus; Klick auf das
  Token meldet die Markierung.
- `dungeon-legend-entry.spec.ts`: Bild, Name, Werte und Position.
- `dungeon-tracker-page` (eigene Aspekt-Spec, falls die bestehenden Specs 150 Zeilen überschreiten):
  Klick markiert, Klick auf ein anderes Token verschiebt, Klick aufs freie Brett hebt auf, ein
  entfernter Charakter hinterlässt keine Markierung, `damageRequested` ruft den Service (gemockt),
  geänderte Werte in `characters()` erscheinen an Token und Legende.
- `damage-taken-dialog.spec.ts`: Host-Klasse `general-dialog`, Titel aus den Dialogdaten, bisherige
  Tests (Werte, Farbstufen, Abbrechen) bleiben.
- `character-damage.service.spec.ts`: `MatDialog` gemockt; Wert → `characters()` enthält das
  Ergebnis von `applyDamage()`; Abbruch → keine Änderung.
- E2E (`e2e/dungeon-damage.spec.ts`):
  - `e2e/support/create-character.ts` bekommt optionale Startwerte, z. B.
    `createCharacter(page, 'Ork', { health: 20, armor: 5 })`, gesetzt über die Felder „Leben“ und
    „Rüstung“ im Editor. Neue Charaktere starten sonst mit 0 und 0.
  - Ablauf: Token zeigt 20/5, Legende ebenso → Token markieren → roter Button → 7 → Token und
    Legende zeigen 13/5 → blauer Button → 7 → 11/0 → nach einem Reload weiterhin 11/0.
  - Einmal mit `click()` (PC), einmal mit `tap()` (Tablet, `hasTouch`), wie in
    `character-editor.spec.ts`.

---

### 9. Dokumentation

- `REQUIREMENTS.md`, Dungeon Tracker: „Unter jedem Charaktersymbol und in der Legende stehen das
  Leben (rot) und die Rüstung (blau) des Charakters. Ein Klick auf ein Charaktersymbol markiert es.
  Unter dem markierten Symbol trägt der DM über einen blauen Button Schaden auf die Rüstung und über
  einen roten Button Schaden direkt auf die Lebensenergie ein; der Wert wird in einem Dialog gewählt.“
- `.claude/rules/architecture.md`: `CharacterStatus` und `DungeonLegendEntry` unter
  `dungeon-tracker/components/`, `CharacterDamageService` unter `shared/services/`,
  `damage-dialog-data.model.ts` unter `shared/models/`.

---

## Hinweise

- **Entscheidungen (2026-10-21):** Werte als Leiste unter dem Token statt Badges an den Ecken oder
  Zahlen links und rechts; Schadens-Buttons als eigene Buttons unter der Leiste statt antippbarer
  Zahlen; `CharacterStatus` im Dungeon Tracker statt unter `shared/`.
- **Statuseffekte (später, eigener Request):** Ein Statuseffekt wie „vergiftet“ braucht ein Feld in
  `CharacterInfo` und damit Änderungen an Session, XML-Mapper und Editor. Dieser Request ändert das
  Modell **nicht**. Er legt nur die Stellen fest: `CharacterStatus` ist die einzige Komponente, die
  Statuseffekte später anzeigt. Am Token ist dafür der obere Rand vorgesehen, in der Legende eine
  zweite Zeile unter dem Namen.
- **Kleine Rasterzellen:** Das Token ist fest 40 px groß. Unter etwa 56 px Zellgröße ragt die
  Werteleiste in die Zelle darunter. Das ist hinnehmbar; ein mit der Zelle skalierendes Token wäre
  ein eigener Request.
- **Kritischer Multiplikator:** `CRITICAL_DAMAGE_MULTIPLIER` in `damage.util.ts` ist `1.0`. Das Verhalten
  bleibt unverändert.
- **Klick und Drag:** Ob die CDK nach einem Drag noch ein `click` auslöst, wird bei der Umsetzung per
  Playwright-Probe geprüft (Anforderung #4: Ziehen ändert die Markierung nicht).
- **Dateilimit 150 Zeilen:** `dungeon-token.ts` hat heute 75 Zeilen mit Inline-Template; das Template
  wandert nach `dungeon-token.html` (#2). `dungeon-tracker-page.html` hat 140 Zeilen; der
  Legendeneintrag wandert nach `DungeonLegendEntry` (#3).

---

## Akzeptanzkriterien

- [ ] Jedes Token zeigt unter dem Bild immer Leben (rot) und Rüstung (blau), auch während des Ziehens
- [ ] Jeder Legendeneintrag zeigt dieselben Werte; Bild, Name und Position bleiben erhalten
- [ ] Token und Legende nutzen dieselbe Komponente `CharacterStatus`
- [ ] Klick oder Tipp markiert genau ein Token; ein Klick aufs freie Brett hebt die Markierung auf
- [ ] Unter der Werteleiste des markierten Tokens erscheinen ein blauer Button (Schaden auf Rüstung) und ein roter Button (Schaden auf Leben), bei anderen Tokens nicht
- [ ] Doppelklick öffnet weiterhin den Editor; Ziehen über das Bild funktioniert und ändert die Markierung nicht
- [ ] Der Schadensauswahl-Dialog liegt unter `shared/`, nutzt den `general-dialog`-Look und nennt Schadensart und Charakter
- [ ] Ein gewählter Wert ändert Leben und Rüstung nach `applyDamage()`; Token und Legende zeigen das sofort und nach einem Reload; „Abbrechen“ ändert nichts
- [ ] Keine neuen Tokens, keine Kopie von Charakterwerten in der Seite, keine Änderung an `CharacterInfo`
- [ ] Jede Datei hat höchstens 150 Zeilen; die Specs prüfen das Verhalten über DOM und Harnesses
- [ ] E2E für PC und Tablet grün
- [ ] `REQUIREMENTS.md` und `architecture.md` sind angepasst
- [ ] `npm run lint`, `npm run test -- --watch=false --coverage` (Schwellen eingehalten), `npm run build` und `npm run e2e` laufen grün
