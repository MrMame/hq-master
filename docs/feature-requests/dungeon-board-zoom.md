# Feature Request: Zoom und Ausschnitt-Verschieben für das Spielbrett im Dungeon Tracker

**Datum:** 2026-10-22  
**Priorität:** Mittel  
**Status:** open  
**Bezug:** `REQUIREMENTS.md` (Dungeon Tracker), `src/app/features/dungeon-tracker/components/dungeon-tracker-page/`, `src/app/features/dungeon-tracker/components/dungeon-token/`, Voraussetzung `docs/refactoring-requests/dungeon-tracker-layout.md` (Sidebar-Reihenfolge, Token-Zentrierung)

---

## Problem

- Das Raster ist eine virtuelle Kopie der Kacheln des fotografierten Spielbretts. Auf dem Tablet sind die Felder oft zu klein, um Tokens genau zu setzen oder Details auf dem Foto zu erkennen. Einen Zoom gibt es nicht.
- **Raster verrutscht bei Größenänderung:** Das Foto wird mit `object-fit: contain` an die Spielbrettfläche angepasst. Raster und Tokens stehen dagegen in festen Bildschirm-Pixeln. Ändert sich die Fläche (Fenstergröße, Tablet drehen, Sidebar), verschiebt sich das Foto unter dem Raster. Die Einstellungen stimmen dann nicht mehr.

---

## Ziel

Foto, Raster und Tokens liegen auf einer gemeinsamen **Spielfläche** und werden immer zusammen vergrößert oder verkleinert. Das Raster bleibt auf dem Foto fest, bei jeder Zoomstufe und jeder Fenstergröße.

**Zoom und Verschieben wirken nur im rechten Spielbrettbereich.** Die Seite, die App-Navigation und die Sidebar des Dungeon Trackers bleiben in Größe und Lage unverändert. Der Browser-Zoom wird nicht verwendet.

```
┌ Sidebar ─────────────┐┌ Spielbrett ─────────────────────────────┐
│ CHARAKTERE (3)       ││  ┌───────────────────────────────┐      │
│ ──────────────────── ││  │ Ausschnitt der Spielfläche     │  ▲  │
│ SPIELBRETT-FOTO LADEN││  │ (Foto + Raster + Tokens)       │  █  │ ← Bildlaufleiste
│ ──────────────────── ││  │   ↔ Ziehen auf freier Fläche   │  ▼  │
│ RASTER-EINSTELLUNGEN ││  └───────────────────────────────┘      │
│ Zoom: 200 %  ━━━●━━━ ││   ◄━━━━━━━━█━━━━━━━━━━━━━━━━━━━━►       │
│ Zellgröße …          │└─────────────────────────────────────────┘
```

---

## Anforderungen

### 1. Spielfläche mit festem Koordinatensystem

- Die Spielfläche ist immer **1000 Einheiten breit**. Die Höhe ergibt sich aus dem Seitenverhältnis des Fotos (`naturalWidth`/`naturalHeight` aus dem `load`-Event des Bildes). Ohne Foto gilt 4:3 (1000 × 750).
- Das Foto füllt die Spielfläche genau aus. Raster und Tokens liegen darauf und rechnen weiter wie bisher mit `gridCellSizePx`, `gridOffsetX/Y` und `col`/`row`, jetzt aber in Einheiten der Spielfläche statt in Bildschirm-Pixeln.
- Die Spielfläche wird per `transform: scale(fitScale * zoom)` dargestellt:
  - `fitScale = min(Brettbreite / 1000, Bretthöhe / Flächenhöhe)`. Bei 100 % Zoom passt die ganze Spielfläche in den Spielbrettbereich, wie heute das Foto.
  - Die Größe des Spielbrettbereichs wird per `ResizeObserver` gemessen.
  - Ist die Spielfläche kleiner als der Bereich, steht sie mittig darin.
