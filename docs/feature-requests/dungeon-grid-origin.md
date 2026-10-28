# Feature Request: Raster-Nullpunkt per Drag & Drop und ±-Buttons an den Raster-Reglern

**Datum:** 2026-10-28  
**Priorität:** Mittel  
**Status:** offen  
**Bezug:** `REQUIREMENTS.md` (Dungeon Tracker: „Das Raster soll einstellbar sein …“),
`docs/feature-requests/done/dungeon-grid-fine-cell-size.md`

---

## Problem

- Das Raster beginnt am Nullpunkt (`gridOffsetX` / `gridOffsetY`). Ändert der DM die Zellgröße, wächst
  oder schrumpft das Raster von diesem Punkt aus.
- Den Nullpunkt verschiebt der DM nur über die Regler „Versatz X/Y“ im Bereich −100 bis 100. Auf einer
  Spielfläche von 1000 Einheiten liegt er damit immer nahe der oberen linken Bildecke.
- Ein Foto zeigt das Spielbrett meist mit Rand. Damit das Raster passt, gehört der Nullpunkt auf eine
  Kachelecke des Spielfelds im Foto. Das geht heute nur mühsam über die Regler und oft gar nicht.
- Tokens lassen sich nur rechts und unterhalb des Nullpunkts ablegen (Spalte und Zeile mindestens 0).
- Die Regler lassen sich auf dem Tablet nicht in kleinsten Schritten bewegen. Feines Nachstellen von
  Zellgröße, Nullpunkt und Deckkraft ist kaum möglich.

---

## Ziel

- Der Nullpunkt ist auf dem Spielbrett markiert. Der DM legt ihn per Drag & Drop auf eine beliebige
  Kachelecke im Foto, z. B. eine gut erkennbare Kreuzung in der Bildmitte, und stellt danach die Zellgröße ein.
  Das Raster wächst von dort in alle Richtungen.
- Charaktere lassen sich auf jedem Feld der Spielfläche ablegen, auch links und oberhalb des Nullpunkts. Ihre
  Position hat dann eine negative Spalte bzw. Zeile.
- Jeder Raster-Regler hat einen „−“- und einen „+“-Button, die den Wert um die feinste Stufe ändern.

```
Raster-Einstellungen
  [x] Nullpunkt verschieben              → blendet den Marker auf dem Spielbrett ein
  Zellgröße: 38,46px      [−] ─────●────── [+]   [ 38,46 ]
  Spalten über Bildbreite  [ 26 ]  [Übernehmen]
  Nullpunkt X: 412,4      [−] ────●─────── [+]
  Nullpunkt Y: 287        [−] ───●──────── [+]
  Deckkraft: 40 %         [−] ────●─────── [+]

Spielbrett (Bearbeitungsmodus)
  ┌───────────────────────────────────┐
  │  ┼───┼───┼───┼───┼───┼            │
  │  │   │ A │   │   │   │            │   A liegt auf Spalte −2, Zeile −1
  │  ┼───┼───⊕───┼───┼───┼            │   ⊕ = Nullpunkt-Marker (Spalte 0, Zeile 0), ziehbar
  │  │   │   │ B │   │   │            │   B liegt auf Spalte 0, Zeile 0
  │  ┼───┼───┼───┼───┼───┼            │
```

---

## Anforderungen

### 1. Nullpunkt-Modus

- In den Raster-Einstellungen gibt es oberhalb der Regler einen Schalter „Nullpunkt verschieben“
  (Checkbox oder Toggle-Button, per Rolle und Text auffindbar).
- Der Schalter ist reiner UI-Zustand. Er wird nicht gespeichert und ist beim Öffnen der Seite aus.
- Die Seite hält den Zustand (wie `zoom`) und gibt ihn an `GridSettings` (z. B. `model<boolean>`) und an
  `DungeonBoard` (`input<boolean>`) weiter.

**Erwartetes Verhalten:** Ohne aktivierten Schalter sieht und bedient der DM das Spielbrett wie bisher.

---

### 2. Nullpunkt-Marker auf dem Spielbrett

- Im Nullpunkt-Modus liegt auf der Spielfläche ein Marker genau auf dem Nullpunkt
  (`gridOffsetX` / `gridOffsetY`), z. B. ein Fadenkreuz mit Kreis in `--color-yellow-400` und dunkler Kontur.
