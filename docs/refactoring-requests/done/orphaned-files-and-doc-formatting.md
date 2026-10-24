# Refactoring Request: Verwaiste Dialog-Templates entfernen und Doku-Dateien formatieren

**Datum:** 2026-10-18  
**Priorität:** Niedrig  
**Status:** done (2026-10-24 21:04) — #1 rejected (2026-10-21, obsolet), #2 done (2026-10-24 21:04)  
**Bezug:** `docs/refactoring-requests/done/test-strategy-improvements.md` (bei der Umsetzung gefunden), `.claude/rules/testing.md` (Git-Hooks)

---

## Problem

Bei der Umsetzung von `test-strategy-improvements` sind zwei vorbestehende Altlasten aufgefallen, die außerhalb des damaligen Scopes lagen:

| Bereich           | Beobachtung (Stand 2026-10-18)                                                                                                                                                                                                             |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Verwaiste Dateien | `add-character-dialog.html` und `damage-taken-dialog.html` enthalten nur den CLI-Platzhalter („… works!“). Beide Komponenten nutzen ein Inline-`template`, kein `templateUrl` verweist auf die Dateien (seit 5858593 „WIP: Dialog Added“). |
| Formatierung      | 7 Markdown-Dateien sind nicht Prettier-formatiert. Der `pre-commit`-Hook prüft gestagte Dateien, daher schlägt jeder Commit fehl, der eine davon anfasst, bis sie formatiert ist.                                                          |

Kein fachliches Verhalten ändert sich.

---

## Anforderungen

### 1. Verwaiste Dialog-Templates entfernen — rejected (2026-10-21)

> **Obsolet:** `add-character-dialog.html` wurde mit dem Character Tracker gelöscht
> (`docs/feature-requests/done/character-tracker-removal.md` #4). `damage-taken-dialog.html` ist kein
> Platzhalter mehr; `DamageTakenDialog` bindet die Datei per `templateUrl` ein, und sie liegt jetzt unter
> `src/app/shared/components/damage-taken-dialog/`. Die Suche nach weiteren verwaisten `.html`/`.css`-Dateien
> entfällt mit diesem Punkt.

- Löschen (per `git rm`):
  - `src/app/features/character-tracker/components/add-character-dialog/add-character-dialog.html`
  - `src/app/features/character-tracker/components/damage-taken-dialog/damage-taken-dialog.html`
- Vorher per `Grep` bestätigen, dass kein `templateUrl` oder sonstiger Verweis darauf existiert.
- Prüfen, ob es weitere nicht referenzierte `.html`/`.scss`-Dateien unter `src/` gibt; Funde auflisten und nach Rückfrage mit entfernen.

### 2. Doku- und Prompt-Dateien mit Prettier formatieren ✅ done (2026-10-24 21:04)

- Betroffen:
  - `.github/instructions/angular-architecture.instructions.md`
  - ~~`.github/instructions/angular-templates.instructions.md`~~ (bei der Umsetzung am 2026-10-24 bereits formatiert)
  - `.github/prompts/create-feature.prompt.md`
  - `.github/prompts/create-vitest.prompt.md`
  - `.github/prompts/review-angular-change.prompt.md`
  - `.github/prompts/review-code.prompt.md`
  - `.claude/rules/clean-code.md`
- `npx prettier --write` auf diese Dateien; Diff auf reine Formatänderungen prüfen (kein inhaltlicher Unterschied).

---

## Akzeptanzkriterien

- [ ] ~~Die beiden Platzhalter-Templates sind entfernt; Build, Lint und Tests bleiben grün.~~ Entfällt (#1 rejected, 2026-10-21).
- [x] `npx prettier --check .github .claude` meldet keine Datei mehr.
- [x] Keine inhaltlichen Änderungen an den formatierten Dateien.
