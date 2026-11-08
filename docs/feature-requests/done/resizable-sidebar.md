# Feature Request: Seitenleiste in der Breite ziehen

**Datum:** 2026-11-08  
**Priorität:** Mittel  
**Status:** done (2026-11-08 21:12)  
**Bezug:** `src/app/shared/components/collapsible-sidebar/collapsible-sidebar.ts`,
`src/app/shared/services/collapsible-sidebar-state.service.ts`, `src/styles/components/sidebar.css`,
`src/app/core/session-state/tool-state-keys.ts`, `docs/feature-requests/done/collapsible-sidebar.md`

---

## Problem

- Die Seitenleiste (`.general-sidebar`) ist fest `--space-64` (16rem = 256px) breit.
- Je nach Inhalt ist das zu schmal (z. B. lange Namen, Deck-Listen) oder zu breit (Spielbrett
  braucht Platz). Bisher kann man die Leiste nur ganz ein- oder ausklappen.

---

## Ziel

- Wie beim Trenner im Windows Explorer zwischen Baumansicht und Ordnerinhalt lässt sich die
  ausgeklappte Leiste mit der Maus oder dem Finger stufenlos breiter oder schmaler ziehen.
- Ziehgriff ist der **bestehende** Streifen mit `‹` am rechten Rand. Es kommt kein neues Element dazu.
- Gilt für alle Features mit `app-collapsible-sidebar`: Card Manager, Dungeon Builder, Dungeon Tracker
  und Time Tracker. Die Game Session hat keine Seitenleiste und bleibt unverändert.

```
┌──────────────┬─┬────────────┐        ┌───────────────────┬─┬───────┐
│ Seitenleiste │‹│  Inhalt    │  ──►   │ Seitenleiste      │‹│Inhalt │
│              │↔│            │ ziehen │                   │↔│       │
└──────────────┴─┴────────────┘        └───────────────────┴─┴───────┘
             Griff (Klick = einklappen, Ziehen = Breite)
```

---

## Anforderungen

### 1. Ziehen am bestehenden Griff ✅ done (2026-11-08 21:12)

- Der Streifen `.collapsible-sidebar__toggle` ist im ausgeklappten Zustand zugleich Ziehgriff.
- Bedienung über Pointer-Events (`pointerdown`/`pointermove`/`pointerup`, Pointer-Capture), damit
  Maus **und Touch** funktionieren. Auf dem Griff `touch-action: none`.
- **Bewegungsschwelle:** Bewegt sich der Zeiger zwischen Drücken und Loslassen weniger als 4px
  waagerecht, zählt das als Klick und klappt wie bisher ein. Ab 4px wird gezogen. Das Loslassen nach
  einem Ziehen klappt **nicht** ein.
- Die Breite folgt dem Zeiger live.
- Während des Ziehens wird kein Text markiert (`user-select: none` auf dem Dokument). Der Zeiger
  ist auf der ganzen Seite `col-resize`, auch wenn er den Griff verlässt.
- Beim Überfahren des Griffs (ausgeklappt) zeigt der Zeiger `col-resize`.
- Enter/Leertaste auf dem fokussierten Griff klappt weiterhin ein und aus. Eine Tastatursteuerung
  der Breite gibt es nicht (bewusst nicht gewünscht).

### 2. Grenzen ✅ done (2026-11-08 21:12)

- Mindestbreite: **200px**. Unter 200px bleibt die Leiste bei 200px stehen; sie klappt dabei
  **nicht** automatisch ein.
- Höchstbreite: **50 % der Fensterbreite**.
- Ist 50 % der Fensterbreite kleiner als 200px (schmale Handys), gilt das Minimum: Höchstbreite =
  `max(200px, 50 % Fensterbreite)`. Die Leiste ist dann praktisch nicht verstellbar. Wer mehr Platz
  braucht, klappt sie ein.
- Wird das Fenster kleiner, wird eine zu große Breite in der **Anzeige** auf die Höchstbreite
  gekürzt. Die gespeicherte Breite bleibt unverändert und gilt wieder, sobald das Fenster groß genug ist.

### 3. Speichern je Feature ✅ done (2026-11-08 21:12)

- Die gezogene Breite wird je `stateId` im localStorage gespeichert. Neuer Key in
  `TOOL_STATE_KEYS`, z. B. `sidebarWidths: 'sidebar_widths'`. Werkzeug-Zustand außerhalb der
  Spielesession, wie `collapsed_sidebars`.
- Gespeichert wird erst beim Loslassen, nicht bei jedem `pointermove`.
- Ohne gespeicherten Wert (oder bei ungültigem Wert) gilt die Standardbreite `--space-64` (256px).
- Ein gespeicherter Wert unter 200px wird beim Lesen auf 200px angehoben.
- Ein Codec für `Record<string, number>` wird neben den bestehenden Codecs in
  `core/session-state/` ergänzt (ungültige Einträge werden verworfen).

### 4. Zusammenspiel mit Ein-/Ausklappen ✅ done (2026-11-08 21:12)

- Einklappen setzt die Breite nicht zurück. Beim Ausklappen erscheint die Leiste in der zuletzt
  gezogenen Breite.
- Eingeklappt lässt sich nicht ziehen: Der Zeiger bleibt normal, ein Klick klappt nur aus.
- Eine Funktion zum Zurücksetzen gibt es nicht (auch kein Doppelklick).

### 5. Umsetzung / Struktur ✅ done (2026-11-08 21:12)

- Die Breite wird über eine Inline-Breite bzw. eine CSS-Variable an der `aside` gesetzt. Der
  Standardwert in `sidebar.css` (`width: var(--space-64)`) bleibt als Fallback erhalten.
- Die Zieh-Logik kommt in eine eigene, testbare Einheit (z. B. Direktive unter `shared/directives/`
  oder reine Hilfsfunktionen für Schwelle und Begrenzung), damit `collapsible-sidebar.ts` unter
  150 Zeilen bleibt.
- Die Breiten-Verwaltung liegt entweder im `CollapsibleSidebarStateService` oder in einem eigenen
  Service (`ng g s`), falls der bestehende sonst seine einzige Verantwortung verliert.
- Feature-Seiten ändern sich nicht; alles passiert zentral in `shared/`.

---

## Akzeptanzkriterien

- [x] In allen vier Features lässt sich die ausgeklappte Leiste am Griff mit der Maus breiter und
      schmaler ziehen; die Breite folgt live.
- [x] Touch-Ziehen funktioniert (Pointer-Events, `touch-action: none`).
- [x] Ein Klick ohne Bewegung (< 4px) klappt ein; ein Ziehen klappt nicht ein.
- [x] Die Breite bleibt zwischen 200px und `max(200px, 50 % Fensterbreite)`.
- [x] Nach dem Neuladen hat jede Leiste ihre eigene zuletzt gezogene Breite; andere Features bleiben
      unberührt.
- [x] Nach Ein- und Ausklappen ist die Breite unverändert.
- [x] Eingeklappt ist kein Ziehen möglich; der Zeiger zeigt kein `col-resize`.
- [x] Beim Verkleinern des Fensters wird die Anzeige gekürzt, der gespeicherte Wert bleibt.
- [x] Während des Ziehens wird kein Text markiert.
- [x] Specs: Schwelle Klick/Ziehen, Begrenzung (inkl. schmales Fenster), Persistenz je `stateId`,
      Codec mit ungültigen Werten, eingeklappt kein Ziehen. Pointer-Events werden im Spec per
      `dispatchEvent` ausgelöst. Zusätzlich eine Playwright-Probe für echtes Ziehen.
