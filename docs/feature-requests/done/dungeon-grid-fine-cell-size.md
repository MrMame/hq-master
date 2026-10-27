# Feature Request: Raster im Dungeon Tracker exakt einstellen (Zellgröße mit Nachkommastellen, Raster an Bildbreite)

**Datum:** 2026-10-27  
**Priorität:** Mittel  
**Status:** done (2026-10-27 21:44)  
**Bezug:** `REQUIREMENTS.md` (Dungeon Tracker: „Das Raster soll einstellbar sein …“),
`docs/feature-requests/done/dungeon-builder.md` #14 (JPEG-Export ohne Rand)

---

## Problem

- Die Zellgröße des Rasters stellt der DM über einen Schieberegler in **ganzen Schritten** ein (20–150). Sie ist
  in Einheiten der Spielfläche angegeben, die immer 1000 breit ist (`STAGE_WIDTH`).
- Ein JPEG aus dem Dungeon Builder ist randlos. Bei 26 Spalten bräuchte das Raster die Zellgröße
  1000 / 26 = 38,46. Mit 38 liegt das Raster am rechten Rand etwa ⅓ Kachel neben den Kacheln. Exakt passt es nur
  bei 10, 20, 25, 40 oder 50 Spalten.
- Auch bei Fotos ist die genaue Zellgröße mit dem Regler allein schwer zu treffen.
- Das Feld `gridColumns` im `DungeonBoardState` wird gespeichert, aber nirgends genutzt.

---

## Ziel

- Die Zellgröße kann Nachkommastellen haben und ist auch per Zahl eingebbar.
- Für randlose Bilder (z. B. aus dem Dungeon Builder) stellt der DM das Raster in einem Schritt über die
  Spaltenanzahl ein.

```
Raster-Einstellungen
  Zellgröße  [ 38,46 ]  ───────●──────────
  Spalten über Bildbreite  [ 26 ]  [Übernehmen]   → Zellgröße 1000 / 26, Versatz 0 / 0
  Versatz X: 0 px  ●───────────
  Versatz Y: 0 px  ●───────────
  Deckkraft: 40 %  ────●───────
```

---

## Anforderungen

### 1. Zellgröße mit Nachkommastellen ✅ done (2026-10-27 21:44)

- Neben dem Regler „Zellgröße“ steht ein Zahlenfeld (`type="number"`, `min="20"`, `max="150"`,
  `step="0.01"`, `aria-label="Zellgröße"`). Regler und Feld zeigen denselben Wert und schreiben beide über
  `DungeonBoardService.updateGridSettings`.
- Der Regler bekommt `step="0.1"`. Die Anzeige rundet auf höchstens zwei Nachkommastellen, deutsch
  formatiert (z. B. „38,46“).
- Werte außerhalb von 20–150 oder leere Eingaben übernimmt das Feld nicht; der gespeicherte Wert bleibt.
- Raster und Token-Positionen rechnen mit dem ungerundeten Wert.

**Erwartetes Verhalten:** Eingabe „38,46“ legt das Raster eines 26 Spalten breiten Bildes bis zum rechten Rand
auf die Kacheln.

---

### 2. Raster an Bildbreite anpassen ✅ done (2026-10-27 21:44)

- Zahlenfeld „Spalten über Bildbreite“ (ganze Zahl, 1–100), vorbelegt mit `gridColumns`, und Button
  „Übernehmen“.
- „Übernehmen“ schreibt in einem Aufruf: `gridColumns` = Eingabe, `gridCellSizePx` = `STAGE_WIDTH / gridColumns`
  (ungerundet), `gridOffsetX` = 0, `gridOffsetY` = 0.
- Liegt das Ergebnis außerhalb von 20–150 (z. B. mehr als 50 Spalten), wird nichts übernommen und ein Hinweis
  erscheint, z. B. „Bei so vielen Spalten wäre eine Zelle kleiner als 20.“
- `gridColumns` bleibt danach unverändert, wenn der DM die Zellgröße wieder von Hand ändert. Es ist nur die
  zuletzt übernommene Spaltenanzahl.

**Erwartetes Verhalten:** Nach dem Laden eines Builder-JPEGs mit 26 Spalten und „26 → Übernehmen“ liegt das Raster
exakt auf den Kacheln.

