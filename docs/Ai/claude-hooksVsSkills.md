Kurz gesagt: Garantiert ausgeführt wird nur, was der Harness selbst ausführt, also **Hooks**. Alles, was in `CLAUDE.md`, `.claude/rules/` oder einem Skill steht, sind Anweisungen an mich. Die befolge ich meistens, aber nicht mit Garantie, wie das Beispiel Prettier gezeigt hat.

## Die Mechanismen im Vergleich

| Mechanismus | Wer führt aus | Garantiert? | Geeignet für |
|---|---|---|---|
| `CLAUDE.md` / `.claude/rules/` | ich | nein | Architektur, Stil, Konventionen |
| Skill (z. B. `/implement-feature`) | ich, mit festem Ablauf | nein, aber zuverlässiger als verstreute Regeln | Ablauf: REQUIREMENTS lesen → planen → umsetzen → FR markieren |
| **Hook** in `.claude/settings.json` | der Harness | **ja** | Prettier, Tests, Build, Commit-Checks |
| Git-Hook (husky / `pre-commit`) | Git | ja, auch für Commits ohne mich | Format- und Lint-Prüfung beim Commit |

## Empfehlung: Skill und Hooks kombinieren

**1. Skill `.claude/skills/implement-feature/SKILL.md` für den Ablauf.** Du rufst ihn mit `/implement-feature shared-session-state #2` auf. Darin steht die Checkliste: `REQUIREMENTS.md` lesen, Feature Request lesen, Plan erstellen, umsetzen, Tests schreiben, Feature Request als durchgeführt markieren. Weil der Ablauf explizit geladen wird, gehen Schritte deutlich seltener verloren als bei Regeln, die irgendwo im Kontext stehen.

**2. Hooks für das, was nicht vergessen werden darf:**

```json
{
  "hooks": {
    "PostToolUse": [{
      "matcher": "Edit|Write",
      "hooks": [{ "type": "command",
        "command": "node -e \"const f=JSON.parse(require('fs').readFileSync(0)).tool_input.file_path; if(/\\.(ts|html|scss|json|md)$/.test(f)) require('child_process').execSync('npx prettier --write \\\"'+f+'\\\"')\"" }]
    }],
    "Stop": [{
      "hooks": [{ "type": "command",
        "command": "git diff --quiet HEAD -- src || (npm run test >&2 || exit 2)" }]
    }]
  }
}
```

- **PostToolUse:** Formatiert jede Datei mit Prettier, die ich bearbeite oder neu schreibe.
- **Stop:** Läuft, bevor ich eine Antwort abschließe. Hat sich in `src/` etwas geändert, startet er die Tests. Schlagen sie fehl, darf ich nicht aufhören: Exit-Code 2 schickt mir die Fehler zurück, und ich muss sie beheben.
- Zusätzlich geht ein **PreToolUse**-Hook auf `git commit`, der einen Commit blockiert, solange `prettier --check` oder `npm run build` fehlschlägt.

**3. Grenze:** „REQUIREMENTS.md lesen und berücksichtigen“ lässt sich per Hook nicht erzwingen. Ein `UserPromptSubmit`-Hook kann aber den Inhalt der Datei bei jeder Feature-Request-Anfrage garantiert in meinen Kontext einfügen. Ob ich den Inhalt dann richtig anwende, liegt wieder bei mir.
