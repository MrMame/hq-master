# Feature Request: Aktive Karte als schwebende Ebene über dem Card Manager

**Datum:** 2026-11-05  
**Priorität:** Mittel  
**Status:** ✅ done (2026-11-05 18:42)  
**Bezug:** `src/app/features/card-manager/components/card-manager-page/`, `src/app/features/card-manager/components/card-display/`, `docs/feature-requests/done/card-manager-active-card-focus.md`

---

## Problem

- Die aktive Karte (`.cardInHand`) liegt innerhalb von `.card-zone` und richtet ihre Größe über `100cqi`
  nach der Breite des Kartenbereichs. Ist die Seitenleiste ausgeklappt oder das Fenster schmal, wird die
  Karte kleiner, obwohl auf dem Bildschirm Platz wäre.
- Die Karte liegt nur per `z-index: 1` über Stapeln und Bank, aber nicht sicher über allem anderen
  (Seitenleiste, Header, andere Ebenen).
- `container-type` auf `.card-zone` legt ein Layout-Containment an. Dadurch wird `.card-zone` auch zum
  Bezugsrahmen für `position: fixed`. Ein `position: fixed` an der Karte reicht deshalb nicht; die Karte muss
  aus dem DOM-Baum von `.card-zone` heraus.

---

## Ziel

- Die aktive Karte schwebt wie ein Dialog **ganz oben**, über Seitenleiste, Stapeln, Bank und Header,
  mittig im Fenster.
- Ihre Größe hängt **nur vom Fenster** ab, nicht vom Elterncontainer.
- **Nicht modal:** kein Hintergrund, der Klicks abfängt. Die Bedienung bleibt wie bisher: Klick auf den
  Ablagestapel legt ab, Klick auf eine Karte im Nachziehstapel mischt zurück, Klick in die Bank legt in die
  Bank, Klick auf die Karte legt ab.
- Das Kartenformat 63 : 88 (`--card-aspect-ratio`) bleibt erhalten.

---

## Anforderungen

### 1. Eigene Komponente für die schwebende Karte ✅ done (2026-11-05 18:42)

- Neue Komponente `active-card-overlay` unter `src/app/features/card-manager/components/` (per Angular CLI:
  `ng g c features/card-manager/components/active-card-overlay`).
- Eingaben: aktive Karte (`Card | null`) und `backImagePath`; Ausgabe: Klick auf die Karte.
- Rendert `app-card-display` nur, solange eine aktive Karte gesetzt ist.
- `card-manager-page.html` bindet die Komponente ein, `.cardInHand` entfällt dort; der Klick ruft wie bisher
  `onActiveCardClick()` auf.

### 2. Oberste Ebene über das CDK Overlay ✅ done (2026-11-05 18:42)

- Die Karte wird über das CDK Overlay (`@angular/cdk/overlay`, bereits installiert) in den
  Overlay-Container an `body` gehängt, z. B. mit `cdkConnectedOverlay` bzw. `Overlay.create()` und
  `positionStrategy: global().centerHorizontally().centerVertically()`.
- **Ohne Backdrop** (`hasBackdrop: false`): Nur die Karte selbst nimmt Klicks an, die übrige Fläche des
  Overlay-Containers lässt Klicks zu den Elementen darunter durch.
- Die Ebene liegt über allen Teilen der Seite, auch über der Seitenleiste und dem Header.
- Beim Verlassen der Seite (Routenwechsel) oder wenn keine Karte aktiv ist, verschwindet die Ebene; kein
  Overlay bleibt im DOM zurück (`dispose()` bzw. Ende von `cdkConnectedOverlay`).
- Falls die CDK-Overlay-Styles noch nicht global eingebunden sind (über das Material-Theme oder
  `@angular/cdk/overlay-prebuilt.css`), werden sie ergänzt.

### 3. Größe nur aus dem Fenster ✅ done (2026-11-05 18:42)

- Höhe `min(60dvh, calc(30vw / var(--card-aspect-ratio)))`, Breite `auto`; das Format kommt aus
  `aspect-ratio` von `card-display`.
