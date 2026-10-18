# Refactoring Request: Card-Zone im Card-Manager in den Elterncontainer einpassen

**Datum:** 2026-10-18  
**Priorität:** Mittel  
**Status:** done (2026-10-18 19:47)  
**Bezug:** `src/app/features/card-manager/components/card-manager-page/card-manager-page.css`, Branch `_dev_card-manager-style-rework`, Folge von `shared-sidebar-styles`

---

## Problem

Die `.card-zone` der Card-Manager-Seite ragt rechts über `.cardManagerPageContainer` hinaus:

- `.cardManagerPageContainer` ist `width: 100vw` breit. Das schließt eine vertikale Scrollbar mit ein und ist damit breiter als der verfügbare Platz.
- Die `.general-sidebar` ist `16rem` breit und hat `flex-shrink: 0`.
- Die Kinder der `.card-zone` (`.pilesContainer`, `.bankContainer`, `.bankCardsContainer`) haben feste Viewport-Breiten (`90vw` / `90dvw`).
- Als Flex-Item hat die `.card-zone` `min-width: auto` und schrumpft deshalb nicht unter 90vw. Ergebnis: 16rem + 90vw > 100vw bei jeder Fensterbreite unter 2560px.

---

## Anforderungen

### 1. Container-Breite relativ zum Elternelement ✅ done (2026-10-18 19:47)

- `.cardManagerPageContainer`: `width: 100%` statt `100vw`.

**Erwartetes Verhalten:** Der Container ist nicht breiter als `.app-main`.

---

### 2. `.card-zone` füllt den Restplatz neben der Sidebar ✅ done (2026-10-18 19:47)

- `.card-zone` erhält `flex: 1` und `min-width: 0`.

**Erwartetes Verhalten:** Sidebar und Card-Zone liegen zusammen vollständig im Container.

---

### 3. Innere Bereiche relativ zur `.card-zone` ✅ done (2026-10-18 19:47)

- `.pilesContainer` und `.bankContainer`: `width: 100%` statt `90dvw` / `90vw`.
- `.bankCardsContainer`: doppelte Hintergrundfarbe und Viewport-Maße entfernen; füllt `.bankContainer` mit `width: 100%` / `height: 100%`.

**Erwartetes Verhalten:** Stapel- und Bankbereich enden am rechten Rand der Card-Zone; das Aussehen bleibt sonst unverändert.

---

## Akzeptanzkriterien

- [x] Die `.card-zone` liegt vollständig innerhalb von `.cardManagerPageContainer` (per Playwright-Probe geprüft)
- [x] Keine Viewport-Breiten (`vw`/`dvw`) mehr in den Layout-Containern der Card-Manager-Seite
- [x] Alle Vitest-Tests grün (`npm run test`), Lint und Build fehlerfrei
