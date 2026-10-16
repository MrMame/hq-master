# Feature Request: Pre-Commit-Hook robuster machen

**Datum:** 2026-10-16  
**Priorität:** Mittel  
**Status:** Offen  
**Bezug:** Claude-Workflow (`.claude/hooks/pre-commit-check.mjs`, `.claude/settings.json`)

---

## Problem

Beim Squash-Merge von `_dev_shared-session-state` nach `development` (Commit `bd18b1d`) hat der Pre-Commit-Hook den Commit blockiert und alle 23 gestagten Dateien als „nicht Prettier-formatiert“ gemeldet, obwohl sie korrekt formatiert waren.

---

## Anforderungen

### 1. Gestagten Inhalt statt Working Copy prüfen

- **Ursache:** Mit `core.autocrlf=true` checkt Git Dateien beim Branch-Wechsel mit CRLF aus. Der Hook liest die Datei per `readFileSync` aus dem Working Tree; Prettier (`endOfLine: "lf"`) meldet die CRLF-Zeilenenden als Formatfehler. Im Repository sind die Dateien jedoch mit LF gespeichert.
- Der Hook soll den gestagten Inhalt prüfen (`git show :<datei>`), also genau das, was committet wird.
- Alternativ/zusätzlich: `"endOfLine": "auto"` in `.prettierrc` erwägen.

**Erwartetes Verhalten:** Branch wechseln, Dateien mergen/stagen, committen → kein falscher Prettier-Alarm wegen Zeilenenden.

---

### 2. Hook nur bei `git commit` auslösen

- **Beobachtung:** Der Hook (`"if": "Bash(git commit *)"`) wurde auch bei zusammengesetzten Bash-Befehlen ausgelöst, die kein `git commit` enthielten (z. B. `cp … && npx prettier … && git diff …`, `git diff --cached | git hash-object --stdin`).
- Ursache klären (Matching der `if`-Bedingung bei zusammengesetzten Befehlen) und den Hook so einschränken, dass er nur bei echten Commits läuft — z. B. zusätzlich im Skript prüfen, ob der Befehl `git commit` enthält.

**Erwartetes Verhalten:** `git diff`, `git status` usw. laufen ohne Prettier-/Lint-/Build-Check.

---

## Betroffene Dateien

| Datei                                | Änderung                                     |
| ------------------------------------ | -------------------------------------------- |
| `.claude/hooks/pre-commit-check.mjs` | Gestagten Inhalt prüfen; Befehl verifizieren |
| `.claude/settings.json`              | ggf. `if`-Bedingung anpassen                 |
| `.prettierrc`                        | ggf. `endOfLine` anpassen                    |

---

## Akzeptanzkriterien

- [ ] Commit nach Branch-Wechsel mit `core.autocrlf=true` wird nicht fälschlich blockiert
- [ ] Wirklich unformatierte gestagte Dateien blockieren den Commit weiterhin
- [ ] Bash-Befehle ohne `git commit` lösen den Hook nicht aus
