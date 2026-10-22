# Refactoring Request: Layout des Dungeon Trackers (Sidebar-Reihenfolge, Überschriften, Token-Zentrierung, Button-Text)

**Datum:** 2026-10-22  
**Priorität:** Mittel  
**Status:** done (2026-10-22 17:32)  
**Bezug:** `src/app/features/dungeon-tracker/components/dungeon-tracker-page/dungeon-tracker-page.html`, `src/app/features/dungeon-tracker/components/dungeon-token/dungeon-token.ts`, `src/styles/components/sidebar.css`

---

## Problem

- **Reihenfolge der Sidebar:** Die linke Seitenleiste zeigt zuerst „Spielbrett-Foto laden“, dann „Raster-Einstellungen“ und zuletzt „Charaktere“. Die Charakterliste wird während des Spiels am häufigsten gebraucht und soll deshalb oben stehen.
- **Uneinheitliche Abschnittsüberschriften:** „Spielbrett-Foto laden“ ist ein `<label class="general-sidebar__caption">` (normale Groß-/Kleinschreibung, ohne Bezug zu einem Eingabefeld). „Raster-Einstellungen“ und „Charaktere“ sind `<h3 class="general-sidebar__heading">` (per CSS `text-transform: uppercase`). Dadurch sehen die drei Überschriften verschieden aus, und die Abstände unter den Überschriften sind ebenfalls verschieden (`--spaced` nur bei „Charaktere“, `gap` bei den Raster-Einstellungen).
- **Token nicht zentriert:** `DungeonToken` positioniert das Token an der oberen linken Ecke des Rasterfelds (`offset + col * cellSize + 2`). Das Porträt (`--space-10`, 40 px) sitzt deshalb oben links im Feld statt in der Mitte.

---

## Anforderungen

### 1. Sidebar-Reihenfolge: Charaktere → Spielbrett-Foto → Raster ✅ done (2026-10-22 17:32)

