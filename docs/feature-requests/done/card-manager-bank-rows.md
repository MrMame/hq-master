# Feature Request: Bank im Card Manager mit Reihen und eigenem Scrollbereich

**Datum:** 2026-11-05  
**Priorität:** Mittel  
**Status:** done (2026-11-05 17:30)  
**Bezug:** `src/app/features/card-manager/components/card-manager-page/card-manager-page.css`,
`docs/feature-requests/done/card-manager-real-card-format.md`, `docs/feature-requests/done/card-manager-active-card-focus.md`

---

## Problem

- Die Bank (lila Ablagebereich unter den Stapeln) zeigt alle Karten in einer einzigen Reihe
  (`.bankCardsContainer` ohne Umbruch, `.cardInBank` mit `flex-shrink: 0`). Passen nicht mehr alle Karten
  nebeneinander, ragen sie seitlich aus der Bank heraus.
- Die Bank ist fest `30dvh` hoch; darunter bleibt bis zum Fensterrand ungenutzter weißer Platz.

---

## Ziel

- Passen nicht mehr alle Bank-Karten in eine Reihe, beginnt darunter eine neue Reihe.
- Die Bank füllt den Platz unter den Stapeln bis zum unteren Fensterrand. Jede Reihe ist halb so hoch wie die
  Bank, damit immer genau zwei Reihen vollständig sichtbar sind.
- Ab der dritten Reihe scrollt die Bank in sich (senkrechter Scrollbalken, kein waagrechter). Die Seite selbst
  scrollt nicht.
- Nur CSS, wenn möglich; die Klicks (Bank-Karte aktivieren, aktive Karte per Klick auf die Bank ablegen)
  bleiben unverändert.

---

## Anforderungen

### 1. Bank bis zum unteren Fensterrand ✅ done (2026-11-05 17:30)

- `.card-zone` als senkrechte Flex-Spalte mit der Höhe der Seite (`height: 100%`), Deck-Zeile und Stapel
  (`40dvh`) behalten ihre Höhe (`flex-shrink: 0`).
- `.bankContainer` statt `height: 30dvh`: `flex: 1; min-height: 0;` und reicht bis zur Unterkante von `.app-main`.
- Die Seite (`.app-main`) scrollt dadurch nicht senkrecht.

### 2. Reihen mit Umbruch ✅ done (2026-11-05 17:30)

- `.bankCardsContainer`: `flex-wrap: wrap`, Reihen oben beginnend (`align-content: flex-start`), Abstand
  zwischen Karten und Reihen über ein Token (z. B. `--space-2`), Karten je Reihe zentriert.
- Keine Karte ragt seitlich aus der Bank heraus.

### 3. Zwei Reihen sichtbar, Rest scrollt ✅ done (2026-11-05 17:30)

- Kartenhöhe in der Bank = halbe sichtbare Bankhöhe abzüglich der Abstände, Breite über das Kartenformat
  (`--card-aspect-ratio`, `width: auto`).
- Vorschlag: `.bankContainer { container-type: size; overflow-y: auto; overflow-x: hidden; }` und
  `.cardInBank { height: calc((100cqh - 3 * <Abstand>) / 2); }`.
- Ab der dritten Reihe zeigt die Bank einen senkrechten Scrollbalken und scrollt in sich.
- Ein Klick auf eine freie Stelle der Bank legt die aktive Karte weiter in die Bank, auch nach dem Scrollen.

### 4. Zusammenspiel mit der aktiven Karte ✅ done (2026-11-05 17:30)

- Die aktive Karte bleibt in der Mitte von `.card-zone` (Probe aus `card-manager-active-card-focus`) und
  überdeckt dabei die Mitte der Bank. Bank-Karten dahinter sind verdeckt, solange eine Karte aktiv ist; das ist
  gewollt (ein Klick auf eine Bank-Karte wirkt nur ohne aktive Karte).

### 5. Tests ✅ done (2026-11-05 17:30)

- Bestehende Specs prüfen kein Layout und bleiben unverändert grün.
- Playwright-Probe unter `e2e/probe/`, alle 10 Karten des Standarddecks über die UI in die Bank legen:
  - 1280 × 1024 und 1920 × 1080: Unterkante der Bank = Unterkante von `.app-main` (± 1 px); Seite scrollt
    weder waagrecht noch senkrecht; Bank-Karten im Format 63 : 88 (± 2 %); keine Karte ragt seitlich aus
    der Bank; mehr als eine Reihe, wo die Breite nicht reicht; die ersten zwei Reihen liegen vollständig im
    sichtbaren Bereich der Bank.
  - Schmales Fenster (z. B. 800 × 900) mit mindestens drei Reihen: Die Bank scrollt senkrecht
    (`scrollHeight > clientHeight`, `overflow-y: auto`), nicht waagrecht; nach dem Scrollen ist die letzte Reihe sichtbar.
- Die Proben `card-manager-real-card-format` und `card-manager-active-card-focus` bleiben grün.

---

## Akzeptanzkriterien

- [x] Passen nicht mehr alle Bank-Karten in eine Reihe, beginnt eine neue Reihe darunter.
- [x] Die Bank reicht bis zum unteren Fensterrand; immer zwei Reihen sind vollständig sichtbar.
- [x] Ab der dritten Reihe scrollt die Bank senkrecht in sich, die Seite scrollt nicht.
- [x] Bank-Karten behalten das Format 63 : 88.
- [x] Klicks auf Bank-Karten und auf die Bank funktionieren wie bisher.
- [x] Die Playwright-Probe bestätigt Reihen, Sichtbarkeit und Scrollen bei drei Fenstergrößen.
- [x] Dateien bleiben unter 150 Zeilen; die Coverage-Schwellen werden eingehalten.
