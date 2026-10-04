---
paths:
  - "src/**/*"
  - "backend/**/*"
---

# Projektarchitektur: hq-master

## App-Zweck
SPA als Dungeon-Master-Tool für ein D&D-ähnliches Spiel.
Alle Features teilen eine gemeinsame Session-Datenbasis über root-provided Services.

## Verzeichnisstruktur (`src/app/`)

```
core/
  services/
    gaming/       → GameTimeService: In-Game-Zeitlogik (app-weit)
    persistent/   → StorageService (LocalStorage-Abstraktion), CharactersDbService

features/
  character-tracker/   → Charakterverwaltung & Kampf
    components/        → CharacterTrackerPage, CharacterCard, Dialoge
    models/            → CharacterInfo, DamageTypes, Abilities, …
    services/          → HeroCreator, MonsterCreator, CombatCalculator

  dungeon-tracker/     → Spielbrett-Overlay mit Token-Positionierung
    components/        → DungeonTrackerPage, DungeonToken
    models/            → DungeonBoardState, DungeonPosition
    services/          → DungeonBoardService (Signal-State + LocalStorage)

  time-tracker/        → In-Game-Zeiterfassung
    components/        → TimeTrackerPage

shared/
  components/          → Feature-unabhängige UI (z. B. ConfirmationDialog)
```

## Kern-Architekturregeln

### Routing
- Alle Feature-Pages werden lazy per `loadComponent` geladen (`app.routes.ts`).
- Kein Preloading, kein NgModule-Routing.

### State & Services
- State lebt in root-provided Services als **private Signals** (`signal()`).
- Öffentlicher Zugriff nur via `.asReadonly()`.
- Features, die gemeinsamen State benötigen, injizieren den Service aus `core/`.
- Persistenz immer über `StorageService` → kein direktes `localStorage` in Features.

### Dependency Injection
- Ausschließlich `inject()` – keine Konstruktor-Injection.

### Signale & RxJS
- Primär Signals (`signal`, `computed`, `effect`).
- RxJS nur, wo asynchrone Streams unumgänglich sind.
- Interop: `toSignal()` / `toObservable()` aus `@angular/core/rxjs-interop`.

### Komponenten
- Standalone-first, kein `NgModule`.
- Signal-Inputs/Outputs statt `@Input()`/`@Output()`.
- Template/Styles inline, wenn < 100 Zeilen; sonst separate `.html`/`.scss`.

### Dateigrößenlimit
- Max. **150 Zeilen** pro Datei. Bei Überschreitung refaktorieren.

## Neue Features hinzufügen
1. Neuen Ordner unter `features/<name>/` anlegen mit `components/`, `models/`, `services/`.
2. Route in `app.routes.ts` als lazy `loadComponent` registrieren.
3. App-weite Services (Storage, GameTime) aus `core/` injizieren, nicht duplizieren.
4. Feature-eigene Persistenz über `StorageService` mit eigenem `KEY_*`-Konstanten-Pattern.

## Anti-Patterns to Avoid
- NEVER use legacy `NgModule` declarations.
- DO NOT use constructor-based dependency injection.
- DO NOT use traditional Lifecycle Hooks (`ngOnInit`, `ngOnChanges`) when Signal-based alternatives (`effect`, computed properties, or template signals) can achieve the same result.
- Avoid mixing legacy RxJS `subscribe` chains with Signals incorrectly; use `toSignal` or `toObservable` from `@angular/core/rxjs-interop` if interop is required.

## Framework Conventions
- **State Management**: Use reactive services driven by Signals and RxJS (`rxjs` ~7.8.0) where asynchronous streams are required.
- **Component Design**: Keep components granular and single-responsibility. Inline templates/styles are acceptable for small components under 100 lines; otherwise, use separate files.