- Reihenfolge in `dungeon-tracker-page.html` unterhalb des Titels „Dungeon Tracker“:
  1. Charaktere (Überschrift, Button „Neuer Charakter“ (siehe #4), Legenden-Einträge bzw. Leer-Hinweis)
  2. Spielbrett-Foto laden (Upload-Button, Status „✓ Bild geladen“)
  3. Raster-Einstellungen (vier Schieberegler)
- Zwischen zwei Abschnitten steht genau ein `<hr class="general-sidebar__divider" />`. Vor dem ersten und nach dem letzten Abschnitt steht keiner.
- Jeder Abschnitt ist ein eigener Container-Block, damit der Trennstrich eindeutig zwischen zwei Abschnitten liegt und kein Inhalt eines Abschnitts über oder unter dem falschen Strich landet.
- Funktion und Bindungen bleiben unverändert (nur verschoben).

**Erwartetes Verhalten:** Die Charakterliste steht direkt unter dem Titel. Die drei Abschnitte sind durch je einen Trennstrich klar voneinander abgegrenzt.

---

### 2. Einheitliche Abschnittsüberschriften ✅ done (2026-10-22 17:32)

- Alle drei Abschnittsüberschriften verwenden dasselbe Element und dieselben Klassen: `<h3 class="general-sidebar__heading general-sidebar__heading--spaced">`.
- „Spielbrett-Foto laden“ wird vom `<label class="general-sidebar__caption">` auf diese Überschrift umgestellt.
- Der Abstand zwischen Überschrift und Inhalt ist in allen drei Abschnitten gleich. Die Raster-Einstellungen bekommen den Abstand nicht doppelt (aus `gap` von `.grid-settings` und aus `--spaced`): Die Überschrift steht dafür z. B. außerhalb des `.grid-settings`-Containers.
- Die Schreibweise der Texte bleibt („Charaktere (n)“, „Spielbrett-Foto laden“, „Raster-Einstellungen“). Die einheitliche Darstellung kommt aus `.general-sidebar__heading` (Großbuchstaben, Schriftgröße, Farbe, Laufweite).
- `.general-sidebar__caption` bleibt in `sidebar.css` bestehen, weil der Card-Manager sie weiter verwendet („Deck Aktionen“).

**Erwartetes Verhalten:** Die drei Überschriften sehen gleich aus: dieselbe Schriftgröße, Farbe, Großschreibung und derselbe Abstand nach unten.

---

### 3. Charakter-Tokens mittig im Rasterfeld ✅ done (2026-10-22 17:32)

- `tokenLeft` / `tokenTop` in `dungeon-token.ts` richten die **Mitte des Porträts** auf die Mitte des Rasterfelds aus:
  - `left = offsetX + col * cellSize + (cellSize - portraitSize) / 2`
  - `top = offsetY + row * cellSize + (cellSize - portraitSize) / 2`
- Maßgeblich ist das Porträt, nicht der ganze Token-Container. Die Werteleiste und die Schadens-Buttons (nur bei Auswahl sichtbar) hängen unter dem Porträt und dürfen über das Feld hinausragen. Ohne diese Regel würde das Porträt beim Markieren springen.
- Die Porträtgröße (40 px = `--space-10`) wird an einer Stelle als Konstante festgelegt und nicht als Zahl mehrfach im Code wiederholt. Der feste Versatz `+ 2` entfällt.
- `onDragEnd` rechnet das Zielfeld konsistent zur neuen Position: über den Mittelpunkt des Porträts mit `Math.floor`, z. B. `col = floor((newPixelX + portraitSize / 2 - offsetX) / cellSize)`, begrenzt auf `>= 0`. Ein Drag ohne Bewegung lässt das Token im selben Feld. Das Token landet in dem Feld, über dem sich die Porträtmitte beim Loslassen befindet.
- Die Ausrichtung gilt auch bei Zellgrößen unter 40 px (Regler-Minimum 20 px): Das Porträt ragt dann gleichmäßig über alle Seiten des Felds hinaus.

**Erwartetes Verhalten:** Bei jeder Zellgröße und jedem Raster-Versatz liegt die Porträtmitte jedes Tokens genau in der Mitte seines Rasterfelds, auch nach dem Verschieben.

---

### 4. Button „Character Neu“ auf Deutsch: „Neuer Charakter“ ✅ done (2026-10-22 17:32)

- Der Button in der Charakter-Sektion heißt künftig „Neuer Charakter“. Das passt zur Überschrift „Charaktere“ und zum Dialogtitel, die schon „Charakter“ schreiben.
- Text anpassen in:
  - `dungeon-tracker-page.html` (Button-Text)
  - `dungeon-tracker-page-interactions.spec.ts` (Testname und `clickButton(host, …)`)
  - `e2e/support/create-character.ts` und `e2e/character-editor.spec.ts` (Locator `getByRole('button', { name: … })`, Kommentare, Testname)
  - `REQUIREMENTS.md` (Dungeon Tracker), `.claude/rules/architecture.md` (Beispiel `createCharacter()`)
  - Offener Feature Request `docs/feature-requests/character-editor-random-character.md` (Bezug und E2E-Ablauf)
- Abgeschlossene Requests unter `done/` und `ai-implementations-log.md` bleiben unverändert (Historie).

**Erwartetes Verhalten:** Der Button heißt „Neuer Charakter“ und funktioniert wie bisher (öffnet den Charakter-Editor im Neu-Modus).

---

## Akzeptanzkriterien

- [x] Sidebar-Reihenfolge: Titel → Charaktere → Spielbrett-Foto laden → Raster-Einstellungen, mit genau einem Trennstrich zwischen je zwei Abschnitten (Spec prüft die Reihenfolge der Überschriften und die Anzahl der `hr`)
- [x] Alle drei Abschnittsüberschriften sind `h3.general-sidebar__heading.general-sidebar__heading--spaced`. Im Dungeon Tracker wird `general-sidebar__caption` nicht mehr verwendet.
- [x] `dungeon-token.spec.ts`: Die erwarteten `left`/`top`-Werte entsprechen der zentrierten Position. Neue Fälle decken eine Zellgröße unter 40 px und einen Drag ohne Bewegung (gleiches Feld) ab. Der bestehende Drag-Test ergibt das Feld unter der Porträtmitte.
- [x] Der Button heißt „Neuer Charakter“. Außerhalb von `done/` und `ai-implementations-log.md` kommt „Character Neu“ nicht mehr vor. Unit-Spec und E2E-Smoke-Tests (`npm run e2e`) sind grün.
- [x] Playwright-Probe (`e2e/probe/`) bestätigt, dass die Porträtmitte eines Tokens in der Feldmitte liegt (Toleranz ±1 px)
- [x] Alle Vitest-Tests grün (`npm run test -- --watch=false --coverage`), Lint und Build fehlerfrei
