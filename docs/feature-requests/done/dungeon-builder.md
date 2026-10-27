# Feature Request: Dungeon Builder – Dungeon-Layouts im Editor bauen, als XML speichern und als JPEG exportieren

**Datum:** 2026-10-27  
**Priorität:** Mittel  
**Status:** done (2026-10-27 21:35)  
**Bezug:** `REQUIREMENTS.md` (Dungeon Tracker: „Bild-Laden“), `.claude/rules/architecture.md` → „Neue Features
hinzufügen“, `docs/refactoring-requests/done/shared-board-building-blocks.md` (Voraussetzung),
`docs/feature-requests/dungeon-grid-fine-cell-size.md` (Raster im Tracker passend zum JPEG)

---

## Problem

- Der Dungeon Tracker braucht ein Bild des Spielplans. Heute ist das ein Foto des realen Spielbretts.
  Eigene Dungeon-Layouts kann der DM in der App nicht entwerfen.
- Ein Layout von Hand zu zeichnen ist mühsam und lässt sich nicht später weiterbearbeiten.

---

## Ziel

- Neue Seite **Dungeon Builder** (`/dungeonbuilder`): Der DM baut in einem kleinen Editor ein Layout aus
  Boden, Wänden, Türen, Möbeln, Treppen und Hindernissen.
- **Bibliothek links:** Alle platzierbaren Elemente stehen in der Seitenleiste. Der DM zieht sie per Drag &
  Drop auf den Plan oder setzt sie als Stempel per Tipp.
- **Raster:** Möbel, Treppen und Hindernisse belegen ganze Kacheln, auch in beliebig zusammenhängender
  Form (z. B. L-Form). Wände und Türen liegen auf den Gitterlinien.
- **Bearbeiten:** Jedes platzierte Element lässt sich verschieben, um 90° drehen und löschen.
- **Speichern:** „Als XML speichern“ sichert das Layout zum Weiterarbeiten, „Laden“ holt es zurück. „Als JPEG
  exportieren“ erzeugt das Bild für den Dungeon Tracker.
- **Getrennte Features:** Builder und Tracker kennen sich nicht. Die Übergabe läuft nur über die JPEG-Datei,
  die der DM im Tracker über „Bild hochladen“ lädt. Beide Features lassen sich so getrennt weiterentwickeln.
- **Erweiterbar:** Neue Möbel usw. kommen über eine Katalog-XML und eine Bilddatei unter `public/` dazu,
  ohne Code.

```
+--------------------+---+-------------------------------------------+
| Dungeon Builder    | ↖ |  · · · · · · · · · · · · · · · · · · · ·  |
| Name [Gruft     ]  | ✎ |  · ┏━━━━━━━━━━━┓ · · · · · · · · · · · ·  |
| Spalten [26]       | ▭ |  · ┃ ▦▦▦   ▣   ┃░░░░░░░░░░░░░░ · · · · ·  |
| Zeilen  [19]       | ◧ |  · ┃ ▦▦▦       ▯░░░░░░░░░░░░░░ · · · · ·  |
| [Neu]   [Laden]    | ⌫ |  · ┃      ▤▤   ┃░░ · · · · · · · · · · ·  |
| [Als XML speichern]| ┃ |  · ┗━━━━━━━━━━━┛░░ · · · · · · · · · · ·  |
| [Als JPEG export.] |---|  · · · · · · · · · · · · · · · · · · · ·  |
|--------------------| ↶ |                                           |
| Boden              | ↷ |   ┃ Wand   ▯ Tür   ░ Gang   ▦ Tisch 3×2   |
| ■Fels ■Raum ■Gang  |---|   ▣ Truhe  ▤ Treppe 2×1  · Fels         |
| Türen              | Z |                                           |
|  ▯ Tür  ▯ Geheimtür| o |                                           |
| Grundmöbel …       | o |                                           |
+--------------------+---+-------------------------------------------+
 Seitenleiste         Werkzeugstreifen          Plan (zoombar, Raster)
 (einklappbar)        ↖ Auswahl  ✎ Pinsel  ▭ Rechteck  ◧ Füllen
                      ⌫ Radierer ┃ Wand  ↶ ↷ Rückgängig/Wiederholen  Z Zoom
```

---

## Anforderungen

### 1. Seite, Route und Navigation ✅ done (2026-10-27 21:35)

- Neues Feature `features/dungeon-builder/` mit `components/`, `models/`, `services/`, `utils/`, `xml/`,
  `testing/` (Architektur „Neue Features hinzufügen“).
- Seite per CLI: `ng g c features/dungeon-builder/components/dungeon-builder-page` → `DungeonBuilderPage`,
  lazy per `loadComponent` unter `/dungeonbuilder` in `app.routes.ts`.
- Neuer Navigationslink „Dungeon Builder“ in `app.ts`, hinter „Dungeon Tracker“.
- Der Builder importiert nichts aus anderen Features. Gemeinsame Bausteine kommen aus `shared/`
  (siehe Refactoring Request `shared-board-building-blocks.md`).

**Erwartetes Verhalten:** Über die Navigation öffnet sich der Dungeon Builder; die Startseite bleibt der
Dungeon Tracker.

---

