# Feature Request: Ein-/Ausklapp-Zustand der Seitenleiste je Feature merken

**Datum:** 2026-11-07  
**Priorität:** Mittel  
**Status:** done (2026-11-07 18:16)  
**Bezug:** `docs/feature-requests/done/collapsible-sidebar.md` (Punkt 2 „Zustand nicht speichern“),
`src/app/shared/components/collapsible-sidebar/collapsible-sidebar.ts`,
`src/app/core/session-state/tool-state-keys.ts`

---

## Problem

- Die gemeinsame Seitenleiste (`CollapsibleSidebar`) hält ihren Zustand nur als privates `signal()`.
  Sie startet bei jedem Aufruf ausgeklappt.
- Wechselt der DM das Feature (z. B. Dungeon Tracker → Card Manager → zurück), ist die Leiste wieder
  offen, obwohl er sie vorher eingeklappt hatte. Auch nach dem Neuladen ist sie offen.

---

## Ziel

- Jedes Feature merkt sich, ob seine Seitenleiste ein- oder ausgeklappt ist.
- Der Zustand bleibt beim Feature-Wechsel und nach dem Neuladen erhalten.
- Die Features sind unabhängig: Einklappen im Dungeon Tracker ändert nichts am Card Manager.
- Ersetzt die Entscheidung aus `collapsible-sidebar.md`, Punkt 2.

---

## Anforderungen

### 1. Gespeicherter Zustand je Leiste ✅ done (2026-11-07 18:16)

- Neuer Werkzeug-Key `TOOL_STATE_KEYS.collapsedSidebars` = `'collapsed_sidebars'` (außerhalb der
  Spielesession, nicht in der SaveSession, eine neue Session setzt ihn nicht zurück).
- Neuer Service `shared/services/collapsible-sidebar-state.service.ts` (`CollapsibleSidebarStateService`,
  per Angular CLI) mit `persistedState` + `STRING_LIST_CODEC`. Gespeichert werden nur die IDs
  eingeklappter Leisten; unbekannte IDs sind ausgeklappt.
- API: `isCollapsed(sidebarId)`, `toggle(sidebarId)`.

### 2. `CollapsibleSidebar` mit Pflicht-Input `stateId` ✅ done (2026-11-07 18:16)

- Neuer Pflicht-Input `stateId` (z. B. `'dungeon-tracker'`). Die Komponente liest und schreibt den
  Zustand über den Service statt über ein eigenes Signal.
- Verhalten, ARIA-Attribute und Darstellung bleiben unverändert.

### 3. Features vergeben eigene IDs ✅ done (2026-11-07 18:16)

- `dungeon-tracker`, `dungeon-builder`, `card-manager`, `time-tracker` – jeweils in der Page-Vorlage.

### 4. Doku ✅ done (2026-11-07 18:16)

- `REQUIREMENTS.md` und `.claude/rules/architecture.md` anpassen, falls sie „wird nicht gespeichert“
  bzw. „startet ausgeklappt“ nennen.

---

## Akzeptanzkriterien

- [x] Leiste im Dungeon Tracker einklappen → Feature wechseln → zurück: Leiste ist eingeklappt.
- [x] Nach dem Neuladen hat jedes Feature den zuletzt gewählten Zustand.
- [x] Einklappen in einem Feature lässt die Leisten der anderen Features unverändert.
- [x] Ohne gespeicherten Wert startet die Leiste ausgeklappt.
- [x] Specs für Service und Komponente decken Speichern, Laden und Unabhängigkeit der IDs ab.
