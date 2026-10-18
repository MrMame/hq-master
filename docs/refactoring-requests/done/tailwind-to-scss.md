# Refactoring Request: Tailwind CSS entfernen, Styling vollständig auf SCSS

**Datum:** 2026-10-18  
**Priorität:** Mittel  
**Status:** rejected (2026-10-18) — Tailwind soll durch reines CSS statt SCSS ersetzt werden; abgelöst durch `docs/refactoring-requests/tailwind-to-css.md`  
**Bezug:** `.claude/rules/clean-code.md` (File Length), `.claude/rules/testing.md` (Playwright-Proben, Verhalten statt Implementierung), `angular.json` (`styles`, `inlineStyleLanguage: scss`)

---

## Problem

Das Styling verteilt sich auf zwei Systeme: Angular Material wird über SCSS gestylt (`src/material-theme.scss`), das Layout und die Farben über Tailwind-v4-Utilities in den Templates (`src/tailwind.css` über PostCSS). Ziel ist ein einziges Styling-System auf Basis von SCSS mit semantischen Klassen pro Komponente.

Stand der Analyse (2026-10-18):

- 13 Dateien mit Tailwind-Klassen: 7 HTML-Dateien und 6 Inline-Templates in `.ts`-Dateien, zusammen 178 `class="…"`-Attribute mit etwa 150 verschiedenen Utilities.
- 9 Werte in eckigen Klammern (`w-[30px]`, `h-[90vh]`, `max-h-[55vh]`, …).
- Varianten: 9× `hover:`, 2× `active:`, 1× `disabled:`, 1× `sm:grid-cols-10`.
- Etwa 15 Klassen mit `!`-Präfix (`!bg-*`, `!text-*`), die Angular-Material-Styles überschreiben.
- Kein `@apply`, `@theme` oder `@reference` in SCSS-Dateien.

---

## Anforderungen

### 1. Design-Tokens und Basis-Styles anlegen

- Verwendete Tailwind-Farben (gray, blue, green, yellow, red, lime, pink) und Abstandswerte als Tokens anlegen, z. B. in `src/styles/_tokens.scss` (SCSS-Variablen oder CSS Custom Properties).
- In `src/styles.scss` ein kleines Reset ergänzen, das die für die App relevanten Teile des Tailwind-Preflight ersetzt: `box-sizing`, Margins an Überschriften, Absätzen und Listen, `img { display: block }`, Button- und Rahmenstile.
- Die Overlay-Regel `.cdk-overlay-backdrop` (Blur) aus `src/tailwind.css` nach `src/styles.scss` verschieben.
- Optional: wenige Mixins für wiederkehrende Muster (z. B. `@mixin flex-col($gap)`), keine neue Utility-Bibliothek.

**Erwartetes Verhalten:** Komponenten können Tokens und Mixins per `@use` einbinden; Hex-Werte stehen nur an einer Stelle.

---

### 2. Templates der HTML-Komponenten umstellen

Utility-Klassen durch semantische Klassen in der jeweiligen Komponenten-`.scss` ersetzen:

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

### 3. Inline-Template-Komponenten umstellen

- `app.ts` (11 Attribute), `character-tracker/.../add-character-dialog/add-character-dialog.ts` (30), `character-tracker/.../character-card/character-card.ts` (24), `character-tracker/.../damage-taken-dialog/damage-taken-dialog.ts` (5), `dungeon-tracker/.../dungeon-token/dungeon-token.ts` (3).
- Styles über `styleUrl` in eine eigene `.scss`-Datei legen, nicht als Inline-`styles`. `add-character-dialog.ts` hat bereits 145 Zeilen und würde sonst die Grenze von 150 Zeilen überschreiten. Wo es sinnvoll ist, das Template ebenfalls in eine `.html`-Datei auslagern.

**Erwartetes Verhalten:** Die Dialoge und Karten sehen aus wie vorher; jede Datei hat höchstens 150 Zeilen.

---

### 4. Zur Laufzeit berechnete Klassen in `DamageTakenDialog`

