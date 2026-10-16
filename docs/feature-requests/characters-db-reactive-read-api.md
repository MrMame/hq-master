# Feature Request: `CharactersDbService` — öffentliche Snapshot-Lesemethode entfernen

**Datum:** 2026-10-16  
**Priorität:** Mittel  
**Status:** Offen  
**Bezug:** `.claude/rules/architecture.md` → „Session-State-Services: reaktive Schnittstelle“, Punkt 2 (und Punkt 6)

---

## Problem

`CharactersDbService.readCharacters()` ([characters-database-service.ts:17](../../src/app/core/services/persistent/characters-database-service.ts#L17)) ist `public` und liefert einen **einmaligen Snapshot** direkt aus dem `StorageService` — am Signal `characters` vorbei.

Laut Architekturregel Punkt 2 dürfen Session-Services keine öffentlichen Snapshot-Lesemethoden (`readX(): T`) anbieten; Lesen aus dem Storage ist nur `private` zur Initialisierung erlaubt.

Einziger externer Aufrufer:

```typescript
// character-tracker-page.ts:46
const charactersFromDb: CharacterInfo[] =
  this.charactersDbService.readCharacters() ||
  this.monsterCharacterCreatorService.getInitMonsterCharacters();
```

Folgen:

- Die `CharacterTrackerPage` liest den Bestand **einmalig im Constructor** und kopiert ihn in ein lokales Signal (verstößt zusätzlich gegen Punkt 6).
- Die Seed-Logik („Storage leer → Init-Monster“) liegt in der Komponente. Die Init-Monster werden dabei **nicht persistiert** und erscheinen daher nicht im Dungeon-Tracker, bis ein Charakter geschrieben wird.
- Die Unterscheidung „nie gespeichert“ (`null`) vs. „bewusst leer“ (`[]`) geht verloren, sobald man auf das Signal (`?? []`) umstellt — sie muss deshalb in den Service wandern.

---

## Anforderungen

### 1. `readCharacters()` privatisieren

- `readCharacters()` → `private loadCharacters(): CharacterInfo[]`, nur zur Signal-Initialisierung verwendet.
- Keine öffentliche Methode des Service liefert mehr einen Snapshot; Lesen ausschließlich über `characters: Signal<CharacterInfo[]>`.

**Erwartetes Verhalten:** Außerhalb des Service gibt es keinen Aufrufer mehr, der Charaktere am Signal vorbei liest.

---

### 2. `CharacterTrackerPage` — Einmal-Read und lokale Kopie entfernen

- **Fund:** Die Page liest den Bestand **einmalig im Constructor** (`loadMonstersFromDb()`) und kopiert ihn in das lokale `WritableSignal` `movableCharacterItems`. Verstößt gegen Architekturregel Punkt 6.
- `loadMonstersFromDb()` und den Constructor-Aufruf entfernen.
- `movableCharacterItems` als `computed()` aus `charactersDbService.characters()` ableiten.
- Reine UI-Positionen (x/y der Karten) separat pro `character.id` halten, damit sie bei Signal-Änderungen erhalten bleiben.
- `addMonster()` / `addHero()` schreiben nur noch über `writeCharacter()`; das lokale `update()` des Item-Arrays entfällt.

**Erwartetes Verhalten:** Charakter hinzufügen/entfernen → Liste aktualisiert sich ausschließlich über das Service-Signal; Kartenpositionen bleiben erhalten.

---

### 3. Init-Monster im Service seeden und persistieren

- **Fund:** Ist der Storage leer, erzeugt die Page Init-Monster (`getInitMonsterCharacters()`), **persistiert sie aber nicht**. Sie existieren nur in der lokalen Kopie der Page und fehlen daher im Dungeon-Tracker, bis irgendein Charakter geschrieben wird.
- Seed-Logik aus der Page in `CharactersDbService` verlagern.
- Beim Seeden die Init-Monster sofort über die zentrale Persistenz-Methode speichern.

**Erwartetes Verhalten:** Erster App-Start mit leerem Storage → Init-Monster erscheinen sofort in Character- **und** Dungeon-Tracker und überleben einen Reload.

---

### 4. Unterscheidung „nie gespeichert“ vs. „bewusst leer“ erhalten

- **Fund:** Die Page unterscheidet aktuell `null` (kein Eintrag) von `[]` (alle gelöscht) nur implizit über `readCharacters() || init` — das funktioniert lediglich, weil `[]` truthy ist. Das Service-Signal initialisiert dagegen mit `?? []` und verliert die Unterscheidung vollständig. Wird die Page auf das Signal umgestellt, ginge das Verhalten verloren.
- Die private Init-Methode prüft explizit auf `null`:
  - `null` → Seed (siehe Punkt 3).
  - `[]` → bleibt leer.
- Verhalten mit Tests absichern.

**Erwartetes Verhalten:** Nutzer löscht alle Charaktere → nach Reload bleibt die Liste leer, es werden **keine** Init-Monster erneut erzeugt.

---

### 5. Keine Abhängigkeit `core/` → `features/*/services/`

- **Fund:** Die Init-Monster stammen aus `MonsterCharacterCreatorService` (Feature-Service). Würde `CharactersDbService` diesen direkt injizieren, hinge `core/` von einem Feature-Service ab.
- Init-Daten bereitstellen über
  - eine Konstante/Factory in `features/character-tracker/models/` **oder**
  - ein `InjectionToken` (z. B. `INITIAL_CHARACTERS`), das in `app.config.ts` befüllt wird.
- `MonsterCharacterCreatorService.getInitMonsterCharacters()` auf die neue Quelle umstellen oder entfernen.

**Erwartetes Verhalten:** `core/` importiert nichts aus `features/*/services/`.

---

### 6. Dialog-Charaktere (`addCharacter()`) — Abstimmung mit `shared-session-state.md` §5

- **Fund:** `addCharacter()` schreibt das Dialog-Ergebnis nur in die lokale Kopie, nicht in die DB, und vergibt eine fortlaufende Zahl als `id` (`newId`) statt einer eindeutigen ID.
- Umsetzung erfolgt in `shared-session-state.md` §5. Hier nur sicherstellen, dass nach Punkt 2 auch der Dialog-Pfad ausschließlich über `writeCharacter()` läuft.
- Reihenfolge: §5 zuerst oder gemeinsam mit Punkt 2 umsetzen, da Punkt 2 das lokale `update()` entfernt.

**Erwartetes Verhalten:** Charakter per Dialog anlegen → sofort im Character- und Dungeon-Tracker sichtbar, mit eindeutiger `id`.

---

## Betroffene Dateien

| Datei                                                                                                 | Änderung                                                   |
| ----------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| `src/app/core/services/persistent/characters-database-service.ts`                                     | `readCharacters()` privat, Seed-Logik + Persistenz         |
| `src/app/core/services/persistent/characters-database-service.spec.ts`                                | Tests für Init (null → Seed, `[]` → leer), Signal-Updates  |
| `src/app/features/character-tracker/components/character-tracker-page/character-tracker-page.ts`      | Reaktive Anbindung via `computed()`, Snapshot-Read weg     |
| `src/app/features/character-tracker/services/character-creators/monster-character-creator-service.ts` | Init-Monster ggf. als Konstante/Factory auslagern          |
| `src/app/app.config.ts`                                                                               | Nur falls `InjectionToken`-Variante (Punkt 5) gewählt wird |

---

## Akzeptanzkriterien

- [ ] `CharactersDbService` hat keine öffentliche Methode, die `CharacterInfo[]` zurückgibt
- [ ] `grep readCharacters src/` findet keine Aufrufer außerhalb des Service
- [ ] `CharacterTrackerPage` hat keinen Einmal-Read und keine lokale Kopie der Charakterliste mehr
- [ ] Leerer Storage → Init-Monster werden persistiert und sind im Dungeon-Tracker sichtbar
- [ ] Gespeichertes `[]` bleibt nach Reload leer
- [ ] `core/` importiert nichts aus `features/*/services/`
- [ ] Dialog-Charaktere werden über `writeCharacter()` persistiert (gemeinsam mit `shared-session-state.md` §5)
- [ ] Alle Vitest-Tests laufen durch (`npm run test`), Build fehlerfrei (`npm run build`)
