# Refactoring Request: Ungenutzte Tokens `--color-gray-50` und `--color-gray-100` entfernen

**Datum:** 2026-10-24  
**Priorität:** Niedrig  
**Status:** rejected (2026-10-24 21:02) – vom Nutzer verworfen, wird nicht umgesetzt; die Tokens bleiben in `tokens.css`.  
**Bezug:** Fund aus `docs/refactoring-requests/done/unused-card-manager-menu-token.md` #1; `.claude/rules/architecture.md` → „Komponenten“ (Farben nur über Tokens aus `src/styles/tokens.css`)

---

## Problem

`src/styles/tokens.css` definiert `--color-gray-50` und `--color-gray-100`, aber keine Datei unter `src/`
referenziert sie per `var(--…)` (Abgleich aller Tokens gegen `src/` am 2026-10-24). Beide stammen aus der
Übernahme der Tailwind-v4-Palette beim Umstieg auf reines CSS und wurden nie verwendet.

Kein fachliches Verhalten ändert sich.

---

## Anforderungen

### 1. Tokens entfernen

- Die Zeilen `--color-gray-50: …;` und `--color-gray-100: …;` aus `src/styles/tokens.css` löschen.
- Vorher per `Grep` über `src/` (`.css`, `.html`, `.ts`) bestätigen, dass es keine Referenz gibt.

**Erwartetes Verhalten:** Alle Seiten sehen aus wie vorher.

---

## Hinweise

- Eine automatische Prüfung auf ungenutzte Tokens (Vitest-Spec, die `tokens.css` gegen alle
  `var(--…)`-Referenzen abgleicht) wäre ein eigener Request.

---

## Akzeptanzkriterien

- [ ] `grep -rE "gray-(50|100)\b" src/` findet keinen Treffer
- [ ] Jeder Token in `tokens.css` wird mindestens einmal per `var(--…)` referenziert
- [ ] `npm run lint`, `npm run test -- --watch=false`, `npm run build` und `npm run e2e` laufen grün
