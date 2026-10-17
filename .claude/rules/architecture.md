---
paths:
  - 'src/**/*'
  - 'backend/**/*'
---

# Projektarchitektur: hq-master

## App-Zweck

SPA als Dungeon-Master-Tool für ein D&D-ähnliches Spiel.
Alle Features teilen eine gemeinsame Session-Datenbasis über root-provided Services.

## Verzeichnisstruktur (`src/app/`)

```
core/
  models/         → game-time.model.ts, game-time-span.model.ts
  services/
    game-time/    → GameTimeService: In-Game-Zeitlogik (app-weit)
    storage/      → StorageService (LocalStorage-Abstraktion)
    characters/   → CharactersDbService

features/
  character-tracker/   → Charakterverwaltung & Kampf
    components/        → CharacterTrackerPage, CharacterCard, Dialoge
    models/            → character-info.model.ts, damage-types.model.ts, …
    services/          → combat-calculator.service.ts
      character-creators/ → hero-/monster-character-creator.service.ts

  dungeon-tracker/     → Spielbrett-Overlay mit Token-Positionierung
    components/        → DungeonTrackerPage, DungeonToken
    models/            → dungeon-board-state.model.ts, dungeon-position.model.ts
    services/          → dungeon-board.service.ts (Signal-State + LocalStorage)

  time-tracker/        → In-Game-Zeiterfassung
    components/        → TimeTrackerPage

  card-manager/        → Kartenverwaltung (Deck aus XML + SVG)
    components/        → CardManagerPage, CardDisplay
    models/            → card.model.ts, deck-config.model.ts, deck-state.model.ts
    services/          → card-manager.service.ts, deck-xml-loader.service.ts

  game-session/        → Session starten/beenden, Speichern/Laden als XML
    components/        → GameSessionPage
    models/            → session-meta.model.ts, session-snapshot.model.ts
    services/          → game-session.service.ts, session-xml.service.ts, session-file.service.ts
    xml/               → *.xml-mapper.ts (writeX/readX), xml.util.ts
    utils/             → date-time-local.util.ts (reine Hilfsfunktionen)
    testing/           → session.fixtures.ts (nur für Specs)

shared/
  components/          → Feature-unabhängige UI (z. B. ConfirmationDialog)
```

## Dateinamen

Kebab-Case, die Rolle steht als Punkt-Suffix im Dateinamen. Der Dateiname folgt dem Klassen-/Typnamen ohne Rollenwort.
`ng g s` erzeugt dank `angular.json` automatisch `*.service.ts`.

| Rolle               | Muster                                   | Inhalt               |
| ------------------- | ---------------------------------------- | -------------------- |
| Component           | `character-card.ts` (Angular-21-Default) | `CharacterCard`      |
| Service             | `game-session.service.ts`                | `GameSessionService` |
| Model / Interface   | `session-meta.model.ts`                  | `SessionMeta`        |
| Reine Hilfsfunktion | `xml.util.ts`                            | Funktionen           |
| XML-Mapper          | `meta.xml-mapper.ts`                     | `writeX` / `readX`   |
| Testdaten           | `<feature>/testing/<name>.fixtures.ts`   | Fabrikfunktionen     |
| Test                | `<dateiname>.spec.ts` (gleicher Stamm)   | Vitest-Specs         |

- Keine PascalCase-Dateinamen, keine Models unter `services/`, keine Testdaten neben Produktivcode.

## Kern-Architekturregeln

### Routing

- Alle Feature-Pages werden lazy per `loadComponent` geladen (`app.routes.ts`).
- Kein Preloading, kein NgModule-Routing.

### State & Services

- State lebt in root-provided Services als **private Signals** (`signal()`).
- Öffentlicher Zugriff nur via `.asReadonly()`.
- Features, die gemeinsamen State benötigen, injizieren den Service aus `core/`.
- Persistenz immer über `StorageService` → kein direktes `localStorage` in Features.

### Session-State-Services: reaktive Schnittstelle (verbindlich)

Gilt für **jeden** `providedIn: 'root'`-Service, der Session-Daten verantwortet
(z. B. `CharactersDbService`, `GameTimeService`, `DungeonBoardService`, `CardManagerService`).

**Ziel:** Jede Änderung an einem Session-Zustand ist sofort app-weit sichtbar –
ohne Navigation, Reload oder manuelles Neu-Lesen.

