# Feature Request: Karten im Card Manager im Format echter Spielkarten

**Datum:** 2026-11-05  
**Priorität:** Mittel  
**Status:** done (2026-11-05 16:52)  
**Bezug:** `src/app/features/card-manager/`, `src/styles/tokens.css`

---

## Problem

- Auf der Card-Manager-Seite (`/cardmanager`) sehen die Karten nicht wie echte Karten aus. Ihr
  Seitenverhältnis hängt von der Fenstergröße ab, auf Breitbildschirmen liegen sie meist quer.
- Grund: Jede Karte übernimmt Breite **und** Höhe vom Container um sie herum.
  - Stapel (Nachziehstapel, Aktive Karte, Ablagestapel): `.cardInPile` und `.cardInHand` sind
    `width: 100%; height: 100%`. Die Karte füllt damit das Rechteck des Stapels
    (30 % bzw. 40 % breit, 50 % bzw. 70 % von `40dvh` hoch).
  - Bank: `.cardInBank` ist `10dvw × 10dvh` groß.
- Ein festes Kartenformat ist nirgends definiert.
- `.card-image { width: 33% }` passt zu den breiten Karten. Auf einer hochkant stehenden Karte wird
  das Motiv damit sehr klein.

---

## Ziel

- Alle Karten (Stapel, aktive Karte, Bank) haben das Seitenverhältnis einer Standard-Spielkarte
  (63 × 88 mm, hochkant), egal wie groß das Fenster ist.
- Die Größe bleibt relativ zur jeweiligen Zone. Physisch echte Millimeter sind nicht das Ziel,
  weil Browser CSS-`mm` nicht an die tatsächliche Pixeldichte des Bildschirms anpassen.
- Nur CSS wird geändert, ohne Umbau von Templates, TypeScript oder Datenmodell.

---

## Anforderungen

### 1. Token für das Kartenformat ✅ done (2026-11-05 16:52)

- In `src/styles/tokens.css` neben `--radius-card`:
  `--card-aspect-ratio: 63 / 88;`

### 2. Karte hält ihr Seitenverhältnis selbst ✅ done (2026-11-05 16:52)

- In `card-display.css`:
  `:host { display: block; aspect-ratio: var(--card-aspect-ratio); }`
- Weil das am Host steht, gilt es überall, wo `<app-card-display>` eingesetzt wird.

### 3. Seite gibt nur noch die Höhe vor ✅ done (2026-11-05 16:52)

- In `card-manager-page.css`:
  - `.cardInPile` und `.cardInHand`: `height: 100%; width: auto;` (bleiben `position: absolute`).
  - `.cardInBank`: `height: 80%; width: auto; flex-shrink: 0;` statt `10dvw × 10dvh`.
- Hinweis: Sind Breite und Höhe beide fest gesetzt, ignoriert der Browser `aspect-ratio`. Deshalb
  muss `width` auf `auto` stehen.
- Die Karten bleiben in ihrem Stapel horizontal zentriert (`.pile` hat `justify-content: center`).

### 4. Motiv passt zur hochkant stehenden Karte ✅ done (2026-11-05 16:52)

- `.card-image` größer machen (Vorschlag: `width: 85%`), damit das quadratische SVG den oberen Teil
  der Karte füllt. Name und Werte bleiben darunter lesbar.

### 5. Optional: Überschriften der Stapel nicht verdecken ✅ done (2026-11-05 16:52)

- Die Karten liegen per `position: absolute` über den Stapel-Überschriften („Nachziehstapel (n)“,
  „Ablagestapel (n)“). Das war schon vorher so.
- Vorschlag: Karten in den Stapeln mit `top` unter die Überschrift setzen und die Höhe über
  `calc(100% - <Abstand>)` angeben.

### 6. Tests ✅ done (2026-11-05 16:52)

- Die bestehenden Specs prüfen kein Layout und bleiben unverändert grün.
- Playwright-Probe unter `e2e/probe/`: Bei zwei Fenstergrößen (z. B. 1920 × 1080 und 1280 × 1024)
  liegt das Verhältnis Breite / Höhe jeder Karte in Stapel und Bank bei 63 / 88 (± 2 %).
- Optional als stabiler Smoke-Test nach `e2e/` übernehmen.

---

## Akzeptanzkriterien

- [x] Karten in Nachziehstapel, Aktive Karte, Ablagestapel und Bank stehen hochkant im Verhältnis
      63 : 88, auch bei breiten und schmalen Fenstern.
- [x] Die Karten bleiben in ihrer Zone, zentriert und ohne horizontales Scrollen der Seite.
- [x] Das Motiv ist auf Vorder- und Rückseite gut erkennbar, Name und ATK/DEF sind lesbar.
- [x] Klicks auf Stapel, aktive Karte und Bank-Karten funktionieren wie bisher.
- [x] Das Format steht nur einmal im Code (Token `--card-aspect-ratio`).
- [x] Die Playwright-Probe bestätigt das Seitenverhältnis bei zwei Fenstergrößen.
- [x] Dateien bleiben unter 150 Zeilen; die Coverage-Schwellen werden eingehalten.
