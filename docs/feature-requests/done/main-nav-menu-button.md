# Feature Request: Menü-Button für die Hauptnavigation auf schmalen Bildschirmen

**Datum:** 2026-10-31  
**Priorität:** Mittel  
**Status:** done (2026-10-31 09:12)  
**Bezug:** `docs/refactoring-requests/done/responsive-app-header.md` (Voraussetzung), `src/app/app.ts`,
`src/app/app.css`, `REQUIREMENTS.md` (Bedienung auf dem Tablet)

---

## Problem

- Nach `responsive-app-header.md` bricht die Hauptnavigation auf schmalen Bildschirmen in mehrere Zeilen
  um. Das verhindert das Überstehen über den Bildschirmrand, kostet aber Höhe: Auf Handy und Tablet mit
  großem Zoom belegt der Header zwei oder drei Zeilen, die dem Spielbrett und dem Plan fehlen.
- Auf schmalen Bildschirmen ist bei vielen umgebrochenen Einträgen schwer zu erkennen, welche Seite gerade
  aktiv ist (nur fett).
- Mit jedem weiteren Feature wird die Navigation länger.

---

## Ziel

Unterhalb einer Breitengrenze ersetzt ein Menü-Button die Linkleiste. Der Header bleibt einzeilig und zeigt
den Namen der aktuellen Seite. Oberhalb der Grenze bleibt alles wie nach `responsive-app-header.md`.

```
Breit (≥ Grenze):
┌───────────────────────────────────────────────────────────────────────────────┐
│ HQ-Master  Game Session  Card Manager  Time Tracker  Dungeon Tracker  Dungeon Builder │
└───────────────────────────────────────────────────────────────────────────────┘

Schmal (< Grenze):
┌──────────────────────────────────────────┐
│ ☰  HQ-Master · Dungeon Tracker           │
└──────────────────────────────────────────┘
      ┌────────────────────┐
      │ Game Session       │
      │ Card Manager       │
      │ Time Tracker       │
      │ ● Dungeon Tracker  │   ← aktive Seite markiert
      │ Dungeon Builder    │
      └────────────────────┘
```

---

## Anforderungen

### 1. Navigation als eigene Komponente mit einer Liste der Einträge ✅ done (2026-10-31 09:12)

- Neue Komponente `MainNav` unter `shared/components/main-nav/` (per `ng g c shared/components/main-nav`).
  Sie enthält Linkleiste und Menü-Button.
  `app.ts` bindet nur noch `<app-main-nav />` ein.
- Die fünf Einträge (Text und Route) stehen einmal in einer Konstante:
  `shared/components/main-nav/main-nav-items.ts` → `MAIN_NAV_ITEMS: readonly MainNavItem[]` mit `{ label, route }`. Linkleiste,
  Menü und Seitenname lesen daraus. Ein neues Feature wird nur dort ergänzt.
- Reihenfolge, Texte und Ziele bleiben: Game Session `/gamesession`, Card Manager `/cardmanager`,
  Time Tracker `/timetracker`, Dungeon Tracker `/dungeontracker`, Dungeon Builder `/dungeonbuilder`.

---

### 2. Menü-Button und Aufklappliste ✅ done (2026-10-31 09:12)

- Links vor dem Logo ein Icon-Button (☰, `mat-icon-button` oder eigenes SVG wie die übrigen Icons in
  `public/img/`), Tippfläche mindestens 48 × 48 px.
- Der Button öffnet ein `mat-menu` unterhalb des Buttons mit allen Einträgen aus `MAIN_NAV_ITEMS`.
  Jeder Eintrag ist ein `mat-menu-item` mit `routerLink`.
- Der Eintrag der aktiven Seite ist markiert (fett und Punkt bzw. Häkchen) und trägt
  `aria-current="page"`.
- Die Liste schließt sich nach der Auswahl eines Eintrags, beim Tippen daneben und mit Esc (Verhalten von
  `mat-menu`).
- Der Button hat `aria-label="Hauptmenü"`. `aria-haspopup`/`aria-expanded` und Tastaturbedienung kommen
  von `mat-menu`.

**Erwartetes Verhalten:** Ein Tipp auf ☰ zeigt alle Seiten, ein Tipp auf einen Eintrag öffnet die Seite
und schließt die Liste.

---

### 3. Name der aktuellen Seite im Header ✅ done (2026-10-31 09:12)

- Im schmalen Header steht hinter dem Logo der Name der aktiven Seite (`HQ-Master · Dungeon Tracker`).
- Der Name kommt aus `MAIN_NAV_ITEMS` passend zur aktuellen Route (Router-Events per `toSignal`). Bei
  Weiterleitungen (`''`, `**` → `/dungeontracker`) zeigt er die Zielseite.
- Ist zu wenig Platz, wird der Name mit „…“ gekürzt. Der Header bleibt einzeilig.

---

