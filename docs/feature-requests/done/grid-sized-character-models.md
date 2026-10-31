# Feature Request: Tokens im Dungeon Tracker in Zellgröße

**Datum:** 2026-10-31  
**Priorität:** Mittel  
**Status:** done (2026-10-31 21:24)  
**Bezug:** `REQUIREMENTS.md` (Dungeon Tracker: „Das Raster entspricht dem Spielplan kacheln …“),
`docs/feature-requests/done/dungeon-grid-fine-cell-size.md`, `docs/feature-requests/done/dungeon-grid-origin.md`

---

## Problem

- Das runde Porträt eines Tokens ist immer 40 Einheiten groß (`TOKEN_PORTRAIT_SIZE_PX` in `dungeon-token.ts`,
  `--space-10` in `dungeon-token.css`), egal wie groß die Rasterzelle ist.
- Bei großen Zellen (z. B. 120) wirkt das Token winzig im Feld. Bei kleinen Zellen (z. B. 38,46 für ein
  Builder-JPEG mit 26 Spalten) ragt es über das Feld hinaus und verdeckt Nachbarfelder.
- Die Werteleiste (Leben/Rüstung) hängt unter dem Porträt und ragt in die nächste Rasterzeile.

---

## Ziel

- Das Porträt richtet sich nach der Zellgröße. Wie groß es im Feld ist, stellt der DM mit einem Regler in
  Prozent der Zellgröße ein.

```
Raster-Einstellungen
  Zellgröße    38,46px  [−] ───────●────────── [+]  [ 38,46 ]
  Token-Größe     85 %  [−] ─────────●──────── [+]
  Spalten über Bildbreite  [ 26 ]  [Übernehmen]
  …
```

---

## Anforderungen

### 1. Porträtgröße aus Zellgröße und Prozent ✅ done (2026-10-31 21:24)

- Kantenlänge des Porträts = `gridCellSizePx × tokenScale` (Einheiten der Spielfläche). Die feste Konstante
  `TOKEN_PORTRAIT_SIZE_PX` fällt weg; die Größe kommt als Eingabe bzw. `computed` in `DungeonToken`.
- Das Porträt bleibt **rund** und liegt mittig im Feld. Ring, Schatten und Markierung bleiben wie heute.
- Es gibt **keine Mindestgröße**. Sind die Tokens zu klein zum Antippen, zoomt der DM.
- Die Initialen bei Charakteren ohne Bild wachsen mit dem Porträt mit.
- Ein gezogenes Token landet weiter auf dem Feld unter der **Mitte des Porträts**, bei jeder Token-Größe.

**Erwartetes Verhalten:** Bei Zellgröße 60 und 85 % ist das Porträt 51 Einheiten groß, bei Zellgröße 120 sind es 102. Die Mitte liegt jeweils in der Feldmitte.

---

### 2. Regler „Token-Größe“ ✅ done (2026-10-31 21:24)

- Neuer `app-grid-slider` „Token-Größe“ in `GridSettings`, **direkt nach der Zellgröße**.
- Bereich **30–150 %**, Standard **85 %**, Schritt **5 %** für Regler und „−“/„+“.
- Anzeige ganzzahlig in Prozent, z. B. „85 %“.
- Geschrieben wird wie bei den anderen Reglern über `DungeonBoardService.updateGridSettings`.
- Grenzen und Schritt kommen zu den übrigen in `utils/grid-step.util.ts`.

---

### 3. Speichern in der Spielesession ✅ done (2026-10-31 21:24)

- Neues Feld `tokenScale: number` im `DungeonBoardState` (Anteil, z. B. `0.85`, wie `gridOpacity`),
  Standard `0.85` in `DEFAULT_DUNGEON_BOARD_STATE`.
- Die Session-XML schreibt und liest das Feld (`dungeon.xml-mapper.ts`). Alte Spielstände ohne das Feld
  bekommen den Standard; das gilt auch für den gespeicherten Session-Zustand im Browser.

---

### 4. Werteleiste und Menüleiste ✅ done (2026-10-31 21:24)

- Werteleiste und Menüleiste wachsen **nicht** mit der Zellgröße oder der Token-Größe. Sie behalten ihre
  heutige Größe in Einheiten der Spielfläche und zoomen also weiter mit.
- ~~Die Werteleiste liegt innen über dem unteren Rand des Porträts.~~ **Geändert nach Rückmeldung
  (2026-10-31):** Die Leiste würde das Bild verdecken. Ein unmarkiertes Token zeigt deshalb **nur sein
  Porträt**. Am markierten Token stehen Leben und Rüstung **unter dem Porträt**, darunter die Menüleiste. In der
  Legende bleiben die Werte immer sichtbar.

