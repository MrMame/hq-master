# Feature Request: Zoom-Regler am Spielbrett

**Datum:** 2026-10-27  
**Priorität:** Mittel  
**Status:** done (2026-10-27 17:44)  
**Bezug:** `REQUIREMENTS.md` (Dungeon Tracker), `docs/feature-requests/done/collapsible-sidebar.md`,
`docs/feature-requests/done/dungeon-board-zoom.md`

---

## Problem

- Der Zoom-Regler liegt in der Seitenleiste unter „Raster-Einstellungen“. Ist die Leiste
  eingeklappt (`collapsible-sidebar`), kann der DM nicht zoomen, ohne sie wieder auszuklappen.
- Zoom ist keine Raster-Einstellung. Er gehört zur Ansicht des Spielbretts.

---

## Ziel

- Der Zoom-Regler sitzt als **senkrechter** Balken oben links am Spielbrett, in einem schmalen
  Streifen neben dem Brett. Er bleibt beim Scrollen und Ziehen des Bretts stehen, verdeckt kein Feld
  und ist bei ein- und ausgeklappter Seitenleiste erreichbar.
- Es gibt nur einen Zoom-Regler: Der Regler in der Seitenleiste entfällt. Unter
  „Raster-Einstellungen“ bleiben Zellgröße, Versatz X, Versatz Y und Deckkraft.

```
┌───┬──────┬───────────────────────┐
│ › │100 % │ [Ork]                 │
│   │  │   │                       │
│   │  ●   │      Spielbrett       │  ← oben = größer
│   │  │   │                       │
│   │      │                       │
└───┴──────┴───────────────────────┘
  Leiste Zoom-Streifen
```

---

## Anforderungen

### 1. Komponente `BoardZoomControl` ✅ done (2026-10-27 17:44)

- Neue Komponente `features/dungeon-tracker/components/board-zoom-control/board-zoom-control.ts`
  (`app-board-zoom-control`), erzeugt per Angular CLI.
- Zwei-Wege-Bindung `zoom = model<number>(1)`. Bereich und Schrittweite wie bisher: 100 % bis
  400 %, Schritt 10 %.
- Senkrechter Range-Input (`writing-mode: vertical-lr; direction: rtl`, oben = größer), darüber der
  Prozentwert. Zugänglicher Name „Zoom“.
- Halbtransparenter Hintergrund in der Farbe der Seitenleiste, Akzentfarbe wie bisher
  (`--color-yellow-400`). Nur Tokens aus `tokens.css`.

### 2. Regler im Streifen links neben dem Spielbrett ✅ done (2026-10-27 17:44)

- `DungeonTrackerPage` legt Regler und Spielbrett in einen gemeinsamen Bereich (`.board-area`).
  Der Regler sitzt oben in einem schmalen Streifen links, das Brett beginnt rechts daneben. Er liegt
  außerhalb des Scroll-Containers, scrollt nicht mit und löst kein Verschieben oder Abwählen aus.
- Geändert während der Umsetzung (Rückfrage 2026-10-27): Der Regler lag zuerst absolut **über** dem
  Brett. Dort verdeckte er das Feld [0,0], auf dem neue Charaktere landen; die Tablet-E2E-Tests
  konnten das Token nicht mehr antippen. Darum jetzt ein eigener Streifen statt Überlagerung.
- Der Zoom bleibt wie bisher reiner Anzeigezustand in der Seite und wird nicht gespeichert.

### 3. Zoom-Regler aus der Seitenleiste entfernen ✅ done (2026-10-27 17:44)

- Unter „Raster-Einstellungen“ stehen nur noch Zellgröße, Versatz X, Versatz Y und Deckkraft.

### 4. Doku ✅ done (2026-10-27 17:44)

- `REQUIREMENTS.md` (Dungeon Tracker) und `.claude/rules/architecture.md` (Komponentenliste)
  angepasst.

---

## Akzeptanzkriterien

- [x] Oben links am Spielbrett liegt ein senkrechter Zoom-Regler mit Prozentanzeige.
- [x] Der Regler zoomt das Brett und ist auch bei eingeklappter Seitenleiste bedienbar.
- [x] Beim Scrollen des Bretts bleibt der Regler an seiner Stelle; er verdeckt kein Feld.
- [x] In der Seitenleiste gibt es keinen Zoom-Regler mehr; die Raster-Einstellungen haben vier
      Regler.
- [x] Specs für `BoardZoomControl` (Anzeige, Eingabe ändert den Zoom, Wert von außen, Grenzen) und
      für die Einbindung in der Seite.
- [x] Playwright-Probe auf Tablet-Breite: Regler senkrecht im Streifen links, zoomt bei
      eingeklappter Leiste, scrollt nicht mit, Token auf [0,0] frei.
