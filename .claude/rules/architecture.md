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
                    damage-types.model.ts (Schadensarten),
                    character-condition.model.ts (ConditionId, ConditionTemplate, ActiveCondition),
                    condition-templates.model.ts (CONDITION_TEMPLATES: Standardwerte und Symbole der Zustände),
                    condition-event.model.ts (ConditionEvent: Schaden/Ablauf eines Zustands),
                    game-log-entry.model.ts (GameLogEntry, GameLogEntryType: Ereignis-Log der Session),
                    card.model.ts, deck-config.model.ts, deck-catalog-entry.model.ts (`DeckCatalogEntry`: Eintrag der Deckliste),
                    deck-state.model.ts (Deck-Instanzen `DeckInstance`, die Hand
                    als `HandCard[]`, `AssignedCard`, `InventoryCard` (eigene Liste, Boni nur aus Slots) und `CardRef` mit `deckId`; in core, weil der Charakter-Editor die
                    Ausrüstung bearbeitet),
                    equipment.model.ts (ModifiableStat, StatModifier, EquipmentSlot, CardSlot, Beschriftungen),
                    card-location.model.ts (`CardLocation`: Ort einer Karte und Ziel einer Bewegung – Hand,
                    Nachziehstapel (als Ziel mit `top` oben auflegen), Ablagestapel, Bank, Slot, Inventar; neue Orte als weitere `kind`)
    character-names/ → <klasse>-names.model.ts (editierbare Vor-/Nachnamen je Charakterklasse,
                    vom Dateilimit ausgenommen), character-names.model.ts (CHARACTER_NAMES_BY_IMAGE)
  session-state/  → persisted-state.ts (persistedState), session-keys.ts (SESSION_KEYS),
                    tool-state-keys.ts (TOOL_STATE_KEYS: Werkzeug-Zustand außerhalb der Spielesession),
                    string-list-codec.util.ts (STRING_LIST_CODEC: gespeicherte ID-Listen prüfen),
                    session-state-slice.ts (SessionStateSlice), session-slices.ts (SessionSliceData)
    testing/      → describe-persisted-state.ts (Vertragstest für Regel 8, nur für Specs)
  services/
    game-time/    → GameTimeService: In-Game-Zeitlogik (app-weit); `addTime`/`setGameTime` loggen den Zeitschritt,
                    `startAt` (Session-Start), `restore` und `reset` nicht
    game-log/     → GameLogService: Ereignis-Log der Session (höchstens 1000 Einträge, Schreiben nur über `append()`),
                    game-log-codec.util.ts (GAME_LOG_CODEC: ungültige Einträge verwerfen),
                    game-log-text.util.ts (Anzeigetexte der Einträge, `formatClock`; in core, weil der
                    GameTimeService sie braucht)
    storage/      → StorageService (LocalStorage-Abstraktion)
    characters/   → CharactersDbService (`markMoved`, `clearMovedThisRound` für `movedThisRound`), characters-codec.util.ts (CHARACTERS_CODEC: ältere Charaktere ohne
                    Zustände, `movedThisRound` bzw. Maximalwerte ergänzen, ungültige Zustände verwerfen),
                    character-limits.util.ts (`withinLimits`: Leben/Rüstung auf 0…`maxHealth`/`maxArmor` begrenzen,
                    `readLimit`: fehlendes/ungültiges Maximum → aktueller Wert; für Codec, XML und Editor;
                    `withinLimits(c, modifiers)` begrenzt auf das wirksame Maximum, `normalizedLimits` für Codec/XML
                    nur nach unten, `withAddedEquipment`)
    card-deck/    → CardManagerService (beliebig viele Deck-Instanzen, `hand`, `assigned`, `inventory`),
                    DeckXmlLoaderService, DeckCatalogService (Deckliste `decks/index.json` einmal laden: `entries`,
                    `isLoading`, `loadError`; nicht Teil der Session), deck-catalog.util.ts (Inhalt der Deckliste prüfen),
                    deck-state.util.ts (Instanz finden/ändern, `isSameRef`, `withDiscarded` in den
                    Ablagestapel der eigenen Instanz, `withoutDanglingRefs`), deck-instance.util.ts (hinzufügen mit Durchnummerieren,
                    umbenennen, entfernen, verschieben, mischen, zurücksetzen), card-location.util.ts (`locateCard`,
                    `findCard` per `CardRef`, `ownerOf`), card-move.util.ts (`moveCard`: einzige Kartenbewegung von jedem Ort an
                    jedes Ziel, `discardOwned` für Slot- und Inventarkarten; neue Bewegungen nur hierüber), deck-draw.util.ts (ziehen in die Hand), moved-cards.util.ts (`movedCards`: bewegte Karten zwischen zwei Zuständen,
                    `isRevertible`, `revertOrder` für Rückgängig), deck-assignment.util.ts (Slot-Belegung, verwaiste Slot- und Inventarkarten), shuffle.util.ts, deck-state-codec.util.ts (DECK_STATE_CODEC),
                    deck-state-migration.util.ts (älterer Zustand mit einem Deck → eine Instanz; Codec und XML;
                    eine alte `activeCard` wird einzige Handkarte),
                    equipment-card-xml.util.ts (Slot und `<modifier>` lesen/schreiben für Deck-XML und Spielstand)
    equipment/    → effective-stats.util.ts (`effectiveStats`: einzige Berechnung der wirksamen Werte),
                    equipment-text.util.ts, equipment-slots.util.ts, equipment-log.util.ts,
                    equipment-transfer.util.ts (Werte und Log-Einträge von Abgebendem und Empfänger),
                    inventory-log.util.ts (Log-Einträge in und aus Inventaren, ein Eintrag je Bewegung),
                    EquipmentService (Zuweisen jeder Karte per `CardRef`, belegter Slot → Ablage oder Inventar,
                    Ablegen inkl. Leben/Rüstung und Log; `moveCard`: jede Bewegung mit Bonusverlust und Log, auch
                    Inventar; kein eigener Zustand),
                    EquipmentSyncService (effect(): Slot- und Inventarkarten fehlender Charaktere ablegen, Leben/Rüstung auf das
                    wirksame Maximum begrenzen; app-weit in app.config.ts gestartet)
  testing/        → character.fixtures.ts (Testdaten für Charaktere), deck.fixtures.ts (Deck, Ausrüstungskarten),
                    card-move.fixtures.ts (je Ort eine Karte in zwei Deck-Instanzen inkl. Inventar, Bewegungsmatrix),
                    condition.fixtures.ts (Test-Zustände, Spielzeit
                    ab 12:00:00), game-log.fixtures.ts (Log-Einträge), nur für Specs

