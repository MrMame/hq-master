# Refactoring Request: Gemeinsame Sidebar-Styles

**Datum:** 2026-10-18  
**Priorität:** Mittel  
**Status:** done (2026-10-18 19:40)  
**Bezug:** `src/styles.css`, `src/styles/tokens.css`, `dungeon-tracker-page.css` (Sidebar-Regeln), `card-manager-page.css` (`.cardmanager-sidebar`), Branch `_dev_card-manager-style-rework`

---

## Problem

Die Sidebar-Styles sind pro Feature dupliziert:

- `dungeon-tracker-page.css` enthält einen vollständigen Satz Sidebar-Regeln (`.dungeon-sidebar`, `__title`, `__caption`, `__heading`, `__heading--spaced`, `__divider`).
- `card-manager-page.css` baut mit `.cardmanager-sidebar` eine eigene, abweichende Sidebar.

Weitere Features mit Sidebar würden die Regeln erneut kopieren. Weil Angular Komponenten-CSS kapselt, kann ein Feature die Klassen eines anderen nicht mitbenutzen.

---

## Anforderungen

### 1. Globale Sidebar-Regeldatei anlegen ✅ done (2026-10-18 19:25)

- Neue Datei `src/styles/components/sidebar.css` mit den Regeln aus `dungeon-tracker-page.css` (Zeilen 14–54), umbenannt nach BEM:

  | alt                                 | neu                                 |
  | ----------------------------------- | ----------------------------------- |
  | `.dungeon-sidebar`                  | `.general-sidebar`                  |
  | `.dungeon-sidebar__title`           | `.general-sidebar__title`           |
  | `.dungeon-sidebar__caption`         | `.general-sidebar__caption`         |
  | `.dungeon-sidebar__heading`         | `.general-sidebar__heading`         |
  | `.dungeon-sidebar__heading--spaced` | `.general-sidebar__heading--spaced` |
  | `.dungeon-sidebar__divider`         | `.general-sidebar__divider`         |

- Hintergrund über den semantischen Token `--color-general-sidebar` statt `--color-gray-800`.
- Zusätzlich `align-self: stretch`, damit die Sidebar unabhängig vom `align-items` des Eltern-Containers die volle Höhe einnimmt (der Card-Manager-Container nutzt `align-items: flex-start`).
- Kurzer Kopfkommentar: Zweck der Datei und Hinweis, dass Features einzelne Werte im eigenen Komponenten-CSS überschreiben.

**Erwartetes Verhalten:** Die Klassen stehen in jeder Komponente zur Verfügung, ohne Import im Feature.

---

### 2. Einbindung über `src/styles.css` ✅ done (2026-10-18 19:25)

- Import am Dateianfang von `src/styles.css` (vor `@layer base`):

  ```css
  @import './styles/components/sidebar.css' layer(components);
  ```

- **Nicht** in `tokens.css` einbinden: Diese Datei enthält laut Kopfkommentar nur Design-Tokens.
- Die Layer-Reihenfolge festlegen, z. B. `@layer base, components;`. Ungelayertes Komponenten-CSS und Material-Styles haben damit weiterhin Vorrang, sodass Features ohne `!important` überschreiben können.

**Erwartetes Verhalten:** `sidebar.css` wird mit den globalen Styles ausgeliefert; `angular.json` bleibt unverändert.

---

### 3. Token `--color-general-sidebar` festlegen ✅ done (2026-10-18 19:25)

- In `tokens.css` steht derzeit der Arbeitswert `purple` (Branch `_dev_card-manager-style-rework`).
- Den Wert vor der Umstellung von #4 auf die bisherige Dungeon-Tracker-Farbe setzen: `--color-general-sidebar: var(--color-gray-800);`

**Erwartetes Verhalten:** Die Dungeon-Sidebar behält ihre Farbe; die Card-Manager-Sidebar ist nicht mehr lila.

---

### 4. Dungeon-Tracker umstellen ✅ done (2026-10-18 19:25)

- In `dungeon-tracker-page.html` die sechs Klassenverwendungen auf `general-sidebar*` umstellen.
- Die Sidebar-Regeln aus `dungeon-tracker-page.css` entfernen.

**Erwartetes Verhalten:** Die Dungeon-Tracker-Seite sieht unverändert aus.

---

### 5. Card-Manager umstellen ✅ done (2026-10-18 19:25)

- `.cardmanager-sidebar` in `card-manager-page.html` durch `general-sidebar` ersetzen.
- Die Regel `.cardmanager-sidebar` vollständig aus `card-manager-page.css` entfernen. Die bisherigen Abweichungen (`width: 20%`, `align-items: center`, `justify-content: flex-start`, `height: 100%`, kein Padding/Gap) entfallen ersatzlos; es bleibt keine Zusatzregel im Feature-CSS.
- Weitere Sidebar-Inhalte, z. B. eine Überschrift, bei Bedarf mit den `general-sidebar__*`-Klassen auszeichnen.
- Die Selektoren in `card-manager-page-clicks.spec.ts` (`.cardmanager-sidebar button:nth-child(n)`) anpassen, z. B. auf `.general-sidebar button:nth-child(n)`. Die Assertions bleiben unverändert.

**Erwartetes Verhalten:** Die Buttons im Card-Manager funktionieren wie bisher; die Sidebar sieht genauso aus wie die des Dungeon-Trackers (Breite, Padding, Abstände, Farbe).

---

### 6. Prüfung ✅ done (2026-10-18 19:25)

- Specs und `e2e/` nach den alten Klassennamen (`dungeon-sidebar`, `cardmanager-sidebar`) durchsuchen; es dürfen keine Treffer bleiben.
- Playwright-Probe unter `e2e/probe/`: Screenshots beider Seiten vor und nach dem Umbau vergleichen.

