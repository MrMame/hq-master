# Refactoring Request: Einheitliche Dateinamen-Konvention

**Datum:** 2026-10-17  
**Priorität:** Mittel  
**Status:** Offen  
**Bezug:** `.claude/rules/architecture.md` (Verzeichnisstruktur), `.claude/rules/clean-code.md` (sprechende Namen)

---

## Problem

Im Projekt existieren vier Namenskonventionen parallel. Am Dateinamen ist nicht erkennbar, ob eine Datei einen Service, ein Model, reine Funktionen oder Testdaten enthält.

| Muster             | Beispiel                                                      |
| ------------------ | ------------------------------------------------------------- |
| Punkt-Suffix       | `card-manager.service.ts`, `card.model.ts`                    |
| Bindestrich-Suffix | `gametime-service.ts`, `storage-service.ts`                   |
| Ohne Suffix        | `game-session.ts`, `session-xml.ts` (enthalten aber Services) |
| PascalCase         | `CharacterInfo.ts`, `DungeonBoardState.ts`                    |

Weitere Funde:

- `game-time.ts` und `game-time-span.ts` sind Models, liegen aber in `core/services/gaming/`.
- `gametime` vs. `game-time` für denselben Begriff.
- `game-session/services/xml/*.ts` enthält reine Funktionen, keine Services.
- `session-test-data.ts` liegt zwischen Produktivcode und ist nicht als Testdatei erkennbar.

---

## Zielkonvention

Kebab-Case, die Rolle steht als Punkt-Suffix im Dateinamen. Der Dateiname folgt dem Klassen-/Typnamen ohne Rollenwort.

| Rolle               | Muster                                   | Inhalt               |
| ------------------- | ---------------------------------------- | -------------------- |
| Component           | `character-card.ts` (Angular-21-Default) | `CharacterCard`      |
| Service             | `game-session.service.ts`                | `GameSessionService` |
| Model / Interface   | `session-meta.model.ts`                  | `SessionMeta`        |
| Reine Hilfsfunktion | `xml.util.ts`                            | Funktionen           |
| XML-Mapper          | `meta.xml-mapper.ts`                     | `writeX` / `readX`   |
| Testdaten           | `<feature>/testing/<name>.fixtures.ts`   | Fabrikfunktionen     |
| Test                | `<dateiname>.spec.ts` (gleicher Stamm)   | Vitest-Specs         |

---

## Anforderungen

### 1. Konvention festschreiben und absichern

- `angular.json`: `"@schematics/angular:service": { "type": "service" }`, damit `ng g s` automatisch `*.service.ts` erzeugt.
- `.claude/rules/architecture.md`: Abschnitt „Dateinamen“ mit der Tabelle oben ergänzen; Verzeichnisstruktur an die neuen Pfade anpassen.

**Erwartetes Verhalten:** `ng g s services/foo` erzeugt `foo.service.ts` mit Klasse `FooService`.

---

### 2. `core/` umbenennen

```
core/services/gaming/gametime-service.ts         → core/services/game-time/game-time.service.ts
core/services/gaming/game-time.ts                → core/models/game-time.model.ts
core/services/gaming/game-time-span.ts           → core/models/game-time-span.model.ts
core/services/persistent/storage-service.ts      → core/services/storage/storage.service.ts
core/services/persistent/characters-database-service.ts
                                                 → core/services/characters/characters-db.service.ts
```

Zugehörige `*.spec.ts` mitbewegen (`game-time.spec.ts` → `game-time.model.spec.ts`).

---

### 3. `character-tracker` umbenennen

- Alle PascalCase-Models in `models/` → `kebab-case.model.ts` (z. B. `CharacterInfo.ts` → `character-info.model.ts`, `DamageTypes.ts` → `damage-types.model.ts`).
- `services/combat-calculator.ts` → `combat-calculator.service.ts`
- `services/character-creators/*-character-creator-service.ts` → `*-character-creator.service.ts`

---

### 4. `dungeon-tracker` umbenennen

- `models/DungeonBoardState.ts` → `dungeon-board-state.model.ts`, `DungeonPosition.ts` → `dungeon-position.model.ts`
- `services/dungeon-board-service.ts` → `dungeon-board.service.ts`

---

### 5. `game-session` umbenennen

```
services/game-session.ts       → services/game-session.service.ts
services/session-xml.ts        → services/session-xml.service.ts
services/session-file.ts       → services/session-file.service.ts
services/xml/meta-xml.ts       → xml/meta.xml-mapper.ts   (analog characters, deck, dungeon, game-time)
services/xml/xml-utils.ts      → xml/xml.util.ts
services/session-test-data.ts  → testing/session.fixtures.ts
models/session-meta.ts         → models/session-meta.model.ts
models/session-snapshot.ts     → models/session-snapshot.model.ts
```

---

### 6. Restliche Dateien und Dokumentation

- `card-manager` prüfen (folgt bereits weitgehend der Konvention).
- Pfadangaben in **offenen** Feature-/Refactoring-Requests und in `docs/api/` aktualisieren. Einträge in `ai-implementations-log.md` bleiben unverändert (Historie).

---

## Vorgehen

- Umbenennungen ausschließlich mit `git mv`, damit die Dateihistorie erhalten bleibt.
- Pro Punkt: Imports anpassen, danach `npm run lint`, `npm run test -- --watch=false`, `npm run build`.
- Reines Umbenennen: keine Logikänderungen, keine Klassen-Umbenennungen außer wo nötig.

---

## Akzeptanzkriterien

- [ ] Jede Service-Datei endet auf `.service.ts`, jede Model-Datei auf `.model.ts`
- [ ] Keine PascalCase-Dateinamen mehr unter `src/app/`
- [ ] Keine Models unter `services/`, keine Testdaten neben Produktivcode
- [ ] `ng g s` erzeugt `*.service.ts`
- [ ] `architecture.md` dokumentiert die Konvention und die aktuelle Struktur
- [ ] Verhalten der App unverändert
- [ ] `npm run lint`, `npm run test`, `npm run build` fehlerfrei
