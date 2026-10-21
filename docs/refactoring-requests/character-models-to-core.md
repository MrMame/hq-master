# Refactoring Request: Charakter-Modelle und Test-Fabrik nach `core/` verschieben

**Datum:** 2026-10-21  
**Priorität:** Mittel  
**Status:** offen  
**Bezug:** `docs/feature-requests/done/character-editor-dialog.md` (Hinweis „Modelle im Feature-Ordner“), `.claude/rules/architecture.md` (Verzeichnisstruktur; `shared/` = „Feature-unabhängige UI“; gemeinsam genutzte Bausteine kommen aus `core/`)

---

## Problem

Der systemweite Charakter-Editor (`CharacterEditorDialog`, `CharacterEditorService`,
`createNewCharacter`) liegt unter `shared/` und soll laut Architektur feature-unabhängig sein. Seine
Modelle holt er aber aus dem Feature `character-tracker`:

```typescript
// shared/components/character-editor-dialog/character-editor-dialog.ts
import { CharacterInfo } from '../../../features/character-tracker/models/character-info.model';
import { ElementalTypes } from '../../../features/character-tracker/models/elemental-types.model';
import { CharacterAbilities } from '../../../features/character-tracker/models/character-abilities.model';
import { CHARACTER_IMAGES } from '../../../features/character-tracker/models/character-images.model';
```

Dieselbe falsche Abhängigkeitsrichtung gibt es schon länger in `core/`: `CharactersDbService` und
`session-slices.ts` importieren `CharacterInfo` aus dem Feature.

| Modell (heute unter `features/character-tracker/models/`) | Genutzt von                                                         |
| --------------------------------------------------------- | ------------------------------------------------------------------- |
| `character-info.model.ts` (`CharacterInfo`)               | core, shared, character-tracker, dungeon-tracker, game-session      |
| `elemental-types.model.ts` (`ElementalTypes`)             | shared (Editor, `createNewCharacter`), character-tracker (Creators) |
| `character-abilities.model.ts` (`CharacterAbilities`)     | shared (Editor), character-tracker (Creators)                       |
| `character-images.model.ts` (`HERO_IMAGES`, …)            | shared (Editor und Specs), character-tracker (Creators)             |

Zusätzlich importieren die Shared-Specs die Test-Fabrik `createTestCharacter` aus
`features/game-session/testing/session.fixtures.ts`. Damit hängt Shared-Testcode von den Testdaten
eines fachfremden Features ab. Die Fabrik nutzen 9 Specs in vier Bereichen.

Fachliches Verhalten ändert sich nicht.

---

## Anforderungen

### 1. Charakter-Modelle nach `core/models/` verschieben

- Die Dateien werden per `git mv` verschoben, damit ihr Verlauf erhalten bleibt. Dateinamen und Inhalt
  bleiben gleich:
  - `src/app/features/character-tracker/models/character-info.model.ts` → `src/app/core/models/character-info.model.ts`
  - `src/app/features/character-tracker/models/elemental-types.model.ts` → `src/app/core/models/elemental-types.model.ts`
  - `src/app/features/character-tracker/models/character-abilities.model.ts` → `src/app/core/models/character-abilities.model.ts`
  - `src/app/features/character-tracker/models/character-images.model.ts` → `src/app/core/models/character-images.model.ts`
- In `features/character-tracker/models/` bleiben nur die Modelle, die allein das Feature nutzt
  (`card-layout.model.ts`, `damage-types.model.ts`).
- Am alten Ort bleiben **keine Weiterleitungsdateien** (Re-Exports). Alle Importe zeigen direkt auf
  `core/models/`.
- Die Importe aller 39 betroffenen Dateien werden angepasst (relative Pfade wie bisher): core 3, shared 8,
  character-tracker 20, dungeon-tracker 6, game-session 2. Die vollständige Liste liefert
  `grep -rlE "models/(character-info|elemental-types|character-abilities|character-images)\.model'" src`.
  Vergessene Stellen meldet der Compiler.

**Erwartetes Verhalten:** Unverändert. Die Suche nach
`character-tracker/models/(character-info|elemental-types|character-abilities|character-images)` unter
`src/` findet nichts mehr.

---

### 2. Test-Fabrik `createTestCharacter` nach `core/testing/` verschieben

- Neue Datei `src/app/core/testing/character.fixtures.ts` mit `createTestCharacter(id: string): CharacterInfo`.
  Der Inhalt kommt unverändert aus `features/game-session/testing/session.fixtures.ts`, samt
  Doc-Kommentar „nur für Specs“.
- `session.fixtures.ts` importiert die Fabrik für `createSessionSnapshot()` von dort. Auch hier gibt es
  keinen Re-Export.
- Alle 9 Specs, die `createTestCharacter` nutzen, importieren sie aus `core/testing/`:
  - `app.config.spec.ts`
  - `character-tracker-page-layout.spec.ts`
  - `dungeon-token.spec.ts`, `dungeon-tracker-page-interactions.spec.ts`, `dungeon-board-sync.service.spec.ts`
  - `game-session.service.spec.ts`
  - `character-editor-dialog.spec.ts`, `character-editor-dialog-create.spec.ts`, `character-editor.service.spec.ts`