---

### 7. Card-Manager-CSS und -Template aufräumen ✅ done (2026-10-18 19:40)

Bei der Planung von #1–#6 entdeckt (2026-10-18), außerhalb von deren Scope:

- `.cardInBank { position: flex; }` in `card-manager-page.css` ist ungültiges CSS und wirkungslos. Gemeintes Verhalten klären (vermutlich `display: flex` oder Zeile entfernen).
- Der Kommentar `/* Menue Container */` in `card-manager-page.css` ist veraltet; der Container existiert nicht mehr.
- In `card-manager-page.html` ist `<p>Deck: …</p>` falsch eingerückt und es gibt mehrere überzählige Leerzeilen (aus dem Style-Rework). ✅ done (bereits erfüllt, 2026-10-18 19:40) — durch Prettier-Formatierung in fe3ffd1

**Erwartetes Verhalten:** Kein ungültiges CSS und keine veralteten Kommentare; Template sauber formatiert. Optik der Bank-Karten unverändert, außer die Klärung ergibt bewusst ein anderes Verhalten.

---

### 8. Sidebar-Button als `.general-sidebar__button` ✅ done (2026-10-18 19:32)

- `.upload-button` aus `dungeon-tracker-page.css` als `.general-sidebar__button` nach `src/styles/components/sidebar.css` verschieben.
- `dungeon-tracker-page.html` auf die neue Klasse umstellen; `.upload-button` entfernen.

**Erwartetes Verhalten:** Der Bild-Upload-Button im Dungeon-Tracker sieht unverändert aus; andere Features können die Klasse für Sidebar-Buttons verwenden.

---

### 9. Card-Manager-Buttons auf `.general-sidebar__button` ✅ done (2026-10-18 19:38)

- Die drei Buttons der Card-Manager-Sidebar (Deck Laden, Nachziehstapel Mischen, Zurücksetzen) erhalten `general-sidebar__button`.
- Den Wrapper-`<div>` entfernen, damit der `gap` der Sidebar zwischen den Buttons greift.
- `<br />` in „Nachziehstapel Mischen“ durch ein Leerzeichen ersetzen: Im Flex-Button würde der Umbruch den Text in zwei nebeneinanderliegende Teile zerlegen.

**Erwartetes Verhalten:** Die Card-Manager-Buttons sehen aus wie der Upload-Button im Dungeon-Tracker (gelb, volle Breite, lesbar) und funktionieren wie bisher.

---

## Akzeptanzkriterien

- [x] `src/styles/components/sidebar.css` existiert, ist ≤ 150 Zeilen und enthält nur `.general-sidebar*`-Regeln
- [x] `src/styles.css` bindet die Datei per `@import … layer(components)` ein; `tokens.css` enthält keinen Import
- [x] `--color-general-sidebar` ist `var(--color-gray-800)` (kein `purple` mehr)
- [x] Keine Treffer mehr für `dungeon-sidebar` und `cardmanager-sidebar` in `src/` und `e2e/`
- [x] Die Dungeon-Tracker-Sidebar sieht vor und nach dem Umbau gleich aus (Probe-Screenshots)
- [x] Die Card-Manager-Sidebar nutzt ausschließlich `general-sidebar` ohne eigene Sidebar-Regeln im Feature-CSS und sieht aus wie die Dungeon-Tracker-Sidebar
- [x] `.upload-button` existiert nicht mehr; der Upload-Button nutzt `.general-sidebar__button` und sieht unverändert aus (Probe-Snapshot)
- [x] Die Card-Manager-Buttons nutzen `.general-sidebar__button` und funktionieren unverändert (Probe)
- [x] `card-manager-page.css` enthält kein ungültiges `position: flex` und keinen veralteten `Menue Container`-Kommentar; `card-manager-page.html` ist sauber formatiert
- [x] Alle Vitest-Tests grün (`npm run test -- --watch=false --coverage`, Schwellen eingehalten), Lint und Build fehlerfrei

---

## Umsetzungsnotizen (2026-10-18 19:25)

- **`align-self: stretch` in `.general-sidebar`:** Der Card-Manager-Container nutzt `align-items: flex-start`; ohne die Regel wäre die Sidebar nur so hoch wie ihr Inhalt. Im Dungeon-Tracker ohne Wirkung (Default `stretch`), per Snapshot belegt.
- **Layer-Reihenfolge:** `@layer base, components;` vor dem `@import` in `src/styles.css`, damit `components` über dem Reset liegt (z. B. Rahmenfarbe des Dividers).
- **Probe `e2e/probe/shared-sidebar-styles.spec.ts`:** Dungeon-Sidebar pixelgleich zum Vorher-Bild; Card-Manager-Buttons funktionieren; berechnete Styles beider Sidebars (Breite, Padding, Gap, Farbe, Ausrichtung) identisch – vor dem Umbau rot, danach grün.
- **Doku:** `.claude/rules/architecture.md` nennt `src/styles/components/` als Ort für feature-übergreifende Bausteine.

## Umsetzungsnotizen #7 (2026-10-18 19:40)

- **`position: flex` entfernt statt in `display: flex` geändert:** Der Wert war ungültig und wurde vom Browser verworfen; Entfernen ändert nichts. `display: flex` hätte das Innenlayout von `app-card-display` verändert.
- **Template:** Bereits durch die Prettier-Formatierung in `fe3ffd1` erfüllt.
- **Probe `e2e/probe/shared-sidebar-styles-7.spec.ts`:** Card-Manager mit zwei Bank-Karten pixelgleich zum Vorher-Bild.
