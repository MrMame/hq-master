---
description: 'Review an HQ-Master Angular change for architecture, tests, typing, persistence, and validation gaps.'
name: 'Review HQ-Master Change'
argument-hint: 'Review the current changes or selected files'
agent: 'agent'
---

Review the current HQ-Master changes against the project rules.

Check:

- `REQUIREMENTS.md` alignment for functional changes
- standalone components and `inject()`
- Signals and shared service boundaries
- no direct feature `localStorage` access
- lazy routing and feature structure
- strict typing with no `any`
- 150-line file limit
- Vitest coverage for new behavior and error paths
- template accessibility and tablet usability
- required documentation updates

Report only concrete findings with file links and line numbers, followed by
validation commands that should be run or were run. Do not rewrite code unless
the user explicitly asks for fixes.