- **Problem:** `getButtonColorClass()` gibt Tailwind-Strings zurück (`'!bg-green-100 !text-green-800 hover:!bg-green-200'`, …). Darunter ist auch `!bg-white-500`, eine Klasse, die es in Tailwind nicht gibt und die heute keine Wirkung hat.
- Auf semantische Modifier-Klassen umstellen (z. B. `damage-btn--light`, `--moderate`, `--noticeable`, …), die in der Komponenten-SCSS definiert werden. Die Hover-Zustände und Übergänge (`hover:scale-105`, `active:scale-95`) in SCSS übernehmen.
- Den Spec auf die neuen Klassen bzw. das sichtbare Verhalten anpassen.

**Erwartetes Verhalten:** Die Schadens-Buttons behalten ihre farbliche Abstufung nach Schadenshöhe.

---

### 5. Material-Overrides ohne `!`-Präfix

- Die bisherigen `!bg-*` und `!text-*` Overrides an Material-Komponenten durch ausreichend spezifische Selektoren oder Material-Tokens/Mixins ersetzen (über `src/material-theme.scss` oder `mat.*-overrides`). `!important` nur, wenn es keine andere Lösung gibt, und dann mit Kommentar.

**Erwartetes Verhalten:** Die Material-Buttons und -Texte behalten ihre bisherigen Farben.

---

### 6. Tailwind-Infrastruktur entfernen

- `tailwindcss`, `@tailwindcss/postcss` und `postcss` aus `package.json` entfernen (`npm uninstall`).
- `.postcssrc.json` und `src/tailwind.css` löschen.
- In `angular.json` unter `styles` den Eintrag `src/tailwind.css` durch `src/styles.scss` ersetzen.

**Erwartetes Verhalten:** Build und Dev-Server laufen ohne PostCSS und Tailwind.

---

### 7. Tests und Dokumentation anpassen

- `card-manager-page.spec.ts:58` fragt `.text-red-400` ab. Stattdessen eine semantische Klasse oder `data-testid` verwenden.
- Den Projekttitel in `.claude/CLAUDE.md` von "Tailwind v4" auf "SCSS" ändern.
- In `.github/instructions/angular-templates.instructions.md` die Erwähnung von Tailwind und den Eintrag `src/tailwind.css` entfernen und durch SCSS-Konventionen ersetzen (semantische Klassen, Tokens aus `_tokens.scss`).
- In `docs/notes-project/CI-CD/README.md` (ca. Zeile 300) den Abschnitt zu den Styles anpassen.
- `docs/notes-human/Tailwind/` bleibt unverändert (persönliche Notizen).

---

### 8. Optischer Abgleich

- Vor dem Umbau mit einer Playwright-Probe (`e2e/probe/`) Screenshots aller Routen und Dialoge erstellen: Dungeon-Tracker, Character-Tracker inkl. Add- und Damage-Dialog, Card-Manager, Game-Session, Time-Tracker und Confirmation-Dialog.
- Nach dem Umbau dieselbe Probe erneut ausführen und die Screenshots vergleichen. Abweichungen beheben oder im Abschlussbericht begründen.

---

## Akzeptanzkriterien

- [ ] Keine Tailwind-Abhängigkeiten in `package.json`; `.postcssrc.json` und `src/tailwind.css` sind entfernt
- [ ] `grep` nach typischen Utilities (`flex `, `bg-`, `text-gray`, `p-4`, `hover:`, `!bg-`) in `src/**/*.html` und den Inline-Templates findet keine Tailwind-Treffer mehr
- [ ] Farben und Abstände stammen aus den zentralen Tokens; keine verstreuten Hex-Werte in Komponenten-SCSS
- [ ] `DamageTakenDialog` verwendet semantische Modifier-Klassen; der Spec deckt die Stufen ab
- [ ] Alle Dateien ≤ 150 Zeilen
- [ ] Die Screenshots vor und nach dem Umbau stimmen überein, oder die Abweichungen sind begründet
- [ ] Alle Vitest-Tests grün (`npm run test -- --watch=false --coverage`, Schwellen eingehalten), Lint und Build fehlerfrei