features/
  dungeon-tracker/     → Spielbrett-Overlay mit Token-Positionierung (Startseite)
    components/        → DungeonTrackerPage (Sidebar, `QuickAccessBar` mit „+“, Runden-Menü und Zoom, Markierung für Brett und Legende),
                         RoundMenu (⏳ in der `QuickAccessBar`, Flyout per `cdkConnectedOverlay` mit „Neue Runde“; UI-Zustand ohne Speicherung),
                         DungeonBoard (zoombare Spielfläche mit Foto, Raster, Tokens; Feldwechsel per Drag → `markMoved`), DungeonToken,
                         GridSettings (Raster-Einstellungen: Schalter „Nullpunkt verschieben“, Zellgröße per Regler
                         oder Zahl, Token-Größe, Spalten über Bildbreite), GridSlider (Raster-Regler mit „−“/„+“ in feinster Stufe),
                         GridOriginMarker (ziehbarer Nullpunkt-Marker, nur im Modus „Nullpunkt verschieben“),
                         DungeonLegendEntry (Legendeneintrag),
                         CharacterStatus (Leben/Rüstung als `aktuell/max` an Token und Legende, dahinter `CharacterCards`),
                         CharacterCards (ausgerüstete Karten als kleine Bilder und Inventaranzahl; Klick öffnet den Card Viewer),
                         DeadMarker (rotes Kreuz „Tot“ bei 0 Leben über Porträt und Legendenbild, lässt Klicks durch),
                         CharacterConditions (Zustände mit Restdauer: `token` Symbole am Porträt, „+n“ ab 4,
                         `selected` mit Name unter dem markierten Token, `legend` zweite Zeile der Legende),
                         CharacterActionBar (Menüleiste des markierten Charakters an Token und Legende;
                         neue Befehle nur hier ergänzen)
    models/            → dungeon-board-state.model.ts, dungeon-position.model.ts, dungeon-session-state.model.ts,
                         board-token.model.ts, size.model.ts, point.model.ts (Nullpunkt, Zugstrecke),
                         character-selection.model.ts (Markierung, UI-Zustand)
    services/          → dungeon-board.service.ts (Signal-State + LocalStorage, Charakter-Sync per effect())
    utils/             → token-placement.util.ts (freies Feld für neue Tokens),
                         board-scale.util.ts (Spielflächengröße, Maßstab), grid-style.util.ts (Rasterlinien),
                         grid-fit.util.ts (Zellgröße prüfen, aus Spaltenanzahl berechnen, deutsch formatieren),
                         grid-step.util.ts (±-Schritt runden und begrenzen, Bereiche, Nullpunkt und Prozent formatieren),
                         board-state-codec.util.ts (BOARD_STATE_CODEC: ältere Spielbrett-Zustände mit Standardwerten ergänzen),
                         grid-origin.util.ts (Zugstrecke des Markers → Nullpunkt, Feld unter der Porträtmitte),
                         scroll-into-view.util.ts (nur bei Bedarf ins Bild scrollen)
    testing/           → resize-observer.fixtures.ts (steuerbarer ResizeObserver),
                         drag-end.fixtures.ts (Stub für das Ende eines CDK-Drags), nur für Specs

  dungeon-builder/     → Dungeon-Layouts bauen, als XML speichern, als JPEG exportieren (kein Session-Zustand)
    components/        → DungeonBuilderPage (stellt BuilderUiService bereit, Tastenkürzel, Ziehen aus der Bibliothek),
                         BuilderFilePanel (Neu, Laden, Als XML speichern, Als JPEG exportieren),
                         LayoutSettings (Layoutname, Plangröße), ElementLibrary (Bibliothek: Suche per `SearchField`,
                         „Zuletzt verwendet“, Gruppen), LibraryGroupSection (aufklappbare Gruppe mit Einträgen,
                         Tipp und Ziehen), LibraryEntry (Inhalt eines Eintrags),
                         BuilderToolStrip (Werkzeuge, Rückgängig/Wiederholen, Zoom in einer `QuickAccessBar`), LayoutPlan (SVG-Plan,
                         Raster, Markierung), ElementActionBar (Drehen, Löschen am markierten Element)
    gestures/          → *.gesture.ts: unveränderliche Zeiger-Gesten mit Vorschau (Pinsel, Rechteck, Wand,
                         Verschieben, Platzieren); schreiben beim Loslassen einmal über LayoutCommands
    models/            → dungeon-layout.model.ts, element-catalog.model.ts, grid.model.ts (TILE_UNITS = 64),
                         render-step.model.ts (Zeichenschritte für Plan und JPEG), builder-tool.model.ts,
                         plan-gesture.model.ts, element-selection.model.ts, library-entry.model.ts, rotation.model.ts
    services/          → dungeon-layout.service.ts (Layout per persistedState mit TOOL_STATE_KEYS, Rückgängig-Verlauf),
                         element-catalog.service.ts (Katalog aus public/dungeon-builder/catalog.xml),
                         layout-xml.service.ts, layout-image.service.ts (JPEG über Canvas),
                         builder-ui.service.ts (UI-Zustand der Seite, nicht root), plan-pointer.service.ts (Zeiger → Gesten),
                         recent-elements.service.ts („Zuletzt verwendet“ per persistedState mit TOOL_STATE_KEYS)
    utils/             → reine Geometrie und Layout-Änderungen (grid-geometry, piece-shape, piece-edit, floor-edit,
                         wall-geometry, door-geometry, layout-edit, layout-resize, hit-test, element-placement),
                         layout-render/element-steps (Zeichenschritte), canvas-draw, layout-history, layout-codec,
                         plan-scale, builder-shortcut, file-name, library-groups (Gruppen der Bibliothek aus dem Katalog),
                         library-search (Bibliothek nach Namen filtern, nutzt `text-search.util.ts`)
    xml/               → catalog.xml-mapper.ts (readCatalog), layout.xml-mapper.ts (writeLayout/readLayout)
    testing/           → builder.fixtures.ts (TEST_CATALOG, createTestLayout), builder-services.fixtures.ts,
                         builder-file-panel.fixtures.ts, layout-plan.fixtures.ts, canvas.fixtures.ts,
                         element-library.fixtures.ts (nur für Specs)

  time-tracker/        → In-Game-Zeiterfassung
    components/        → TimeTrackerPage (Sidebar „Zeit vorrücken“ mit „Neue Runde“ über `RoundService`, rechts Spielzeit),
                         ActiveConditionsList (aktive Zustände aller Charaktere, nur Anzeige),
                         GameLogList (Ereignis-Log: Filter-Chips, „Log leeren“ mit Rückfrage, scrollt in sich)
    models/            → active-condition-row.model.ts, game-log-row.model.ts (GameLogFilter, GameLogRow),
                         time-step.model.ts (TIME_STEPS: Zeit-Buttons mit Beschriftung, Namen und Rasterbreite)
    utils/             → active-condition-rows.util.ts (Zeilen sortiert nach nächstem Wirkmoment, dann Restdauer),
                         game-log-rows.util.ts (Spielzeit absteigend, Datums-Trennzeile, Filter, Symbol je Eintrag)

  card-manager/        → Kartenverwaltung: beliebig viele Decks (XML + SVG) auf dem Spieltisch
    components/        → CardManagerPage (`feature-page`, Spieltisch mit Deck-Reihen, höchstens eine aufgeklappt als
                         UI-Zustand; Klick in der Deckliste klappt auf und scrollt), DmHand („Hand des Dungeon Masters“
                         über „Ausgerüstet“, Klick öffnet den Card Viewer), DeckRow (kompakte Reihe: Name,
                         Nachziehstapel zieht per Klick in die Hand und öffnet den Viewer, oberste Ablagekarte öffnet den
                         Viewer, Bank-Anzahl, ⋮), DeckPiles (aufgeklappte Stapel und Bank; Klick auf eine Karte öffnet den
                         Viewer, sonst keine Klickflächen), DeckMenu (`MatMenu`: Mischen,
                         Zurücksetzen, Umbenennen, Nach oben/unten, Entfernen), DeckList (Seitenleiste „Decks“: Suche und Liste; „Deck hinzufügen“ steht in der Gruppe
                         „Deck Management“ darüber),
                         AddDeckForm (Deck aus der Auswahlliste der Deckliste als neue Instanz laden), RenameDeckDialog, EquippedCards (gemeinsamer
                         Bereich „Ausgerüstet“ über dem Spieltisch mit Besitzer und Herkunftsdeck, höchstens zwei
                         Reihen sichtbar, weitere scrollen in sich; ohne Karten ausgeblendet; Klick öffnet den Viewer;
                         Hand und Ausgerüstet nutzen `.card-strip` aus `src/styles/components/card-strip.css`),
                         InventoryCards (Bereich „Inventar“ unter „Ausgerüstet“: Karten aller Charaktere gruppiert,
                         Höhe begrenzt, ohne Karten ausgeblendet; Klick öffnet den Viewer)
    services/          → deck-actions.service.ts (Umbenennen per Dialog, Entfernen nach Rückfrage);
                         Deck-Zustand und Loader liegen in core/services/card-deck/
    testing/           → card-manager-page.fixtures.ts (echter Deck-Zustand, gemockter Loader, Deckliste und Zuweisungsablauf;
                         nur für Specs)

  game-session/        → Session starten/beenden, Speichern/Laden als XML
    components/        → GameSessionPage
    models/            → session-meta.model.ts, session-snapshot.model.ts
    services/          → game-session.service.ts, session-xml.service.ts
    xml/               → *.xml-mapper.ts (writeX/readX); game-log.xml-mapper.ts: fehlendes `<gameLog>` → leeres Log;
                         card.xml-mapper.ts (Karten), deck.xml-mapper.ts (`<cardDeck>` mit `<deck>`-Instanzen, Hand
                         und Zuweisungen; älteres `<config>` direkt in `<cardDeck>` → eine Instanz),
                         hand.xml-mapper.ts (`<hand>`; älteres `<activeCard>` → einzige Handkarte),
                         inventory.xml-mapper.ts (`<inventory>`; fehlend → leer),
                         deck-instance.xml-mapper.ts (eine Instanz), assigned-cards.xml-mapper.ts (fehlendes `<assigned>`
                         → leer)
    utils/             → date-time-local.util.ts (reine Hilfsfunktionen)
    testing/           → session.fixtures.ts, game-session-page.fixtures.ts (nur für Specs)

