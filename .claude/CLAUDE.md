# hq-master (Angular 21 + Tailwind v4 + Vitest)

## App Definitions
- **Before making any major code changes or refactoring, you MUST read and follow the requirements specified in `REQUIREMENTS.md` at the project root.**
- Always ensure that your implementation aligns with the current goals and scope defined in that file.


## Build, Test & Lint Commands
- Start dev server: `npm start` (or `ng serve`)
- Build production: `npm run build`
- Run unit tests: `npm run test` (uses Vitest)
- Watch build: `npm run watch`

## Architecture & Framework Conventions
- **Framework**: Angular 21 (Strict Standalone-first, Zoneless preferred).
- **Core APIs**: Always prefer Angular Signals (`signal`, `computed`, `effect`) and signal inputs/outputs over traditional `@Input()`/`@Output()`.
- **Dependency Injection**: Always use the `inject()` function. Do not use constructor injection.
- **Styling**: Tailwind CSS v4 via `@tailwindcss/postcss`. Avoid custom CSS or SCSS unless absolutely necessary. Use utility classes directly in the template.
- **State Management**: Use reactive services driven by Signals and RxJS (`rxjs` ~7.8.0) where asynchronous streams are required.
- **Component Design**: Keep components granular and single-responsibility. Inline templates/styles are acceptable for small components under 100 lines; otherwise, use separate files.

## Testing & Quality Guidelines
- **Unit Tests**: Written in Vitest (`vitest` ^4.0.0) using `jsdom`. Ensure all new logic has test coverage.
- **Code Style**: Code formatting is enforced via Prettier (`prettier`). Format files before committing.
- **TypeScript**: Strict mode enabled. No `any` type allowed. Use precise interfaces or types.

## Anti-Patterns to Avoid
- NEVER use legacy `NgModule` declarations.
- DO NOT use constructor-based dependency injection.
- DO NOT use traditional Lifecycle Hooks (`ngOnInit`, `ngOnChanges`) when Signal-based alternatives (`effect`, computed properties, or template signals) can achieve the same result.
- Avoid mixing legacy RxJS `subscribe` chains with Signals incorrectly; use `toSignal` or `toObservable` from `@angular/core/rxjs-interop` if interop is required.