- Die Werte (60 % Höhe, 30 % Breite) stehen je nur einmal im Code, z. B. als Custom Properties der
  Overlay-Komponente.
- Die Begrenzung auf 30 % der Fensterbreite sorgt dafür, dass Nachziehstapel und Ablagestapel neben der
  Karte sichtbar und klickbar bleiben.
- `--active-zone-fraction`, die `cqi`-Rechnung und – falls nur dafür nötig – `container-type: inline-size` an
  `.card-zone` entfallen.

### 4. Dialog-Optik ✅ done (2026-11-05 18:42)

- Kräftigerer Schatten als bei Karten in Stapeln (neuer Token, z. B. `--shadow-card-floating`, in den
  globalen Design-Tokens).
- Kurzes Einblenden beim Aktivieren (z. B. 150 ms Opacity/Scale), abgeschaltet bei
  `prefers-reduced-motion: reduce`.
- Die Zone „Aktive Karte“ im Stapelbereich bleibt als Platzhalter-Fläche bestehen.

### 5. Tests ✅ done (2026-11-05 18:42)

- Spec der neuen Komponente (Inhalt im `OverlayContainer` prüfen):
  - Mit aktiver Karte erscheint genau eine Karte im Overlay-Container, ohne aktive Karte keine.
  - Wechsel der aktiven Karte zeigt die neue Karte; Zurücksetzen auf `null` entfernt die Ebene.
  - Klick auf die Karte löst die Ausgabe aus.
  - Nach dem Zerstören der Komponente ist der Overlay-Container leer.
  - Kein Backdrop-Element vorhanden.
- `card-manager-page`-Spec: Klick auf die schwebende Karte legt sie ab (Karte landet im Ablagestapel).
- Playwright-Probe unter `e2e/probe/` bei 1920 × 1080 und 1280 × 1024, jeweils mit aus- und eingeklappter
  Seitenleiste:
  - Mitte der Karte = Mitte des Fensters (± 2 px), Seitenverhältnis 63 / 88 (± 2 %).
  - Kartengröße ist mit aus- und eingeklappter Seitenleiste gleich (± 1 px).
  - Höhe ≤ 60 % der Fensterhöhe, Breite ≤ 30 % der Fensterbreite.
  - `document.elementFromPoint` in der Kartenmitte trifft die aktive Karte (oberste Ebene).
  - `document.elementFromPoint` auf die oberste Karte des Nachziehstapels, den Ablagestapel und einen
    Bank-Punkt neben der Karte trifft diese Elemente.
  - Klick auf den Ablagestapel neben der Karte legt die aktive Karte ab; nach einem Routenwechsel ist keine
    schwebende Karte mehr im DOM.

### 6. Anforderungen dokumentieren ✅ done (2026-11-05 18:42)

- In `REQUIREMENTS.md` einen kurzen Abschnitt bzw. Satz zum Card Manager (`/cardmanager`) ergänzen: Die
  aktive Karte schwebt mittig über der ganzen Seite, ihre Größe richtet sich nach dem Fenster, Stapel und Bank
  bleiben daneben bedienbar.

---

## Akzeptanzkriterien

- [x] Die aktive Karte schwebt mittig im Fenster über allen anderen Elementen der Seite, auch über der Seitenleiste.
- [x] Ihre Größe hängt nur von der Fenstergröße ab (gleich bei aus- und eingeklappter Seitenleiste), im Format 63 : 88.
- [x] Kein Backdrop: Nachziehstapel, Ablagestapel und Bank neben der Karte bleiben klickbar und funktionieren wie bisher.
- [x] Klick auf die Karte legt sie ab; ohne aktive Karte und nach dem Verlassen der Seite ist keine Ebene mehr im DOM.
- [x] Kein horizontales Scrollen der Seite.
- [x] Die Playwright-Probe bestätigt Lage, Größe, oberste Ebene und Klickbarkeit bei zwei Fenstergrößen.
- [x] Dateien bleiben unter 150 Zeilen; die Coverage-Schwellen werden eingehalten.