- Das Raster deckt nur noch die Spielfläche (das Foto) ab, nicht mehr den leeren Rand daneben.
- Die Felder von `DungeonBoardState` bleiben unverändert. So bleiben die Spielstände und die XML-Abbildung kompatibel. Ein Kommentar im Modell nennt die neue Einheit.
- **Bewusst ohne Migration:** Gespeicherte Raster-Einstellungen passen nach dem Update einmalig nicht mehr zum Foto und werden vom DM neu eingestellt.

**Erwartetes Verhalten:** Fenster verkleinern oder Tablet drehen ändert nur die Darstellungsgröße. Raster und Tokens bleiben auf denselben Stellen des Fotos.

---

### 2. Zoom-Regler in den Raster-Einstellungen

- Neuer Schieberegler als erster Eintrag in „Raster-Einstellungen“: **„Zoom: 150 %“**, Bereich 100 % bis 400 %, Schrittweite 10 %.
- Der Zoom ist reiner Anzeigezustand (wie die Token-Markierung). Die Page hält ihn als Signal. Er wird nicht gespeichert und startet nach dem Neuladen bei 100 %.
- Beim Ändern des Zooms bleibt die Mitte des sichtbaren Ausschnitts an derselben Stelle der Spielfläche.

**Erwartetes Verhalten:** Der Regler vergrößert Foto, Raster und Tokens gemeinsam. Was in der Mitte zu sehen war, bleibt in der Mitte.

---

### 3. Bildlaufleisten

- Nur der Spielbrettbereich ist ein Scroll-Container (`overflow: auto`). Ist die gezoomte Spielfläche größer als der Bereich, zeigt er **eigene** Bildlaufleisten an seinem unteren bzw. rechten Rand. Es sind die Standard-Bildlaufleisten, die der Browser für einen einzelnen Bereich anzeigt.
- Die gezoomte Spielfläche bleibt innerhalb des Spielbrettbereichs. Sie vergrößert weder den Bereich selbst noch die Seite. Seite, App-Navigation und Sidebar bekommen dadurch keine Bildlaufleisten und verschieben sich nicht.
- Die Bildlaufleisten werden per `scrollbar-color` an das dunkle Design angepasst. Eigene Bildlaufleisten-Komponenten werden nicht gebaut.

**Erwartetes Verhalten:** Mit den Bildlaufleisten des Spielbrettbereichs lässt sich der Ausschnitt ohne Ziehen verschieben. Dabei bewegt sich nur der Inhalt des Spielbrettbereichs. Bei 100 % Zoom sind keine Bildlaufleisten zu sehen.

---

### 4. Ausschnitt per Ziehen verschieben

- Ziehen auf einer freien Stelle (Foto oder Raster, kein Token) verschiebt den Ausschnitt mit Maus und Finger. Technisch ändert das Ziehen nur `scrollLeft`/`scrollTop` des Scroll-Containers. Ziehen und Bildlaufleisten teilen sich damit denselben Zustand.
- Das Ziehen eines Tokens verschiebt weiterhin nur das Token, nicht den Ausschnitt.
- Ein Klick ohne Bewegung hebt wie bisher die Markierung auf. Nach dem Verschieben bleibt die Markierung bestehen.
- Kann verschoben werden, zeigt der Mauszeiger `grab` bzw. beim Ziehen `grabbing`.
- Mit dem Finger darf der Ausschnitt nicht doppelt wandern, also nicht durch eigenes Ziehen und zusätzlich durch natives Scrollen. Dafür `touch-action` passend setzen.

**Erwartetes Verhalten:** Beim Ziehen folgt der Ausschnitt dem Zeiger. Auf dem Tablet funktioniert das mit einem Finger.

---

### 5. Tokens im Zoom

- Tokens wachsen mit der Spielfläche. Ihr Größenverhältnis zum Feld bleibt gleich.
- Beim Ziehen folgt das Token dem Zeiger genau. Dafür bekommt `cdkDrag` den aktuellen Maßstab über `cdkDragScale` (in `@angular/cdk` 21.2 vorhanden). Ob `getFreeDragPosition()` dann Einheiten der Spielfläche liefert, wird bei der Umsetzung geprüft. Danach richtet sich die Zielfeld-Berechnung in `onDragEnd`.

