# hq-master (Angular 21 + Tailwind v4 + Vitest)

## App Definitions
- Before making any major code changes or refactoring, you MUST read and follow the requirements specified in `REQUIREMENTS.md` at the project root.
- Always ensure that your implementation aligns with the current goals and scope defined in that file.

## Build, Test & Lint Commands
- Start dev server: `npm start` (or `ng serve`)
- Build production: `npm run build`
- Run unit tests: `npm run test` (uses Vitest)
- Watch build: `npm run watch`

## Code Generation Guidelines
- Always use the Angular CLI to generate new blueprints. Do not create component or service files manually.
- Generate a new service: `ng g s services/<name>`
- Generate a new component: `ng g c components/<name>`
- Generate a new module: `ng g m modules/<name>`
- Create Comments to clearify public functions for a better understanding for human readers

## Architecture
- Core architecture rules are modularized. See `.claude/rules/architecture.md`.

## Testing & Quality Guidelines
- Core testing rules are modularized. See `.claude/rules/testing.md`.

## Documentationen
- Selbst erzeugte dokumentationenunter docs/api/ speichern. Verwende ab da die gleiche verzeichnisstruktur, wie die datei die du beschreibst im src ordner zu finden ist. Der name der doku-datei soll den namen der zu beschreibenden datei beinhaltet