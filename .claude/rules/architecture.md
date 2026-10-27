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
  models/         → game-time.model.ts, game-time-span.model.ts,
                    character-info.model.ts, elemental-types.model.ts,
                    character-abilities.model.ts, character-images.model.ts (Bildlisten),
                    damage-types.model.ts (Schadensarten)
    character-names/ → <klasse>-names.model.ts (editierbare Vor-/Nachnamen je Charakterklasse,
                    vom Dateilimit ausgenommen), character-names.model.ts (CHARACTER_NAMES_BY_IMAGE)
  session-state/  → persisted-state.ts (persistedState), session-keys.ts (SESSION_KEYS),
                    tool-state-keys.ts (TOOL_STATE_KEYS: Werkzeug-Zustand außerhalb der Spielesession),
                    session-state-slice.ts (SessionStateSlice), session-slices.ts (SessionSliceData)
    testing/      → describe-persisted-state.ts (Vertragstest für Regel 8, nur für Specs)
  services/
    game-time/    → GameTimeService: In-Game-Zeitlogik (app-weit)
    storage/      → StorageService (LocalStorage-Abstraktion)
    characters/   → CharactersDbService
  testing/        → character.fixtures.ts (Testdaten für Charaktere, nur für Specs)

features/
  dungeon-tracker/     → Spielbrett-Overlay mit Token-Positionierung (Startseite)
    components/        → DungeonTrackerPage (Sidebar, Schnellzugriffsleiste mit „+“ und Zoom, Markierung für Brett und Legende),
                         DungeonBoard (zoombare Spielfläche mit Foto, Raster, Tokens), DungeonToken,
                         GridSettings (Raster-Einstellungen: Zellgröße per Regler oder Zahl, Spalten über Bildbreite),
                         DungeonLegendEntry (Legendeneintrag),
                         CharacterStatus (Leben/Rüstung an Token und Legende, später Statuseffekte),
                         CharacterActionBar (Menüleiste des markierten Charakters an Token und Legende;
                         neue Befehle nur hier ergänzen)
    models/            → dungeon-board-state.model.ts, dungeon-position.model.ts, dungeon-session-state.model.ts,
                         board-token.model.ts, size.model.ts, character-selection.model.ts (Markierung, UI-Zustand)
    services/          → dungeon-board.service.ts (Signal-State + LocalStorage, Charakter-Sync per effect())
    utils/             → token-placement.util.ts (freies Feld für neue Tokens),
                         board-scale.util.ts (Spielflächengröße, Maßstab), grid-style.util.ts (Rasterlinien),
                         grid-fit.util.ts (Zellgröße prüfen, aus Spaltenanzahl berechnen, deutsch formatieren),
                         scroll-into-view.util.ts (nur bei Bedarf ins Bild scrollen)
    testing/           → resize-observer.fixtures.ts (steuerbarer ResizeObserver),
                         scroll-into-view.fixtures.ts (Spy für das in jsdom fehlende scrollIntoView), nur für Specs

  dungeon-builder/     → Dungeon-Layouts bauen, als XML speichern, als JPEG exportieren (kein Session-Zustand)
    components/        → DungeonBuilderPage (stellt BuilderUiService bereit, Tastenkürzel, Ziehen aus der Bibliothek),
                         BuilderFilePanel (Neu, Laden, Als XML speichern, Als JPEG exportieren),
                         LayoutSettings (Layoutname, Plangröße), ElementLibrary + LibraryEntry (Bibliothek),
                         BuilderToolStrip (Werkzeuge, Rückgängig/Wiederholen, Zoom), LayoutPlan (SVG-Plan,
                         Raster, Markierung), ElementActionBar (Drehen, Löschen am markierten Element)
    gestures/          → *.gesture.ts: unveränderliche Zeiger-Gesten mit Vorschau (Pinsel, Rechteck, Wand,
                         Verschieben, Platzieren); schreiben beim Loslassen einmal über LayoutCommands
    models/            → dungeon-layout.model.ts, element-catalog.model.ts, grid.model.ts (TILE_UNITS = 64),
                         render-step.model.ts (Zeichenschritte für Plan und JPEG), builder-tool.model.ts,
                         plan-gesture.model.ts, element-selection.model.ts, library-entry.model.ts, rotation.model.ts
    services/          → dungeon-layout.service.ts (Layout per persistedState mit TOOL_STATE_KEYS, Rückgängig-Verlauf),
                         element-catalog.service.ts (Katalog aus public/dungeon-builder/catalog.xml),
                         layout-xml.service.ts, layout-image.service.ts (JPEG über Canvas),
                         builder-ui.service.ts (UI-Zustand der Seite, nicht root), plan-pointer.service.ts (Zeiger → Gesten)
    utils/             → reine Geometrie und Layout-Änderungen (grid-geometry, piece-shape, piece-edit, floor-edit,
                         wall-geometry, door-geometry, layout-edit, layout-resize, hit-test, element-placement),
                         layout-render/element-steps (Zeichenschritte), canvas-draw, layout-history, layout-codec,
                         plan-scale, builder-shortcut, file-name
    xml/               → catalog.xml-mapper.ts (readCatalog), layout.xml-mapper.ts (writeLayout/readLayout)
    testing/           → builder.fixtures.ts (TEST_CATALOG, createTestLayout), builder-services.fixtures.ts,
                         builder-file-panel.fixtures.ts, layout-plan.fixtures.ts, canvas.fixtures.ts (nur für Specs)

  time-tracker/        → In-Game-Zeiterfassung
    components/        → TimeTrackerPage

  card-manager/        → Kartenverwaltung (Deck aus XML + SVG)
    components/        → CardManagerPage, CardDisplay
    models/            → card.model.ts, deck-config.model.ts, deck-state.model.ts
    services/          → card-manager.service.ts, deck-xml-loader.service.ts
    testing/           → card-manager-page.fixtures.ts (gemockter Service, nur für Specs)

  game-session/        → Session starten/beenden, Speichern/Laden als XML
    components/        → GameSessionPage
    models/            → session-meta.model.ts, session-snapshot.model.ts
    services/          → game-session.service.ts, session-xml.service.ts
    xml/               → *.xml-mapper.ts (writeX/readX)
    utils/             → date-time-local.util.ts (reine Hilfsfunktionen)
    testing/           → session.fixtures.ts, game-session-page.fixtures.ts (nur für Specs)

