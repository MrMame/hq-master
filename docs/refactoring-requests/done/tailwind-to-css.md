# Refactoring Request: Tailwind CSS durch reines CSS ersetzen

**Datum:** 2026-10-18  
**Priorität:** Mittel  
**Status:** done (2026-10-18 18:43)  
**Bezug:** löst `docs/refactoring-requests/done/tailwind-to-scss.md` ab (rejected); `.claude/rules/clean-code.md` (File Length), `.claude/rules/testing.md` (Playwright-Proben), `angular.json` (`styles`, `inlineStyleLanguage`, Schematics)

---

## Problem

Das Styling verteilt sich auf drei Systeme: Tailwind-v4-Utilities in den Templates (`src/tailwind.css` über PostCSS), Komponenten-Styles als `.scss` und das Angular-Material-Theme in `src/material-theme.scss`. Ziel ist reines CSS mit semantischen Klassen pro Komponente und CSS Custom Properties als Tokens, ohne Tailwind, PostCSS und SCSS.

Stand der Analyse (2026-10-18):

- 13 Dateien mit Tailwind-Klassen: 7 HTML-Dateien und 6 Inline-Templates in `.ts`-Dateien, zusammen 178 `class="…"`-Attribute mit etwa 150 verschiedenen Utilities.
- 9 Werte in eckigen Klammern (`w-[30px]`, `h-[90vh]`, `max-h-[55vh]`, …).
- Varianten: 9× `hover:`, 2× `active:`, 1× `disabled:`, 1× `sm:grid-cols-10`.
- Etwa 15 Klassen mit `!`-Präfix (`!bg-*`, `!text-*`), die Angular-Material-Styles überschreiben.
- 13 `.scss`-Dateien, davon 6 leer. Außer `material-theme.scss` nutzt keine davon Sass-Features (`$`, `@use`, `@mixin`, `&`), daher reicht hier eine reine Umbenennung.

---

## Anforderungen

### 1. Design-Tokens und Basis-Styles als CSS anlegen ✅ done (2026-10-18 18:43)

- Die verwendeten Tailwind-Farben (gray, blue, green, yellow, red, lime, pink, amber, orange, white) und Abstandswerte als CSS Custom Properties auf `:root` anlegen, z. B. in `src/styles/tokens.css`. Nur Werte übernehmen, die tatsächlich genutzt werden.
- `src/styles.css` als globale Stylesheet-Datei anlegen. Dort kommt ein kleines Reset hinein, das die für die App relevanten Teile des Tailwind-Preflight ersetzt: `box-sizing`, Margins an Überschriften, Absätzen und Listen, `img { display: block }`, Button- und Rahmenstile. Der Preflight setzt heute `border-style: solid` und `border-width: 0` für alle Elemente; Klassen wie `border`/`border-t` verlassen sich darauf. Das Reset oder die semantischen Klassen müssen `border-style` daher explizit setzen.
- Die Overlay-Regel `.cdk-overlay-backdrop` (Blur) aus `src/tailwind.css` nach `src/styles.css` verschieben.
- Natives CSS-Nesting und `:hover`/`:active`/`:disabled` sind erlaubt. Für den `sm:`-Breakpoint wird eine `@media (min-width: 40rem)`-Regel verwendet (entspricht 640px in Tailwind).

**Erwartetes Verhalten:** Komponenten-CSS nutzt `var(--…)`; Farb- und Abstandswerte stehen nur in `tokens.css`.

---

### 2. Angular-Material-Theme ohne Sass ✅ done (2026-10-18 18:43)

- **Entscheidung (2026-10-18):** Das Theme wird einmalig als CSS erzeugt und als `src/styles/material-theme.css` abgelegt. `material-theme.scss` wird danach gelöscht; im Projekt bleibt keine Sass-Datei übrig.
- **Begründung:** Vom Theme hängen nur zwei Material-Module ab: `dialog` (3 Dialoge) und `button` (10 Buttons, viele davon mit Tailwind-Farb-Overrides). Ein Theme-Wechsel wird selten nötig sein, und die erzeugte Datei bleibt überschaubar.
- **Vorgehen:** `mat.theme()` (Primärfarbe `cyan`, Tertiärfarbe `orange`, Typografie Roboto, Dichte 0) einmal mit Sass kompilieren, z. B. mit `npx sass` aus einer temporären Datei im Scratchpad. Die erzeugten `--mat-sys-*`-Variablen in `material-theme.css` übernehmen.
- Einen Kopfkommentar in `material-theme.css` ergänzen. Er nennt die Theme-Konfiguration und den Befehl zum Neuerzeugen, damit sich das Theme reproduzieren und wechseln lässt.
- Die `html`/`body`-Basisregeln aus `material-theme.scss` (`color-scheme`, Hintergrund, Textfarbe und Schrift über `--mat-sys-*`, `margin`, `height`) in `styles.css` übernehmen.

