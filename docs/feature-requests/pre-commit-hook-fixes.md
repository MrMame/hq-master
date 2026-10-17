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
- **Erneut beobachtet (2026-10-17, file-naming-convention):** Der Hook blockierte zwei aufeinanderfolgende Bash-Befehle ohne `git commit`, weil gestagte Dateien (aus vorherigem `git mv`) nicht formatiert waren. Auch der zweite Befehl, der die Dateien per `npx prettier --write` reparieren sollte, wurde blockiert; erst nach manuellem Formatieren per Edit-Tool liefen Bash-Befehle wieder. Betroffene Befehle:
  - `cat > m5.txt <<EOF … EOF; node rename.mjs m5.txt && … && bash verify.sh` (Heredoc + Skript, das intern `git mv` ausführt)
  - `git add -A src && npx prettier --write $(git diff --cached --name-only …)`
- **Folge:** Neben dem Fehlalarm kostet jeder fälschlich ausgelöste Lauf Lint + Build (Minuten) und kann die eigene Reparatur blockieren.
- Ursache klären (Matching der `if`-Bedingung bei zusammengesetzten Befehlen, Heredocs, `$(…)`) und den Hook so einschränken, dass er nur bei echten Commits läuft.
- **Vorschlag:** Im Skript `tool_input.command` aus dem Hook-JSON (stdin) lesen und sofort mit Exit-Code 0 beenden, wenn `/\bgit\s+commit\b/` nicht vorkommt. Das wirkt unabhängig davon, wie die `if`-Bedingung matcht.

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
- [ ] Bash-Befehle ohne `git commit` lösen den Hook nicht aus (auch nicht mit Heredoc, `$(…)` oder `&&`-Ketten)
