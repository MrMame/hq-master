# Refactoring Request: Navigationsleiste von links nach rechts, umbrechend statt über den Bildschirmrand

**Datum:** 2026-10-31  
**Priorität:** Hoch (die App ist auf dem Tablet ohne „Desktopwebsite“ nicht vollständig nutzbar)  
**Status:** open  
**Bezug:** `src/app/app.ts`, `src/app/app.css`, `REQUIREMENTS.md` (Bedienung auf dem Tablet)

---

## Problem

Auf einem Galaxy Tab S11 in Chrome ist ohne die Einstellung „Desktopwebsite“ die ganze Seite rechts
abgeschnitten. „Dungeon Builder“ in der Navigation und Teile der Features sind erst sichtbar, wenn man
die Seite seitlich verschiebt. Mit „Desktopwebsite“ passt alles.

Ursache (per Playwright-Probe gemessen):

- `.app-header__bar` und `.app-nav` sind `display: flex` ohne `flex-wrap`. Logo und Menü stehen per
  `justify-content: space-between` links und rechts. Sind alle Wörter der Links schon umgebrochen, kann
  die Leiste nicht weiter schrumpfen. Unter etwa 395 CSS-Pixeln Breite ragt `nav.app-nav` über den Rand
  (bei 360 px rechte Kante bei 394 px). Die Feature-Seiten laufen bei keiner Breite über.
- Chrome auf Android verbreitert dann die ganze Seite auf die Breite des überstehenden Elements. Alle
  Bereiche mit 100 % Breite (Header, `app-main`, Spielbrett, Plan) werden mitgezogen und ragen über den
  Bildschirm.
- Mit „Desktopwebsite“ ignoriert Chrome `width=device-width` und baut die Seite etwa 980 px breit auf.
  Dort passt die Navigation, deshalb tritt der Fehler nicht auf. Ohne diese Einstellung verkleinern die
  Zoom- und Schriftgrößen-Einstellungen des Tablets die nutzbare Breite unter die Grenze.

Zusätzlich setzt `.app-main` eine feste Höhe von `90vh`, und `dungeon-tracker-page.css` und
`dungeon-builder-page.css` setzen ihre Seite ebenfalls auf `90vh`. Wird der Header zweizeilig, wird die
Seite dadurch länger als der Bildschirm.

Fachliches Verhalten ändert sich nicht. Nur die Anordnung des Headers bei wenig Breite ändert sich.

---

## Anforderungen

### 1. Menüeinträge von links nach rechts

- `.app-header__bar`: `justify-content: flex-start` statt `space-between`. Das Menü beginnt direkt
  rechts neben dem Logo, mit festem Abstand (`gap`, z. B. `var(--space-6)`).
- Die Reihenfolge der Einträge bleibt: Game Session, Card Manager, Time Tracker, Dungeon Tracker,
  Dungeon Builder.

**Erwartetes Verhalten:** Bei ausreichender Breite steht alles in einer Zeile, linksbündig hinter dem
Logo. Rechts davon bleibt freier Platz.

---

### 2. Umbrechen statt Überstehen

- `.app-nav`: `flex-wrap: wrap` und `gap` (Zeilen- und Spaltenabstand) statt
  `& > :not(:last-child) { margin-inline-end }`.
- `.app-header__bar`: `flex-wrap: wrap`, damit bei sehr wenig Breite auch das Menü unter das Logo
  rutschen kann.
- Die einzelnen Links brechen nicht mehr innerhalb des Textes um (`white-space: nowrap` auf
  `.app-nav__link`). Bei Platzmangel wandert ein ganzer Eintrag in die nächste Zeile, aus
  „Dungeon Builder“ wird also nicht „Dungeon / Builder“.
- Kein Element des Headers ist breiter als der Bildschirm (`document.documentElement.scrollWidth`
  entspricht der Bildschirmbreite).

**Erwartetes Verhalten:**

```
Breit:   [HQ-Master] Game Session  Card Manager  Time Tracker  Dungeon Tracker  Dungeon Builder
Schmal:  [HQ-Master] Game Session  Card Manager  Time Tracker
                     Dungeon Tracker  Dungeon Builder
```

---

### 3. Seitenhöhe unabhängig von der Header-Höhe

- `.app-shell`: Höhe des Bildschirms (`height: 100dvh`) statt `min-height: 100vh`.
- `.app-main`: füllt den Rest unter dem Header (`flex: 1; min-height: 0`) statt `height: 90vh`.
- `dungeon-tracker-page.css` und `dungeon-builder-page.css`: `height: 100%` statt `90vh`, damit die
  Seiten die Höhe von `.app-main` übernehmen.
- Card Manager (`dvh`-Werte innerhalb der Seite), Game Session und Time Tracker bleiben unverändert.
  Ihr Aussehen wird nur in der Probe aus Punkt 4 geprüft.

**Erwartetes Verhalten:** Dungeon Tracker und Dungeon Builder füllen die Höhe unter dem Header ohne
senkrechten Seiten-Scrollbalken, egal ob der Header ein- oder zweizeilig ist. Spielbrett und Plan
scrollen und zoomen wie bisher in ihrem eigenen Bereich.

---

### 4. Tests

- `app.spec.ts`: Die bestehenden Prüfungen der fünf Links (Text und Ziel) bleiben grün.
- Playwright-Probe unter `e2e/probe/` (Touch, `isMobile`) bei 360, 600, 800 und 1280 px Breite auf allen
  fünf Routen:
  - `scrollWidth` entspricht der Bildschirmbreite.
  - Alle fünf Navigationseinträge liegen vollständig im Bildschirm.
  - Bei 1280 px steht die Navigation in einer Zeile und beginnt links, direkt nach dem Logo.
  - Bei Dungeon Tracker und Dungeon Builder endet `.app-main` am unteren Bildschirmrand (kein Überstand).
- Die bestehenden E2E-Tests (`npm run e2e`, u. a. `dungeon-builder-tablet.spec.ts`) bleiben grün.

---

## Hinweise

- **Entscheidung (2026-10-31):** Umbrechen statt eines Menü-Buttons („Hamburger“). Alle Einträge
  bleiben mit einem Tipp erreichbar, der Aufwand ist klein. Ein Menü-Button wäre ein eigener Feature
  Request.
- Die Probe-Dateien `e2e/probe/tablet-overflow*.spec.ts` aus der Analyse können als Ausgangspunkt dienen.
- `index.html` (`width=device-width, initial-scale=1`) bleibt unverändert.

---

## Akzeptanzkriterien

- [ ] Die Menüeinträge stehen linksbündig direkt hinter dem Logo
- [ ] Bei wenig Breite brechen ganze Einträge in eine neue Zeile um, kein Text innerhalb eines Eintrags
- [ ] Bei 360 px Breite ist keine Seite breiter als der Bildschirm, und alle fünf Einträge sind sichtbar
- [ ] Dungeon Tracker und Dungeon Builder füllen die Höhe unter dem Header, auch bei zweizeiligem Header
- [ ] Auf dem Galaxy Tab S11 passt die Seite in Chrome ohne „Desktopwebsite“ in den Bildschirm (manuelle Prüfung durch den Nutzer)
- [ ] Jede Datei hat höchstens 150 Zeilen
- [ ] `npm run lint`, `npm run test -- --watch=false --coverage` (Schwellen eingehalten), `npm run build` und `npm run e2e` laufen grün
