# Feature Request: Aktive Karte groß in der Mitte des Card Managers

**Datum:** 2026-11-05  
**Priorität:** Mittel  
**Status:** done (2026-11-05 17:12)  
**Bezug:** `src/app/features/card-manager/components/card-manager-page/`, `docs/feature-requests/done/card-manager-real-card-format.md`

---

## Problem

- Die aktive Karte liegt klein in der mittleren Zone „Aktive Karte“ (40 % breit, 70 % von `40dvh` hoch).
  Der DM soll sie während des Spiels gut lesen können; dafür ist sie zu klein.
- Zugleich muss er neben der Karte weiter klicken können: Nachziehstapel (aktive Karte zurückmischen),
  Ablagestapel (aktive Karte ablegen) und Bank (aktive Karte in die Bank legen).

---

## Ziel

- Die aktive Karte ist deutlich größer und steht in der Mitte des Kartenbereichs (`.card-zone`, die Fläche
  rechts neben der Seitenleiste), nicht in der Mitte des ganzen Fensters.
- Sie ist höchstens 60 % der Fensterhöhe hoch und höchstens so breit wie die mittlere Zone, damit
  Nachziehstapel und Ablagestapel links und rechts sowie die Bank seitlich klickbar bleiben.
- Sie behält das Kartenformat 63 : 88 (`--card-aspect-ratio`).
- Nur CSS, wenn möglich; Verhalten der Klicks bleibt unverändert.

---

## Anforderungen

### 1. Position: Mitte des Kartenbereichs ✅ done (2026-11-05 17:12)

- `.cardInHand` richtet sich nicht mehr an der Zone „Aktive Karte“ aus, sondern an `.card-zone`
  (`position: relative` an `.card-zone`, die Zone „Aktive Karte“ ohne eigenen Positionierungskontext).
- Waagrecht und senkrecht zentriert (z. B. `top: 50%; left: 50%; transform: translate(-50%, -50%)`).
- Die Karte liegt über Stapeln und Bank (`z-index`), die Zone „Aktive Karte“ bleibt als Fläche bestehen.

### 2. Größe: höchstens 60 % der Fensterhöhe, höchstens so breit wie die mittlere Zone ✅ done (2026-11-05 17:12)

- Höhe `60dvh`, aber nur so groß, dass die Breite (Höhe × 63/88) 40 % der Breite von `.card-zone` nicht
  überschreitet.
- Vorschlag: `.card-zone { container-type: inline-size; }` und
  `height: min(60dvh, calc(40cqi / (var(--card-aspect-ratio))))`, `width: auto`.
- Hinweis: Ein reines `max-width` reicht nicht, weil die Karte dann bei fester Höhe ihr Seitenverhältnis verliert.
- Die 40 % stehen nur einmal im Code (gleicher Wert wie die Breite von `.activeCardPile`, z. B. als lokale
  Custom Property der Seite).

### 3. Klickbarkeit neben der Karte ✅ done (2026-11-05 17:12)

- Nachziehstapel und Ablagestapel werden von der aktiven Karte nicht überdeckt.
- Die Bank bleibt links und rechts neben der Karte klickbar.
- Klick auf die aktive Karte legt sie wie bisher ab.

### 4. Tests ✅ done (2026-11-05 17:12)

- Bestehende Specs prüfen kein Layout und bleiben unverändert grün.
- Playwright-Probe unter `e2e/probe/` bei 1920 × 1080 und 1280 × 1024:
  - Mitte der aktiven Karte = Mitte von `.card-zone` (± 2 px), Seitenverhältnis 63 / 88 (± 2 %).
  - Höhe ≤ 60 % der Fensterhöhe, Breite ≤ 40 % von `.card-zone`; deutlich größer als vorher (Höhe > Höhe der Zone „Aktive Karte“).
  - Keine Überschneidung mit Nachziehstapel und Ablagestapel; `document.elementFromPoint` auf die oberste
    Karte des Nachziehstapels, den Ablagestapel und einen Bank-Punkt links neben der Karte trifft diese Elemente.
  - Klick auf Ablagestapel neben der Karte legt die aktive Karte ab.

---

## Akzeptanzkriterien

- [x] Die aktive Karte steht mittig im Kartenbereich und ist deutlich größer als bisher.
- [x] Sie ist höchstens 60 % der Fensterhöhe hoch und höchstens 40 % des Kartenbereichs breit, im Format 63 : 88.
- [x] Nachziehstapel, Ablagestapel und die Bank seitlich der Karte bleiben klickbar und funktionieren wie bisher.
- [x] Kein horizontales Scrollen der Seite.
- [x] Die Playwright-Probe bestätigt Lage, Größe und Klickbarkeit bei zwei Fenstergrößen.
- [x] Dateien bleiben unter 150 Zeilen; die Coverage-Schwellen werden eingehalten.
