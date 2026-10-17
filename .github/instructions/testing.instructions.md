---
name: Testing Guidelines
description: 'Use when creating or modifying Vitest tests, Playwright e2e tests, Angular component tests, services, Signals, persistence, or business logic.'
applyTo:
  - 'src/**/*.spec.ts'
  - 'src/**/*.ts'
  - 'e2e/**/*.ts'
---

# Testing Guidelines

The test conventions are maintained in one place only:
**[`.claude/rules/testing.md`](../../.claude/rules/testing.md)**. Read and follow it; do not
duplicate its rules here.

Copilot-specific notes:

- Before writing a new test, open the nearest existing `*.spec.ts` of the same feature and
  reuse its setup and fixtures (`<feature>/testing/`, `shared/testing/`).
- When suggesting test code inline, use the Vitest globals (`vi`, `describe`, `it`, `expect`)
  that are already available in specs; do not add Jasmine or Jest imports.
