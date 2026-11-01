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
| Fehlschläge                     | `FAIL`-Zeilen (siehe „Fehlschläge“), gruppiert nach Edit, Tests, Lint, Build, E2E  |
| Dateien neu/geändert/verschoben | `git diff --name-status -M` gegen `merge-base development` bzw. `HEAD` + untracked |
| Tokens                          | Sitzungsprotokoll `~/.claude/projects/*/<session>.jsonl`, je `message.id` einmal   |
| Subagenten                      | `[sub]`-Zeilen und `<session>/subagents/*.jsonl`, getrennt ausgewiesen             |

Kosten werden bewusst nicht ausgegeben.

## Fehlschläge

- `FAIL` schreibt der Hook bei `PostToolUseFailure` (Exit-Code ≠ 0) und bei Prüfbefehlen (Test, Lint,
  Build, E2E), deren Ausgabe einen Fehlermarker enthält, obwohl sie mit Exit-Code 0 enden (z. B. über
  eine Pipe). Befehlsmuster und Marker: `scripts/claude/check-output.mjs`.
- Filtert eine Pipe die Ergebniszeile weg (z. B. `| tail -1` ohne „Lint errors found“ / „x failed“),
  bleibt der Fehler unerkannt. Pipes bei Prüfbefehlen so wählen, dass die Ergebniszeile erhalten bleibt.
- **Erwartet rot:** Läuft ein Prüfbefehl absichtlich rot (z. B. eine Probe als Beleg für „fehlt noch“),
  „erwartet rot“ in die Bash-Beschreibung schreiben. Der Fehlschlag wird dann als „erwartet“ getrennt
  ausgewiesen und nicht in die Summe gezählt.

## Ausgabe

- **Chat:** Abschnitt `## Arbeitsstatistik` mit der Tabelle aus dem Skript, unverändert. Darunter die
  Zeile des aktuellen Laufs im Statistiklog (Kopf + Zeile), ebenfalls unverändert aus der Skript-Ausgabe:
  ohne `--append` als „Zeile für das Statistiklog (Vorschau)“, mit `--append` als „Zeile im Statistiklog“.
  Für eine vollständige Vorschau `--slug` und `--points` schon beim ersten Aufruf mitgeben.
- **`docs/project-logs/ai-implementations-log.md`:** die Kurzzeile `- **Statistik:** …` aus dem Skript als letzter
  Punkt des Eintrags (nur bei `implement-feature` und `implement-refactor`).
- Auffälligkeiten (z. B. viele Fehlschläge, ungewöhnlich viele Tokens) in einem Satz unter der
  Tabelle einordnen.

## Statistiklog

`docs/project-logs/harness-statistics.md` ist die auswertbare Quelle über alle Läufe (die Kurzzeile im
`ai-implementations-log.md` bleibt als Historie). Die Datei wird nur vom Skript geschrieben, nie von Hand.
Ihr Abschnitt **Erläuterungen** (Spalten, Index, Beispielrechnungen) kommt aus der Vorlage
`scripts/claude/statistics-guide.md`; Änderungen an Gewichten, Schwellen oder Mess-Dateien dort mitziehen –
`statistics-guide.test.mjs` prüft die genannten Zahlen gegen den Code.

- **Anhängen** nach der Freigabe von Committext und Log-Eintrag, damit die Zeile im selben Commit landet:

  ```bash
  node scripts/claude/work-statistics.mjs --skill <name> --slug <slug> --points <n> --append
  ```

  `--points` = Anzahl umgesetzter Punkte des Aufrufs; bei `interview-me` weglassen (zählt nicht in den Index).
  Diff-Zeilen per `git diff --shortstat` gegen dieselbe Basis wie die Dateizählung, plus Zeilen neuer Dateien,
  ohne `docs/project-logs/**` und Lockfiles. Modell und Effort aus dem Sitzungsprotokoll.

