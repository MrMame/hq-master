# Refactoring Request: Statistiklog zur Bewertung der Harness-Effizienz

**Datum:** 2026-11-01  
**Priorität:** Mittel  
**Status:** open  
**Bezug:** `scripts/claude/work-statistics.mjs`, `scripts/claude/format-statistics.mjs`,
`scripts/claude/transcript-usage.mjs`, `scripts/claude/git-files.mjs`, `.claude/rules/work-statistics.md`,
`.claude/skills/implement-feature/SKILL.md`, `.claude/skills/implement-refactor/SKILL.md`,
`.claude/skills/interview-me/SKILL.md`, `docs/project-logs/ai-implementations-log.md`  
**Voraussetzung:** `docs/refactoring-requests/project-logs-folder.md` (Logs nach `docs/project-logs/`) ist umgesetzt.

---

## Problem

- Die Arbeitsstatistik erscheint nur im Chat und als Kurzzeile im Fließtext von
  `docs/project-logs/ai-implementations-log.md`. Ein Vergleich über mehrere Läufe hinweg ist nur durch Abschreiben möglich.
- Die Kennzahlen sind absolut. Ohne Angabe zum Umfang (Punkte, geänderte Zeilen) ist ein großer Lauf nicht von
  einem ineffizienten zu unterscheiden.
- Nirgends steht, mit welchem Harness-Stand (Skills, Regeln, Hooks, Skripte, Modell) ein Lauf gemacht wurde.
  Ob eine Änderung am Harness die Läufe effizienter gemacht hat, lässt sich deshalb nicht belegen.
- Ändert sich das Messverfahren selbst (z. B. die Erkennung von Fehlschlägen, Refactoring
  work-statistics-failure-detection), sind ältere und neuere Zahlen nicht vergleichbar, ohne dass das
  sichtbar wird.

---

## Anforderungen

### 1. Statistiklog als eigene Datei

- Neue Datei `docs/project-logs/harness-statistics.md`, eingecheckt. Sie wird nur vom Skript geschrieben,
  nie von Hand.
