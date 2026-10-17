# Refactoring Request: Qualitäts-Gate über Git-Hooks statt nur Claude-Hooks

**Datum:** 2026-10-17  
**Priorität:** Hoch  
**Status:** offen  
**Bezug:** `.claude/settings.json`, `.claude/hooks/pre-commit-check.mjs`, `.claude/hooks/stop-run-tests.mjs`, `.claude/rules/testing.md` (Definition of Done)

---

## Problem

Prettier, Lint, Build und Tests werden heute ausschließlich über Claude-Code-Hooks erzwungen:

| Prüfung                | Wo                                  | Greift bei                    |
| ---------------------- | ----------------------------------- | ----------------------------- |
| Prettier (gestagt)     | `pre-commit-check.mjs` (PreToolUse) | nur `git commit` durch Claude |
| Lint, Build            | `pre-commit-check.mjs` (PreToolUse) | nur `git commit` durch Claude |
| Unit-Tests (ohne Cov.) | `stop-run-tests.mjs` (Stop)         | nur Ende einer Claude-Antwort |
| Coverage               | –                                   | nie automatisch               |

Commits und Pushes von Hand, aus VS Code oder über Copilot laufen ungeprüft durch. Die Tests sind kein Commit-/Push-Gate, und es gibt keine Coverage-Schwellen. `npm run deploy` kann ungetesteten Code veröffentlichen.

Es wird kein fachliches Verhalten geändert, nur Werkzeug-Konfiguration.

---

## Anforderungen

### 1. Git-Hooks mit husky einrichten

- `husky` als devDependency; `"prepare": "husky"` in `package.json`, damit die Hooks nach `npm install` automatisch aktiv sind (setzt `core.hooksPath` auf `.husky/_`).
- Hook-Dateien unter `.husky/` werden eingecheckt und rufen nur Node-Skripte auf (Logik plattformunabhängig in `.mjs`, nicht in Shell).

### 2. `pre-commit`: schnelle Prüfungen

- Prettier-Check auf den **gestagten Inhalt** (Index), Logik aus `pre-commit-check.mjs` übernehmen (CRLF-Fehlalarme durch `core.autocrlf` vermeiden).
- `npm run lint`.
- Ziel: wenige Sekunden; kein Build, keine Tests.
- Skript nach `scripts/git-hooks/pre-commit.mjs` verschieben (kein Claude-spezifischer Code).

### 3. `pre-push`: vollständige Prüfung

- `npm run test -- --watch=false --coverage` und `npm run build`.
- Push wird bei Fehlern oder unterschrittenen Coverage-Schwellen abgebrochen.
- Timeout-/Prozessbaum-Logik aus `stop-run-tests.mjs` wiederverwenden (gemeinsames Modul unter `scripts/git-hooks/`), damit ein hängender Testlauf keine verwaisten Prozesse hinterlässt.
- Laufwerksbuchstaben-Workaround für Vitest unter Windows (`f:\` → `F:\`) übernehmen.

### 4. Coverage-Schwellen festlegen

- Schwellen knapp unter dem aktuellen Stand (2026-10-17: 98,3 % Lines, 94,0 % Branches, 89,8 % Functions, 96,8 % Statements), z. B. Lines 95, Branches 90, Functions 85, Statements 95.
- Konfiguration über die Optionen des `@angular/build:unit-test`-Builders bzw. eine Vitest-Konfiguration; vor der Umsetzung prüfen, welcher Weg vom Builder unterstützt wird.

### 5. Claude-Hooks bereinigen

- PreToolUse-Hook `pre-commit-check.mjs` aus `.claude/settings.json` entfernen; der Git-Hook übernimmt (greift auch bei Commits durch Claude, Fehlerausgabe erscheint im Bash-Ergebnis).
- Stop-Hook `stop-run-tests.mjs` bleibt als schnelles Feedback während der Arbeit, nutzt aber das gemeinsame Modul aus Punkt 3.
- Verweise in `.claude/skills/implement-*/SKILL.md` („Hooks in `.claude/settings.json` erzwingen …") anpassen.

### 6. Dokumentation

- `CLAUDE.md` / `.claude/rules/testing.md`: Abschnitt zu den Git-Hooks (was läuft wann, Umgehung nur mit `--no-verify` in begründeten Ausnahmen).
- `README.md`: Hinweis, dass `npm install` die Hooks aktiviert.

---

## Akzeptanzkriterien

- Nach `npm install` in einem frischen Clone sind die Hooks aktiv (`git config core.hooksPath` → `.husky/_`).
- Ein Commit mit unformatierter gestagter Datei oder Lint-Fehler wird abgebrochen – auch außerhalb von Claude Code.
- Ein Push mit fehlschlagendem Test, Build-Fehler oder unterschrittener Coverage-Schwelle wird abgebrochen.
- `pre-commit` läuft auf dem aktuellen Stand in unter ~15 s.
- `.claude/settings.json` enthält keinen doppelten Commit-Check mehr; Stop-Hook funktioniert weiter.
- Hooks laufen unter Windows (Git Bash, VS Code Source Control) und POSIX.
