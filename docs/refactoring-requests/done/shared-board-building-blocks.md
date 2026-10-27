# Refactoring Request: Gemeinsame Bausteine für Spielflächen und Dateien nach `shared/` verschieben

**Datum:** 2026-10-27  
**Priorität:** Hoch (Voraussetzung für `docs/feature-requests/dungeon-builder.md`)  
**Status:** done (2026-10-27 20:51)  
**Bezug:** `docs/feature-requests/dungeon-builder.md` (Hinweis „Gemeinsame Bausteine“),
`.claude/rules/architecture.md` → „Verzeichnisstruktur“, „Kern-Architekturregeln“

---

## Problem

Der geplante Dungeon Builder braucht Bausteine, die heute fest in einem Feature liegen:

| Baustein                                                   | Heute                                                     | Genutzt von                    |
| ---------------------------------------------------------- | --------------------------------------------------------- | ------------------------------ |
| XML-Helfer (`setAttributes`, `readNumber`, `indentXml`, …) | `features/game-session/xml/xml.util.ts`                   | Mapper und `SessionXmlService` |
| Datei-Download und Lesen einer Datei                       | `features/game-session/services/session-file.service.ts`  | `GameSessionPage`              |
| Senkrechter Zoom-Regler `BoardZoomControl`                 | `features/dungeon-tracker/components/board-zoom-control/` | `DungeonTrackerPage`           |
| Ausschnitt per Ziehen verschieben `BoardPan`               | `features/dungeon-tracker/directives/board-pan.ts`        | `DungeonBoard`                 |
| Schnellzugriffsleiste (`.quick-access`)                    | `dungeon-tracker-page.css`                                | `DungeonTrackerPage`           |

Der Builder müsste sie entweder aus fremden Features importieren (Kopplung zwischen Features) oder
nachbauen (doppelter Code). Beides soll vermieden werden: Builder und Tracker sollen getrennt
weiterentwickelt werden können.

Fachliches Verhalten ändert sich nicht.

---

## Anforderungen

### 1. XML-Helfer nach `shared/utils/` verschieben ✅ done (2026-10-27 20:51)

- `git mv` von `features/game-session/xml/xml.util.ts` und `xml.util.spec.ts` nach
  `shared/utils/xml.util.ts` bzw. `shared/utils/xml.util.spec.ts`.
- `requireChild` nennt heute fest „Session-Datei“ in der Fehlermeldung. Die Funktion bekommt einen
  optionalen Parameter für die Dateiart, z. B.
  `requireChild(parent: Element, name: string, fileKind: string = 'Datei')` →
  `Ungültige ${fileKind}: <${name}> fehlt in <${parent.tagName}>.`
- `SessionXmlService` übergibt `'Session-Datei'`. Die Meldungen beim Laden einer SaveSession bleiben
  damit wörtlich gleich (`game-session-page-file.spec.ts` prüft „Ungültige Session-Datei“).
- Alle Importe der Mapper unter `features/game-session/xml/` und von `SessionXmlService` zeigen direkt
  auf `shared/utils/xml.util.ts`. Keine Weiterleitungsdatei am alten Ort.

**Erwartetes Verhalten:** Speichern und Laden einer SaveSession funktionieren unverändert.

---

### 2. Datei-Service nach `shared/services/` verschieben und verallgemeinern ✅ done (2026-10-27 20:51)

- `git mv` von `session-file.service.ts` (+ Spec) nach `shared/services/file-transfer.service.ts`,
  Klasse `SessionFileService` → `FileTransferService` (Dateistamm in PascalCase + `Service`).
- Schnittstelle:
  - `download(content: string | Blob, fileName: string, mimeType: string = 'application/xml'): void`:
    Ein `Blob` wird unverändert heruntergeladen, ein Text als `Blob` mit `mimeType`.
  - `readText(file: File): Promise<string>` bleibt.
- `GameSessionPage` und `game-session-page-file.spec.ts` nutzen `FileTransferService`.
- Die Spec deckt zusätzlich den `Blob`-Fall ab (gleiches Objekt-URL-Muster wie heute).

**Erwartetes Verhalten:** „Session speichern“ lädt dieselbe XML-Datei wie bisher herunter.

---

### 3. `BoardZoomControl` nach `shared/components/` verschieben ✅ done (2026-10-27 20:51)

