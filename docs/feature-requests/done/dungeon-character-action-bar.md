# Feature Request: Charakter über die Legende markieren und gemeinsame Menüleiste für Token und Legende

**Datum:** 2026-10-25  
**Priorität:** Mittel  
**Status:** done (2026-10-25 19:35)  
**Bezug:** `REQUIREMENTS.md` (Dungeon Tracker), `.claude/rules/architecture.md` → „Verzeichnisstruktur“,
`docs/feature-requests/done/dungeon-token-damage.md` #4, #5, #10, #11,
`docs/feature-requests/done/character-editor-dialog.md`

---

## Problem

- Markieren kann der DM einen Charakter nur über sein Token auf dem Spielbrett. Die Legende in der
  Seitenleiste kennt die Markierung nicht. Bei vielen Tokens oder hohem Zoom muss er das Token erst
  suchen.
- Den Charakter-Editor für einen vorhandenen Charakter öffnet nur ein Doppelklick aufs Token.
- Die Markierung liegt heute als lokales Signal im Spielbrett (`DungeonBoard.selectedCharacterId`) und
  nicht in der Seite.
- Unter dem markierten Token liegen zwei fest eingebaute Schadens-Buttons. Für weitere Befehle gibt es
  keinen vorgesehenen Ort.

---

## Ziel

- **Eine Markierung für Brett und Legende:** Ein Klick auf einen Legendeneintrag markiert den Eintrag
  und das Token. Ein Klick aufs Token markiert ebenso den Legendeneintrag.
- **Gemeinsame Menüleiste:** Unter dem markierten Token und unter dem markierten Legendeneintrag
  erscheint dieselbe Komponente `CharacterActionBar` mit drei Buttons: **Charakter editieren**,
  **Schaden auf Leben** (rot) und **Schaden auf Rüstung** (blau). Die bisherigen Schadens-Buttons am
  Token entfallen.
- **Erweiterbar:** Spätere Befehle werden nur in `CharacterActionBar` ergänzt. Token, Brett, Legende und
  Seite bleiben unverändert.
- **Sichtbar machen:** Bei Auswahl über die Legende scrollt das Brett zum Token, bei Auswahl über das
  Token scrollt die Legende zum Eintrag, jeweils nur wenn nötig.

```
Spielbrett (markiertes Token)              Legende (Seitenleiste)
      ╭──────╮
      │  🧙  │                             ┃ (o) Krag der Ork      20   5   [7,2]  ← markiert
     ┌┴──────┴┐                            ┃     [✎] [♥] [🛡]                      ← CharacterActionBar
     │ 20   5 │                              (o) Skelett            8   0   [1,1]
     └────────┘
   ┌────────────┐
   │ [✎][♥][🛡] │   ← dieselbe Komponente; am Token höchstens 4 Buttons je Reihe
   └────────────┘
     grau rot blau
      │    │    │
      │    └────┴─► CharacterDamageService.requestDamage(character, Critical | Normal)
      └──────────► CharacterEditorService.openEdit(character)
```

---

## Anforderungen

### 1. Gemeinsame Markierung in der Seite ✅ done (2026-10-25 19:35)

- Die Markierung wandert aus `DungeonBoard` in `DungeonTrackerPage`. Sie bleibt reiner UI-Zustand: nicht
  Teil der Spielesession, nicht persistiert. Nach einem Reload ist nichts markiert.
