# Feature Request: Time Tracker im Layout von Dungeon Tracker und Dungeon Builder

**Datum:** 2026-11-01  
**Priorität:** Mittel  
**Status:** offen  
**Bezug:** `REQUIREMENTS.md` (§0 Übersicht, §1 Time Tracker), `docs/feature-requests/done/dungeon-round-control.md`,
`docs/feature-requests/done/game-event-log.md`

---

## Problem

- Der Time Tracker sieht anders aus als Dungeon Tracker (DT) und Dungeon Builder (DB). Die Seite ist hell
  und alles steht untereinander: Spielzeit, Zeit-Buttons, Aktive Zustände, Log. Die linke Seitenleiste fehlt.
- Die Buttons sind englisch beschriftet („+1 Second“, „+8 Hours“) und haben je eigene Farben.
- „Neue Runde“ gibt es nur im Runden-Menü des Dungeon Trackers.
- DT und DB haben gleiche Stilregeln doppelt im Code: `.dungeon-page` = `.builder-page`,
  `.board-area` = `.builder-area`. Im Time Tracker stehen `.game-log__title` und
  `.active-conditions__title` als Kopie von `.general-sidebar__heading`.

---

## Ziel

- Der Time Tracker ist aufgebaut wie DT und DB und wird gleich bedient: dunkle Seite, links die
  einklappbare Seitenleiste mit Kopf und Gruppen, rechts der Hauptbereich.
- In der Seitenleiste steht die Gruppe „Zeit vorrücken“ mit „Neue Runde“ und den Zeit-Buttons.
- Im rechten Bereich steht oben groß die aktuelle Spielzeit. Darunter folgen „Aktive Zustände“ und das
  Ereignis-Log.
- Gleiche Stilregeln der drei Features liegen einmal in `src/styles/components/`.

```
┌──────────────────────────┬─┬──────────────────────────────────────────┐
│ Time Tracker         ⊟   │‹│ SPIELZEIT                                │
│ ▾ ZEIT VORRÜCKEN         │ │ 14:03:20 2026-05-01        (groß, gelb)  │
│ [     Neue Runde      ]  │ │ AKTIVE ZUSTÄNDE                          │
│ [+1 s] [+5 s] [+10 s]    │ │ Charakter | Zustand | Schaden | …        │
│ [ +1 h ]  [ +8 h ]       │ │ EREIGNISSE  (Alle)(Zeit)(…)  [Log leeren]│
│                          │ │ 14:03:20  ⏱  +10 s (…)                   │
│                          │ │ …                    (scrollt in sich)   │
└──────────────────────────┴─┴──────────────────────────────────────────┘
```

---

## Anforderungen

### 1. Gemeinsame Stilregeln herausziehen (ohne neues Verhalten)

- Neue globale Datei unter `src/styles/components/` (z. B. `feature-page.css`), eingebunden wie
  `sidebar.css` in die Cascade-Layer `components`:
  - `.feature-page`: Seitenhülle (`display: flex`, `height: 100%`, Hintergrund `gray-900`, Schrift weiß).
    Ersetzt `.dungeon-page` und `.builder-page`.
  - `.feature-page__main`: Hauptbereich neben der Seitenleiste (`display: flex`, `flex: 1`,
    `min-width: 0`). Ersetzt `.board-area` und `.builder-area`.
  - Abschnittsüberschrift für den Hauptbereich mit den Werten von `.general-sidebar__heading` (gray-400,
    `text-xs`, Großbuchstaben, `tracking-wider`). Ersetzt `.game-log__title` und `.active-conditions__title`.
  - Hinweis für leere Listen (gray-500, kleine Schrift). Ersetzt `.legend-empty`, `.game-log__empty`
    und `.active-conditions__empty`. Die Schriftgröße wird dabei einheitlich (Vorschlag: `text-xs` wie in
    der Legende; im Hauptbereich bei Bedarf `text-sm` per Modifier).
- DT und DB stellen auf die gemeinsamen Klassen um. Sie sehen danach unverändert aus.
- Bestehende Kommentare (z. B. „Leiste scrollt nicht mit und verdeckt kein Feld“) wandern mit.

### 2. Seitenleiste im Time Tracker

