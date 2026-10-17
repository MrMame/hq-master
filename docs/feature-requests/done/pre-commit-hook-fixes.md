# Feature Request: Pre-Commit-Hook robuster machen

**Datum:** 2026-10-16  
**Priorität:** Mittel  
**Status:** done (2026-10-17 20:11)  
**Bezug:** Claude-Workflow (`.claude/hooks/pre-commit-check.mjs`, `.claude/hooks/stop-run-tests.mjs`, `.claude/settings.json`)

---

## Problem

Beim Squash-Merge von `_dev_shared-session-state` nach `development` (Commit `bd18b1d`) hat der Pre-Commit-Hook den Commit blockiert und alle 23 gestagten Dateien als „nicht Prettier-formatiert“ gemeldet, obwohl sie korrekt formatiert waren.

---

## Anforderungen

### 1. Gestagten Inhalt statt Working Copy prüfen ✅ done (2026-10-17 20:11)

- **Ursache:** Mit `core.autocrlf=true` checkt Git Dateien beim Branch-Wechsel mit CRLF aus. Der Hook liest die Datei per `readFileSync` aus dem Working Tree; Prettier (`endOfLine: "lf"`) meldet die CRLF-Zeilenenden als Formatfehler. Im Repository sind die Dateien jedoch mit LF gespeichert.
- Der Hook soll den gestagten Inhalt prüfen (`git show :<datei>`), also genau das, was committet wird.
- Alternativ/zusätzlich: `"endOfLine": "auto"` in `.prettierrc` erwägen.

**Erwartetes Verhalten:** Branch wechseln, Dateien mergen/stagen, committen → kein falscher Prettier-Alarm wegen Zeilenenden.

---

### 2. Hook nur bei `git commit` auslösen ✅ done (2026-10-17 20:11)

- **Beobachtung:** Der Hook (`"if": "Bash(git commit *)"`) wurde auch bei zusammengesetzten Bash-Befehlen ausgelöst, die kein `git commit` enthielten (z. B. `cp … && npx prettier … && git diff …`, `git diff --cached | git hash-object --stdin`).
- **Erneut beobachtet (2026-10-17, file-naming-convention):** Der Hook blockierte zwei aufeinanderfolgende Bash-Befehle ohne `git commit`, weil gestagte Dateien (aus vorherigem `git mv`) nicht formatiert waren. Auch der zweite Befehl, der die Dateien per `npx prettier --write` reparieren sollte, wurde blockiert; erst nach manuellem Formatieren per Edit-Tool liefen Bash-Befehle wieder. Betroffene Befehle:
  - `cat > m5.txt <<EOF … EOF; node rename.mjs m5.txt && … && bash verify.sh` (Heredoc + Skript, das intern `git mv` ausführt)
  - `git add -A src && npx prettier --write $(git diff --cached --name-only …)`
- **Folge:** Neben dem Fehlalarm kostet jeder fälschlich ausgelöste Lauf Lint + Build (Minuten) und kann die eigene Reparatur blockieren.
- Ursache klären (Matching der `if`-Bedingung bei zusammengesetzten Befehlen, Heredocs, `$(…)`) und den Hook so einschränken, dass er nur bei echten Commits läuft.
- **Vorschlag:** Im Skript `tool_input.command` aus dem Hook-JSON (stdin) lesen und sofort mit Exit-Code 0 beenden, wenn `/\bgit\s+commit\b/` nicht vorkommt. Das wirkt unabhängig davon, wie die `if`-Bedingung matcht.

**Erwartetes Verhalten:** `git diff`, `git status` usw. laufen ohne Prettier-/Lint-/Build-Check.

---

### 3. Stop-Hook: Testlauf mit eigenem Timeout und Prozessbaum-Kill ✅ done (2026-10-17 20:11)