### 4. Umschalten per CSS ✅ done (2026-10-31 09:12)

- Linkleiste und Menü-Button stehen beide im Template. Eine Media Query blendet je nach Breite eine Variante
  aus (`display: none`). Kein TypeScript-Code beobachtet die Bildschirmbreite.
- Die Grenze ist in `rem` angegeben (Startwert `48rem`, als Token in `src/styles/tokens.css`). Sie greift
  dadurch auch, wenn Chrome-Seitenzoom oder Schriftgröße die nutzbare Breite verkleinern.
- Die Grenze liegt so, dass oberhalb davon alle Einträge in eine Zeile passen. Das Umbrechen aus
  `responsive-app-header.md` bleibt als Absicherung für Grenzfälle erhalten.

---

### 5. Tests ✅ done (2026-10-31 09:12)

- `main-nav.spec.ts`:
  - Linkleiste zeigt alle Einträge aus `MAIN_NAV_ITEMS` mit richtigem Ziel, die aktive Seite ist markiert.
  - Per `MatMenuHarness`: Menü öffnet sich, zeigt alle Einträge, ein Klick navigiert (Router-Test-Setup)
    und schließt das Menü.
  - Der aktive Menüeintrag trägt `aria-current="page"`.
  - Der Seitenname im Header folgt der Route, auch nach einer Weiterleitung von `''`.
- `app.spec.ts`: Prüfungen auf die Navigation passen zur neuen Komponente.
- Playwright-Probe unter `e2e/probe/` (Touch, `isMobile`):
  - Bei 360 und 600 px ist nur der Menü-Button sichtbar, der Header ist einzeilig, `scrollWidth`
    entspricht der Bildschirmbreite. Antippen von ☰ und eines Eintrags wechselt die Seite.
  - Bei 800 und 1280 px ist nur die Linkleiste sichtbar.

---

### 6. Dokumentation ✅ done (2026-10-31 09:12)

- `REQUIREMENTS.md`: Satz zur Navigation ergänzen („Auf schmalen Bildschirmen erreicht der DM alle Seiten über
  einen Menü-Button oben links; der Header zeigt die aktuelle Seite.“).
- `.claude/rules/architecture.md`, Verzeichnisstruktur: `shared/components/` um `MainNav` (Hauptnavigation mit
  Menü-Button, `main-nav-items.ts` mit `MAIN_NAV_ITEMS`) ergänzen.

---

## Hinweise

- **Voraussetzung:** `docs/refactoring-requests/done/responsive-app-header.md` ist umgesetzt (linksbündige
  Einträge, Umbrechen, Seitenhöhe unabhängig vom Header).
- **Entscheidung (2026-10-31):** Aufklappliste (`mat-menu`) statt seitlicher Schublade (`mat-sidenav`). Eine
  Schublade von links würde mit den einklappbaren Seitenleisten von Dungeon Tracker und Dungeon Builder um den
  linken Rand konkurrieren.
- **Entscheidung (2026-10-31):** `MainNav` und `main-nav-items.ts` liegen unter `shared/components/main-nav/`
  (`ng g c shared/components/main-nav`), nicht in einem neuen Ordner `core/layout/`.
- **Entscheidung (2026-10-31, Umsetzung):** `@media` kann kein `var()` auswerten. Die Grenze `48rem` steht deshalb
  wie `sm = 40rem` als Doku-Eintrag im Breakpoint-Kommentar von `tokens.css` und als Wert nur in `main-nav.css`.
  Gemessen braucht die einzeilige Linkleiste 666 px (≈ 41,6 rem); `48rem` bleibt damit passend.
- Die Grenze `48rem` ist ein Startwert. Die Probe aus Punkt 5 misst, ab welcher Breite die Einträge in eine
  Zeile passen. Liegt der Wert deutlich daneben, wird das Token angepasst.

---

## Akzeptanzkriterien

- [x] Unter der Breitengrenze zeigt der Header nur ☰, Logo und den Namen der aktuellen Seite in einer Zeile
- [x] ☰ öffnet eine Liste aller fünf Seiten, die aktive Seite ist markiert; ein Tipp wechselt die Seite und schließt die Liste
- [x] Über der Grenze sieht die Navigation aus wie nach `responsive-app-header.md`
- [x] Die Einträge sind nur einmal in `MAIN_NAV_ITEMS` definiert
- [x] Bei 360 px ist keine Seite breiter als der Bildschirm
- [ ] Auf dem Galaxy Tab S11 ist die Navigation in Chrome ohne „Desktopwebsite“ per Menü-Button bedienbar (manuelle Prüfung durch den Nutzer)
- [x] `REQUIREMENTS.md` und `architecture.md` sind angepasst
- [x] Jede Datei hat höchstens 150 Zeilen
- [x] `npm run lint`, `npm run test -- --watch=false --coverage` (Schwellen eingehalten), `npm run build` und `npm run e2e` laufen grün
