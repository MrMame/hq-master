# Feature Request: Charakterart Held/Monster explizit speichern

**Datum:** 2026-10-17  
**Priorität:** Mittel  
**Status:** rejected (2026-10-17) — Die App soll nicht zwischen Helden und Monstern unterscheiden; alle sind Charaktere. Statt eines `kind`-Felds bekommen alle Tokens einen einheitlichen goldenen Rahmen (`docs/refactoring-requests/dungeon-token-required-character.md` #3). Creator-Services und Buttons bleiben vorerst unverändert.  
**Bezug:** `REQUIREMENTS.md` §1 und §3 (Zustände von Spielern und Gegnern), `.claude/rules/architecture.md` (Session-State-Services, Regel 9), entdeckt bei `dungeon-board-reactive-character-sync`

---

## Problem

`DungeonToken` färbt den Rahmen danach, ob der **Name** mit „hero“ beginnt:

```typescript
// dungeon-token.ts:75
const isHero: boolean = name.toLowerCase().startsWith('hero');
```

Ein Held namens „Aragorn“ bekommt dadurch den roten Monster-Rahmen. Der DM kann Spieler und Gegner auf dem Dungeon-Tracker nicht verlässlich unterscheiden.

Die Ursache liegt im Datenmodell: `CharacterInfo` hat kein Feld für die Charakterart. `type` ist der Element-Typ (`ElementalTypes`), den `HeroCharacterCreatorService` und `MonsterCharacterCreatorService` zufällig vergeben. Ob ein Charakter Held oder Monster ist, weiß nur der Creator, der ihn erzeugt hat; danach geht die Information verloren.

---

## Anforderungen

### 1. Feld `kind` in `CharacterInfo`

- Neues Model `CharacterKind = 'hero' | 'monster'` in `character-tracker/models/` und Pflichtfeld `kind: CharacterKind` in `CharacterInfo`.
- `HeroCharacterCreatorService` setzt `kind: 'hero'`, `MonsterCharacterCreatorService` `kind: 'monster'`.
- Alle übrigen Stellen, die `CharacterInfo` erzeugen (Dialoge, Fixtures), setzen `kind` explizit.

**Erwartetes Verhalten:** Jeder neu angelegte Charakter trägt seine Art dauerhaft.

---

### 2. Bestehende Daten ohne `kind` laden

- Im Storage (`characters`) und in alten XML-Spielständen fehlt `kind`.
- `CharactersDbService` bekommt einen `StorageCodec`, der fehlendes `kind` ergänzt; der XML-Mapper liest fehlendes `kind` ebenso.
- **Entschieden (2026-10-17):** Fehlt `kind`, wird der Charakter als `'monster'` geladen. Keine Migration über die Namensheuristik; Helden aus Altbeständen muss der DM bei Bedarf selbst umstellen.
- XML: `kind` wird geschrieben; ob die Formatversion steigt, bei der Umsetzung entscheiden (ältere Dateien müssen weiter ladbar sein).

**Erwartetes Verhalten:** Alte Spielstände und Storage-Daten laden ohne Fehler, jeder Charakter hat danach ein `kind`.

---

### 3. `DungeonToken` nutzt `kind`

- `tokenBorderClass` entscheidet über `character().kind === 'hero'` statt über den Namen.
- Abstimmen mit `docs/refactoring-requests/dungeon-token-required-character.md` (Pflicht-Input `character`); sinnvollerweise davor oder gemeinsam umsetzen.

**Erwartetes Verhalten:** Held „Aragorn“ → goldener Rahmen; Monster „Hero-Slayer“ → roter Rahmen.

---

### 4. Tests

- Creator-Specs: `kind` korrekt gesetzt.
- `CharactersDbService`: `describePersistedState` mit Altbestand ohne `kind` (Codec-Fallback).
- `characters.xml-mapper` / `session-xml.service`: Roundtrip mit `kind`, Laden einer Datei ohne `kind`.
- `DungeonToken`: Rahmenfarbe je `kind`, unabhängig vom Namen.

---

## Betroffene Dateien

| Datei                                                                        | Änderung                       |
| ---------------------------------------------------------------------------- | ------------------------------ |
| `src/app/features/character-tracker/models/character-info.model.ts`          | Feld `kind`                    |
| `src/app/features/character-tracker/models/character-kind.model.ts`          | Neu: `CharacterKind`           |
| `src/app/features/character-tracker/services/character-creators/*.ts`        | `kind` setzen (+spec)          |
| `src/app/core/services/characters/characters-db.service.ts`                  | Codec für Altbestand (+spec)   |
| `src/app/features/game-session/xml/characters.xml-mapper.ts`                 | `kind` schreiben/lesen (+spec) |
| `src/app/features/game-session/testing/session.fixtures.ts`                  | `kind` in Testcharakteren      |
| `src/app/features/dungeon-tracker/components/dungeon-token/dungeon-token.ts` | Rahmen über `kind`             |

---

## Akzeptanzkriterien

- [ ] `CharacterInfo.kind` existiert und wird von beiden Creators gesetzt
- [ ] Storage- und XML-Altbestände ohne `kind` laden fehlerfrei mit Default `'monster'`
- [ ] Rahmenfarbe im Dungeon-Tracker hängt nur von `kind` ab, nicht vom Namen
- [ ] Testfälle aus Punkt 4 vorhanden
- [ ] Alle Vitest-Tests laufen durch (`npm run test`), Build fehlerfrei (`npm run build`)