shared/
  components/          → Feature-unabhängige UI (z. B. ConfirmationDialog, CharacterEditorDialog,
                         CollapsibleSidebar (einklappbare `.general-sidebar`, UI-Zustand ohne Speicherung),
                         DamageTakenDialog, BoardZoomControl (senkrechter Zoom-Regler für zoombare Spielflächen,
                         z. B. in der Schnellzugriffsleiste `.general-quick-access`))
  directives/          → board-pan.ts (BoardPan: Ausschnitt eines Scroll-Containers per Ziehen verschieben)
  models/              → confirmation-dialog-data.model.ts (Texte der Rückfrage),
                         damage-dialog-data.model.ts (Titel des Schadensauswahl-Dialogs)
  services/            → character-editor.service.ts (öffnet den Charakter-Editor systemweit),
                         character-damage.service.ts (Schadensauswahl → applyDamage → Session),
                         file-transfer.service.ts (Dateien herunterladen und lesen),
                         confirmation.service.ts (Rückfrage über den ConfirmationDialog als Promise<boolean>)
  utils/               → new-character.util.ts (Startwerte für neue Charaktere),
                         random-character.util.ts (Zufallscharakter, Name passend zur Bildklasse),
                         damage.util.ts (reine Schadensberechnung),
                         xml.util.ts (XML lesen/schreiben, `requireChild` mit Dateiart in der Fehlermeldung)
  testing/             → feature-übergreifende Spec-Helfer (z. B. click-button.ts,
                         character-editor-dialog.fixtures.ts)
