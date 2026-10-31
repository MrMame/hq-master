# Refactoring Request: Fehlschläge in der Arbeitsstatistik zuverlässig erfassen

**Datum:** 2026-10-31  
**Priorität:** Niedrig  
**Status:** open – Inhalt noch zu definieren  
**Bezug:** `scripts/claude/work-statistics.mjs`, `scripts/claude/activity-log.mjs`,
`.claude/hooks/log-activity.mjs`, `.claude/rules/work-statistics.md`

---

## Problem

- Die Kennzahl „Fehlschläge“ zählt nur `FAIL`-Zeilen (`PostToolUseFailure`), also Tool-Aufrufe, die Claude Code
  selbst als fehlgeschlagen meldet.
- Läuft ein Prüfbefehl über eine Pipe (z. B. `npm run lint 2>&1 | tail -5`), zählt der Exit-Code des letzten
  Befehls (`tail` = 0). Lint-Fehler, rote Tests oder eine rote Playwright-Probe erscheinen dann nicht als Fehlschlag.
- Beispiel: Beim Lauf `implement-feature main-nav-menu-button` (2026-10-31) meldete die Statistik
  „0 Fehlschläge“, obwohl `npm run lint` 3 Fehler gemeldet hatte und die Probe vorher (absichtlich) rot war.

---

## Anforderungen

_Noch zu definieren._ Mögliche Richtungen, nicht entschieden:

- Ausgabe von Prüfbefehlen zusätzlich auswerten (z. B. „Lint errors found“, „x failed“).
- Prüfbefehle in Skills/Regeln ohne Pipe bzw. mit `set -o pipefail` ausführen.
- Erwartete Fehlschläge (rote Probe als Beleg für „fehlt noch“) getrennt ausweisen.

---

## Akzeptanzkriterien

_Noch zu definieren._