---

### 5. Überlappung ✅ done (2026-10-31 21:24)

- Ab etwa 100 % überlappen sich Nachbar-Tokens. Das markierte Token liegt immer oben (wie heute
  `.dungeon-token--selected`). Die übrigen bleiben in ihrer bisherigen Reihenfolge.
- Ein verdecktes Token markiert der DM über die Legende.

---

### 6. Tests ✅ done (2026-10-31 21:24)

- `grid-settings.spec.ts` über DOM bzw. Harness: Regler zeigt „85 %“, ändern und „−“/„+“ speichern
  `tokenScale` in 5er-Schritten. Die Grenzen 30 % und 150 % werden nicht über- bzw. unterschritten.
- `dungeon-token.spec.ts`: Porträtgröße und Lage folgen Zellgröße × Token-Größe (z. B. 60 × 0,85 und
  120 × 1,5). Die Feldmitte bleibt die Porträtmitte. Ein Drag landet auf dem Feld unter der Porträtmitte, auch bei
  150 % und bei Feldern links bzw. oberhalb des Nullpunkts.
- XML-Mapper: `tokenScale` übersteht den Roundtrip, fehlt das Feld, gilt der Standard.
- Bestehende Specs bleiben grün. Den Coverage-Report für neue und geänderte Dateien prüfen.
- Playwright-Probe: unmarkiert nur das Porträt, markiert die Werte unter dem Porträt.

---

### 7. Dokumentation ✅ done (2026-10-31 21:24)

- `REQUIREMENTS.md`, Dungeon Tracker: nach „Die Zellgröße lässt sich auch mit Nachkommastellen eingeben.“
  ergänzen, z. B.: „Die Charaktersymbole richten sich nach der Zellgröße; wie groß sie im Feld sind, stellt der DM
  über den Regler ‚Token-Größe‘ ein.“

---

## Hinweise

- **Entscheidungen aus dem Interview (2026-10-31):** Die Skalierung mit der Zelle kommt ohne Figuren über mehrere
  Felder; jeder Charakter belegt weiter genau ein Feld. Die Token-Größe gehört zum Spielbrett und daher in die
  Spielesession, nicht in den Browser. Die Leisten bleiben fest, damit Zahlen und Buttons auf dem Tablet bei jeder
  Zellgröße lesbar und antippbar bleiben.
- **Annahmen:** Die Legende bleibt unverändert. Neue Charaktere landen weiter auf dem ersten freien Feld
  (`placeNewTokens`).
- Die Regel „höchstens 150 Zeilen“ beachten. `grid-settings.ts` und `dungeon-token.ts` sind schon recht lang;
  falls nötig, die Größenberechnung in ein Util auslagern (z. B. `utils/token-size.util.ts`).

---

- **Umsetzung (2026-10-31):** `persistedState` ergänzt beim Laden aus dem Browser keine fehlenden Felder.
  Neu ist deshalb `utils/board-state-codec.util.ts` (`BOARD_STATE_CODEC`): Er ergänzt ältere Spielbrett-Zustände um
  die Standardwerte. Das Token bekommt `tokenScale` vom Spielbrett und setzt `--portrait-size` als
  CSS-Variable. Werte- und Menüleiste stehen nur am markierten Token. Die Smoke-Tests `e2e/dungeon-damage.spec.ts`
  prüfen die Werte am Token deshalb nur, solange es markiert ist. Probe:
  `e2e/probe/grid-sized-character-models.spec.ts` (85 % → 90 %, Zellgröße 120, unmarkiert nur das Porträt, alter
  Zustand ohne `tokenScale` → 85 %).

---

## Akzeptanzkriterien

- [x] Das Porträt ist `Zellgröße × Token-Größe` groß, rund und mittig im Feld
- [x] Der Regler „Token-Größe“ (30–150 %, Standard 85 %, Schritt 5 %) steht nach der Zellgröße
- [x] `tokenScale` bleibt beim Speichern und Laden der Session erhalten; alte Spielstände bekommen 85 %
- [x] Werteleiste und Menüleiste behalten ihre Größe und erscheinen nur am markierten Token, unter dem Porträt
- [x] Gezogene Tokens landen bei jeder Token-Größe auf dem Feld unter der Porträtmitte
- [x] Das markierte Token liegt bei Überlappung oben
- [x] `REQUIREMENTS.md` ist angepasst; jede Datei hat höchstens 150 Zeilen
- [x] `npm run lint`, `npm run test -- --watch=false --coverage` (Schwellen eingehalten), `npm run build` und `npm run e2e` laufen grün