shared/
  components/          → Feature-unabhängige UI (z. B. ConfirmationDialog, CharacterEditorDialog,
                         CollapsibleSidebar (einklappbare `.general-sidebar`, UI-Zustand ohne Speicherung),
                         SidebarSection (auf-/zuklappbare Gruppe der Seitenleiste, `sectionId` = `<feature>.<abschnitt>`),
                         SidebarSectionToggleAll (alle Gruppen eines Features auf-/zuklappen, in `.general-sidebar__header`),
                         CharacterConditionsEditor (Abschnitt „Zustände“ im Editor, Felder hängen per
                         `viewProviders` am Formular des Editors),
                         CharacterStatsEditor (Zahlenwerte im Editor mit Bonus `+2 = 6`, ebenfalls per `viewProviders`),
                         CharacterEquipmentEditor (Abschnitt „Ausrüstung“: Slots; Bild/Name öffnen den Card Viewer im
                         Entwurf, Ablegen erst mit „Übernehmen“),
                         CharacterInventoryEditor (Abschnitt „Inventar“ unter „Ausrüstung“, öffnet den Viewer im Entwurf),
                         CardViewer (einmal im App-Template: Overlay mit Backdrop über allem, auch über Dialogen;
                         Ort per `viewerContext` bei jeder Änderung neu, schließt bei verschwundener Karte),
                         CardViewerPanel (Inhalt des Viewers: Deck/Ort, Karte mit Blättern am Ort nur `live`, `CardActionMenu`;
                         Aktionen `live` über `CardUndoService.track`, danach nachrückende Karte; kennt keine einzelne Aktion),
                         CardActionMenu (Menüeinträge mit Trennlinien, ausgegraute mit Tooltip, Untermenüs mit „Zurück“),
                         SlotOccupiedDialog (belegter Slot: Inventar / Ablagestapel / Abbrechen),
                         CardDisplay (eine Karte: Vorder-/Rückseite, Slot, Modifikatoren, „Im Besitz von“, Herkunftsdeck),
                         SearchField (Suchfeld mit `label`, × und Escape leeren es; Builder-Bibliothek, Deckliste),
                         DamageTakenDialog, BoardZoomControl (senkrechter Zoom-Regler für zoombare Spielflächen,
                         z. B. in der `QuickAccessBar`),
                         QuickAccessBar (Schnellzugriffsleiste: senkrechter Streifen links neben einer Spielfläche,
                         reiner Container per `<ng-content>`), QuickAccessDivider (Trenner, `role="separator"`),
                         QuickAccessButton (`button[appQuickAccessButton]`: `label`, `title`, `icon`,
                         `variant` `primary`/`toggle`, `active` → `aria-pressed` nur bei Umschaltern mit Zustand),
                         MainNav (Hauptnavigation im Header: Linkleiste, schmal Menü-Button mit Seitenname;
                         main-nav-items.ts mit MAIN_NAV_ITEMS – neue Seiten nur dort ergänzen,
                         active-nav-item.util.ts))
  card-actions/        → Kartenaktionen des Card Viewers: provide-card-actions.ts (`provideCardActions(...)`:
                         Multi-Provider auf `CARD_ACTIONS`; neue Aktionen nur so registrieren),
                         *.card-action.ts (move: Hand/Ablage/Nachziehstapel/Bank über `EquipmentService.moveCard`;
                         inkl. „Oben auf den Nachziehstapel legen“; assign: „Einem Charakter anlegen“ als Untermenü (Charakter → ggf. Hand);
                         inventory: „ins Inventar geben“ als Untermenü, „Ins Inventar legen“;
                         draft-discard, draft-inventory: Ablegen, Ins Inventar legen, Anlegen im Entwurf des Editors),
                         default-card-actions.ts (`provideDefaultCardActions()`, registriert in app.config.ts)
  directives/          → board-pan.ts (BoardPan: Ausschnitt eines Scroll-Containers per Ziehen verschieben),
                         repeat-on-hold.ts (RepeatOnHold: Schritt-Button wiederholt beim Gedrückthalten)
  models/              → confirmation-dialog-data.model.ts (Texte der Rückfrage),
                         card-action.model.ts (`CardAction` = `CardActionInfo` + `run` oder `choices` (Untermenü aus `CardChoice`), `CardActionContext`, Modus `live`/`draft`, `CardDraft` mit
                         vorgemerkten `DraftMove`s,
                         `CardViewerContext`, `CARD_ACTIONS`),
                         slot-occupied.model.ts (Daten/Ergebnis der Rückfrage bei belegtem Slot),
                         damage-dialog-data.model.ts (Titel des Schadensauswahl-Dialogs)
  services/            → character-editor.service.ts (öffnet den Charakter-Editor systemweit),
                         card-viewer.service.ts (CardViewerService: `open(ref, context?)`, `close()`, `viewed`;
                         UI-Zustand ohne Speicherung),
                         card-assignment.service.ts (`assignTo` mit Rückfrage bei belegtem Slot, Inventarziele),
                         card-undo.service.ts (CardUndoService: Rückgängig der letzten Aktion `live` per MatSnackBar, 5 s;
                         UI-Zustand ohne Speicherung),
                         character-card-draft.service.ts (je Editor bereitgestellt: Kartenentwurf, `apply()` beim Übernehmen),
                         character-damage.service.ts (Schadensauswahl → applyDamage → Session),
                         condition-tick.service.ts (ConditionTickService: effect() auf die Spielzeit → advanceConditions
                         → CharactersDbService; app-weit in app.config.ts gestartet, Ereignisse → GameLogService),
                         file-transfer.service.ts (Dateien herunterladen und lesen),
                         confirmation.service.ts (Rückfrage über den ConfirmationDialog als Promise<boolean>),
                         sidebar-section-state.service.ts (zugeklappte Abschnitte per persistedState mit TOOL_STATE_KEYS),
                         round.service.ts (RoundService: „Neue Runde“ → Log `round`, +10 s, `clearMovedThisRound`; einziger
                         Rücksetzer des Rundenstands)
  utils/               → new-character.util.ts (Startwerte für neue Charaktere),
                         character-stat.util.ts (CharacterStat, `withStat`: Zahlenwert im Editor setzen, beim Anlegen
                         folgt das Maximum dem Startwert),
                         random-character.util.ts (Zufallscharakter, Name passend zur Bildklasse),
                         damage.util.ts (reine Schadensberechnung),
                         stat-bonus.util.ts (Bonus, wirksamer Wert und Quellen je Zahlenwert im Editor),
                         condition-tick.util.ts (advanceConditions: Wirkmomente nachholen, Ablauf, Ereignisse),
                         condition-time.util.ts (Ende, Restdauer, nächster Wirkmoment, `m:ss`),
                         condition-draft.util.ts (Vorlage kopieren, Start beim Übernehmen, Minuten/Sekunden),
                         game-log-entries.util.ts (Log-Einträge zu Zustands-Tick, Setzen/Entfernen, manuellem Schaden),
                         xml.util.ts (XML lesen/schreiben, `requireChild` mit Dateiart in der Fehlermeldung),
                         text-search.util.ts (`isSearching`, `matchesSearch`: Namenssuche ohne Groß-/Kleinschreibung),
                         card-menu-entries.util.ts (Menü: Modus, Verfügbarkeit, Reihenfolge, Trennlinien, Untermenüs),
                         assign-targets.util.ts (Charaktere und Slots fürs Anlegen, freie zuerst, „– ersetzt …“),
                         card-place.util.ts (Karten eines Ortes zum Blättern, nachrückende Karte nach einer Aktion),
                         card-viewer-context.util.ts (Kontext der angesehenen Karte, im Entwurf Ort laut Entwurf),
                         undo-hint-text.util.ts (Text des Rückgängig-Hinweises),
                         card-viewer-title.util.ts (Deck und Ort über der Karte, „wird abgelegt“ im Entwurf),
                         card-draft.util.ts (Entwurfsbewegungen: Ort im Entwurf, Karten laut Entwurf)
  testing/             → feature-übergreifende Spec-Helfer (z. B. click-button.ts,
                         scroll-into-view.fixtures.ts (Spy für das in jsdom fehlende scrollIntoView),
                         character-editor-dialog.fixtures.ts, character-conditions-editor.fixtures.ts,
                         character-equipment.fixtures.ts (inkl. Ablegen über den Card Viewer),
                         card-viewer.fixtures.ts (Viewer mit echtem Deck-Zustand), snack-bar.fixtures.ts (steuerbare Snackbar),
                         main-nav.fixtures.ts)
```

## E2E-Tests (`e2e/`, Projekt-Root)

Playwright-Smoke-Tests (`npm run e2e`) liegen unter `e2e/` – **nicht** unter `src/`, damit sie weder
von Vitest noch vom App-Build erfasst werden. `playwright.config.ts` (Root) erzeugt die Deckliste und startet `ng serve` auf Port 4321.
Die Deckliste `public/decks/index.json` erzeugt `scripts/build-deck-index.mjs` (Tests: `node --test scripts/*.test.mjs`)
vor `start`, `build`, `watch` und `deploy`; sie ist nicht eingecheckt.
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
- Feature-übergreifende Bausteine (z. B. `.general-sidebar`, `.general-dialog`) liegen global unter `src/styles/components/`
  und werden in `src/styles.css` per `@import … layer(components)` eingebunden; `tokens.css` enthält nur Tokens.
- Seiten mit Seitenleiste nutzen `feature-page.css`: `.feature-page` (dunkle Hülle), `.feature-page__main` (Bereich neben
  der Leiste), `.section-heading` (Abschnittsüberschrift in Leiste und Hauptbereich), `.empty-hint` (`--sm`) für leere Listen.
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