1. **Single Source of Truth:** Jeder verantwortete Zustandsteil liegt in genau einem
   privaten `WritableSignal` (`_name`). Kein zweiter Zustand in Komponenten oder anderen Services.
2. **Zentrale Lese-Schnittstelle:** Pro Zustandsteil ein öffentliches, schreibgeschütztes
   `readonly name: Signal<T> = this._name.asReadonly()`. Abgeleitete Werte als `computed()`.
   - Öffentliche Lesemethoden, die einen **Snapshot** liefern (`readX(): T`), sind verboten.
     Lesen aus dem Storage ist `private` und nur für die Initialisierung erlaubt.
   - Zeitbasierte/rohe Werte (z. B. `Date` der Spielzeit) werden ebenfalls als `Signal`
     exponiert – nicht nur formatierte Ableitungen –, damit andere Services darauf reagieren können.
3. **Initialisierung beim Service-Start:** Das Signal wird einmalig aus dem `StorageService`
   befüllt, mit typisiertem Default-Wert bei fehlenden/ungültigen Daten.
4. **Mutation nur über Service-Methoden:** Fachliche Methoden (`writeX`, `removeX`, `addTime`, …)
   sind der einzige Schreibweg. Jede Mutation läuft durch **eine** private Methode
   (z. B. `persist()` / `updateAndPersist()`), die Signal **und** Storage gemeinsam aktualisiert.
   Signal-Update und Persistenz dürfen nie auseinanderlaufen.
5. **Immutable Updates:** Signals werden nur mit neuen Objekten/Arrays gesetzt
   (`set`/`update` mit Spread/`map`/`filter`, `Date` kopieren). Keine In-Place-Mutation,
   sonst feuern Abhängige nicht.
6. **Konsumenten reagieren, statt zu lesen:**
   - Komponenten binden das Signal direkt im Template oder via `computed()`.
   - Services/Komponenten, die auf Änderungen anderer Verantwortungsbereiche reagieren müssen,
     nutzen `computed()` (abgeleiteter Zustand) bzw. `effect()` (Seiteneffekte, z. B.
     Positionen bei Charakter-Änderung synchronisieren, Schaden-Tick bei Zeitänderung).
   - Einmaliges Kopieren eines Signal-Werts in ein lokales Feld (Constructor, `ngOnInit`) ist verboten.
7. **Klare Verantwortung:** Ein Service schreibt nur seinen eigenen Zustand. Querbezüge
   (z. B. Dungeon-Positionen ↔ Charaktere) werden über das Lese-Signal des anderen Service
   abgebildet, nie durch direktes Schreiben in dessen Storage-Key.
8. **Tests:** Für jeden Session-Service ist zu testen, dass eine Mutation (a) das öffentliche
   Signal aktualisiert und (b) persistiert, sowie dass die Initialisierung aus dem Storage
   inkl. Default-Fallback funktioniert.

**Referenzmuster:**

```typescript
const KEY_ITEMS: string = 'items';

@Injectable({ providedIn: 'root' })
export class ItemsService {
  private readonly storageService: StorageService = inject(StorageService);
  private readonly _items: WritableSignal<Item[]> = signal<Item[]>(this.load());
  readonly items: Signal<Item[]> = this._items.asReadonly();
  readonly count: Signal<number> = computed(() => this._items().length);

  addItem(item: Item): void {
    this.persist([...this._items(), item]);
  }

  private persist(items: Item[]): void {
    this._items.set(items);
    this.storageService.writeToLocalStorage<Item[]>(KEY_ITEMS, items);
  }

  private load(): Item[] {
    return this.storageService.readFromLocalStorage<Item[]>(KEY_ITEMS) ?? [];
  }
}
```

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
- DO NOT expose snapshot getters (`readX(): T`) on session services or copy signal values once into local fields — bind to the service's readonly signal instead.
- Avoid mixing legacy RxJS `subscribe` chains with Signals incorrectly; use `toSignal` or `toObservable` from `@angular/core/rxjs-interop` if interop is required.

## Framework Conventions

- **State Management**: Use reactive services driven by Signals and RxJS (`rxjs` ~7.8.0) where asynchronous streams are required.
- **Component Design**: Keep components granular and single-responsibility. Inline templates/styles are acceptable for small components under 100 lines; otherwise, use separate files.