- Wie alle Fixture-Dateien wird sie auch vom App-Build kompiliert (`testing.md`). Die Fabrik braucht
  keine Vitest-APIs.

**Erwartetes Verhalten:** Specs unter `shared/` hängen nicht mehr von `features/game-session/testing/` ab.

---

### 3. Architektur-Doku

`.claude/rules/architecture.md`:

- Verzeichnisstruktur:
  - `core/models/` bekommt zusätzlich `character-info.model.ts`, `elemental-types.model.ts`,
    `character-abilities.model.ts` und `character-images.model.ts`.
  - `core/testing/` kommt neu hinzu: `character.fixtures.ts` (Testdaten für Charaktere, nur für Specs).
  - Bei `features/character-tracker/models/` stehen nur noch `card-layout.model.ts` und
    `damage-types.model.ts`.
- Unter „State & Services“ kommt eine neue Regel hinzu: **Code unter `shared/` importiert nichts aus
  `features/`. Modelle, die außer ihrem Feature auch `shared/` oder andere Features nutzen, liegen in
  `core/models/`.**

**Erwartetes Verhalten:** Die Doku beschreibt die neue Lage und verhindert, dass Shared-Code wieder
von Features abhängig wird.

---

## Betroffene Dateien

| Bereich                                        | Änderung                                                                                                    |
| ---------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `src/app/core/models/`                         | Ziel der vier Modelldateien (Punkt 1)                                                                       |
| `src/app/features/character-tracker/models/`   | Die vier Dateien entfallen (Punkt 1)                                                                        |
| `src/app/core/` (3 Dateien)                    | Importe: `characters-db.service.ts` (+ Spec), `session-slices.ts` (Punkt 1)                                 |
| `src/app/shared/` (8 Dateien)                  | Importe: Editor-Dialog, Service, Util, Fixtures, Specs (Punkt 1, 2)                                         |
| `src/app/features/character-tracker/` (20)     | Importe: Komponenten, Services, Creators, Utils, Fixtures, Specs (Punkt 1)                                  |
| `src/app/features/dungeon-tracker/` (6)        | Importe: `dungeon-token`, `dungeon-tracker-page`, `board-token.model`, `dungeon-board.service` (Punkt 1, 2) |
| `src/app/features/game-session/` (2)           | Importe: `characters.xml-mapper.ts`, `session.fixtures.ts` (Punkt 1, 2)                                     |
| `src/app/core/testing/character.fixtures.ts`   | Neu: `createTestCharacter` (Punkt 2)                                                                        |
| `src/app/app.config.spec.ts` und weitere Specs | Import von `createTestCharacter` (Punkt 2)                                                                  |
| `.claude/rules/architecture.md`                | Verzeichnisstruktur und Importregel für `shared/` (Punkt 3)                                                 |

---

## Hinweise

- Das ist eine reine Verschiebung, neue Tests sind nicht nötig. Die bestehenden Tests und der Compiler
  sichern sie ab. Die Modelle sind Typen, Enums und Konstanten ohne eigene Specs.
- **Außerhalb des Scopes:** `core/session-state/session-slices.ts` importiert weiterhin `DeckState`,
  `CardLayoutState` und `DungeonSessionState` aus den Features (Slice-Vertrag des
  `GameSessionService`). Das betrifft den Charakter-Editor nicht und wäre ein eigener Request. Die neue
  Regel in Punkt 3 gilt deshalb bewusst nur für `shared/`.
- Erledigte Requests und `ai-implementations-log.md` behalten die alten Pfade, weil sie Historie sind.
- Umsetzung über den Skill `implement-refactor`, und zwar nach dem Commit von `character-editor-dialog`,
  damit die Verschiebung ein eigener Refactoring-Commit ohne Verhaltensänderung bleibt.

---

## Akzeptanzkriterien

- [ ] Die vier Modelldateien liegen unter `src/app/core/models/`. Am alten Ort gibt es weder die Dateien noch Re-Exports
- [ ] Die Suche nach `character-tracker/models/(character-info|elemental-types|character-abilities|character-images)` unter `src/` findet nichts
- [ ] Kein Code unter `src/app/shared/` importiert aus `src/app/features/`
- [ ] `CharactersDbService` importiert `CharacterInfo` aus `core/models/`
- [ ] `createTestCharacter` liegt in `src/app/core/testing/character.fixtures.ts` und wird überall von dort importiert
- [ ] Der Dateiverlauf der verschobenen Modelle ist erhalten (`git log --follow`)
- [ ] `architecture.md` beschreibt die neue Lage und die Importregel für `shared/`
- [ ] Kein fachliches Verhalten geändert. `npm run lint`, `npm run test -- --watch=false --coverage`, `npm run build` und `npm run e2e` laufen grün
