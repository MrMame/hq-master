# Refactoring Request: Gemeinsame Schnellzugriffsleiste als Shared-Komponente

**Datum:** 2026-11-01  
**Priorität:** Mittel  
**Status:** done (2026-11-01 08:28)  
**Bezug:** `features/dungeon-tracker/components/dungeon-tracker-page/dungeon-tracker-page.html`,
`features/dungeon-builder/components/builder-tool-strip/builder-tool-strip.ts`,
`shared/components/board-zoom-control/`, `src/styles/components/quick-access.css`, `.claude/rules/architecture.md`

---

## Problem

- Die Schnellzugriffsleiste des Dungeon Trackers („+“ für „Neuer Charakter“, Zoom) ist reines Markup in der
  `DungeonTrackerPage` (`<div class="general-quick-access">`).
- Die Werkzeugleiste des Dungeon Builders (`BuilderToolStrip`) nutzt dieselbe globale Klasse, definiert aber
  Button-Varianten (grau, aktiv, `disabled`), Icon-Größe und Trenner in ihren eigenen Styles.
- Leiste und Buttons sind damit doppelt bzw. verteilt beschrieben; `aria-pressed`, `aria-label` und `title`
  werden je Button von Hand gesetzt.

---

## Anforderungen

Entschieden am 2026-11-01: Der Zoom-Regler wird wie die Buttons projiziert (nicht fest eingebaut); Buttons
werden eine eigene Komponente (keine reinen CSS-Modifier).

### 1. Shared-Komponente `QuickAccessBar` ✅ done (2026-11-01 08:28)

- Neu unter `shared/components/quick-access-bar/` (per `ng g c`).
- Reiner Container: senkrechter Streifen links neben einer Spielfläche, Inhalt per `<ng-content>`, von oben
  nach unten. Kennt weder Werkzeuge noch Zoom.
- Übernimmt das Leisten-Layout aus `.general-quick-access` sowie `overflow-y: auto` (bisher nur im Builder).
- Bietet einen Trenner (z. B. `QuickAccessDivider` oder Element-Klasse der Leiste) mit `role="separator"`.

### 2. Shared-Komponente `QuickAccessButton` ✅ done (2026-11-01 08:28)

- Neu unter `shared/components/quick-access-button/` (per `ng g c`), als Attribut-Komponente auf einem
  nativen `<button>` (z. B. `button[appQuickAccessButton]`), damit `click`, `disabled` und Tastaturbedienung
  nativ bleiben.
- Signal-Inputs: `label` (setzt `aria-label`, Standard für `title`), optional `title` (z. B. mit Tastenkürzel),
  optional `icon` (Bild-URL, `alt=""`), `active` (setzt `aria-pressed` nur bei Umschalt-Buttons),
  `variant`: `primary` (gelbe Hauptaktion, wie „+“) oder `toggle` (grau, aktiv gelb mit invertiertem Icon).
- Ohne `icon` wird der projizierte Inhalt angezeigt (z. B. „+“).
- `disabled` halb durchsichtig ohne Hover-Effekt, wie bisher im Builder.

### 3. Dungeon Tracker umstellen ✅ done (2026-11-01 08:28)

- `<div class="general-quick-access">` durch `<app-quick-access-bar>` ersetzen; „+“ als
  `QuickAccessButton` (`variant="primary"`, Label „Neuer Charakter“) und `<app-board-zoom-control>` projizieren.

### 4. Dungeon Builder umstellen ✅ done (2026-11-01 08:28)

- `BuilderToolStrip` bleibt Feature-Komponente (kennt `STRIP_TOOLS`, `BuilderUiService`, Rückgängig/Wiederholen)
  und rendert ihren Inhalt in `<app-quick-access-bar>`: Werkzeuge als `toggle`-Buttons, Trenner,
  Rückgängig/Wiederholen, Zoom-Regler.
- Die eigenen Styles für Leiste, Buttons, Icons und Trenner entfallen.

### 5. Globale Styles aufräumen ✅ done (2026-11-01 08:28)

- Liegen alle Styles der Leiste in den Komponenten, entfällt `src/styles/components/quick-access.css` samt
  `@import` in `src/styles.css`. Gibt es weitere Nutzer der Klasse, bleibt sie und die Abweichung wird im
  Abschlussbericht begründet.

### 6. Tests und Doku ✅ done (2026-11-01 08:28)

- Specs für `QuickAccessBar` (Projektion, Trenner) und `QuickAccessButton` (Label/Title, Icon vs. Inhalt,
  `aria-pressed` bei `toggle`, `disabled`, Klick löst aus bzw. nicht aus).
- Bestehende Specs von `BuilderToolStrip`, `DungeonBuilderPage` und `DungeonTrackerPage` sowie
  `e2e/support/create-character.ts` bleiben grün; Locator nur über Rolle/Label.
- `.claude/rules/architecture.md`: Shared-Komponenten ergänzen, Beschreibung von `DungeonTrackerPage`,
  `BuilderToolStrip`, `BoardZoomControl` und `.general-quick-access` anpassen.

---

## Akzeptanzkriterien

- [x] Tracker und Builder sehen aus und bedienen sich wie vorher (per Playwright-Probe geprüft).
- [x] Beide Leisten nutzen `QuickAccessBar` und `QuickAccessButton`; keine Leisten-/Button-Styles mehr in den
      Feature-Komponenten.
- [x] `shared/` importiert nichts aus `features/`.
- [x] Neue Specs prüfen mehr als `should create`; Tests, Lint und Build grün, Coverage-Schwellen erreicht.
- [x] `architecture.md` beschreibt die neue Aufteilung.