- Der Marker ist auch bei Deckkraft 0 sichtbar und liegt über Raster und Tokens.
- Er behält bei jedem Zoom dieselbe Bildschirmgröße (Größe in Einheiten = Bildschirmgröße / `scale`, wie die
  Linienstärke in `gridStyle`). Die Grifffläche ist auf dem Tablet mindestens etwa 40 px groß.
- Zugänglicher Name und Test-Locator: `aria-label="Nullpunkt"`, `data-testid="grid-origin"`.

---

### 3. Nullpunkt per Drag & Drop verschieben

- Der DM zieht den Marker mit Maus, Finger oder Stift. Beim Loslassen schreibt das Spielbrett den neuen
  Nullpunkt über `DungeonBoardService.updateGridSettings({ gridOffsetX, gridOffsetY })`.
- Während des Ziehens folgt das Raster dem Marker, damit der DM die Linien direkt am Foto ausrichten kann.
- Die Zugstrecke wird von Bildschirm-Pixeln in Einheiten der Spielfläche umgerechnet (`cdkDragScale` wie bei
  den Tokens).
- Werte werden auf eine Nachkommastelle gerundet und auf den erlaubten Bereich begrenzt (Punkt 6).
- Tokens bleiben auf ihrem Feld relativ zum Nullpunkt und wandern mit dem Raster mit (wie heute beim
  Versatz). Die Felder werden nicht neu nummeriert.
- Ziehen am Marker verschiebt nicht den Ausschnitt (`BoardPan` ignoriert `.cdk-drag`). Ein Klick auf den
  Marker hebt die Markierung eines Charakters nicht auf.
- Ändert der DM danach die Zellgröße, bleibt der Nullpunkt fest und das Raster wächst von dort in alle
  Richtungen.

**Erwartetes Verhalten:** Der DM legt den Marker auf eine gut erkennbare Kachelecke des fotografierten
Spielbretts, z. B. in der Bildmitte, und stellt danach nur noch die Zellgröße ein, bis das Raster auf den
Kacheln liegt. Weil das Raster vom Nullpunkt nach allen Seiten wächst, verteilt sich eine Abweichung
gleichmäßig auf beide Ränder.

---

### 4. Charaktere links und oberhalb des Nullpunkts

- Spalte und Zeile einer Position (`DungeonPosition.col` / `row`) dürfen negativ sein. Spalte −1, Zeile 0 ist
  das Feld direkt links neben dem Nullpunkt.
- Die Untergrenze 0 in `DungeonToken.fieldAt` entfällt. Stattdessen wird die Porträtmitte beim Ablegen auf den
  linken und oberen Rand der Spielfläche begrenzt (x und y mindestens 0). So landet kein Token links oder
  oberhalb außerhalb des Fotos. Rechts und unten bleibt das Verhalten wie heute.
- Neue Charaktere erscheinen wie bisher ab dem Feld am Nullpunkt (`placeNewTokens` ab Spalte 0, Zeile 0).
  Belegte Felder mit negativer Spalte oder Zeile zählen als belegt.
- Die Legende zeigt die Position mit Vorzeichen, z. B. „[-2,-1]“.
- Die Session-XML schreibt und liest negative Spalten und Zeilen unverändert (`readNumber`). Ein Test
  sichert das ab.

**Erwartetes Verhalten:** Liegt der Nullpunkt in der Bildmitte, zieht der DM einen Charakter auf ein Feld
links oben davon. Der Charakter bleibt dort liegen, die Legende zeigt z. B. „[-2,-1]“, und nach Speichern und
Laden der Session liegt er auf demselben Feld.

---

### 5. ±-Buttons an den Raster-Reglern

- Neben den Reglern Zellgröße, Nullpunkt X, Nullpunkt Y und Deckkraft steht links ein „−“- und rechts ein
  „+“-Button (`aria-label` z. B. „Zellgröße verringern“ / „Zellgröße erhöhen“).
- Schrittweite (feinste Stufe):

  | Regler      | Schritt | Bereich                       |
  | ----------- | ------- | ----------------------------- |
  | Zellgröße   | 0,01    | 20 – 150 (`CELL_SIZE_LIMITS`) |
  | Nullpunkt X | 0,1     | −100 – 1000 (`STAGE_WIDTH`)   |
  | Nullpunkt Y | 0,1     | −100 – 1000                   |
  | Deckkraft   | 5 %     | 0 – 100 %                     |

- Das Ergebnis wird auf die Genauigkeit des Schritts gerundet. So entsteht kein Gleitkomma-Rest wie
  38,470000000000006. Ein ungerundeter Wert aus „Spalten über Bildbreite“ (38,4615…) wird dabei z. B. zu 38,47.