**Erwartetes Verhalten:** Material-Komponenten sehen unverändert aus.

---

### 3. Vorhandene `.scss`-Dateien in `.css` umbenennen ✅ done (2026-10-18 18:43)

- Von den 11 Komponenten-`.scss`-Dateien die 6 nicht leeren per `git mv` in `.css` umbenennen und `styleUrl` anpassen: `card-display`, `card-manager-page`, `character-card-minimised`, `character-tracker-page`, `movable-character-card`, `dungeon-tracker-page`.
- Die 5 leeren Dateien löschen und ihr `styleUrl` entfernen, sofern vorhanden: `game-session-page`, `time-tracker-page` (eingebunden) sowie `app.scss`, `add-character-dialog.scss`, `damage-taken-dialog.scss`. Die letzten drei sind nicht eingebunden, weil die Komponenten Inline-`styles` haben (siehe #5).
- Die leere und nicht eingebundene Datei `src/styles.scss` löschen; sie wird durch `src/styles.css` (#1) ersetzt.
- In `angular.json` `inlineStyleLanguage` auf `css` und die Schematics (`@schematics/angular:component` → `style`) auf `css` setzen.

**Erwartetes Verhalten:** Neue Komponenten werden mit `.css` generiert; im Projekt gibt es keine `.scss`-Datei mehr.

---

### 4. Templates der HTML-Komponenten umstellen ✅ done (2026-10-18 18:43)

Die Utility-Klassen durch semantische Klassen in der jeweiligen Komponenten-`.css` ersetzen:

- `dungeon-tracker/components/dungeon-tracker-page/dungeon-tracker-page.html` (33 Attribute)
- `game-session/components/game-session-page/game-session-page.html` (20)
- `card-manager/components/card-manager-page/card-manager-page.html` (18)
- `character-tracker/components/character-card-minimised/character-card-minimised.html` (10)
- `card-manager/components/card-display/card-display.html` (8)
- `time-tracker/components/time-tracker-page/time-tracker-page.html` (6)
- `character-tracker/components/character-tracker-page/character-tracker-page.html` (6)
- `character-tracker/components/movable-character-card/movable-character-card.html` (4)

**Erwartetes Verhalten:** Die Seiten sehen aus wie vorher; die Templates enthalten keine Tailwind-Utilities mehr.

---

### 5. Inline-Template-Komponenten umstellen ✅ done (2026-10-18 18:43)

- `app.ts` (11 Attribute), `character-tracker/.../add-character-dialog/add-character-dialog.ts` (30), `character-tracker/.../character-card/character-card.ts` (24), `character-tracker/.../damage-taken-dialog/damage-taken-dialog.ts` (5), `dungeon-tracker/.../dungeon-token/dungeon-token.ts` (3).
- Die Styles über `styleUrl` in eine eigene `.css`-Datei legen, nicht als Inline-`styles`. `add-character-dialog.ts` hat bereits 145 Zeilen und würde sonst die Grenze von 150 Zeilen überschreiten. Wo es sinnvoll ist, das Template ebenfalls in eine `.html`-Datei auslagern.
- Die vorhandenen Inline-`styles` in `add-character-dialog.ts` und `damage-taken-dialog.ts` ziehen mit in die neue `.css`-Datei um. `app.ts` hat ein leeres `styles: ```, das entfernt wird.
- Für die `.damage-grid-btn`-Regel in `damage-taken-dialog.ts` (mehrere `!important` auf `min-width`, `padding`, `width`, `aspect-ratio`) gilt #7: über Material-Tokens oder spezifischere Selektoren lösen; verbleibende `!important` kommentieren.

**Erwartetes Verhalten:** Die Dialoge und Karten sehen aus wie vorher; jede Datei hat höchstens 150 Zeilen.

---

### 6. Zur Laufzeit berechnete Klassen in `DamageTakenDialog` ✅ done (2026-10-18 18:43)

- **Problem:** `getButtonColorClass()` gibt Tailwind-Strings zurück (`'!bg-green-100 !text-green-800 hover:!bg-green-200'`, …). Darunter ist auch `!bg-white-500`, eine Klasse, die es in Tailwind nicht gibt und die heute keine Wirkung hat.
- Auf semantische Modifier-Klassen umstellen (z. B. `damage-btn--light`, `--moderate`, `--noticeable`, …), die in der Komponenten-CSS definiert werden. Die Hover-Zustände und Übergänge (`hover:scale-105`, `active:scale-95`) in CSS übernehmen.
- Den Spec auf die neuen Klassen bzw. das sichtbare Verhalten anpassen.

**Erwartetes Verhalten:** Die Schadens-Buttons behalten ihre farbliche Abstufung nach Schadenshöhe.

---

### 7. Material-Overrides ohne `!`-Präfix ✅ done (2026-10-18 18:43)

- Die bisherigen `!bg-*` und `!text-*` Overrides an Material-Komponenten durch ausreichend spezifische Selektoren oder durch Überschreiben der Material-Token-Variablen ersetzen (`--mat-…`/`--mdc-…` auf der Komponente). `!important` nur, wenn es keine andere Lösung gibt, und dann mit Kommentar.

**Erwartetes Verhalten:** Die Material-Buttons und -Texte behalten ihre bisherigen Farben.

---

### 8. Tailwind-Infrastruktur entfernen ✅ done (2026-10-18 18:43)

- `tailwindcss`, `@tailwindcss/postcss` und `postcss` aus `package.json` entfernen (`npm uninstall`).
- `.postcssrc.json` und `src/tailwind.css` löschen.
- In `angular.json` die `styles` auf die neuen CSS-Dateien umstellen: `src/styles/material-theme.css`, `src/styles/tokens.css` und `src/styles.css`.

**Erwartetes Verhalten:** Build und Dev-Server laufen ohne PostCSS und Tailwind.

---

### 9. Tests und Dokumentation anpassen ✅ done (2026-10-18 18:43)

- `card-manager-page.spec.ts:58` fragt `.text-red-400` ab. Stattdessen eine semantische Klasse oder `data-testid` verwenden.
- `dungeon-token.spec.ts:11` (`GOLD_BORDER`: `border-yellow-400`, `shadow-yellow-400/50`, `shadow-md`) und `:72` (`border-red-500`) prüfen Tailwind-Klassen. Auf die semantische Token-Klasse umstellen.
- Der Smoke-Test `e2e/dungeon-drag.spec.ts:8` findet die Positionsanzeige der Legende über die Tailwind-Klasse `aside span.ml-auto`. Im Template ein `data-testid` ergänzen und den Locator darauf umstellen.
- In `.claude/rules/architecture.md` (Abschnitt Komponenten, ca. Zeile 203) „separate `.html`/`.scss`“ durch „separate `.html`/`.css`“ ersetzen.
- Den Projekttitel in `.claude/CLAUDE.md` von "Tailwind v4" auf "CSS" ändern.
- In `.github/instructions/angular-templates.instructions.md` Tailwind, SCSS und `src/tailwind.css` durch die CSS-Konventionen ersetzen (semantische Klassen, Tokens aus `tokens.css`).
- In `docs/notes-project/CI-CD/README.md` (ca. Zeile 300) den Abschnitt zu den Styles anpassen.
- `docs/notes-human/Tailwind/` bleibt unverändert (persönliche Notizen).

---

### 10. Optischer Abgleich ✅ done (2026-10-18 18:43)

- Vor dem Umbau mit einer Playwright-Probe (`e2e/probe/`) Screenshots aller Routen und Dialoge erstellen: Dungeon-Tracker, Character-Tracker inkl. Add- und Damage-Dialog, Card-Manager, Game-Session, Time-Tracker und Confirmation-Dialog.
- Die Probe legt vorher Testdaten an (Charaktere, Deck, Spielbrett-Bild, geöffnete Dialoge), damit nicht leere Seiten verglichen werden. Vergleich über `toHaveScreenshot()` mit kleiner Toleranz; die Vorher-Bilder bleiben bis zum Abschluss erhalten.
- ✅ done (2026-10-18 18:24) – Teil 1: Probe `e2e/probe/tailwind-to-css-10.spec.ts` (+ `.fixtures.ts`) mit 12 Vorher-Bildern unter `e2e/probe/tailwind-to-css-10.spec.ts-snapshots/` (gitignored, lokal). Abgedeckt: Character Tracker (Karten, Add-/Damage-Dialog, Damage-Dialog bei 600px für `sm:`), Dungeon Tracker (leer, mit Bild und Tokens), Card Manager (leer, Ladefehler, geladenes Deck mit aktiver Karte), Game Session (aktiv, Confirmation-Dialog), Time Tracker. Zwei Läufe ohne Update grün. Das Deck wird nach dem Laden nach Karten-id sortiert, weil `loadDeckConfig` zufällig mischt.
- ✅ done (2026-10-18 18:43) – Teil 2: Alle 12 Bilder pixelgleich (Lauf mit Toleranz 0). Einzige Abweichung im Zwischenstand (Datumsfeld der Game Session 2px höher) durch die Preflight-Regeln für Datums-/Zeitfelder in `styles.css` behoben.
- Ursprüngliche Vorgabe Teil 2: Nach dem Umbau dieselbe Probe erneut ausführen (`npx playwright test --project=probe e2e/probe/tailwind-to-css-10.spec.ts`, ohne `--update-snapshots`) und die Screenshots vergleichen. Abweichungen beheben oder im Abschlussbericht begründen.

---

## Reihenfolge der Umsetzung

1. #10 Teil 1: Vorher-Screenshots erstellen.
2. #1–#3: Tokens, Basis-Styles, Theme, Umbenennung.
3. #4–#7 feature-weise, je Feature ein Commit.
4. #8 erst zum Schluss: Ohne Tailwind fällt jede noch nicht umgestellte Komponente optisch auseinander.
5. #9, dann #10 Teil 2: Nachher-Screenshots vergleichen.

---

## Akzeptanzkriterien

- [x] Keine Tailwind- oder PostCSS-Abhängigkeiten in `package.json`; `.postcssrc.json` und `src/tailwind.css` sind entfernt
- [x] Keine `.scss`-Dateien mehr in `src/`; `inlineStyleLanguage` und Schematics stehen auf `css`
- [x] `src/styles/material-theme.css` enthält die `--mat-sys-*`-Variablen und einen Kopfkommentar, der beschreibt, wie das Theme neu erzeugt wird; Dialoge und Buttons sehen unverändert aus
- [x] Eine Suche nach typischen Utilities (`flex `, `bg-`, `text-gray`, `p-4`, `hover:`, `!bg-`) in `src/**/*.html` und den Inline-Templates findet keine Tailwind-Treffer mehr
- [x] Farben und Abstände stammen aus `tokens.css`; keine verstreuten Hex-Werte in Komponenten-CSS
- [x] `DamageTakenDialog` verwendet semantische Modifier-Klassen; der Spec deckt die Stufen ab
- [x] Alle Dateien ≤ 150 Zeilen
- [x] Die Screenshots vor und nach dem Umbau stimmen überein, oder die Abweichungen sind begründet
- [x] Alle Vitest-Tests grün (`npm run test -- --watch=false --coverage`, Schwellen eingehalten), Lint und Build fehlerfrei

---

## Umsetzungsnotizen (2026-10-18 18:43)

- **Theme in zwei Dateien:** Das erzeugte Theme hat 165 Variablen. Damit jede Datei unter 150 Zeilen bleibt, liegt die Typografie in `src/styles/material-theme-typography.css`; Herkunft und Neuerzeugung stehen im Kopf von `material-theme.css`.
- **Reset in `@layer base`:** wie der frühere Preflight, damit Material-Styles (ohne Layer) weiter Vorrang haben.
- **Wirkungslose Tailwind-Klassen nicht übernommen:** Per Probe gemessen, wurden an Material-Elementen `text-gray-800` (Dialogtitel), `border-t pt-2` (Dialog-Aktionen), `font-semibold`/`text-xs`/`font-bold`/`transition-all` (Buttons) und `aspect-ratio` (Schadens-Buttons) von Material überschrieben. Der aktive Navigationslink ist nur fett, weil `text-gray-600` gegen `text-blue-600` gewann.
- **Übergang ergänzt:** Hover-/Active-Skalierung der Schadens-Buttons (`scale`) wie gefordert in CSS; die Farben laufen über `--mat-button-filled-*`-Tokens.
- **`!important`:** Nur noch am Overlay-Backdrop und an `[hidden]`, jeweils kommentiert. An `.is-on-top` per Probe als unnötig belegt und entfernt.
