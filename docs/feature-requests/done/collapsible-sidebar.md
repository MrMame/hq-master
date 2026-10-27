# Feature Request: Seitenleiste ein- und ausklappen

**Datum:** 2026-10-27  
**Priorität:** Mittel  
**Status:** done (2026-10-27 17:23)  
**Bezug:** `REQUIREMENTS.md` (Dungeon Tracker), `.claude/rules/architecture.md` → „Komponenten“,
`src/styles/components/sidebar.css`

---

## Problem

- Die Seitenleiste (`.general-sidebar`) ist fest `--space-64` (16rem) breit. Auf Handy und Tablet
  bleibt für das Spielbrett im Dungeon Tracker wenig Platz.
- Der DM braucht die Leiste nur gelegentlich (Charakter anlegen, Bild laden, Raster einstellen).
  Meist schaut er aufs Brett.

---

## Ziel

- Ein kleiner Schalter am rechten Rand der Seitenleiste klappt sie ein und aus.
- Eingeklappt bleibt nur ein schmaler Streifen mit dem Schalter. Das Spielbrett bekommt die frei
  gewordene Breite.
- Der Zustand ist reiner UI-Zustand und wird **nicht** gespeichert: Die Leiste startet bei jedem
  Aufruf ausgeklappt.
- Die Lösung ist gemeinsam (`shared/`), damit jede Seite mit `.general-sidebar` sie nutzen kann.

```
Ausgeklappt:                         Eingeklappt:
┌──────────────┬─┬────────────┐      ┌─┬──────────────────────────┐
│ Dungeon      │‹│  Spielbrett│      │›│        Spielbrett        │
│ Tracker      │ │            │      │ │                          │
│ Charaktere   │ │            │      │ │                          │
│ ...          │ │            │      │ │                          │
└──────────────┴─┴────────────┘      └─┴──────────────────────────┘
              Griff                  Griff
```

---

## Anforderungen

### 1. Shared-Komponente `CollapsibleSidebar` ✅ done (2026-10-27 17:23)

- Neue Komponente `shared/components/collapsible-sidebar/collapsible-sidebar.ts`
  (`app-collapsible-sidebar`, Klasse `CollapsibleSidebar`), erzeugt per Angular CLI.
- Sie rendert `<aside class="general-sidebar">` mit dem projizierten Inhalt (`<ng-content />`) und
  rechts daneben den Schalter (Griff) als eigenen schmalen Streifen über die volle Höhe.
- Eingeklappt wird die `aside` per CSS ausgeblendet, bleibt aber im DOM. Formularzustand und
  Markierung in der Legende gehen beim Umschalten nicht verloren.
- Der Schalter ist ein `<button type="button">` mit `aria-expanded` und `aria-controls` (auf die
  `aside`, eindeutige `id` je Instanz) sowie einem `aria-label` „Seitenleiste einklappen“ bzw.
  „Seitenleiste ausklappen“. Er zeigt `‹` (ausgeklappt) bzw. `›` (eingeklappt).
- Das Touch-Ziel ist `--space-8` breit, damit es auf dem Tablet gut trifft.
- Styling nur über Tokens aus `tokens.css`. Der Griff hat die Hintergrundfarbe der Seitenleiste
  (`--color-general-sidebar`) und eine Trennlinie (`--color-gray-600`); Hover in `--color-yellow-400`.

### 2. Zustand nicht speichern ✅ done (2026-10-27 17:23)

- Geändert nach Rückfrage (2026-10-27): Der Zustand wird nicht im Storage gespeichert. Er liegt als
  privates `signal()` in der Komponente und startet bei jedem Aufruf ausgeklappt.

### 3. Dungeon Tracker nutzt die Komponente ✅ done (2026-10-27 17:23)

- `DungeonTrackerPage` ersetzt `<aside class="general-sidebar">` durch `<app-collapsible-sidebar>`.
  Inhalt und Reihenfolge der Abschnitte bleiben gleich.
- Das Spielbrett nimmt nach dem Einklappen sofort die frei gewordene Breite ein.

### 4. Card Manager nutzt die Komponente ✅ done (2026-10-27 17:23)

- `CardManagerPage` ersetzt ihre `aside` ebenso.

### 5. Doku ✅ done (2026-10-27 17:23)

- `REQUIREMENTS.md` (Dungeon Tracker) und `.claude/rules/architecture.md` (`shared/components`)
  ergänzt.

---

## Akzeptanzkriterien

- [x] Klick auf den Griff klappt die Seitenleiste ein; erneuter Klick klappt sie wieder aus.
- [x] Eingeklappt ist nur der Griff sichtbar, das Spielbrett wird breiter.
- [x] Nach einem Reload startet die Leiste ausgeklappt; nichts wird gespeichert.
- [x] `aria-expanded` und `aria-label` spiegeln den Zustand.
- [x] Specs für `CollapsibleSidebar` (Startzustand, Umschalten per Klick, aria, eindeutige `id`,
      keine Speicherung) und für die Einbindung im Dungeon Tracker.
- [x] Playwright-Probe: Auf Tablet- und Handybreite wird das Brett nach dem Einklappen breiter;
      im Card Manager der Kartenbereich.