- Am Bereichsende ist der jeweilige Button deaktiviert, der Wert bleibt in den Grenzen.
- Gedrückthalten wiederholt den Schritt: erster Schritt sofort, Wiederholung nach etwa 400 ms, danach etwa
  alle 80 ms. Loslassen, Verlassen des Buttons und `pointercancel` beenden die Wiederholung.
- Das Zahlenfeld der Zellgröße bleibt.

---

### 6. Regler „Versatz“ werden zu „Nullpunkt“

- Die Regler „Versatz X/Y“ heißen „Nullpunkt X/Y“ und zeigen dieselben Werte wie der Marker, deutsch mit
  höchstens einer Nachkommastelle (z. B. „412,4“).
- Bereich der Regler: −100 bis `STAGE_WIDTH` (1000) für X und Y. Der bisherige Bereich −100 bis 100 bleibt
  darin enthalten, gespeicherte Spielstände bleiben gültig.
- Beim Ziehen bleibt der Marker zusätzlich auf der Spielfläche (X höchstens Breite, Y höchstens Höhe der
  Spielfläche). Negative Werte sind für Fotos gedacht, die das Spielfeld am Rand abschneiden, und werden über
  Regler oder ±-Buttons eingestellt.
- „Spalten über Bildbreite → Übernehmen“ setzt den Nullpunkt wie bisher auf 0 / 0.
- Die Feldnamen `gridOffsetX` / `gridOffsetY` im `DungeonBoardState` und in der Session-XML bleiben
  unverändert.

---

### 7. Aufteilung

- Regler mit Beschriftung, „−“, „+“ und Wiederholung kommen in eine eigene Komponente, z. B.
  `ng g c features/dungeon-tracker/components/grid-slider` → `GridSlider` (Eingaben: Beschriftung, Wert,
  Grenzen, Schritt; Ausgabe: neuer Wert). `GridSettings` nutzt sie für alle vier Regler und bleibt unter
  150 Zeilen je Datei.
- Die Wiederholung beim Gedrückthalten ist allgemein und kommt als Direktive nach `shared/directives/`, z. B.
  `RepeatOnHold` (wie `BoardPan`).
- Der Marker kommt in eine eigene Komponente, z. B.
  `ng g c features/dungeon-tracker/components/grid-origin-marker` → `GridOriginMarker`. `DungeonBoard` bindet
  sie nur im Nullpunkt-Modus ein und schreibt über den Service.
- Rechen-Logik (Schritt + Runden + Begrenzen, Umrechnung der Zugstrecke, Feld aus Porträtmitte) gehört in
  reine Funktionen unter `utils/` (z. B. `grid-fit.util.ts` erweitern oder `grid-step.util.ts`).

---

### 8. Tests

- `grid-slider.spec.ts` über DOM: „+“/„−“ ändern um genau einen Schritt; Rundung (38,46 + 0,01 = 38,47);
  Button am Bereichsende deaktiviert; Regler meldet den Wert wie bisher.
- `repeat-on-hold.spec.ts` mit `vi.useFakeTimers()`: ein Schritt bei kurzem Druck; Wiederholung nach
  Verzögerung; Ende bei `pointerup`, `pointerleave` und `pointercancel`.
- `grid-settings.spec.ts`: Schalter „Nullpunkt verschieben“ meldet den Zustand; Beschriftung „Nullpunkt X/Y“;
  ±-Buttons schreiben über den Service; „Übernehmen“ setzt den Nullpunkt weiterhin auf 0 / 0.
- `grid-origin-marker.spec.ts` bzw. `dungeon-board.spec.ts`: Marker nur im Nullpunkt-Modus; Position =
  Nullpunkt; Drag-Ende schreibt den umgerechneten, gerundeten und begrenzten Wert; Tokens rechnen mit dem
  neuen Nullpunkt; Klick auf den Marker löst kein `selectionChange` aus.
- `dungeon-token.spec.ts`: Ablegen links bzw. oberhalb des Nullpunkts meldet eine negative Spalte bzw. Zeile;
  ein Token mit negativer Position wird links bzw. oberhalb des Nullpunkts gezeichnet; Ablegen links oder
  oberhalb außerhalb der Spielfläche landet auf dem Feld am Rand.
- `token-placement.util.spec.ts`: Felder mit negativer Spalte oder Zeile zählen als belegt, neue Tokens
  starten weiter bei 0 / 0.