- Neues Model `features/dungeon-tracker/models/character-selection.model.ts`, z. B.
  `CharacterSelection { characterId: string; source: 'board' | 'legend' }`. Die Quelle steuert das
  Scrollen (#6).
- Die Seite hält `selection: WritableSignal<CharacterSelection | null>`. Die angezeigte Markierung wird wie
  heute aus `tokens()` abgeleitet (`computed`): Gibt es den Charakter nicht mehr, ist nichts markiert,
  ohne Aufräumen von Hand.
- `DungeonBoard` hält keine eigene Markierung mehr. Es bekommt die Markierung als Input und meldet
  Änderungen per Output, z. B. `selectionChange: string | null`:
  - Klick auf ein Token → dessen Id (Quelle `board`).
  - Klick auf eine freie Stelle (`clickWithoutPan`) → `null`.
- Das Verhalten auf dem Brett bleibt wie in `dungeon-token-damage.md` #4: Ein Klick aufs Token markiert
  es und hebt die Markierung nicht wieder auf (wegen des Doppelklicks). Ziehen ändert die Markierung
  nicht. Ein Klick auf eine freie Stelle hebt die Markierung an Brett und Legende auf.

**Erwartetes Verhalten:** Höchstens ein Charakter ist markiert, und Token und Legendeneintrag zeigen
immer dieselbe Markierung.

---

### 2. Markieren über die Legende ✅ done (2026-10-25 19:35)

- `DungeonLegendEntry` bekommt den Input `selected: boolean` und einen Output, z. B.
  `selectionToggled: void`.
- **Klickfläche:** die ganze Zeile (Bild, Name, Position), am PC per Klick und auf dem Tablet per Tipp.
- **Umschalten:** Ein Klick auf einen nicht markierten Eintrag markiert ihn (Quelle `legend`). Ein Klick
  auf den markierten Eintrag hebt die Markierung auf, auch am Token. In der Legende gibt es keinen
  Doppelklick, deshalb ist Umschalten hier möglich.
- **Werte bleiben Schnellschaden:** Ein Klick auf Leben oder Rüstung öffnet wie bisher direkt den
  Schadensdialog (`dungeon-token-damage.md` #11) und ändert die Markierung nicht.
- **Hervorhebung:** Der markierte Eintrag bekommt eine gelbe Kante links (z. B. `--color-yellow-400`) und
  einen etwas helleren Hintergrund (z. B. `--color-gray-700`), passend zum gelben Ring am Token. Der
  Inhalt verschiebt sich dabei nicht (z. B. transparente Kante im Normalzustand oder `box-shadow: inset`).
  Keine neuen Tokens.
- Der markierte Eintrag ist auch ohne Farbe erkennbar, z. B. über `aria-current="true"`.
- Ein Doppelklick auf den Eintrag öffnet **nicht** den Editor; das geht über die Menüleiste (#3).

**Erwartetes Verhalten:** Ein Tipp auf einen Legendeneintrag markiert ihn und sein Token, ein zweiter
Tipp hebt beides auf. Ein Tipp auf die Werte trägt weiterhin nur Schaden ein.

---

### 3. Menüleiste `CharacterActionBar` ✅ done (2026-10-25 19:35)

- Neue Komponente per CLI: `ng g c features/dungeon-tracker/components/character-action-bar` →
  `CharacterActionBar` (im Dungeon Tracker, weil beide Nutzer dort liegen, wie bei `CharacterStatus`).
- Input `character: InputSignal<CharacterInfo>`. Die Leiste löst ihre Befehle **selbst** aus
  (entschieden 2026-10-25), über die vorhandenen Shared-Services:

  | Reihenfolge | Button              | Aussehen                                                 | Wirkung                                                     |
  | ----------- | ------------------- | -------------------------------------------------------- | ----------------------------------------------------------- |
  | 1           | Charakter editieren | grau `--color-gray-700`, Hover `--color-gray-600`, Stift | `CharacterEditorService.openEdit(character)`                |
  | 2           | Schaden auf Leben   | rot `--color-red-600`, Hover `--color-red-700`           | `CharacterDamageService.requestDamage(character, Critical)` |
  | 3           | Schaden auf Rüstung | blau `--color-blue-600`, Hover `--color-blue-700`        | `CharacterDamageService.requestDamage(character, Normal)`   |

- `aria-label` und `title` je Button wie in der Tabelle. Die Schadens-Buttons behalten ihre Icons
  `./img/hit-critical.svg` und `./img/hit-normal.svg`.
- **Icon „Charakter editieren“:** das Material-Icon `edit` (Stift) als lokale Datei
  `public/img/edit.svg`, weiß auf transparentem Grund, eingebunden per `<img>` wie die Schadens-Icons.
  Nicht über die Material-Icons-Schrift von Google Fonts (siehe Hinweise). Pfad des Icons
  (Material Icons, Apache License 2.0, `viewBox="0 0 24 24"`):
  `M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z`
- Alle Buttons sind `--space-6` (24 px) groß, damit sie auf dem Tablet sicher antippbar sind.
- Die Leiste bringt ihr Aussehen selbst mit, damit sie an Token und Legende gleich aussieht: dunkler,
  halbtransparenter Hintergrund wie die Werteleiste am Token (z. B. `--color-gray-900` per `color-mix`),
  kleine Rundung (`--radius-sm`), Buttons per `flex-wrap` nebeneinander mit kleinem Abstand
  (`--space-1`). Die Breite bzw. den Umbruch legt der Einbettende fest (#4, #5).
- `role="toolbar"` mit `aria-label`, z. B. „Aktionen für Krag der Ork“, damit Tests und Screenreader die
  Leiste von den Werte-Buttons der Legende unterscheiden.
- Klicks und Doppelklicks in der Leiste gehen nicht an Token, Brett oder Legendeneintrag weiter
  (`stopPropagation`). Ein Button-Klick ändert also die Markierung nicht und öffnet am Token keinen
  zweiten Editor über den Doppelklick.
- Die Leiste hält keinen Zustand und keine Kopie der Charakterwerte (Regel 6). Editor und Schadensdialog
  schreiben selbst; Token und Legende folgen über `tokens()`.
- **Erweiterung später:** Ein neuer Befehl ist ein weiterer Button mit Wirkung in dieser Komponente.

**Erwartetes Verhalten:** „Charakter editieren“ öffnet den Editor mit den Werten des markierten Charakters,
wie ein Doppelklick aufs Token. Die beiden Schadens-Buttons verhalten sich wie die bisherigen am Token.

---

### 4. Menüleiste am Token ✅ done (2026-10-25 19:35)

- `DungeonToken` zeigt bei `selected()` statt der beiden Schadens-Buttons die `CharacterActionBar`,
  mittig unter der Werteleiste.
- Der Output `damageRequested` von `DungeonToken` entfällt, ebenso `onDamageRequested` und die Injektion
  von `CharacterDamageService` in `DungeonBoard`. Die bisherigen Klassen `dungeon-token__actions` und
  `dungeon-token__damage*` entfallen bzw. werden auf die Einbettung der Leiste reduziert.
- **Umbruch:** Am Token stehen höchstens **4 Buttons je Reihe**, ab dem 5. Button beginnt eine neue Reihe
  (z. B. `max-width` für 4 Buttons plus Abstände). Mit den drei Buttons dieses Requests ist die Leiste
  einzeilig und ragt mittig über die Nachbarfelder; das markierte Token liegt über den anderen.
- Ein Klick oder Tipp auf die Leiste startet kein Ziehen (gezogen wird weiter nur über das Bild,
  `cdkDragHandle`) und verschiebt nicht den Brettausschnitt (`BoardPan` ignoriert `.cdk-drag`).
- Der Doppelklick aufs Token öffnet weiterhin den Editor.

**Erwartetes Verhalten:** Unter dem markierten Token erscheinen ✎, Rot und Blau, unter allen anderen
Tokens nichts.

---

### 5. Menüleiste in der Legende ✅ done (2026-10-25 19:35)

- `DungeonLegendEntry` zeigt bei `selected()` die `CharacterActionBar` unter der Zeile. Sie beginnt
  bündig mit dem Namen, ist also um Bildbreite und Abstand eingerückt
  (z. B. `calc(var(--space-6) + var(--space-2))`).
- Die Leiste ist einzeilig und bricht nur um, wenn die Seitenleiste zu schmal ist.
- Die nachfolgenden Einträge rücken nach unten.

**Erwartetes Verhalten:** Unter dem markierten Legendeneintrag erscheint dieselbe Leiste wie am Token.

---

### 6. Zum markierten Charakter scrollen ✅ done (2026-10-25 19:35)

- **Auswahl über die Legende** (Quelle `legend`): Liegt das Token außerhalb des sichtbaren
  Brettausschnitts (Zoom über 100 %), scrollt das Brett so weit, dass Token und Leiste sichtbar sind. Ist
  es schon sichtbar, bleibt der Ausschnitt stehen.
- **Auswahl über das Token** (Quelle `board`): Ist der Legendeneintrag in der Seitenleiste nicht zu sehen
  (viele Charaktere), scrollt die Seitenleiste zu ihm. Sonst bleibt sie stehen.
- Eine Auswahl über das Token verschiebt nie den Brettausschnitt, eine Auswahl über die Legende nie die
  Seitenleiste.
- Vorschlag: Token und Legendeneintrag bekommen einen Input, z. B. `reveal: boolean` (wahr, wenn die
  Auswahl von der jeweils anderen Seite kam). Werden sie damit markiert, rufen sie
  `scrollIntoView({ block: 'nearest', inline: 'nearest' })` auf ihrem Element auf. `nearest` scrollt nur,
  wenn nötig.
- Der gemerkte Ausschnitt für den Zoom (`rememberViewCenter`) folgt über das `scroll`-Event.

**Erwartetes Verhalten:** Wer in der Legende einen Charakter antippt, sieht danach sein Token auf dem
Brett, und umgekehrt.

---

### 7. Tests ✅ done (2026-10-25 19:35)

- `character-action-bar.spec.ts`:
  - Drei Buttons in der Reihenfolge Editieren, Leben, Rüstung, mit `aria-label`s, Icons und dem
    Toolbar-Label mit dem Namen.
  - Editieren ruft `CharacterEditorService.openEdit` mit dem Charakter; Rot und Blau rufen
    `CharacterDamageService.requestDamage` mit `Critical` bzw. `Normal` (Services per `useValue`
    gemockt).
  - Klick und Doppelklick erreichen das umgebende Element nicht (Host-Testkomponente).
- `dungeon-token-selection.spec.ts`: Leiste nur bei `selected`, keine eigenen Schadens-Buttons mehr; ein
  Doppelklick auf die Leiste meldet keinen `tokenDoubleClicked`; mit `reveal` wird `scrollIntoView`
  aufgerufen, ohne nicht.
- `dungeon-legend-entry.spec.ts` (bei mehr als 150 Zeilen Aspekt-Spec
  `dungeon-legend-entry-selection.spec.ts`): Klick auf Bild, Name und Position meldet `selectionToggled`,
  Klick auf die Werte nicht; Hervorhebung und `aria-current` nur bei `selected`; Leiste nur bei
  `selected`; ein Klick in der Leiste meldet kein `selectionToggled`; `reveal` ruft `scrollIntoView`.
- `dungeon-board-tokens.spec.ts`: Markierung kommt aus dem Input; Klick aufs Token meldet die Id, Klick
  aufs freie Brett `null`, Verschieben des Ausschnitts nichts; `reveal` nur bei Quelle `legend`.
- Neue Aspekt-Spec `dungeon-tracker-page-selection.spec.ts`
  (`'DungeonTrackerPage – selection'`, weil `dungeon-tracker-page-interactions.spec.ts` schon 143 Zeilen
  hat):
  - Legenden-Klick markiert Eintrag und Token (beide zeigen die Leiste).
  - Zweiter Klick hebt beides auf.
  - Token-Klick markiert den Legendeneintrag.
  - Klick aufs freie Brett hebt beides auf.
  - Ein entfernter Charakter hinterlässt keine Markierung.
  - Klick auf einen Wert in der Legende ändert die Markierung nicht.
  - Editieren über die Leiste der Legende öffnet den Editor mit dem markierten Charakter.
- `scrollIntoView` gibt es in jsdom nicht: in den Specs per `vi.fn()` bereitstellen; bei mehrfacher
  Nutzung als Helfer unter `features/dungeon-tracker/testing/`.
- Coverage-Report für alle neuen und geänderten Dateien prüfen (`testing.md` → Definition of Done).

---

### 8. E2E ✅ done (2026-10-25 19:35)

- `e2e/dungeon-damage.spec.ts` anpassen: Der erste Test nutzt die Schadens-Buttons der Leiste am Token
  (Locator auf die Toolbar des Tokens). Ablauf und Werte bleiben gleich. Der Schnellschaden über die
  Legendenwerte bleibt unverändert.
- Neu `e2e/dungeon-selection.spec.ts`, einmal mit `click()` (PC) und einmal mit `tap()` (Tablet,
  `hasTouch`):
  - Charakter „Ork“ anlegen → Legendeneintrag antippen → Token und Eintrag zeigen je die Toolbar
    „Aktionen für Ork“ → „Charakter editieren“ in der Legende → Editor „Charakter bearbeiten“ mit Name
    „Ork“ → „Abbrechen“ → weiterhin markiert → Eintrag erneut antippen → keine Toolbar mehr.
  - Token antippen → Toolbar in der Legende sichtbar → „Charakter editieren“ am Token öffnet den Editor.
- Das Scrollen (#6) bei Zoom 400 % per Playwright-Probe unter `e2e/probe/` prüfen, besonders
  `scrollIntoView` auf dem per `transform: scale()` vergrößerten Token.

---

### 9. Dokumentation ✅ done (2026-10-25 19:35)

- `REQUIREMENTS.md`, Dungeon Tracker: Die Sätze zur Markierung und zu den Schadens-Buttons ersetzen,
  z. B.: „Ein Klick auf ein Charaktersymbol oder auf seinen Eintrag in der Legende markiert den
  Charakter an beiden Stellen; ein erneuter Klick auf den Legendeneintrag hebt die Markierung auf. Unter
  dem markierten Symbol und unter seinem Legendeneintrag erscheint dieselbe Menüleiste: Über ‚Charakter
  editieren‘ öffnet der DM den Charakter-Editor, über einen roten Button trägt er Schaden direkt auf die
  Lebensenergie und über einen blauen Button Schaden auf die Rüstung ein; der Wert wird in einem Dialog
  gewählt. Liegt der markierte Charakter außerhalb des sichtbaren Bereichs, scrollen Spielbrett bzw.
  Legende zu ihm.“ Der Satz zum Schnellschaden über die Legende bleibt.
- `.claude/rules/architecture.md`: `CharacterActionBar` unter `dungeon-tracker/components/`,
  `character-selection.model.ts` unter `dungeon-tracker/models/`; bei `DungeonTrackerPage` „Markierung“
  ergänzen.

---

### 10. Ungenutzte Material-Icons-Schrift entfernen (ergänzt 2026-10-25) ✅ done (2026-10-25 19:35)

- `src/index.html` lud die Schrift `https://fonts.googleapis.com/icon?family=Material+Icons`. Keine
  Komponente nutzt sie (kein `mat-icon`, keine Klasse `material-icons`). Der Link entfällt.
- Icons kommen weiterhin als SVG aus `public/img/` (siehe #3 und Hinweis „Icon offline“).

**Erwartetes Verhalten:** Die App lädt die Icon-Schrift nicht mehr; Aussehen und Verhalten bleiben
unverändert.

---

## Hinweise

- **Entscheidungen (2026-10-25):**
  - Klickfläche: ganze Zeile.
  - Werte in der Legende bleiben Schnellschaden ohne Markierung; Schaden gibt es dort damit doppelt
    (Werte und Leiste).
  - Zweiter Klick in der Legende hebt die Markierung auf.
  - Scrollen in beide Richtungen, nur wenn nötig.
  - Kein Doppelklick auf den Legendeneintrag.
  - Reihenfolge: Editieren, Rot, Blau.
  - Grauer Editieren-Button.
  - Am Token höchstens 4 Buttons je Reihe.
  - Die Leiste löst ihre Befehle selbst aus.
  - In der Legende ist die Leiste bündig mit dem Namen.
- **Icon offline:** `index.html` lud die Material-Icons-Schrift von Google Fonts, sie wurde aber nirgends
  genutzt (mit #10 entfernt). Die App hat keinen Service Worker. Ohne Internet am Spieltisch zeigte ein Schrift-Icon das
  Wort „edit“ statt des Stifts. Deshalb liegt das Icon als SVG unter `public/img/`. Spätere Icons für
  die Leiste kommen auf dieselbe Weise dazu.
- **Gleich benannte Buttons:** In der markierten Legendenzeile heißen Werte-Button und Leisten-Button
  beide „Schaden auf Leben“ bzw. „Schaden auf Rüstung“. Tests suchen die Leisten-Buttons deshalb
  innerhalb der Toolbar.
- **Markierung nach dem Editor:** Nach „Übernehmen“ oder „Abbrechen“ bleibt der Charakter markiert; nach
  „Entfernen“ verschwindet die Markierung durch die Ableitung aus `tokens()` (#1).
- **Dateilimit 150 Zeilen:** `dungeon-board.ts` hat 125 Zeilen. Es verliert Markierung und
  Schadensaufruf und bekommt nur Input und Output; das Scrollen liegt bei Token und Legendeneintrag
  (#6). `dungeon-tracker-page.html` hat 119 Zeilen. `dungeon-board-tokens.spec.ts` (142) und
  `dungeon-token.spec.ts` (137) liegen nahe am Limit, bei Bedarf nach Aspekt aufteilen.
- **Umsetzung Scrollen (2026-10-25):** Die Menüleiste am Token ist breiter als das 40 px breite Token.
  Das Token scrollt deshalb erst sich selbst (Höhe samt Leiste) und dann die Leiste (volle Breite) per
  `scrollIntoViewIfNeeded()` ins Bild. Die Probe zeigte vorher bei Zoom 400 % eine rechts abgeschnittene
  Leiste.
- **Hervorhebung (2026-10-25):** Der Hintergrund des markierten Legendeneintrags ist `--color-gray-700`
  zu 60 % statt voll, damit der graue Hover der Werte-Buttons sichtbar bleibt.

---

## Akzeptanzkriterien

- [x] Ein Klick oder Tipp auf einen Legendeneintrag (Bild, Name, Position) markiert Eintrag und Token; ein zweiter hebt beides auf
- [x] Ein Klick aufs Token markiert auch den Legendeneintrag; ein Klick aufs freie Brett hebt beide Markierungen auf
- [x] Ein Klick auf Leben oder Rüstung in der Legende öffnet weiterhin direkt den Schadensdialog und ändert die Markierung nicht
- [x] Der markierte Legendeneintrag ist hervorgehoben (gelbe Kante, hellerer Hintergrund) und per `aria-current` erkennbar
- [x] Unter markiertem Token und markiertem Legendeneintrag erscheint dieselbe `CharacterActionBar` mit Editieren (grau), Leben (rot), Rüstung (blau)
- [x] „Charakter editieren“ öffnet den Editor mit dem markierten Charakter; das Icon kommt aus `public/img/edit.svg`
- [x] Die Schadens-Buttons der Leiste tragen Schaden wie bisher ein; die alten Buttons am Token und `DungeonToken.damageRequested` gibt es nicht mehr
- [x] Am Token stehen höchstens 4 Buttons je Reihe; in der Legende beginnt die Leiste bündig mit dem Namen
- [x] Ein Klick in der Leiste ändert die Markierung nicht, startet kein Ziehen und öffnet keinen zusätzlichen Editor
- [x] Doppelklick aufs Token und Drag & Drop funktionieren wie bisher
- [x] Auswahl über die Legende scrollt das Brett zum Token, Auswahl über das Token scrollt die Legende zum Eintrag, jeweils nur wenn nötig
- [x] Die Markierung wird nicht persistiert und verschwindet mit dem Charakter
- [x] Keine neuen Tokens, keine Kopie von Charakterwerten, keine Änderung an `CharacterInfo`
- [x] Jede Datei hat höchstens 150 Zeilen; die Specs prüfen das Verhalten über DOM und Harnesses
- [x] E2E für PC und Tablet grün; Scrollen per Playwright-Probe geprüft
- [x] `REQUIREMENTS.md` und `architecture.md` sind angepasst
- [x] `index.html` lädt die ungenutzte Material-Icons-Schrift nicht mehr
- [x] `npm run lint`, `npm run test -- --watch=false --coverage` (Schwellen eingehalten), `npm run build` und `npm run e2e` laufen grün
