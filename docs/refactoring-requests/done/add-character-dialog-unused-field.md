# Refactoring Request: Ungenutztes Feld `damageOptions` aus `AddCharacterDialog` entfernen

**Datum:** 2026-10-18  
**Priorität:** Niedrig  
**Status:** rejected (2026-10-21) — obsolet: `AddCharacterDialog` wurde mit dem Character Tracker entfernt (`docs/feature-requests/done/character-tracker-removal.md` #4).  
**Bezug:** Fund aus `docs/refactoring-requests/done/tailwind-to-css.md`; `.claude/rules/clean-code.md`

---

## Problem

`AddCharacterDialog` enthält das Feld `damageOptions` (Zahlen 1 bis 100,
`add-character-dialog.ts:23`). Weder das Template `add-character-dialog.html` noch ein Spec
verwendet es. Das Feld ist eine Kopie aus `DamageTakenDialog`, wo es das Raster der
Schadens-Buttons erzeugt. Im Add-Dialog erweckt es den falschen Eindruck, dass dort Schadenswerte
ausgewählt werden.

---

## Anforderungen

### 1. Feld entfernen

- `damageOptions` samt Kommentar „Generiert das Array von 1 bis 100“ aus
  `character-tracker/components/add-character-dialog/add-character-dialog.ts` löschen.
- `DamageTakenDialog.damageOptions` bleibt unverändert, weil das Template es verwendet.

**Erwartetes Verhalten:** Der Dialog verhält sich und sieht aus wie vorher.

---

## Akzeptanzkriterien

- [ ] `grep damageOptions src/` findet nur noch `damage-taken-dialog.ts` und `damage-taken-dialog.html`
- [ ] `add-character-dialog.spec.ts` grün, Lint und Build fehlerfrei