- `dungeon-legend-entry.spec.ts`: negative Position wird mit Vorzeichen angezeigt.
- Session-Roundtrip: Nullpunkt mit Nachkommastelle (z. B. 412,4) und Positionen mit negativer Spalte und
  Zeile bleiben beim Speichern und Laden erhalten.
- Playwright-Probe unter `e2e/probe/`: Marker im Browser ziehen, Raster und Tokens folgen; bei Zoom 200 %
  stimmt die Umrechnung; ein Token lässt sich links oberhalb des Nullpunkts ablegen.
- Coverage-Report für neue und geänderte Dateien prüfen.

---

### 9. Dokumentation

- `REQUIREMENTS.md`, Dungeon Tracker: nach „… stellt der DM das Raster über die Spaltenanzahl in einem Schritt
  passend ein.“ ergänzen, z. B.: „Im Modus ‚Nullpunkt verschieben‘ zieht der DM den markierten Nullpunkt des
  Rasters auf eine Kachelecke im Foto. Von dort wächst das Raster in alle Richtungen, wenn er die Zellgröße
  ändert. Charaktere lassen sich auch links und oberhalb des Nullpunkts ablegen. Jeder Raster-Regler lässt
  sich über ‚−‘ und ‚+‘ in feinsten Schritten nachstellen.“
- `.claude/rules/architecture.md`: `GridSlider` und `GridOriginMarker` unter `dungeon-tracker/components/`,
  `RepeatOnHold` unter `shared/directives/`.

---

## Hinweise

- **Entscheidung (2026-10-28):** Tokens wandern beim Verschieben des Nullpunkts mit dem Raster (keine
  Umnummerierung der Felder). Felder links und oberhalb des Nullpunkts sind nutzbar und haben negative Spalten
  bzw. Zeilen. Der Marker ist nur im Modus „Nullpunkt verschieben“ sichtbar, damit er im Spiel nicht stört und
  auf dem Tablet nicht versehentlich gezogen wird. Die ±-Buttons nutzen die feinste Stufe.
- Weil Tokens mit dem Raster wandern, können sie nach dem Verschieben des Nullpunkts oder einer größeren
  Zellgröße ganz außerhalb der Spielfläche liegen (heute schon rechts und unten möglich). Der DM holt sie
  zurück, indem er den Nullpunkt bzw. die Zellgröße wieder anpasst. **Entscheidung (2026-10-28):** Es gibt
  bewusst keine automatische Korrektur; solche Tokens bleiben außerhalb des Bildes liegen.
- Liegt der Nullpunkt bei negativen Werten außerhalb der Spielfläche, ist der Marker ganz oder teilweise
  verdeckt. Das ist gewollt; eingestellt wird dann über Regler oder ±-Buttons.
- Nicht Teil dieses Requests: ±-Buttons am Zoom-Regler und Tastatursteuerung des Markers.

---

## Akzeptanzkriterien

- [ ] Ein Schalter „Nullpunkt verschieben“ blendet einen Marker am Nullpunkt des Rasters ein und aus; der
      Zustand wird nicht gespeichert
- [ ] Der Marker lässt sich per Maus und Touch ziehen; Raster und Tokens folgen, der Wert wird gespeichert
- [ ] Nach dem Verschieben wächst das Raster beim Ändern der Zellgröße vom neuen Nullpunkt in alle Richtungen
- [ ] Die Umrechnung stimmt bei jedem Zoom; Ziehen am Marker verschiebt nicht den Ausschnitt
- [ ] Charaktere lassen sich links und oberhalb des Nullpunkts ablegen; ihre Position hat dann eine negative
      Spalte bzw. Zeile, wird in der Legende angezeigt und bleibt beim Speichern und Laden erhalten
- [ ] Zellgröße, Nullpunkt X/Y und Deckkraft haben „−“/„+“-Buttons mit feinster Schrittweite, Begrenzung und
      Wiederholung beim Gedrückthalten
- [ ] Bestehende Spielstände (Versatz −100 bis 100) laden unverändert; Nachkommastellen bleiben beim Speichern
      erhalten
- [ ] Jede Datei hat höchstens 150 Zeilen; `REQUIREMENTS.md` und `architecture.md` sind angepasst
- [ ] `npm run lint`, `npm run test -- --watch=false --coverage` (Schwellen eingehalten), `npm run build` und
      `npm run e2e` laufen grün