- **Beobachtung (2026-10-17, shared-session-state #9):** Ein Testlauf hing wegen einer vermutlich synchronen Endlosschleife in einer Spec (22/23 Dateien, 107/110 Tests fertig, eine Datei lief nie zu Ende). Das Vitest-Testtimeout greift bei synchronen Schleifen nicht. Nach dem Stoppen des Tasks liefen die Node-Prozesse (`npm` → `ng test` → `vitest`) unter Windows über 20 Minuten weiter und mussten per `taskkill /T /F` beendet werden.
- **Ursache im Hook:** `stop-run-tests.mjs` startet die Tests per `spawnSync(..., { shell: true })` ohne eigenes `timeout`. Bricht Claude Code den Hook nach 300 s ab, wird unter Windows vermutlich nur die Shell beendet; die Kindprozesse bleiben als Waisen bestehen und bremsen oder blockieren spätere Testläufe (nicht verifiziert).
- Eigenes Timeout im Hook setzen (kleiner als die 300 s aus `settings.json`), z. B. per `spawn` + Timer.
- Bei Ablauf den **gesamten Prozessbaum** beenden (Windows: `taskkill /PID <pid> /T /F`, sonst Prozessgruppe per `process.kill(-pid)` mit `detached: true`).
- Bei Timeout Claude mit Exit-Code 2 und klarer Meldung anhalten („Testlauf nach N s abgebrochen – vermutlich Endlosschleife“), inkl. der letzten Ausgabezeilen.
- Optional: Vor dem Start prüfen, ob bereits ein `ng test`-/`vitest`-Prozess dieses Projekts läuft, und dann warnen statt einen weiteren Lauf zu starten.

**Erwartetes Verhalten:** Hängender Testlauf → Hook bricht nach dem eigenen Timeout ab, meldet den Hänger, und es bleiben keine `node.exe`-Prozesse des Testlaufs zurück.

---

### 4. Stop-Hook: Laufwerksbuchstaben normalisieren ✅ done (2026-10-17 10:31)

- **Beobachtung (2026-10-17, shared-session-state #9):** Läuft die Sitzung im Pfad `f:\Projekte - Web\hq-master` (kleiner Laufwerksbuchstabe), schlagen im Stop-Hook alle 23 Spec-Dateien mit „Vitest failed to find the runner“ fehl. Derselbe Lauf aus `F:\…` ist grün (110/110).
- **Ursache:** Vitest unterscheidet unter Windows `f:` und `F:` und lädt dadurch zwei Modulinstanzen. Der Hook übernimmt das Arbeitsverzeichnis der Sitzung unverändert.
- `spawnSync` im Hook mit `cwd` aufrufen, dessen Laufwerksbuchstabe großgeschrieben ist.

**Erwartetes Verhalten:** Stop-Hook-Testlauf ist grün, unabhängig von der Schreibweise des Laufwerksbuchstabens.

---

## Betroffene Dateien

| Datei                                | Änderung                                                           |
| ------------------------------------ | ------------------------------------------------------------------ |
| `.claude/hooks/pre-commit-check.mjs` | Gestagten Inhalt prüfen; Befehl verifizieren                       |
| `.claude/hooks/stop-run-tests.mjs`   | Eigenes Timeout, Prozessbaum beenden (§3); Laufwerksbuchstabe (§4) |
| `.claude/settings.json`              | ggf. `if`-Bedingung anpassen                                       |
| `.prettierrc`                        | ggf. `endOfLine` anpassen                                          |

---

## Akzeptanzkriterien

- [x] Commit nach Branch-Wechsel mit `core.autocrlf=true` wird nicht fälschlich blockiert
- [x] Wirklich unformatierte gestagte Dateien blockieren den Commit weiterhin
- [x] Bash-Befehle ohne `git commit` lösen den Hook nicht aus (auch nicht mit Heredoc, `$(…)` oder `&&`-Ketten)
- [x] Hängender Testlauf im Stop-Hook wird nach eigenem Timeout abgebrochen und gemeldet
- [x] Nach einem abgebrochenen Testlauf laufen keine verwaisten `node.exe`-Prozesse (ng/vitest) mehr
- [x] Stop-Hook-Testlauf ist auch bei kleinem Laufwerksbuchstaben im Arbeitsverzeichnis grün