- `git mv` von `features/dungeon-tracker/components/board-zoom-control/` nach
  `shared/components/board-zoom-control/`. Klasse, Selektor `app-board-zoom-control`, Model-Input `zoom`
  und Aussehen bleiben gleich.
- Der JSDoc-Kommentar nennt nicht mehr das Spielbrett des Trackers, sondern allgemein „eine zoombare
  Spielfläche“.

---

### 4. `BoardPan` nach `shared/directives/` verschieben ✅ done (2026-10-27 20:51)

- `git mv` von `features/dungeon-tracker/directives/board-pan.ts` (+ Spec) nach
  `shared/directives/board-pan.ts` (neuer Ordner). Selektor `appBoardPan` und Verhalten bleiben gleich,
  auch dass `.cdk-drag`-Elemente kein Verschieben starten.
- Der Ordner `features/dungeon-tracker/directives/` entfällt, wenn er leer ist.

---

### 5. Schnellzugriffsleiste als globaler Baustein ✅ done (2026-10-27 20:51)

- Die Klassen `.quick-access` und `.quick-access__button` wandern aus `dungeon-tracker-page.css` nach
  `src/styles/components/quick-access.css` als `.general-quick-access` und
  `.general-quick-access__button`, eingebunden in `src/styles.css` per
  `@import './styles/components/quick-access.css' layer(components);` (wie `sidebar.css`).
- `dungeon-tracker-page.html` und die Selektoren in `dungeon-tracker-page.spec.ts` und
  `dungeon-tracker-page-interactions.spec.ts` nutzen die neuen Klassen. Das Aussehen bleibt gleich.

---

### 6. Dokumentation ✅ done (2026-10-27 20:51)

- `.claude/rules/architecture.md`, Verzeichnisstruktur:
  - `shared/components/` um `BoardZoomControl` ergänzen, bei `dungeon-tracker/components/` streichen.
  - Neuer Eintrag `shared/directives/ → board-pan.ts (BoardPan)`, bei `dungeon-tracker/directives/`
    streichen.
  - `shared/services/` um `file-transfer.service.ts` ergänzen, bei `game-session/services/` und
    `game-session/xml/` die verschobenen Dateien streichen.
  - `shared/utils/` um `xml.util.ts` ergänzen.
  - Bei den globalen Bausteinen `.general-quick-access` neben `.general-sidebar` nennen.

---

### 7. Tests ✅ done (2026-10-27 20:51)

- Alle verschobenen Specs laufen am neuen Ort unverändert grün (Ausnahmen: neuer `fileKind`-Fall in
  `xml.util.spec.ts`, `Blob`-Fall in `file-transfer.service.spec.ts`).
- Ganze Suite mit Coverage, `npm run build`, `npm run lint` und `npm run e2e` grün.
- Die lokalen Proben unter `e2e/probe/` (gitignored) importieren keine verschobenen Dateien und bleiben
  unverändert.

---

## Hinweise

- **Entscheidung (2026-10-27):** Eigener Refactoring Request vor dem Feature Request statt
  Verschieben als erster Punkt des Builders: kleinere Commits, klare Trennung von Umbau und neuem
  Verhalten.
- Keine Weiterleitungsdateien (Re-Exports) an den alten Orten; vergessene Importe meldet der Compiler.
- `board-scale.util.ts` bleibt im Dungeon Tracker: Der Builder rechnet mit seiner eigenen
  Plangröße (Kacheln), nicht mit der 1000 breiten Spielfläche des Fotos.

---

## Akzeptanzkriterien

- [x] `xml.util.ts`, `FileTransferService`, `BoardZoomControl` und `BoardPan` liegen unter `shared/`, ihre Specs daneben
- [x] Kein Code unter `shared/` importiert aus `features/`; keine Weiterleitungsdateien an den alten Orten
- [x] Die Fehlermeldungen beim Laden einer SaveSession sind wörtlich unverändert
- [x] `FileTransferService.download` lädt Text und `Blob` herunter
- [x] Die Schnellzugriffsleiste nutzt `.general-quick-access` aus `src/styles/components/quick-access.css` und sieht unverändert aus
- [x] Dungeon Tracker und Game Session verhalten sich unverändert (Zoom, Ziehen des Ausschnitts, Speichern/Laden)
- [x] `architecture.md` ist angepasst
- [x] Jede Datei hat höchstens 150 Zeilen
- [x] `npm run lint`, `npm run test -- --watch=false --coverage` (Schwellen eingehalten), `npm run build` und `npm run e2e` laufen grün
