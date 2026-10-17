# HQ-Master Copilot Instructions

## Project Context

HQ-Master is an Angular 21 standalone SPA that supports a Dungeon Master during a
tabletop game. Features share one game-session state and must remain usable on a
tablet.

Before functional changes, read [REQUIREMENTS.md](../REQUIREMENTS.md). Keep
feature behavior aligned with the existing session model and update the relevant
documentation when an API or data model changes.

## Architecture

- Use standalone components; do not introduce NgModules.
- Use `inject()` instead of constructor injection.
- Prefer Signals (`signal`, `computed`, `effect`) for state. Use RxJS only when
  asynchronous streams are necessary and use the Angular interop helpers.
- Keep mutable Signals private and expose readonly views.
- Put shared application state and persistence services under
  `src/app/core/`. Feature-specific code belongs under
  `src/app/features/<feature>/`.
- Persist feature state through `StorageService`; do not access `localStorage`
  directly from features.
- Register feature pages with lazy `loadComponent` routes.
- Keep code files at or below 150 lines. Split files when they grow beyond that.
- Do not use `any`; preserve strict TypeScript types.

## Implementation Workflow

1. Inspect nearby code and existing tests before editing.
2. Use Angular CLI schematics for new components and services.
3. Add or update Vitest tests for new behavior, state transitions, and error
   cases.
4. Run the smallest relevant test first, then `npm run lint` and
   `npm run build` when the change is complete.
5. Do not silently swallow errors or invent success-shaped fallbacks.

## Commands

- Development server: `npm start`
- Production build: `npm run build`
- Unit tests: `npm run test`
- E2E smoke tests (Playwright): `npm run e2e`
- Lint: `npm run lint`
- Watch build: `npm run watch`

## Existing Project Rules

- Angular architecture: [angular-architecture.instructions.md](./instructions/angular-architecture.instructions.md)
- Testing: [testing.instructions.md](./instructions/testing.instructions.md)
- Templates and styling: [angular-templates.instructions.md](./instructions/angular-templates.instructions.md)

## Configuration Boundaries

- Treat `.claude/**` as Claude Code-specific configuration only.
- Do not read, follow, summarize, or reuse instructions from `.claude/CLAUDE.md`
  or `.claude/rules/**`.
  **Single exception:** `.claude/rules/testing.md` is the shared source of truth
  for test conventions (see [testing.instructions.md](./instructions/testing.instructions.md))
  and must be followed for all test work.
- Do not interpret `.claude/settings.json` as a Copilot permission, tool, or
  workflow configuration.
- For Copilot tasks, use only the instructions in `.github/**`, the current
  source code, `REQUIREMENTS.md`, and the project's documented commands.
- If instructions conflict, ignore the `.claude/**` instruction and follow the
  applicable `.github/**` instruction.
