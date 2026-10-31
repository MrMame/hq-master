# Refactoring Request: Fehlschläge in der Arbeitsstatistik zuverlässig erfassen

**Datum:** 2026-10-31  
**Priorität:** Niedrig  
**Status:** done (2026-10-31 20:56)  
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

Entschieden am 2026-10-31: Ausgabe von Prüfbefehlen auswerten (keine reine `pipefail`-Regel), erwartete
Fehlschläge über die Bash-Beschreibung getrennt ausweisen.

### 1. Fehler aus der Ausgabe von Prüfbefehlen erkennen ✅ done (2026-10-31 20:56)

- Bei erfolgreichen Bash-Aufrufen (`PostToolUse`) prüft der Hook `log-activity.mjs` die Ausgabe
  (`tool_response.stdout`/`stderr`), wenn der Befehl ein Prüfbefehl ist (Test, Lint, Build, E2E).
- Enthält die Ausgabe einen Fehlermarker (z. B. „Lint errors found“, „Tests 3 failed“, „2 failed“,
  „Application bundle generation failed“, verfehlte Coverage-Schwelle), schreibt der Hook eine `FAIL`-Zeile im
  selben Format wie bei `PostToolUseFailure`. Logformat und `LINE` bleiben unverändert.
- Befehlsmuster und Marker liegen an einer Stelle (`scripts/claude/check-output.mjs`) und werden von Hook und
  Auswertung gemeinsam genutzt.

### 2. Erwartete Fehlschläge getrennt ausweisen ✅ done (2026-10-31 20:56)

- Ein `FAIL`, dessen Bash-Beschreibung „erwartet rot“ bzw. „expect red“/„expected to fail“ enthält, zählt als
  **erwartet** und nicht in die Summe der Fehlschläge.
- Tabelle und Kurzzeile der Arbeitsstatistik zeigen erwartete Fehlschläge getrennt, nur wenn es welche gibt.

### 3. Doku nachziehen ✅ done (2026-10-31 20:56)

- `.claude/rules/work-statistics.md`: Quelle der Fehlschläge und Konvention „erwartet rot“ beschreiben, ebenso
  die Grenze (Pipe darf die Ergebniszeile nicht wegfiltern).
- Probe-Abschnitte der Skills `implement-feature` und `implement-refactor` um die Konvention ergänzen.

---

## Akzeptanzkriterien

- [x] Ein Prüfbefehl mit Fehlermarker in der Ausgabe und Exit-Code 0 erscheint im `activity.log` als `FAIL`.
- [x] Grüne Ausgaben (z. B. „864 passed“, nur Lint-Warnungen) und Nicht-Prüfbefehle mit „failed“ in der
      Ausgabe erzeugen keinen `FAIL`.
- [x] Fehlschläge mit „erwartet rot“ in der Beschreibung werden getrennt ausgewiesen und nicht in die Summe
      gezählt.
- [x] `node --test scripts/claude/*.test.mjs` grün, Regel und Skills beschreiben das Verhalten.