- **Harness** = `.claude/CLAUDE.md`, `.claude/settings.json`, `.claude/rules/**`, `.claude/skills/**`,
  `.claude/hooks/**`, `scripts/claude/**` (ohne `*.test.mjs` und `testing/`), `scripts/git-hooks/**`, `.husky/**`
  (ohne Ignoriertes), `vitest.config.ts`, `playwright.config.ts`, außerdem `~/.claude/settings.json` und das
  Memory-Verzeichnis des Projekts. Liste: `HARNESS_PATHS` in `scripts/claude/harness-files.mjs`.
- **Harness-Stand** = 8-stelliger Hash über die Dateiinhalte (Zeilenenden normalisiert, auch ungespeicherte
  Änderungen), Modell inkl. Effort und Claude-Code-Version. Der letzte Stand liegt als Snapshot in
  `docs/project-logs/harness-statistics.state.json`; weicht er ab, entsteht eine Zeile unter **Harness-Stände**
  mit den geänderten Dateien.
- **Messbruch:** Betrifft die Änderung eine Mess-Datei (`MEASUREMENT_FILES`: `work-statistics.mjs`,
  `activity-log.mjs`, `check-output.mjs`, `transcript-usage.mjs`, `transcript-model.mjs`, `git-files.mjs`,
  `format-statistics.mjs`, `log-activity.mjs`), wird der Stand als Messbruch markiert. Läufe hinter einem
  Messbruch werden nicht mit früheren verglichen. Index und Übersicht werden bei jedem Schreiben aus den
  Rohwerten neu berechnet; Änderungen daran sind deshalb kein Messbruch.
- **Einordnung:** Meldet das Skript einen neuen Stand, gibt Claude beim `--append` eine Beschreibung
  (`--harness-note`), die Einordnung (`--harness-impact wirkungsrelevant|"nicht wirkungsrelevant"`) und die
  erwartete Wirkung als Hypothese (`--harness-hypothesis`) mit. Nachträglich: dieselben Optionen ohne
  `--append` ändern den letzten Stand. Ein offener Stand zählt als wirkungsrelevant; nicht wirkungsrelevante
  Stände (z. B. Tippfehler, reines CC-Update) werden in der Übersicht dem vorigen Stand zugeschlagen.
- **Lauf ändert den Harness:** Berührt der Diff des Laufs Harness-Dateien, zählt der Lauf zum vorigen Stand
  (Vermerk „ändert Harness“); der neue Stand gilt ab dem nächsten Lauf.
- **Übersicht** (`--overview` erzeugt sie neu, `--append` automatisch): je Messverfahren und
  wirkungsrelevantem Stand Anzahl Läufe und Median je Punkt für Dauer, Tools, Tokens gesamt (inkl. Subagenten),
  Output-Tokens, Fehlschläge + 1 und Diff-Zeilen. Unter 3 Läufen ist der Index „vorläufig“.
- **Effizienz-Index:** gewichtetes geometrisches Mittel von Median / Wert je Punkt, Median über alle Läufe
  desselben Messverfahrens; 100 = Median, höher = effizienter. Gewichte: Tokens 30 %, Tools 20 %, Dauer 20 %,
  (Fehlschläge + 1) 15 %, (max(0, Runden + Rückfragen − 2) + 1) 15 %.
- **Nacharbeit:** Ein späterer Lauf mit demselben Slug wird dem früheren zugeschlagen (Kennzahlen summiert,
  Punkte des früheren Laufs) und zählt in dessen Stand; beide Zeilen sind markiert.
- **Altdaten:** `--import-legacy` hat die `**Statistik:**`-Zeilen bis 2026-11-01 einmalig übernommen (Stände
  `alt-1`/`alt-2`, Messbruch ab work-statistics-failure-detection, 2026-10-31 20:56).

## Tests

`node --test scripts/claude/*.test.mjs` – bei Änderungen an Skript, Statistiklog oder Log-Format ausführen.
Ändert sich das Zeilenformat in `.claude/hooks/log-activity.mjs`, muss `LINE` in
`scripts/claude/activity-log.mjs` mitgezogen werden.