---

### 3. Speichern ✅ done (2026-10-27 21:44)

- Die Session-XML schreibt die Zellgröße mit allen Nachkommastellen und liest sie unverändert zurück
  (`dungeon.xml-mapper.ts` nutzt bereits `String(value)` und `readNumber`). Ein Test sichert das ab.
- Kein neues Feld im `DungeonBoardState`; vorhandene Spielstände bleiben gültig.

---

### 4. Aufteilung ✅ done (2026-10-27 21:44)

- `dungeon-tracker-page.html` hat 124 Zeilen. Die Raster-Einstellungen wandern in eine eigene Komponente, z. B.
  `ng g c features/dungeon-tracker/components/grid-settings` → `GridSettings`. Sie liest `boardState` und schreibt
  über `DungeonBoardService` (keine Kopie des Zustands, Regel 6).

---

### 5. Tests ✅ done (2026-10-27 21:44)

- `grid-settings.spec.ts` über DOM: Regler und Zahlenfeld zeigen denselben Wert; Eingabe mit Nachkommastellen
  wird gespeichert; ungültige und leere Eingabe ändern nichts; „Übernehmen“ setzt Zellgröße, Versatz und
  `gridColumns`; zu viele Spalten zeigen den Hinweis und ändern nichts.
- `dungeon.xml-mapper` bzw. Session-Roundtrip: Zellgröße 38,4615… bleibt erhalten.
- Bestehende Specs der Seite bleiben grün; Coverage-Report für neue und geänderte Dateien prüfen.

---

### 6. Dokumentation ✅ done (2026-10-27 21:44)

- `REQUIREMENTS.md`, Dungeon Tracker: nach „Das Raster soll einstellbar sein …“ ergänzen, z. B.: „Die
  Zellgröße lässt sich auch mit Nachkommastellen eingeben. Für randlose Bilder, z. B. aus dem Dungeon Builder,
  stellt der DM das Raster über die Spaltenanzahl in einem Schritt passend ein.“
- `.claude/rules/architecture.md`: `GridSettings` unter `dungeon-tracker/components/`.

---

## Hinweise

- **Entscheidung (2026-10-27):** Das JPEG des Dungeon Builders bleibt randlos. Statt eines Ausgleichsrands im
  Export wird das Raster im Tracker genauer einstellbar. Builder und Tracker bleiben unabhängig.
- Der Builder kennt diesen Request nicht und muss für ihn nicht geändert werden. Beide lassen sich in beliebiger
  Reihenfolge umsetzen.

- **Umsetzung (2026-10-27):** Die Zahl-Logik liegt in `utils/grid-fit.util.ts` (Eingabe prüfen, auch mit
  Komma; Zellgröße aus Spaltenanzahl; deutsche Anzeige). Unter 7 Spalten wäre eine Zelle größer als 150; dafür
  gibt es einen eigenen Hinweis. Die Regler-Tests sind aus `dungeon-tracker-page-interactions.spec.ts` nach
  `grid-settings.spec.ts` gewandert. Probe: Builder-JPEG mit 26 Spalten im Tracker, nach „26 → Übernehmen“
  liegen Bodenreihe und letzte Spalte bis zum rechten Rand im Raster.

---

## Akzeptanzkriterien

- [x] Die Zellgröße ist per Regler (Schritt 0,1) und Zahlenfeld (Schritt 0,01) einstellbar; ungültige Eingaben ändern nichts
- [x] „Spalten über Bildbreite“ + „Übernehmen“ setzt Zellgröße 1000 / Spalten und Versatz 0 / 0
- [x] Ein randloses JPEG mit 26 Spalten lässt sich exakt mit dem Raster belegen
- [x] Die Zellgröße bleibt beim Speichern und Laden der Session mit Nachkommastellen erhalten
- [x] Die Raster-Einstellungen liegen in `GridSettings`; jede Datei hat höchstens 150 Zeilen
- [x] `REQUIREMENTS.md` und `architecture.md` sind angepasst
- [x] `npm run lint`, `npm run test -- --watch=false --coverage` (Schwellen eingehalten), `npm run build` und `npm run e2e` laufen grün