### 2. Element-Katalog als XML (Bibliothek) ✅ done (2026-10-27 21:35)

- Der Katalog liegt unter `public/dungeon-builder/catalog.xml`, die Grafiken flach unter
  `public/dungeon-builder/elements/` (Pfade relativ zu `public/`, wie bei `public/decks/default/`).
- Neuer Service `ng g s features/dungeon-builder/services/element-catalog` → `ElementCatalogService`. Er lädt
  den Katalog einmal per `HttpClient` und stellt ihn als `catalog: Signal<ElementCatalog | null>` bereit, dazu
  `loadError: Signal<string | null>`. Das Lesen übernimmt ein reiner Mapper `xml/catalog.xml-mapper.ts`
  (`readCatalog`) mit den Helfern aus `shared/utils/xml.util.ts`.
- **Format (Vorschlag):**

  ```xml
  <?xml version="1.0" encoding="UTF-8"?>
  <catalog version="1">
    <!-- Optik der Karte: gilt auf dem Plan und im JPEG -->
    <appearance rockColor="#1c1915" wallColor="#3a332b" wallThickness="0.2" />

    <floors>
      <floor id="room" name="Raumboden" image="dungeon-builder/elements/floor-room.svg" />
      <floor id="corridor" name="Gang" image="dungeon-builder/elements/floor-corridor.svg" />
    </floors>

    <doors>
      <door id="door" name="Tür" image="dungeon-builder/elements/door.svg" />
    </doors>

    <pieces category="Grundmöbel">
      <!-- Rechteck: alle Kacheln von width × height sind belegt -->
      <piece id="table" name="Tisch" width="3" height="2" image="dungeon-builder/elements/table.svg" />
    </pieces>

    <pieces category="Hindernisse">
      <!-- Freie Form: nur die aufgezählten Kacheln sind belegt -->
      <piece id="rubble" name="Schutt" image="dungeon-builder/elements/rubble.svg">
        <cell col="0" row="0" /><cell col="0" row="1" /><cell col="1" row="1" />
      </piece>
    </pieces>
  </catalog>
  ```

- **Formen:** Ein Element mit `width`/`height` belegt das ganze Rechteck. Ein Element mit `<cell>`-Kindern
  belegt genau diese Kacheln. Sie müssen über Kanten zusammenhängen (4er-Nachbarschaft) und bei `0,0`
  beginnen. Die Grafik deckt immer das umgebende Rechteck ab und ist außerhalb der Form transparent.
- **Ungültige Einträge** (doppelte `id`, fehlende Grafik-Angabe, nicht zusammenhängende Form) überspringt
  der Mapper mit einer Konsolenwarnung. Der Rest der Bibliothek bleibt nutzbar. Fehlt die Datei oder ist sie
  kein gültiges XML, zeigt die Seitenleiste „Bibliothek konnte nicht geladen werden.“
- **Grafik-Maßstab:** 1 Kachel = 64 Einheiten. Möbel-SVGs haben `viewBox="0 0 (width·64) (height·64)"`,
  Böden `0 0 64 64` (nahtlos kachelbar), Türen `0 0 64 16`. Türen liegen mittig auf der Gitterlinie.
- **Neue Elemente später:** Bild unter `public/dungeon-builder/elements/` ablegen und einen Eintrag in
  `catalog.xml` ergänzen. Weitere `<pieces category="…">`-Gruppen erscheinen automatisch als eigene Gruppe in
  der Bibliothek.

**Erwartetes Verhalten:** Ein neues Möbel erscheint nach dem Ergänzen von Bild und Katalogeintrag ohne
Codeänderung in der Bibliothek.

---

### 3. Startbestand ✅ done (2026-10-27 21:35)

Claude erstellt einfache SVG-Grafiken in Draufsicht, im dunklen Stil der App. Die Größen sind Vorschläge und
lassen sich im Katalog ändern.

| Gruppe          | Elemente (Kacheln)                                                                                               |
| --------------- | ---------------------------------------------------------------------------------------------------------------- |
| Boden           | Raumboden, Gang (zwei unterscheidbare Steinoptiken)                                                              |
| Türen           | Tür, Geheimtür, Gittertor                                                                                        |
| Treppen         | Treppe (2×2)                                                                                                     |
| Grundmöbel      | Tisch (3×2), Stuhl (1×1), Schrank (3×1), Bücherregal (3×1), Truhe (1×1), Bett (1×2)                              |
| Besondere Möbel | Thron (1×1), Kamin (3×1), Altar (2×1), Sarg (1×2), Alchemistentisch (3×2), Waffenständer (3×1), Folterbank (2×3) |
| Hindernisse     | Felsbrocken (1×1), Schutt (L-Form aus 3 Kacheln), Säule (1×1), Grube/Falle (1×1)                                 |

- Mindestens ein Element hat eine freie Form (Schutt), damit Drehen und Belegung nicht-rechteckiger Formen von
  Anfang an geprüft werden.

---

### 4. Layout-Modell und Arbeitsstand ✅ done (2026-10-27 21:35)

