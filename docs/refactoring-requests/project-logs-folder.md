# Refactoring Request: Projekt-Logs gesammelt unter `docs/project-logs/`

**Datum:** 2026-11-01  
**Priorität:** Mittel  
**Status:** open  
**Bezug:** `ai-implementations-log.md`, `.claude/settings.json`, `.claude/rules/work-statistics.md`,
`.claude/rules/feature-requests.md`, `.claude/rules/refactoring-requests.md`,
`.claude/skills/implement-feature/SKILL.md`, `.claude/skills/implement-refactor/SKILL.md`,
`scripts/claude/format-statistics.mjs`, `docs/notes-project/`, `docs/refactoring-requests/harness-statistics-log.md`

---

## Problem

- Das eingecheckte Projekt-Log `ai-implementations-log.md` liegt im Root, während alle anderen
  Projektdokumente unter `docs/` liegen.
- Mit dem geplanten Statistiklog (`harness-statistics-log`) käme ein zweites Log hinzu. Ohne gemeinsamen Ort
  verteilen sich die Logs über Root und `docs/`.

---

## Anforderungen

Entschieden am 2026-11-01: Alle eingecheckten Projekt-Logs liegen unter `docs/project-logs/`.

### 1. Ordner anlegen und Log verschieben

- Neuer Ordner `docs/project-logs/`.
- `ai-implementations-log.md` per `git mv` nach `docs/project-logs/ai-implementations-log.md` verschieben;
  Dateiname und Inhalt bleiben unverändert, damit die Historie per `git log --follow` erhalten bleibt.

### 2. Verweise anpassen

- `.claude/settings.json`: Berechtigungen `Read(./ai-implementations-log.md)` und
  `Edit(./ai-implementations-log.md)` auf den neuen Pfad umstellen.
- Regeln (`work-statistics.md`, `feature-requests.md`, `refactoring-requests.md`) und Skills
  (`implement-feature`, `implement-refactor`): Pfad auf `docs/project-logs/ai-implementations-log.md`.
- `scripts/claude/format-statistics.mjs` (Kommentar) und `docs/notes-project/implement-feature/README.md`.
- Offene Requests (`harness-statistics-log.md`) verweisen bereits auf den neuen Pfad.
- Abgeschlossene Requests unter `done/` und die Einträge im Log selbst bleiben unverändert (Historie).

### 3. Regel für künftige Logs

- In `.claude/CLAUDE.md` (Abschnitt „Requests & Offene Arbeiten“ oder eigener Abschnitt) festhalten: Neue
  eingecheckte Projekt-Logs gehören nach `docs/project-logs/`, nicht ins Root.

### 4. Lokales Aktivitätslog bleibt, wo es ist

- `.claude/logs/activity.log` wird **nicht** verschoben: Es ist ein lokales Rohprotokoll der Hooks
  (gitignored, wächst mit jedem Tool-Aufruf, enthält Befehle und Pfade) und kein Projektdokument. Unter
  `docs/` würde es leicht versehentlich eingecheckt.
- Die neue Regel (#3) nennt diese Abgrenzung: `docs/project-logs/` = eingecheckte, lesbare Logs;
  `.claude/logs/` = lokale Rohdaten.

---

## Akzeptanzkriterien

- [ ] `docs/project-logs/ai-implementations-log.md` existiert, im Root liegt kein Log mehr; `git log --follow`
      zeigt die bisherige Historie.
- [ ] Außer in `done/` und im Log selbst verweist nichts mehr auf `./ai-implementations-log.md` im Root
      (`Grep` prüft das).
- [ ] Claude kann das Log ohne zusätzliche Berechtigungsabfrage lesen und bearbeiten.
- [ ] `.claude/CLAUDE.md` beschreibt den Ablageort für Logs.
- [ ] `node --test scripts/claude/*.test.mjs` grün.