- `TimeTrackerPage` nutzt `app-collapsible-sidebar` mit demselben Kopf wie DT/DB:
  `.general-sidebar__header` mit Titel „Time Tracker“ und `app-sidebar-section-toggle-all scope="time-tracker"`.
  Der Button steht auch bei nur einer Gruppe dort, damit Bedienung und Kopf gleich sind.
- Eine Gruppe `app-sidebar-section` mit Titel „Zeit vorrücken“ und `sectionId="time-tracker.time"`.
  Der Klappzustand wird wie bei DT/DB im Browser gespeichert. Die Leiste startet bei jedem Aufruf
  ausgeklappt.
- Keine Schnellzugriffsleiste: Der Time Tracker hat keine Spielfläche.

### 3. Buttons der Gruppe „Zeit vorrücken“

- Alle Buttons haben den Stil `.general-sidebar__button` (gelb, schwarze Schrift). Die eigenen Farben
  `.time-button--seconds/--hour/--hours` entfallen.
- Anordnung:
  1. Zeile: „Neue Runde“ über die volle Breite. Ruft `RoundService.startNewRound()` auf: Log-Eintrag
     „Neue Runde“, +10 s, alle Charaktere gelten als „noch nicht bewegt“ (wie im Runden-Menü des DT).
  2. Zeile: „+1 s“, „+5 s“, „+10 s“; die drei teilen sich die Breite.
  3. Zeile: „+1 h“, „+8 h“; die zwei teilen sich die Breite.
- Kurze Beschriftung auf dem Button. `aria-label` und `title` nennen den vollen Text, z. B.
  „1 Sekunde vorrücken“, „5 Sekunden vorrücken“, „1 Stunde vorrücken“, „8 Stunden vorrücken“.
- Die Zeitschritte selbst ändern sich nicht (`GameTimeService.addTime`). Sie setzen den Rundenstand nicht
  zurück.

### 4. Rechter Bereich: Spielzeit, Aktive Zustände, Ereignisse

- Von oben nach unten: Spielzeit, „Aktive Zustände“, „Ereignisse“. Der Bereich hat einen Innenabstand
  (Vorschlag `space-4`, wie die Seitenleiste).
- **Spielzeit:** Die kleine Beschriftung „Spielzeit“ im Stil der Abschnittsüberschrift. Darunter steht die Zeit
  aus `gameTimeAsString()` groß (Vorschlag `text-3xl`, fett, `yellow-400`, `tabular-nums`). Die Anzeige bleibt
  oben stehen und scrollt nicht mit.
- „Aktive Zustände“ und „Ereignisse“ sind nicht einklappbar und bleiben immer sichtbar.
- Das Log füllt die Resthöhe und scrollt in sich, wie heute.

### 5. Dunkles Farbschema für Log und Tabelle

- Die Seite nutzt `.feature-page` (dunkel).
- Filter-Chips wie Umschalter der Schnellzugriffsleiste: inaktiv `gray-700` mit heller Schrift (Hover
  `gray-600`), aktiv `yellow-500` mit schwarzer Schrift.
- „Log leeren“: grau (`gray-700`, Hover `gray-600`), helle Schrift, deaktiviert abgedimmt wie heute.
- Trennlinien der Logzeilen `gray-700` statt `gray-100`, wie die Zeilen der Zustands-Tabelle.
  Zeit- und Datumsspalte bleiben gut lesbar (gray-400 statt gray-500 prüfen).
- Die Bestätigungsrückfrage zu „Log leeren“ bleibt unverändert (globaler Dialog-Stil).

### 6. Tests und Doku

- `time-tracker-page.spec.ts`: Seitenleiste mit Titel und Gruppe, Klick auf „Neue Runde“ (Log-Eintrag,
  +10 s, Rundenstand zurückgesetzt), alle fünf Zeit-Buttons über ihren zugänglichen Namen, Spielzeit-Anzeige
  nach einem Klick. Einklappen der Gruppe über die Überschrift.
- Bestehende Selektoren anpassen: `data-testid="add-seconds-<n>"` und `game-time-label` dürfen bleiben.
  `e2e/routes.spec.ts` (Marker „+1 Hour“) und `e2e/character-conditions.spec.ts` (Button „+1 Hour“) auf die
  neuen Namen umstellen.
