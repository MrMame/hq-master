# Feature Request: „Neuer Charakter“ in der Schnellzugriffsleiste

**Datum:** 2026-10-27  
**Priorität:** Mittel  
**Status:** done (2026-10-27 17:53)  
**Bezug:** `REQUIREMENTS.md` (Dungeon Tracker), `docs/feature-requests/done/board-zoom-control.md`,
`docs/feature-requests/done/collapsible-sidebar.md`

---

## Problem

- Der Button „Neuer Charakter“ liegt in der Seitenleiste. Ist sie eingeklappt, muss der DM sie erst
  ausklappen, um einen Charakter anzulegen.
- Seit `board-zoom-control` gibt es links neben dem Spielbrett einen schmalen Streifen mit dem
  Zoom-Regler. Er eignet sich als Schnellzugriffsleiste für häufige Befehle.

---

## Ziel

- Der Button „Neuer Charakter“ sitzt oben in der Schnellzugriffsleiste, über dem Zoom-Regler.
- Er zeigt nur ein „+“. Sein zugänglicher Name und Tooltip lauten „Neuer Charakter“.
- In der Seitenleiste entfällt der Button. Der Abschnitt „Charaktere (n)“ zeigt nur noch die Legende.

```
┌───┬──────┬───────────────────────┐
│ › │ [ + ]│ [Ork]                 │  ← Neuer Charakter
│   │100 % │                       │
│   │  │   │                       │
│   │  ●   │      Spielbrett       │  ← Zoom
│   │  │   │                       │
└───┴──────┴───────────────────────┘
  Leiste Schnellzugriff
```

---

## Anforderungen

### 1. Schnellzugriffsleiste in der Seite ✅ done (2026-10-27 17:53)

- Der Streifen links neben dem Brett wird zur Schnellzugriffsleiste (`.quick-access`, senkrecht,
  Elemente oben, mittig ausgerichtet). Darin liegen von oben nach unten: Button „Neuer Charakter“,
  Zoom-Regler.
- Spätere Schnellbefehle kommen in diese Leiste.

### 2. Button „Neuer Charakter“ mit „+“ ✅ done (2026-10-27 17:53)

- `<button type="button">` mit dem Inhalt „+“, `aria-label` und `title` „Neuer Charakter“.
- Quadratisch (`--space-10`), „+“ in `--text-xl`, gelb wie die Buttons der Seitenleiste
  (`--color-yellow-500`, Hover `--color-yellow-400`), schwarzes „+“. Nur Tokens aus `tokens.css`.
- Ein Klick öffnet wie bisher den Charakter-Editor im Modus „Neuer Charakter“
  (`CharacterEditorService.openCreate()`).

### 3. Button aus der Seitenleiste entfernen ✅ done (2026-10-27 17:53)

- Im Abschnitt „Charaktere (n)“ stehen nur noch Überschrift, Legende bzw. Leerhinweis. Die Klasse
  `.new-character-button` entfällt.

### 4. Tests und Doku ✅ done (2026-10-27 17:53)

- E2E-Helfer `createCharacter()` und `e2e/character-editor.spec.ts` suchen den Button nicht mehr in
  der Seitenleiste.
- `REQUIREMENTS.md` (Dungeon Tracker) anpassen.

---

## Akzeptanzkriterien

- [x] In der Schnellzugriffsleiste liegt oben ein „+“-Button „Neuer Charakter“, darunter der
      Zoom-Regler.
- [x] Der Button öffnet den Charakter-Editor für einen neuen Charakter, auch bei eingeklappter
      Seitenleiste.
- [x] In der Seitenleiste gibt es keinen Button „Neuer Charakter“ mehr.
- [x] Specs für Button (Klick öffnet `openCreate`) und Aufbau der Seitenleiste.
- [x] Playwright-Probe auf Tablet-Breite: Button über dem Zoom-Regler, Anlegen bei eingeklappter
      Leiste.

---

## Umsetzungshinweise

- Der Button liegt direkt im Template der `DungeonTrackerPage` (keine eigene Komponente für einen
  einzelnen Button).
- Die reinen Aufbau-Prüfungen (vier Raster-Regler, „+“ über dem Zoom-Regler) stehen in
  `dungeon-tracker-page.spec.ts`, damit `dungeon-tracker-page-interactions.spec.ts` unter 150 Zeilen
  bleibt.