- Modelle unter `features/dungeon-builder/models/`, z. B.:
  - `Rotation = 0 | 90 | 180 | 270` (im Uhrzeigersinn).
  - `PlacedPiece { id; catalogId; col; row; rotation }`: `col`/`row` ist die linke obere Kachel des
    **gedrehten** umgebenden Rechtecks.
  - `PlacedWall { id; x1; y1; x2; y2 }`: Gitterpunkte (`0 … columns`, `0 … rows`), immer waagerecht oder
    senkrecht, Länge ≥ 1.
  - `PlacedDoor { id; catalogId; x; y; rotation }`: Die Tür belegt genau eine Gitterkante ab dem Punkt `x, y`,
    nach `rotation` rechts (0), unten (90), links (180) oder oben (270).
  - `DungeonLayout { name; columns; rows; floor; pieces; walls; doors }`. `floor` enthält nur Kacheln mit Boden
    (z. B. `Record<string, string>` mit Schlüssel `"col,row"` → Boden-`id`); alle anderen Kacheln sind Fels.
  - Die Reihenfolge in `pieces`, `walls`, `doors` ist die Zeichenreihenfolge innerhalb der Ebene (#10).
- Neuer Service `ng g s features/dungeon-builder/services/dungeon-layout` → `DungeonLayoutService`
  (`providedIn: 'root'`), Single Source of Truth für das Layout nach den Regeln 1–5 und 8 der Architektur:
  privater `PersistedState<DungeonLayout>`, öffentlich `readonly layout: Signal<DungeonLayout>`, Mutation nur
  über fachliche Methoden.
- Die eigentlichen Änderungen sind reine Funktionen in `utils/` (z. B. `layout-edit.util.ts`:
  `placePiece(layout, …) → DungeonLayout`). Der Service ruft sie auf und schreibt das Ergebnis. So bleibt er
  unter 150 Zeilen und die Logik ist ohne TestBed prüfbar.
- **Nicht Teil der Spielesession:** Das Layout ist Werkzeug-Zustand. Es implementiert **kein**
  `SessionStateSlice`, steht nicht in `SessionSliceData` und nicht in der SaveSession-XML. „Session
  starten“ im Game Session-Feature lässt es unverändert.
- **Speicher-Key:** `persistedState` akzeptiert heute nur `SessionStateKey`. Neu
  `core/session-state/tool-state-keys.ts` mit `TOOL_STATE_KEYS = { dungeonBuilderLayout: 'dungeon_builder_layout' }`
  (Kommentar: „Werkzeug-Zustand außerhalb der Spielesession“). Der Key-Parameter von `persistedState` wird
  zu `SessionStateKey | ToolStateKey`. Keine Keys außerhalb dieser beiden Konstanten.
- **Startwert:** Name „Neues Layout“, 26 × 19 Kacheln, alles Fels, keine Elemente.

**Erwartetes Verhalten:** Nach einem Reload ist das Layout unverändert da; eine neue Spielesession ändert es
nicht.

---

### 5. Seitenaufbau ✅ done (2026-10-27 21:35)

- **Seitenleiste** (`CollapsibleSidebar`, `.general-sidebar`), Titel „Dungeon Builder“:
  1. Datei-Bereich `BuilderFilePanel` (#12–#14): Layoutname, Spalten, Zeilen, „Neu“, „Laden“, „Als XML
     speichern“, „Als JPEG exportieren“.
  2. Bibliothek `ElementLibrary` (#2): Gruppen „Boden“, „Türen“, dann die `<pieces>`-Gruppen in
     Katalog-Reihenfolge. Je Eintrag Vorschaubild, Name und Größe (z. B. „Tisch · 3 × 2“).
- **Werkzeugstreifen** `BuilderToolStrip` im schmalen Streifen links neben dem Plan (`.general-quick-access`
  aus dem Refactoring Request), von oben nach unten:
  Auswahl, Pinsel, Rechteck, Füllen, Radierer, Wand · Rückgängig, Wiederholen · Zoom (`BoardZoomControl`).
  Er bleibt beim Scrollen stehen und ist auch bei eingeklappter Seitenleiste erreichbar.
- **Werkzeug-Buttons:** `aria-pressed` und `title`/`aria-label` je Werkzeug. Das aktive Werkzeug ist gelb
  hervorgehoben (wie der „+“-Button im Tracker), die anderen grau. Icons als lokale SVG unter `public/img/`
  (Material Icons, Apache 2.0, wie `edit.svg`), nicht über eine Icon-Schrift.
- **Aktives Werkzeug** als Modell, z. B. `BuilderTool` mit `select | brush | rectangle | fill | eraser | wall |
stamp(catalogId)`. Es ist reiner UI-Zustand der Seite (nicht persistiert, nach Reload „Auswahl“). Pinsel,
  Rechteck und Füllen nutzen die in der Bibliothek gewählte Bodenart (Start: „Raumboden“).
- **Plan** `LayoutPlan`: zoombar von 100 % (ganzer Plan passt in den Bereich) bis 400 %. Den Ausschnitt
  verschiebt der DM über die Bildlaufleisten und mit dem Werkzeug „Auswahl“ per Ziehen auf einer freien Stelle
  (`BoardPan`). Bei den Zeichenwerkzeugen zeichnet Ziehen und verschiebt nicht. Dafür bekommt `BoardPan` einen
  Input zum Abschalten und ignoriert platzierte Elemente (wie heute `.cdk-drag`).
- Auf dem Plan ist das Raster immer als feine Linie sichtbar. Fels ist dunkel (`rockColor` aus dem Katalog).

---

### 6. Boden-Werkzeuge ✅ done (2026-10-27 21:35)

| Werkzeug | Bedienung                                                                                          |
| -------- | -------------------------------------------------------------------------------------------------- |
| Pinsel   | Drücken und über Kacheln ziehen: Jede berührte Kachel bekommt die gewählte Bodenart.               |
| Rechteck | Von einer Kachel zur anderen ziehen: Alle Kacheln im Rechteck bekommen die gewählte Bodenart.      |
| Füllen   | Tipp auf eine Kachel: Die zusammenhängende Fläche gleicher Art (4er-Nachbarschaft) wird umgefärbt. |
| Radierer | Wie der Pinsel, macht Kacheln wieder zu Fels.                                                      |

- In der Gruppe „Boden“ steht zusätzlich „Fels“. Damit radieren auch Rechteck und Füllen.
- Ein Tipp auf eine Bodenart wählt sie und schaltet auf den Pinsel, wenn gerade kein Boden-Werkzeug aktiv ist.
- **Vorschau während der Geste:** Solange der Zeiger gedrückt ist, zeigt der Plan die betroffenen Kacheln
  sofort an (UI-Zustand). Erst beim Loslassen schreibt der Service einmal: ein Speichervorgang, ein
  Rückgängig-Schritt (#11). `pointercancel` verwirft die Vorschau.
- Boden ändert keine Elemente; Möbel und Wände dürfen auch auf Fels liegen.
- Reine Funktionen: `floor-fill.util.ts` (Füllfläche), `grid-geometry.util.ts` (Kachel unter dem Zeiger,
  Kacheln im Rechteck).

**Erwartetes Verhalten:** Ein Raum entsteht mit einem Rechteck-Zug, ein Gang mit einem Pinselstrich; beide
lassen sich mit einem Schritt rückgängig machen.

---

### 7. Wände ziehen ✅ done (2026-10-27 21:35)

- Werkzeug „Wand“: Drücken nahe einem Gitterpunkt startet die Wand am nächsten Gitterpunkt. Beim Ziehen folgt
  die Vorschau der vorherrschenden Richtung (nur waagerecht oder senkrecht) bis zum nächsten Gitterpunkt.
  Loslassen legt einen **Wandzug** als ein Element an. Unter einer Kachel Länge entsteht nichts.
- Wände liegen auf der Ebene über den Möbeln (#10) und haben Farbe und Stärke aus `<appearance>`.
- Wände dürfen sich überlappen und kreuzen.
- Ein Wandzug ist danach ein Element wie ein Möbel (#10): antippen markiert den ganzen Zug. Kürzen heißt löschen
  und neu ziehen.
- Damit dünne Linien auch am Tablet treffen, ist die Trefferfläche breiter als die sichtbare Wand (z. B. ¼
  Kachel).

---

### 8. Möbel, Treppen und Hindernisse platzieren ✅ done (2026-10-27 21:35)

- **Drag & Drop:** Einen Eintrag aus der Bibliothek auf den Plan ziehen (`@angular/cdk/drag-drop`, wie die
  Tokens im Tracker). Solange er über dem Plan ist, zeigt der Plan die belegten Kacheln als Vorschau. Beim
  Loslassen liegt die Mitte des Elements auf der Kachel unter dem Zeiger. Losgelassen außerhalb des Plans
  passiert nichts.
- Am Tablet startet das Ziehen erst nach kurzem Halten (`cdkDragStartDelay` für Touch), damit die Bibliothek
  weiter per Wischen scrollt.
- **Stempel:** Ein Tipp auf einen Eintrag macht ihn zum aktiven Werkzeug (Eintrag hervorgehoben). Jeder Tipp auf
  den Plan setzt eine Kopie, mittig auf die getippte Kachel. Ein zweiter Tipp auf den Eintrag, ein anderes
  Werkzeug oder `Esc` beendet den Stempel.
- Elemente bleiben immer ganz im Plan: Eine Position am Rand wird nach innen geschoben.
- Überlappen ist erlaubt (Entscheidung 2026-10-27), auch mit anderen Möbeln und auf Fels. Das neue Element liegt
  oben.

---

### 9. Türen ✅ done (2026-10-27 21:35)

- Türen setzt der DM wie Möbel per Drag & Drop oder Stempel. Statt auf eine Kachel rastet die Tür auf die
  nächste Gitterkante ein.
- **Tür ersetzt Wandstück:** Liegt auf der Kante eine Wand, zeichnen Plan und JPEG die Wand dort mit Lücke und
  die Tür darin. Wird die Tür entfernt oder verschoben, ist die Wand wieder geschlossen. Der Wandzug selbst
  bleibt unverändert (die Lücke wird nur beim Zeichnen berechnet, z. B. `wallSegments(wall, doors)` in
  `wall-geometry.util.ts`).
- Eine Tür darf auch ohne Wand liegen. Auf einer Kante liegt höchstens eine Tür; eine neue Tür auf einer belegten
  Kante ersetzt die alte.

---

### 10. Markieren, Verschieben, Drehen, Löschen und Ebenen ✅ done (2026-10-27 21:35)

- **Ebenen (fest):** Boden → Möbel/Treppen/Hindernisse → Wände → Türen. Innerhalb einer Ebene liegt das zuletzt
  gesetzte oder verschobene Element oben.
- **Markieren** (Werkzeug „Auswahl“): Ein Tipp auf ein Element markiert das oberste Element unter dem Zeiger
  (gelber Rahmen, z. B. `--color-yellow-400`, wie der Ring am Token). Ein Tipp auf eine freie Stelle hebt die
  Markierung auf. Die Markierung ist UI-Zustand und wird nicht gespeichert.
- **Menüleiste** `ElementActionBar` unter dem markierten Element mit „Drehen“ (90° im Uhrzeigersinn) und
  „Löschen“ (rot), `role="toolbar"`, Buttons mindestens `--space-6` groß, Klicks gehen nicht an den Plan
  weiter (wie `CharacterActionBar`).
- **Tastatur am PC:** `R` dreht, `Entf`/`Backspace` löscht, `Esc` hebt die Markierung auf bzw. beendet den
  Stempel. Kürzel greifen nicht, solange ein Eingabefeld (z. B. Layoutname) den Fokus hat.
- **Verschieben:** Markiertes oder beliebiges Element mit „Auswahl“ ziehen. Möbel rasten auf Kacheln, Wände auf
  Gitterpunkte, Türen auf Kanten. Vorschau während des Ziehens, ein Schreibvorgang beim Loslassen.
- **Drehen** (`rotation.util.ts`):
  - Möbel: Form und Grafik drehen um die Mitte des umgebenden Rechtecks, gerundet auf ganze Kacheln, danach
    zurück in den Plan geschoben.
  - Wände und Türen: Drehpunkt ist der Gitterpunkt in der Mitte, bei ungerader Länge der Gitterpunkt davor.
    So bleiben alle Endpunkte auf dem Gitter; eine waagerechte Wand wird senkrecht.
- **Löschen** sofort ohne Rückfrage (rückgängig machbar, #11).

**Erwartetes Verhalten:** Ein Tisch 3 × 2 wird nach „Drehen“ zu 2 × 3 und bleibt auf dem Plan; viermal Drehen
ergibt wieder die Ausgangslage.

---

### 11. Rückgängig und Wiederholen ✅ done (2026-10-27 21:35)

- Buttons „Rückgängig“ und „Wiederholen“ im Werkzeugstreifen, am PC zusätzlich `Strg+Z` und `Strg+Y` bzw.
  `Strg+Umschalt+Z`. Nicht aktiv, wenn es nichts gibt (`disabled`).
- Bis zu **50 Schritte**. Jede abgeschlossene Geste ist ein Schritt (Pinselstrich, Rechteck, Füllen, Wand ziehen,
  Platzieren, Verschieben, Drehen, Löschen, Größe ändern). Eine neue Änderung leert „Wiederholen“.
- Der Verlauf liegt im `DungeonLayoutService` (privates Signal, nicht persistiert) und beginnt nach Reload, „Neu“
  und „Laden“ leer. Die Stapel-Logik ist eine reine Funktion (z. B. `layout-history.util.ts`).
- Das Umbenennen des Layouts ist kein eigener Schritt.

---

### 12. Layoutname und Plangröße ✅ done (2026-10-27 21:35)

- **Layoutname:** Textfeld, bestimmt die Dateinamen (#13, #14) über eine reine Funktion `file-name.util.ts`:
  Kleinbuchstaben, Umlaute als `ae`/`oe`/`ue`/`ss`, andere Zeichen → `-`; leer → `dungeon-layout`.
  Beispiel: „Gruft des Hexers“ → `gruft-des-hexers.xml`.
- **Spalten/Zeilen:** Zahlenfelder, je 5 bis 40, Start 26 × 19. Die Größe ändert sich vom linken oberen Eck aus;
  neue Fläche ist Fels.
- **Verkleinern:** Liegen Elemente ganz oder teilweise außerhalb der neuen Größe, fragt der
  `ConfirmationDialog`, z. B. „3 Elemente liegen außerhalb und werden entfernt.“ Bei „Abbrechen“ bleibt die alte
  Größe. Boden außerhalb entfällt ohne Rückfrage.

---

### 13. Als XML speichern, Laden und Neu ✅ done (2026-10-27 21:35)

- Reiner Mapper `xml/layout.xml-mapper.ts` (`writeLayout`/`readLayout`) mit den Helfern aus
  `shared/utils/xml.util.ts`; Service `LayoutXmlService` für Text ↔ `DungeonLayout`; Download und Lesen der Datei
  über `FileTransferService` (`shared/services/`).
- **Format (Vorschlag):**

  ```xml
  <?xml version="1.0" encoding="UTF-8"?>
  <dungeonLayout version="1" name="Gruft des Hexers" columns="26" rows="19">
    <floor>
      <cell col="3" row="2" floor="room" />
    </floor>
    <pieces>
      <piece id="…" catalogId="table" col="5" row="4" rotation="90" />
    </pieces>
    <walls>
      <wall id="…" x1="3" y1="2" x2="9" y2="2" />
    </walls>
    <doors>
      <door id="…" catalogId="door" x="5" y="2" rotation="0" />
    </doors>
  </dungeonLayout>
  ```

- Eingerückt (`indentXml`), damit die Datei von Hand lesbar bleibt. Die Reihenfolge der Elemente ist die
  Zeichenreihenfolge.
- **„Als XML speichern“** lädt `<dateiname>.xml` herunter.
- **„Laden“** (`accept=".xml"`) ersetzt das aktuelle Layout. Ist das aktuelle Layout nicht leer, fragt vorher der
  `ConfirmationDialog`. Fehler zeigt die Seitenleiste als Meldung, z. B. „Ungültige Layout-Datei: <walls> fehlt
  in <dungeonLayout>.“ (`requireChild(…, 'Layout-Datei')`). Bei einem Fehler bleibt das aktuelle Layout
  unverändert.
- **Unbekannte Katalogeinträge** (Element im Katalog gelöscht oder umbenannt): Das Element bleibt erhalten und
  erscheint als graue Fläche mit Fragezeichen, damit beim erneuten Speichern nichts verloren geht. Die
  Seitenleiste nennt die Anzahl.
- **„Neu“** setzt den Startwert (#4). Ist das aktuelle Layout nicht leer, fragt vorher der `ConfirmationDialog`.

**Erwartetes Verhalten:** Speichern, „Neu“ und Laden der gespeicherten Datei ergibt dasselbe Layout wie vorher.

---

### 14. Als JPEG exportieren ✅ done (2026-10-27 21:35)

- **„Als JPEG exportieren“** lädt `<dateiname>.jpg` herunter. Das Bild zeigt Fels, Boden, Möbel, Wände und
  Türen, **ohne Raster und ohne Rand** (Entscheidung 2026-10-27): Das Raster legt der Dungeon Tracker darüber.
- **Auflösung:** 64 px je Kachel, höchstens 2048 px an der längsten Seite (dann weniger px je Kachel, ganzzahlig).
  26 × 19 ergibt 1664 × 1216 px. Der Tracker speichert das Bild als Base64 im `localStorage`, deshalb die
  Obergrenze. JPEG-Qualität 0,9.
- **Aufbau:** Eine reine Funktion (z. B. `layout-render.util.ts`) erzeugt aus Layout und Katalog eine Liste von
  Zeichenschritten (Fläche, Bild mit Position und Drehung, Linie). `LayoutImageService` führt sie auf einem
  `<canvas>` aus und liefert das JPEG als `Blob` (`canvas.toBlob(…, 'image/jpeg', 0.9)`). Bilder kommen
  same-origin aus `public/`, die Canvas bleibt exportierbar.
- Die Lücken für Türen in Wänden kommen aus derselben Funktion wie auf dem Plan (#9).
- Während des Exports ist der Button deaktiviert; ein Fehler (z. B. Grafik nicht ladbar) erscheint als Meldung in
  der Seitenleiste.

**Erwartetes Verhalten:** Das JPEG lässt sich im Dungeon Tracker über „Bild hochladen“ laden. Mit Zellgröße
1000 / Spalten und Versatz 0 liegt das Raster dort auf den Kacheln
(siehe `docs/feature-requests/dungeon-grid-fine-cell-size.md`).

---

### 15. Tests ✅ done (2026-10-27 21:35)

- **Reine Funktionen** (je eigene Spec): Drehen (Rechteck, freie Form, viermal Drehen = Ausgangslage, Wand- und
  Türdrehung bleibt auf dem Gitter), Füllen (Grenzen, Rand, gleiche Art), Rechteck in beide Ziehrichtungen,
  nächster Gitterpunkt/Kante, Einschieben in den Plan, Wandlücken für Türen, Layout-Änderungen,
  Rückgängig-Stapel (Limit 50, Wiederholen wird geleert), Dateiname, Zeichenschritte (Ebenen-Reihenfolge, ohne
  Raster, Auflösung und Obergrenze).
- **Mapper:** Katalog (gültig, Rechteck und freie Form, ungültige Einträge übersprungen, nicht zusammenhängende
  Form abgelehnt, Gruppen-Reihenfolge); Layout hin und zurück, fehlende Pflicht-Elemente mit
  „Ungültige Layout-Datei“, unbekannte `catalogId` bleibt erhalten.
- **Services:** `DungeonLayoutService` mit `describePersistedState(…)` (Mutation aktualisiert Signal und
  Storage, Startwert-Fallback), Rückgängig/Wiederholen über die öffentlichen Methoden;
  `ElementCatalogService` mit `HttpTestingController` (Erfolg und Fehler); `LayoutImageService` mit gemockter
  Canvas (jsdom hat keine Canvas) bzw. die Ausführung per E2E geprüft und im Abschlussbericht begründet.
- **Komponenten über DOM und Harnesses** (Pointer-Events wie in `board-pan.spec.ts`): Werkzeugwechsel mit
  `aria-pressed`; Pinselstrich, Rechteck, Füllen und Radierer ändern die Kacheln erst beim Loslassen; Wand ziehen;
  Stempel setzt Kopien und endet mit `Esc`; Markieren, Menüleiste, Drehen und Löschen auch über `R`/`Entf`;
  Kürzel wirken nicht im Namensfeld; Verkleinern mit Rückfrage; „Neu“ und „Laden“ mit Rückfrage; Fehlermeldung
  beim Laden; Export ruft `FileTransferService.download` mit `Blob` und Dateiname. Dialoge per `useValue`
  gemockt.
- Der Startkatalog `public/dungeon-builder/catalog.xml` wird geprüft (alle Einträge gültig, Grafiken
  vorhanden), per Spec falls der Runner die Datei lesen kann, sonst im E2E-Test.
- Coverage-Report für alle neuen und geänderten Dateien prüfen (`testing.md` → Definition of Done).

---

### 16. E2E ✅ done (2026-10-27 21:35)

- Neu `e2e/dungeon-builder.spec.ts`, mit `click()` (PC) und `tap()` (Tablet, `hasTouch`):
  - „Dungeon Builder“ in der Navigation öffnen → Bibliothek zeigt die Gruppen des Startkatalogs.
  - Raum per Rechteck aufziehen, Wand ziehen, Tisch per Drag & Drop setzen, Truhe per Stempel setzen, Tisch drehen
    und löschen, „Rückgängig“ holt ihn zurück.
  - Reload → Layout unverändert.
  - „Als XML speichern“ → Download `neues-layout.xml`; „Neu“ bestätigen → leer; die Datei laden → Layout wieder da.
  - „Als JPEG exportieren“ → Download `.jpg` mit `image/jpeg` und 1664 × 1216 px.
- Drag & Drop aus der scrollenden Seitenleiste am Tablet (Haltezeit) und die Vorschau beim Ziehen per
  Playwright-Probe unter `e2e/probe/` prüfen.

---

### 17. Dokumentation ✅ done (2026-10-27 21:35)

- `REQUIREMENTS.md`: neuer Abschnitt „4. Dungeon Builder ('/dungeonbuilder')“ mit Ziel und Funktionen
  (Bibliothek per Drag & Drop und Stempel, Boden-Werkzeuge, Wände auf Gitterlinien, Türen ersetzen Wandstücke,
  Drehen in 90°-Schritten, Rückgängig, Speichern/Laden als XML, Export als JPEG für den Dungeon Tracker; nicht Teil
  der Spielesession).
- `.claude/rules/architecture.md`: Verzeichnisstruktur um `features/dungeon-builder/` ergänzen,
  `core/session-state/` um `tool-state-keys.ts`; bei den Session-Regeln ergänzen, dass Werkzeug-Zustand
  `persistedState` mit `TOOL_STATE_KEYS` nutzt und kein `SessionStateSlice` ist.

---

## Hinweise

- **Entscheidungen (2026-10-27):**
  - Plangröße je Layout einstellbar, Start 26 × 19.
  - Grafiken als SVG von Claude, später durch eigene SVG/PNG ersetzbar.
  - Erweiterung über Katalog-XML in `public/`, kein Code.
  - Boden per Pinsel, Rechteck, Füllen und Radierer; Fläche startet als Fels; zwei Bodenarten.
  - Wände werden entlang der Gitterlinien gezogen; ein Wandzug ist ein Element.
  - Tür ersetzt Wandstück.
  - Überlappen erlaubt, feste Ebenen ohne „Nach vorn/Nach hinten“.
  - PC und Tablet; Menüleiste am markierten Element, am PC zusätzlich Tasten.
  - Platzieren per Drag & Drop und als Stempel.
  - Rückgängig/Wiederholen, 50 Schritte, nicht über Reload hinweg.
  - Arbeitsstand bleibt im Browser, gehört aber nicht zur Spielesession.
  - Zwei Buttons „Als XML speichern“ und „Als JPEG exportieren“, Dateiname aus dem Layoutnamen.
  - JPEG immer ohne Raster und ohne Rand; das passende Raster im Tracker regelt ein eigener Feature Request.
  - Werkzeugstreifen links wie im Dungeon Tracker.
  - Gemeinsame Bausteine vorher per Refactoring Request nach `shared/`.
- **Reihenfolge der Umsetzung:** erst `docs/refactoring-requests/done/shared-board-building-blocks.md`, dann dieser
  Request. Sinnvolle Teilschritte: #1–#5 (Seite, Katalog, Modell, Aufbau), #6–#7, #8–#10, #11–#12, #13–#14.
- **Optik der Karte vs. Bedienoberfläche:** Farben von Fels und Wand stehen im Katalog (`<appearance>`), weil sie
  Inhalt der Karte sind und Plan und JPEG gleich aussehen müssen. Die Bedienoberfläche (Seitenleiste,
  Werkzeugstreifen, Markierung, Menüleiste) nutzt wie überall die Tokens aus `src/styles/tokens.css`.
- **Darstellung auf dem Plan (Vorschlag):** ein SVG mit `viewBox` in Kacheleinheiten (1 Kachel = 64). Boden als
  `<image>`/Muster je Kachel, Möbel und Türen als `<image>` mit `transform`, Wände als Linien. Das Plan-SVG ist
  nicht die Quelle des JPEGs (#14), beide nutzen aber dieselben Geometrie-Funktionen.
- **Dateilimit 150 Zeilen:** Plan, Seite und Service werden schnell groß. Pro Werkzeug eine kleine Klasse oder
  Funktion für die Zeiger-Geste (z. B. `utils/` oder `tools/`), der Plan verteilt nur die Ereignisse.
- **Ausblick, nicht Teil dieses Requests:** Layout direkt an den Dungeon Tracker übergeben, Möbel vor dem
  Platzieren drehen, eigene Elemente in der App anlegen, Ebenen-Befehle, weitere Bodenarten (Wasser, Lava).

- **Umsetzung (2026-10-27):**
  - `BoardPan` bleibt unverändert (#5): Statt eines Inputs zum Abschalten übernimmt der Plan Zeichen- und
    Element-Gesten selbst und stoppt deren `pointerdown`. Nur ein Druck mit „Auswahl“ auf freier Fläche
    erreicht `BoardPan` und verschiebt den Ausschnitt.
  - Zeiger-Gesten sind unveränderliche Klassen unter `gestures/` (`*.gesture.ts`, neue Rolle in
    `architecture.md`). Sie liefern die Vorschau (`draft`) und schreiben beim Loslassen einmal über
    `LayoutCommands`. Der `PlanPointerService` beendet nur Gesten, die mit einem Druck auf den Plan begonnen
    haben; sonst landete ein Element beim Ziehen aus der Bibliothek doppelt (in der Probe gefunden, mit
    Regressionstest behoben).
  - Plan und JPEG zeichnen dieselben Zeichenschritte (`renderSteps`); der Plan als SVG, der Export auf einer
    Canvas. Das Raster des Plans ist eine HTML-Ebene, damit `url(#…)` mit `base href` kein Problem macht.
  - Neu in `shared/`: `ConfirmationService` (Rückfrage als `Promise<boolean>`) und `parseXmlRoot` in
    `xml.util.ts`. Die Game Session nutzt weiter ihre eigene Rückfrage (nicht Teil dieses Requests).
  - Icons: Rückgängig, Wiederholen, Drehen, Löschen, Pinsel und Rechteck aus Material Icons; Auswahl, Füllen,
    Radierer und Wand als schlichte eigene SVGs. „Grube/Falle“ heißt im Katalog „Grube“.
  - Der Startkatalog wird im E2E-Test geprüft (alle 23 Grafiken geladen, keine Katalog-Warnung), weil der
    Spec-Runner `public/` nicht liest. Die E2E-Tests sind nach Gerät aufgeteilt (`dungeon-builder.spec.ts`,
    `dungeon-builder-tablet.spec.ts`).
  - Proben: Ziehen mit Haltezeit am Tablet (CDP-Touch, Haltezeit über `page.clock`), Vorschau beim Ziehen und
    Laden des exportierten JPEGs im Dungeon Tracker (Bild 1664 px breit).

---

## Akzeptanzkriterien

- [x] `/dungeonbuilder` ist über die Navigation „Dungeon Builder“ erreichbar und lazy geladen; der Builder importiert nichts aus anderen Features
- [x] Die Bibliothek kommt aus `public/dungeon-builder/catalog.xml`; ein neuer Eintrag mit Bild erscheint ohne Codeänderung
- [x] Der Startbestand enthält Boden (Raum, Gang), Tür, Geheimtür, Gittertor, Treppe, Grundmöbel, besondere Möbel und Hindernisse, mindestens eins in freier Form
- [x] Pinsel, Rechteck, Füllen und Radierer ändern den Boden; jede Geste ist ein Rückgängig-Schritt
- [x] Wände werden entlang der Gitterlinien gezogen und sind danach ein markierbares Element
- [x] Möbel, Treppen und Hindernisse belegen ganze Kacheln, auch in freier Form, und lassen sich per Drag & Drop und als Stempel setzen
- [x] Türen rasten auf Gitterkanten ein und ersetzen dort die Wand
- [x] Jedes Element lässt sich markieren, verschieben, um 90° drehen und löschen, per Menüleiste und am PC per Tastatur; Elemente bleiben im Plan
- [x] Die Ebenen-Reihenfolge Boden → Möbel → Wände → Türen gilt auf dem Plan und im JPEG
- [x] Rückgängig/Wiederholen für bis zu 50 Schritte, per Button und Tastenkürzel
- [x] Spalten und Zeilen sind einstellbar (5–40); Verkleinern fragt vorher, wenn Elemente entfallen
- [x] Der Arbeitsstand übersteht einen Reload und ist nicht Teil der Spielesession
- [x] „Als XML speichern“ und „Laden“ ergeben dasselbe Layout; ungültige Dateien zeigen eine Meldung und ändern nichts
- [x] „Als JPEG exportieren“ liefert ein randloses JPEG ohne Raster mit 64 px je Kachel (höchstens 2048 px), das der Dungeon Tracker laden kann
- [x] PC und Tablet funktionieren (Maus, Touch, Tastatur am PC)
- [x] Jede Datei hat höchstens 150 Zeilen; Specs prüfen das Verhalten über DOM und Harnesses
- [x] E2E für PC und Tablet grün; Drag & Drop am Tablet per Playwright-Probe geprüft
- [x] `REQUIREMENTS.md` und `architecture.md` sind angepasst
- [x] `npm run lint`, `npm run test -- --watch=false --coverage` (Schwellen eingehalten), `npm run build` und `npm run e2e` laufen grün