**Erwartetes Verhalten:** Bei jedem Zoom landet ein gezogenes Token in dem Feld, über dem die Porträtmitte losgelassen wird.

---

### 6. Code-Aufbau: einfach und lesbar

Die Page wächst sonst über 150 Zeilen. Deshalb wird nach Zuständigkeiten aufgeteilt, und jedes Teil bleibt klein:

| Teil                                                                                | Zuständigkeit                                                                                                                   |
| ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `DungeonTrackerPage`                                                                | Nur die Sidebar sowie das Signal `zoom`, das an das Spielbrett geht                                                             |
| **neu** `DungeonBoard` (`ng g c features/dungeon-tracker/components/dungeon-board`) | Spielbrettbereich aus der Page: Scroll-Container, Spielfläche, Foto, Raster, Tokens, Markierung. Übernimmt `dungeon-board.css`. |
| **neu** Direktive `BoardPan` (`ng g d …`)                                           | Nur das Verschieben per Ziehen über Pointer-Events am Scroll-Container                                                          |
| **neu** `board-scale.util.ts`                                                       | Reine Funktionen: Flächenhöhe aus dem Seitenverhältnis, `fitScale`, Raster-Style (`gridStyle` aus der Page)                     |

- Es gibt keine eigene Matrix- oder Transformationslogik. Die einzige Umrechnung ist `scale`, der Browser übernimmt das Scrollen.
- Kein Mausrad- und kein Pinch-Zoom (siehe „Nicht im Umfang“).

---

### 7. Dokumentation

- `REQUIREMENTS.md`, Abschnitt Dungeon Tracker, nach dem Satz zum Raster ergänzen: „Über einen Zoom-Regler in den Raster-Einstellungen vergrößert der DM Foto, Raster und Charaktere gemeinsam; den Ausschnitt verschiebt er per Ziehen auf einer freien Stelle oder über die Bildlaufleisten. Das Raster bleibt dabei und bei jeder Fenstergröße fest auf dem Foto.“

---

## Nicht im Umfang

- Zoomen per Mausrad oder Zwei-Finger-Geste
- Speichern von Zoomstufe und Ausschnitt in der Spielesession
- Automatisches Umrechnen alter Raster-Einstellungen

---

## Akzeptanzkriterien

- [ ] Unit-Tests für `board-scale.util.ts`: Flächenhöhe für Hoch- und Querformat und ohne Foto, `fitScale` für breite und hohe Bereiche
- [ ] `DungeonBoard`-Spec: Die Spielfläche bekommt den Maßstab aus gemessener Größe × Zoom (`ResizeObserver` per `vi.stubGlobal` ersetzt). Raster und Tokens liegen in der Spielfläche. Ein Klick auf eine freie Stelle hebt die Markierung auf, Verschieben nicht.
- [ ] Page-Spec: Der Zoom-Regler zeigt „Zoom: 100 %“ und gibt den geänderten Wert an das Spielbrett weiter
- [ ] Token-Spec: `cdkDragScale` erhält den Maßstab. Das Zielfeld stimmt bei Zoom ≠ 100 %.
- [ ] Playwright-Probe (`e2e/probe/`):
  - Ein Token liegt bei 100 % und 300 % sowie nach einer Änderung der Viewport-Größe auf derselben Fotostelle (Toleranz ±1 px auf der Spielfläche).
  - Ziehen auf freier Fläche und die Bildlaufleisten verschieben den Ausschnitt.
  - Bei 400 % hat die Seite selbst keine Bildlaufleisten (`document.scrollingElement` ohne Überlauf). Sidebar und Spielbrettbereich behalten Position und Größe.
  - Ein Token-Drag bei 200 % landet im Zielfeld.
- [ ] Keine Datei über 150 Zeilen. Alle Vitest-Tests grün mit Coverage (`npm run test -- --watch=false --coverage`), Lint und Build fehlerfrei, `npm run e2e` grün.
- [ ] `REQUIREMENTS.md` ist ergänzt
