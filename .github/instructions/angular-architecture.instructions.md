---
name: Angular Architecture
description: "Use when creating or modifying Angular components, services, routes, signals, state management, or feature folders."
applyTo:
  - "src/**/*.ts"
  - "src/**/*.html"
---

# Angular Architecture

- Use standalone components and do not add NgModules.
- Use `inject()` rather than constructor injection.
- Prefer Signals for local and shared state. Use `computed` for derived state
  and `effect` only for explicit side effects.
- Keep writable Signals private and expose readonly Signals.
- Put application-wide services in `src/app/core/` and feature code in
  `src/app/features/<feature>/`.
- Use `StorageService` for persistence. Feature code must not access
  `localStorage` directly.
- Keep routes lazy with `loadComponent`.
- Keep components granular and single-purpose.
- Keep each code file at or below 150 lines; refactor when it grows beyond that.
- Preserve strict TypeScript typing and never introduce `any`.
- For shared session state, inspect existing services before adding a second
  source of truth.

Before functional changes, read [REQUIREMENTS.md](../../REQUIREMENTS.md) and
check the existing feature and service patterns.
