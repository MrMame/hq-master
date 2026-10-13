---
name: Testing Guidelines
description: "Use when creating or modifying Vitest tests, Angular component tests, services, Signals, persistence, or business logic."
applyTo:
  - "src/**/*.spec.ts"
  - "src/**/*.ts"
---

# Testing Guidelines

- Use Vitest and the project's `jsdom` test environment.
- Follow nearby `*.spec.ts` files before introducing a new test pattern.
- Cover new business logic, Signal state transitions, persistence behavior, and
  error paths.
- Prefer behavior-focused test names and assertions over implementation details.
- Isolate LocalStorage state between tests and use the existing persistence
  abstractions where applicable.
- Do not add Jasmine or Jest APIs to new tests.
- Run the smallest affected test first, then run `npm run test` when the change
  affects shared behavior.
- If a test exposes an implementation error, fix the production behavior rather
  than weakening the assertion.
