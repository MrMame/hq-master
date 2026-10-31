# Arbeitsstatistik

Am Ende jedes Skill-Laufs (`implement-feature`, `implement-refactor`, `interview-me`) wird eine
Arbeitsstatistik ausgegeben, damit der Nutzer die Effektivität der Arbeit einschätzen kann.

## Ermitteln

- Die Zahlen kommen **ausschließlich** aus dem Skript, nie aus eigener Zählung oder Schätzung:

  ```bash
  node scripts/claude/work-statistics.mjs --skill <skill-name>
  ```

  Es zählt ab dem letzten Prompt `/<skill-name> …` der eigenen Sitzung (`CLAUDE_CODE_SESSION_ID`)
  bis jetzt, inklusive Freigabe-Runden. Alternativ `--since "YYYY-MM-DD HH:MM"`; `--session <id>`
  wertet eine andere Sitzung aus.

- Aufruf **direkt vor dem Abschlussbericht** bzw. vor dem Zeigen von Committext und Log-Eintrag.
  Die laufende Antwort und spätere Commit-Schritte sind darin nicht enthalten.
- Schlägt das Skript fehl (z. B. „Kein Lauf im Log gefunden“), die Fehlermeldung nennen und keine
  Zahlen erfinden.

## Quellen

| Kennzahl                        | Quelle                                                                             |
| ------------------------------- | ---------------------------------------------------------------------------------- |
| Dauer, Runden, Rückfragen       | `.claude/logs/activity.log` (Hook `log-activity.mjs`), inkl. Wartezeit auf Antwort |
| Tool-Aufrufe, gelesene Dateien  | `activity.log`; gelesen = eindeutige Pfade aus `Read` (nicht `cat` per Bash)       |
| Fehlschläge                     | `FAIL`-Zeilen (`PostToolUseFailure`), gruppiert nach Edit, Tests, Lint, Build, E2E |
| Dateien neu/geändert/verschoben | `git diff --name-status -M` gegen `merge-base development` bzw. `HEAD` + untracked |
| Tokens                          | Sitzungsprotokoll `~/.claude/projects/*/<session>.jsonl`, je `message.id` einmal   |
| Subagenten                      | `[sub]`-Zeilen und `<session>/subagents/*.jsonl`, getrennt ausgewiesen             |

Kosten werden bewusst nicht ausgegeben.

## Ausgabe

- **Chat:** Abschnitt `## Arbeitsstatistik` mit der Tabelle aus dem Skript, unverändert.
- **`ai-implementations-log.md`:** die Kurzzeile `- **Statistik:** …` aus dem Skript als letzter
  Punkt des Eintrags (nur bei `implement-feature` und `implement-refactor`).
- Auffälligkeiten (z. B. viele Fehlschläge, ungewöhnlich viele Tokens) in einem Satz unter der
  Tabelle einordnen.

## Tests

`node --test scripts/claude/*.test.mjs` – bei Änderungen an Skript oder Log-Format ausführen.
Ändert sich das Zeilenformat in `.claude/hooks/log-activity.mjs`, muss `LINE` in
`scripts/claude/activity-log.mjs` mitgezogen werden.
