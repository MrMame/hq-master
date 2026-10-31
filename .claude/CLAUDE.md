# hq-master (Angular 21 + CSS + Vitest)

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

## Architecture

- Core architecture rules are modularized. See `.claude/rules/architecture.md`.

## Testing & Quality Guidelines

- Core testing rules are modularized. See `.claude/rules/testing.md`.

## Requests & Offene Arbeiten

- Ablageort und Verhalten beim Abfragen offener Aufgaben: See `.claude/rules/feature-requests.md`.
- Refactoring Requests (Umbauten ohne neues Verhalten): See `.claude/rules/refactoring-requests.md`.

## Arbeitsstatistik

- Am Ende jedes Skill-Laufs per Skript ermitteln und ausgeben: See `.claude/rules/work-statistics.md`.
