---
description: 'Create an HQ-Master feature using the project architecture, requirements, tests, and lazy routing.'
name: 'Create HQ-Master Feature'
argument-hint: 'Describe the feature and its user-visible behavior'
agent: 'agent'
---

Implement the requested HQ-Master feature.

1. Read [REQUIREMENTS.md](../../REQUIREMENTS.md) and inspect the closest
   existing feature.
2. Identify the required route, models, services, components, shared session
   state, persistence, and tests before editing.
3. Use Angular CLI schematics for new components and services.
4. Follow the Angular architecture and testing instructions in
   [copilot-instructions.md](../copilot-instructions.md).
5. Keep routes lazy, preserve strict types, and avoid direct feature
   `localStorage` access.
6. Add or update focused Vitest tests, then run the relevant tests, lint, and
   build.
7. Summarize changed files, validation results, and any unresolved requirement.