```

## E2E-Tests (`e2e/`, Projekt-Root)

Playwright-Smoke-Tests (`npm run e2e`) liegen unter `e2e/` – **nicht** unter `src/`, damit sie weder
von Vitest noch vom App-Build erfasst werden. `playwright.config.ts` (Root) startet `ng serve` auf Port 4321.
Nur wenige, stabile Abläufe über echte Browser-Interaktion (Routing, Reload-Persistenz, Drag & Drop,
Datei-Export/-Import); Logik wird weiterhin in Vitest-Specs getestet.
Gemeinsame Schritte (z. B. `createCharacter()` über „Neuer Charakter“) liegen unter `e2e/support/`
und heißen nicht `*.spec.ts`, damit Playwright sie nicht als Tests ausführt.

## Dateinamen

Kebab-Case, die Rolle steht als Punkt-Suffix im Dateinamen. Der Dateiname folgt dem Klassen-/Typnamen ohne Rollenwort.
`ng g s` erzeugt dank `angular.json` automatisch `*.service.ts`.

| Rolle               | Muster                                                                | Inhalt               |
| ------------------- | --------------------------------------------------------------------- | -------------------- |
| Component           | `dungeon-token.ts` (Angular-21-Default)                               | `DungeonToken`       |
| Directive           | `directives/board-pan.ts` (Angular-21-Default)                        | `BoardPan`           |
| Service             | `game-session.service.ts`                                             | `GameSessionService` |
| Model / Interface   | `session-meta.model.ts`                                               | `SessionMeta`        |
| Reine Hilfsfunktion | `xml.util.ts`                                                         | Funktionen           |
| XML-Mapper          | `meta.xml-mapper.ts`                                                  | `writeX` / `readX`   |
| Geste               | `gestures/wall.gesture.ts`                                            | `WallGesture`        |
| Testdaten           | `<feature>/testing/<name>.fixtures.ts`, Core-Modelle: `core/testing/` | Fabrikfunktionen     |
| E2E-Test            | `e2e/<szenario>.spec.ts`                                              | Playwright-Tests     |
| Test                | `<dateiname>.spec.ts` (gleicher Stamm)                                | Vitest-Specs         |

- Keine PascalCase-Dateinamen, keine Models unter `services/`, keine Testdaten neben Produktivcode.
- Komponentenklassen ohne `Component`-Suffix (`confirmation-dialog.ts` → `ConfirmationDialog`).
- Service-Klassen = Dateistamm in PascalCase + `Service` (`game-time.service.ts` → `GameTimeService`, nicht `GametimeService`).
- Reine Funktionen nicht in Komponenten- oder Service-Dateien, sondern in eine eigene `*.util.ts` mit Spec gleichen Stamms.
- Ausnahme Dateilimit: Würde eine Spec 150 Zeilen überschreiten, darf sie nach Aspekt aufgeteilt werden:
  `<stamm>-<aspekt>.<rolle>.spec.ts` neben der Basis-Spec `<stamm>.<rolle>.spec.ts`
  (z. B. `dungeon-board-sync.service.spec.ts` zu `dungeon-board.service.ts`). Der oberste
  `describe` nennt Klasse und Aspekt (`'DungeonBoardService – character sync'`).

## Kern-Architekturregeln

### Routing

- Alle Feature-Pages werden lazy per `loadComponent` geladen (`app.routes.ts`).
- Kein Preloading, kein NgModule-Routing.

### State & Services

- State lebt in root-provided Services als **private Signals** (`signal()`).
- Öffentlicher Zugriff nur via `.asReadonly()`.
- Features, die gemeinsamen State benötigen, injizieren den Service aus `core/`.
- **Code unter `shared/` importiert nichts aus `features/`. Modelle, die außer ihrem Feature auch
  `shared/` oder andere Features nutzen, liegen in `core/models/`.**
- Persistenz immer über `StorageService` → kein direktes `localStorage` in Features.

### Session-State-Services: reaktive Schnittstelle (verbindlich)

Gilt für **jeden** `providedIn: 'root'`-Service, der Session-Daten verantwortet
(z. B. `CharactersDbService`, `GameTimeService`, `DungeonBoardService`, `CardManagerService`).

**Ziel:** Jede Änderung an einem Session-Zustand ist sofort app-weit sichtbar –
ohne Navigation, Reload oder manuelles Neu-Lesen.

1. **Single Source of Truth:** Jeder verantwortete Zustandsteil liegt in genau einem
   privaten `PersistedState<T>` (`_name = persistedState(SESSION_KEYS.x, …)`). Kein zweiter
   Zustand in Komponenten oder anderen Services.
2. **Zentrale Lese-Schnittstelle:** Pro Zustandsteil ein öffentliches, schreibgeschütztes
   `readonly name: Signal<T> = this._name.value`. Abgeleitete Werte als `computed()`.
   - Öffentliche Lesemethoden, die einen **Snapshot** liefern (`readX(): T`), sind verboten.
     Lesen aus dem Storage ist `private` und nur für die Initialisierung erlaubt.
   - Zeitbasierte/rohe Werte (z. B. `Date` der Spielzeit) werden ebenfalls als `Signal`
     exponiert – nicht nur formatierte Ableitungen –, damit andere Services darauf reagieren können.
3. **Initialisierung beim Service-Start:** `persistedState(key, fallback, codec?)` liest den
   Storage einmalig; bei fehlenden/ungültigen Daten greift `fallback()`. Werte, die nicht
   1:1 als JSON gespeichert werden (z. B. `Date`), bekommen einen `StorageCodec`.
   Keine eigenen `load*()`-Methoden, keine lokalen `KEY_*`-Konstanten – Keys stehen nur in `SESSION_KEYS`
   (bzw. `TOOL_STATE_KEYS` für Werkzeug-Zustand, siehe unten).
4. **Mutation nur über Service-Methoden:** Fachliche Methoden (`writeX`, `removeX`, `addTime`, …)
   sind der einzige Schreibweg. Sie schreiben ausschließlich über `set()`/`update()` des
   `PersistedState`, die Signal **und** Storage gemeinsam aktualisieren. Keine eigenen
   `persist*()`-Methoden. Den eigenen Zustand in Mutationen über `current()`/`update()` lesen
   (untracked), damit Aufrufe aus `effect()` keine Endlosschleife auslösen.
5. **Immutable Updates:** `set`/`update` nur mit neuen Objekten/Arrays
   (Spread/`map`/`filter`, `Date` kopieren). Keine In-Place-Mutation, sonst feuern Abhängige nicht.
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
   inkl. Default-Fallback funktioniert. Dafür je Zustandsteil `describePersistedState(…)`
   aus `core/session-state/testing/` verwenden.
9. **Session-Vertrag:** Jeder Service, der zur Spielesession gehört, implementiert
   `SessionStateSlice<T>` (`sessionState`, `restore(state)`, `reset()`) und hat einen Eintrag in
   `SessionSliceData`. Der `GameSessionService` liest und ersetzt fremden Zustand nur über
   diesen Vertrag. Der Slice exponiert seine `PersistedState`s nicht.

**Referenzmuster:**

```typescript
@Injectable({ providedIn: 'root' })
export class ItemsService implements SessionStateSlice<Item[]> {
  private readonly _items: PersistedState<Item[]> = persistedState<Item[]>(
    SESSION_KEYS.items,
    () => [],
  );
  readonly items: Signal<Item[]> = this._items.value;
  readonly count: Signal<number> = computed(() => this.items().length);
  readonly sessionState: Signal<Item[]> = this.items;

