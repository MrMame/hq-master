# Refactoring Request: Ungenutzten Token `--color-card-manager-menu` entfernen

**Datum:** 2026-10-21  
**Priorität:** Niedrig  
**Status:** done (2026-10-24 20:17)  
**Bezug:** Fund aus `docs/feature-requests/done/character-tracker-removal.md` #5; `.claude/rules/architecture.md` → „Komponenten“ (Farben nur über Tokens aus `src/styles/tokens.css`)

---

## Problem

`src/styles/tokens.css` definiert `--color-card-manager-menu: orange;`, aber keine Datei unter `src/`
referenziert den Token per `var(--color-card-manager-menu)`. Er war die Hintergrundfarbe des früheren
Menü-Containers in `card-manager-page.css`. Diesen Container hat
`880510c` (card-zone-layout, 2026-10-18) durch die Seitenleiste ersetzt; der Token blieb stehen.

Seit `character-tracker-removal` #5 enthält `tokens.css` sonst nur noch genutzte Tokens. Der eine
verwaiste Eintrag erweckt den Eindruck, der Card Manager habe noch ein orangefarbenes Menü.

Kein fachliches Verhalten ändert sich.

---

## Anforderungen

### 1. Token entfernen ✅ done (2026-10-24 20:17)

- Die Zeile `--color-card-manager-menu: orange;` aus `src/styles/tokens.css` löschen.
- Vorher per `Grep` über `src/` (`.css`, `.html`, `.ts`) bestätigen, dass es keine Referenz gibt.

**Erwartetes Verhalten:** Der Card Manager und alle anderen Seiten sehen aus wie vorher.

---

## Hinweise

- **Wiederholung vermeiden (optional, eigener Request):** Ungenutzte Tokens fallen bisher nur bei
  manueller Suche auf. Eine kleine Prüfung, etwa eine Vitest-Spec, die `tokens.css` gegen alle
  `var(--…)`-Referenzen unter `src/` abgleicht, würde neue Fälle sofort melden. Das gehört nicht zu
  diesem Request.

---

## Akzeptanzkriterien

- [x] `grep -r "card-manager-menu" src/` findet keinen Treffer
- [x] Kein Card-Manager-Token in `tokens.css` ist unreferenziert (angepasst 2026-10-24: Die ebenfalls ungenutzten `--color-gray-50` und `--color-gray-100` behandelt der eigene Request `docs/refactoring-requests/done/unused-gray-tokens.md`)
- [x] `npm run lint`, `npm run test -- --watch=false`, `npm run build` und `npm run e2e` laufen grün