- Abschnitt **Übersicht** oben (generiert, siehe #5), darunter die Tabellen **Läufe** und
  **Harness-Stände**, jeweils chronologisch, neuester Eintrag unten.
- Je Lauf eine Tabellenzeile: Datum/Uhrzeit, Skill, Slug, Punkte, Diff-Zeilen (+/−), Dauer (min), Runden,
  Rückfragen, Tools, Fehlschläge (erwartet), Output-Tokens, Tokens gesamt, Modell, Harness-Stand, Nacharbeit.
- Kosten werden weiterhin nicht ausgegeben.

### 2. Lauf-Eintrag per Skript

- `node scripts/claude/work-statistics.mjs --skill <name> --slug <slug> --points <n> --append` hängt die Zeile
  an. Die Zahlen kommen aus denselben Quellen wie die Chat-Tabelle (`work-statistics.md`), nicht aus Schätzung.
- **Umfang:** `--points` = Anzahl umgesetzter Punkte des Aufrufs; Diff-Zeilen per `git diff --shortstat`
  gegen dieselbe Basis wie die Dateizählung (ohne `docs/project-logs/**` und Lockfiles).
- **Modell:** aus dem Sitzungsprotokoll (`message.model`); Effort-Stufe nur, falls dort verfügbar.
- Aufruf nach der Freigabe von Committext und Log-Eintrag, damit die Zeile im selben Commit landet.
- `interview-me` schreibt ebenfalls eine Zeile (Punkte leer) und zählt nicht in den Index (#5).

### 3. Harness-Stand automatisch erkennen

- **Harness** = alle Dateien, die beeinflussen, wie Claude arbeitet oder wie gemessen wird:
  `.claude/CLAUDE.md`, `.claude/settings.json`, `.claude/rules/**`, `.claude/skills/**`, `.claude/hooks/**`,
  `scripts/claude/**` (ohne `*.test.mjs`), `scripts/git-hooks/**`, `.husky/**`, `vitest.config.ts`,
  `playwright.config.ts`. Außerhalb des Repos zusätzlich `~/.claude/settings.json` und das Memory-Verzeichnis
  des Projekts.
- **Harness-Stand** = kurzer Hash über die Inhalte dieser Dateien (nicht über Git-Commits, damit auch
  ungespeicherte Änderungen zählen), dazu Modell und Claude-Code-Version.
- Weicht der Stand vom letzten Eintrag ab, schreibt das Skript eine neue Zeile in **Harness-Stände** mit den
  geänderten Dateien (Diff der Dateiliste/Hashes gegen den vorigen Stand). Dafür legt es neben dem Log einen
  kleinen Hash-Snapshot ab (`docs/project-logs/harness-statistics.state.json`).
- **Messbruch:** Betrifft die Änderung das Messverfahren (`work-statistics.mjs`, `activity-log.mjs`,
  `check-output.mjs`, `transcript-usage.mjs`, `git-files.mjs`, `format-statistics.mjs`, `log-activity.mjs`),
  wird der Stand automatisch als Messbruch markiert.

### 4. Harness-Änderung einordnen

- Bei neuem Harness-Stand ergänzt Claude in der Zeile **eine** Beschreibung (`--harness-note "…"`) und eine
  Einordnung `wirkungsrelevant` / `nicht wirkungsrelevant` (z. B. reine Tippfehler in einer Regel), dazu die
  erwartete Wirkung als Hypothese (z. B. „weniger Tool-Aufrufe in Schritt 1b“).
- Ob die Wirkung eingetreten ist, zeigt die Übersicht (#5) an den gemessenen Werten, nicht die Einordnung.
- Hat der Lauf selbst den Harness geändert (z. B. ein Refactoring an den Skills), wird das in der Lauf-Zeile
  vermerkt; der neue Stand gilt erst für den nächsten Lauf.

### 5. Übersicht und Effizienz-Index

- `node scripts/claude/work-statistics.mjs --overview` erzeugt den Abschnitt **Übersicht** neu; `--append`
  ruft das automatisch auf.
- Je Harness-Stand (wirkungsrelevante Stände, Messbrüche als Trennlinie): Anzahl Läufe und Median je Punkt für
  Dauer, Tools, Tokens gesamt, Output-Tokens, Fehlschläge und Diff-Zeilen.
- **Effizienz-Index** je Lauf und Stand: gewichtetes geometrisches Mittel der Kennzahlen je Punkt relativ zum
  Median aller vergleichbaren Läufe (gleiches Messverfahren); 100 = Median, höher = effizienter. Gewichte:
  Tokens 30 %, Tools 20 %, Dauer 20 %, (Fehlschläge + 1) 15 %, (Runden + Rückfragen − 2) 15 %.
- Mit weniger als 3 Läufen je Stand wird der Median als „vorläufig“ gekennzeichnet.
- **Nacharbeit:** Gibt es später einen Lauf mit demselben Slug, markiert die Übersicht den früheren Lauf mit
  „Nacharbeit“ und zählt beide gemeinsam in den Index des früheren Stands.

### 6. Bisherige Läufe übernehmen

- Die vorhandenen `**Statistik:**`-Kurzzeilen aus `docs/project-logs/ai-implementations-log.md` einmalig als Läufe übernehmen
  (Punkte aus der Überschrift `#1–#n`, Diff-Zeilen aus dem jeweiligen Commit, falls ermittelbar),
  Harness-Stand `unbekannt`.
- Läufe vor dem Refactoring work-statistics-failure-detection (2026-10-31 20:56) liegen hinter einem Messbruch.

### 7. Doku und Tests

- `.claude/rules/work-statistics.md`: Statistiklog, Harness-Definition, Messbruch, Index und Aufruf beschreiben.
- Skills `implement-feature`, `implement-refactor`, `interview-me`: Aufruf mit `--append` am Ende ergänzen,
  bei neuem Harness-Stand die Einordnung (#4).
- Die Kurzzeile in `docs/project-logs/ai-implementations-log.md` bleibt (Historie), das Statistiklog ist die auswertbare Quelle.
- `node --test scripts/claude/*.test.mjs`: Tests für Anhängen, Umfang, Harness-Hash und -Diff, Messbruch,
  Index, Nacharbeit und Übernahme der Altdaten. Neue Logik in eigenen Modulen, jede Datei ≤ 150 Zeilen.

---

## Akzeptanzkriterien

- [ ] Nach einem Lauf von `implement-feature` / `implement-refactor` steht eine Zeile im Statistiklog, die im
      selben Commit wie der Umbau eingecheckt wird.
- [ ] Eine Änderung an einer Harness-Datei erzeugt beim nächsten Lauf einen neuen Harness-Stand mit Liste der
      geänderten Dateien; eine Änderung an einer Mess-Datei ist als Messbruch markiert.
- [ ] Die Übersicht zeigt je Harness-Stand Mediane je Punkt und einen Effizienz-Index; Läufe hinter einem
      Messbruch werden nicht mit früheren verglichen.
- [ ] Die bisherigen 5 Läufe mit Statistik sind übernommen.
- [ ] `node --test scripts/claude/*.test.mjs` grün; Regel und Skills beschreiben den Ablauf.