  addItem(item: Item): void {
    this._items.update((items) => [...items, item]);
  }

  restore(items: Item[]): void {
    this._items.set([...items]);
  }

  reset(): void {
    this._items.set([]);
  }
}
```

Neuer Session-Zustand: Key in `SESSION_KEYS`, Feld in `SessionSliceData`, Service in die
Slice-Map des `GameSessionService`; der Compiler meldet dann Snapshot und XML-Mapping.

**Werkzeug-Zustand außerhalb der Spielesession** (z. B. das Layout des Dungeon Builders) nutzt
`persistedState` mit einem Key aus `TOOL_STATE_KEYS` und gilt für die Regeln 1–8. Er ist **kein**
`SessionStateSlice`, steht nicht in `SessionSliceData` und nicht in der SaveSession; „Session starten“
lässt ihn unverändert.

### Dependency Injection

- Ausschließlich `inject()` – keine Konstruktor-Injection.

### Signale & RxJS

- Primär Signals (`signal`, `computed`, `effect`).
- RxJS nur, wo asynchrone Streams unumgänglich sind.
- Interop: `toSignal()` / `toObservable()` aus `@angular/core/rxjs-interop`.

### Komponenten

- Standalone-first, kein `NgModule`.
- Signal-Inputs/Outputs statt `@Input()`/`@Output()`.
- Template/Styles inline, wenn < 100 Zeilen; sonst separate `.html`/`.css`.
- Styling: reines CSS mit semantischen Klassen je Komponente; Farben, Abstände und Typografie
  nur über die Tokens aus `src/styles/tokens.css` (`var(--…)`).
- Feature-übergreifende Bausteine (z. B. `.general-sidebar`, `.general-dialog`, `.general-quick-access`) liegen global unter `src/styles/components/`
  und werden in `src/styles.css` per `@import … layer(components)` eingebunden; `tokens.css` enthält nur Tokens.
- Shared-Dialoge nutzen den dunklen Look über `host: { class: 'general-dialog' }` und die Element-Klassen
  `general-dialog__title`, `__cancel`, `__confirm`. Material setzt den Dialog-Host (ohne Layer) auf
  `display: contents`; `.general-dialog` hält deshalb `display: block !important`, damit die Fläche eine Box hat.

### Dateigrößenlimit

- Max. **150 Zeilen** pro Datei. Bei Überschreitung refaktorieren.
- Ausnahme: Namenslisten unter `core/models/character-names/` (reine Daten, je 50 Vor- und Nachnamen).

## Neue Features hinzufügen

1. Neuen Ordner unter `features/<name>/` anlegen mit `components/`, `models/`, `services/`.
2. Route in `app.routes.ts` als lazy `loadComponent` registrieren.
3. App-weite Services (Storage, GameTime) aus `core/` injizieren, nicht duplizieren.
4. Session-Zustand über `persistedState` mit Key aus `SESSION_KEYS` und als `SessionStateSlice` (siehe oben).

## Anti-Patterns to Avoid

- NEVER use legacy `NgModule` declarations.
- DO NOT use constructor-based dependency injection.
- DO NOT use traditional Lifecycle Hooks (`ngOnInit`, `ngOnChanges`) when Signal-based alternatives (`effect`, computed properties, or template signals) can achieve the same result.
- DO NOT expose snapshot getters (`readX(): T`) on session services or copy signal values once into local fields — bind to the service's readonly signal instead.
- DO NOT hold session state in a plain `signal()` with manual `StorageService` reads/writes (`load()`/`persist()`) — use `persistedState(SESSION_KEYS.x, …)`.
- Avoid mixing legacy RxJS `subscribe` chains with Signals incorrectly; use `toSignal` or `toObservable` from `@angular/core/rxjs-interop` if interop is required.

## Framework Conventions

- **State Management**: Use reactive services driven by Signals and RxJS (`rxjs` ~7.8.0) where asynchronous streams are required.
- **Component Design**: Keep components granular and single-responsibility. Inline templates/styles are acceptable for small components under 100 lines; otherwise, use separate files.
