# Ai Konfiguration im Projekt
Diese Datei Beschreibt die verschiedenen Dateien und Ordner, um der ki das notwendige Projektverhalten anzuweisen

## Ordnerstruktur (.claude-Ordner)
- Der .claude Ordner muss in das Git Repo eingecheckt werden, damit auf anderen Rechnern die Rgeeln ebenfalls eingehalten werden

mein-projekt/
├── .git/
├── src/
├── package.json
├── .claude/                <-- Hier liegt das "Gehirn" deines Projekts
|    ├── CLAUDE.md           <-- Die Haupt-Bedienungsanleitung (Commands, Core-Tech-Stack)
|    ├── rules/              <-- Spezifische Richtlinien (z. B. linter.md, testing.md)
|    ├── skills/             <-- Wiederverwendbare Prompts und Custom Commands
|    ├── agents/             <-- Definitionen für Sub-Agenten
|    └── settings.json       <-- Projekt-Konfiguration (Berechtigungen, Hooks)
├─ REQUIREMENTS.md          <-- Funktionale und nicht Funktionale Projektanforderungen



• CLAUDE.md steuert das Vorgehen (Workflow): Hier steht, welche Schritte Claude nacheinander ausführen soll (z. B. "Erst Requirements lesen", "Nach dem Code-Generieren immer npm test ausführen").

• .claude/rules/ steuert das Ergebnis (Code-Qualität): Dort liegen die statischen Regeln für das fertige Produkt (z. B. "Maximal 150 Zeilen" oder "Nutze Clean Code").


## Unterschied .claude/settings.json und .claudeignore

- settings.json ist Claude-System-Relevant und wird immer ausgewertet
- .claudeignore ist "community-driven" und KANN ausgewertet werden. Muss aber nicht.

Sicherheitsrelevante Daten wie Passwörter und .env Dateien MÜSSEN per ./claude/settings.json geschützt werden.

### Einlese Prioritäten der settings.json
- ~/.claude/settings.json          ← Global (all projects)
- ~/.claude/settings.local.json    ← Global local overrides
- .claude/settings.json            ← Project (committed to git)
- .claude/settings.local.json      ← Project local (gitignored)