- Specs von DT/DB laufen nach Punkt 1 unverändert grün.
- Playwright-Probe unter `e2e/probe/` für das Layout: Sidebar links, Spielzeit oben rechts, Log scrollt in
  sich, Sidebar einklappbar; auch bei Tablet-Breite ohne horizontales Scrollen.
- `REQUIREMENTS.md` §1 ergänzen: Aufbau mit Seitenleiste, Gruppe „Zeit vorrücken“ mit „Neue Runde“,
  Spielzeit groß oben im rechten Bereich.

---

## Akzeptanzkriterien

- [ ] DT und DB sehen nach der Umstellung auf die gemeinsamen Klassen unverändert aus.
- [ ] Der Time Tracker ist dunkel, links steht die einklappbare Seitenleiste mit Titel „Time Tracker“ und
      dem Button „Alle Gruppen ein-/ausklappen“.
- [ ] Die Gruppe „Zeit vorrücken“ klappt über ihre Überschrift auf und zu; der Zustand bleibt nach einem
      Neuladen erhalten.
- [ ] „Neue Runde“ schreibt „Neue Runde“ ins Log, rückt die Zeit um 10 s vor und setzt die bewegten
      Charaktere zurück.
- [ ] +1 s, +5 s, +10 s, +1 h und +8 h rücken die Zeit wie bisher vor; ihre vollen Namen stehen in
      `aria-label`/`title`.
- [ ] Oben im rechten Bereich steht die Spielzeit groß und gelb und aktualisiert sich sofort.
- [ ] „Aktive Zustände“ steht über dem Log; das Log scrollt in sich, die Spielzeit bleibt stehen.
- [ ] Filter-Chips, „Log leeren“ und Trennlinien sind auf dunklem Grund gut lesbar.
- [ ] Dateien bleiben unter 150 Zeilen; die Coverage-Schwellen werden eingehalten.

---

## Annahmen (aus dem Interview vom 2026-11-01)

- Alles läuft in einem Feature Request. Das Herausziehen der Stilregeln ist Punkt 1, nicht ein eigener
  Refactoring Request.
- Die Seitenleiste hat eine Gruppe „Zeit vorrücken“, nicht getrennt in Sekunden/Stunden. Neue
  Zeitschritte (z. B. Minuten) kommen nicht dazu.
- „Neue Runde“ steht zusätzlich zum DT-Runden-Menü im Time Tracker, oben in der Gruppe über die volle
  Breite.
- Keine Schnellzugriffsleiste im Time Tracker.
- Alle Zeit-Buttons gelb im Stil `.general-sidebar__button`; die Beschriftung ist kurz und deutsch
  („+1 s“, „+1 h“).
- „Aktive Zustände“ bleibt eine Tabelle im rechten Bereich über dem Log. Weder sie noch das Log sind
  einklappbar.
- Die Spielzeit steht groß und gelb unter einer kleinen Überschrift „Spielzeit“. Das Format von
  `gameTimeAsString()` bleibt.
- Filter-Chips im Stil der Umschalter der Schnellzugriffsleiste (inaktiv grau, aktiv gelb).

---

## Umsetzungshinweise

- `app-main` ist weiß (`app.css`); `.feature-page` mit `height: 100%` deckt ihn ab, wie heute bei DT/DB.
- Die gemeinsame Überschrift kann `.general-sidebar__heading` mitnutzen. Dafür die Werte in eine neutrale
  Klasse ziehen (z. B. `.section-heading`), die auch die Seitenleiste verwendet. So entsteht keine
  Sidebar-Klasse im Hauptbereich.
- Die Button-Zeilen können als kleines Grid in `time-tracker-page.css` entstehen, z. B.
  `grid-template-columns: repeat(6, 1fr)`: „Neue Runde“ `span 6`, Sekunden je `span 2`, Stunden je `span 3`.
  Die Breite von `.general-sidebar__button` (`width: 100%`) passt dazu.
- Die Spielzeit-Anzeige kann bei Wachstum der Seite eine eigene Komponente werden (`ng g c`), damit
  `time-tracker-page` unter 150 Zeilen bleibt.
