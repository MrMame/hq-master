# Refactoring Request: `DungeonToken` — `character` als Pflicht-Input

**Datum:** 2026-10-17  
**Priorität:** Niedrig  
**Status:** Offen  
**Bezug:** `.claude/rules/testing.md` (präzise Typen), entdeckt bei `dungeon-board-reactive-character-sync` #6; #3 aus dem verworfenen `docs/feature-requests/done/character-kind-hero-monster.md`

---

## Problem

`DungeonToken` erlaubt `character = undefined`:

```typescript
// dungeon-token.ts:48
character: InputSignal<CharacterInfo | undefined> = input<CharacterInfo | undefined>(undefined);
```

Seit `dungeon-board-reactive-character-sync` #6 rendert die `DungeonTrackerPage` Tokens ausschließlich aus `DungeonBoardService.tokens()`, das Positionen ohne Charakter ausfiltert. Der Fall `undefined` tritt damit nicht mehr auf. Die Komponente trägt trotzdem Fallback-Logik dafür (`character()?.name ?? '?'`, `?? ''`, `character()!.image` im Template).

---

## Anforderungen

### 1. `character` auf `input.required<CharacterInfo>()` umstellen

- Input-Typ auf `InputSignal<CharacterInfo>` ändern.
- Optional-Chaining und Non-Null-Assertions (`?.`, `!`, `?? '?'`, `?? ''`) in Template und `computed()`s entfernen.
- Verhalten bleibt unverändert: gleiche Initialen, gleiches Bild, gleicher Titel.

**Erwartetes Verhalten:** Kein `undefined`-Pfad mehr in `DungeonToken`; der Compiler erzwingt einen Charakter.

---

### 2. Spec für `DungeonToken` anlegen

- **Fund:** Für `dungeon-token.ts` existiert keine `.spec.ts`.
- Testfälle: Position in Pixeln (`tokenLeft`/`tokenTop` inkl. Offset), Initialen bei fehlendem Bild, Bild bei vorhandenem `image`, `tokenMoved` nach Drag-Ende mit gerundetem Feld (nicht negativ), `tokenDoubleClicked` mit `characterId`, einheitlicher Rahmen (Punkt 3).

---

### 3. Einheitlicher goldener Rahmen statt Held/Monster-Heuristik

- **Fund:** `tokenBorderClass` rät die Charakterart über den Namen (`name.toLowerCase().startsWith('hero')` → gold, sonst rot). Ein Held „Aragorn“ wird rot dargestellt.
- **Entscheidung (2026-10-17):** Die App unterscheidet nicht zwischen Helden und Monstern; alle sind Charaktere.
- `tokenBorderClass`-`computed()` samt Kommentar entfernen; der Token erhält fest `border-yellow-400 shadow-yellow-400/50 shadow-md` in seiner `class`-Liste.
- Kleine sichtbare Änderung: bisher rot umrandete Tokens werden gold.

**Erwartetes Verhalten:** Alle Tokens haben unabhängig vom Namen denselben goldenen Rahmen.

---

## Betroffene Dateien

| Datei                                                                             | Änderung                                          |
| --------------------------------------------------------------------------------- | ------------------------------------------------- |
| `src/app/features/dungeon-tracker/components/dungeon-token/dungeon-token.ts`      | Pflicht-Input, Fallbacks entfernen, fester Rahmen |
| `src/app/features/dungeon-tracker/components/dungeon-token/dungeon-token.spec.ts` | Neu: Tests (Punkt 2)                              |

---

## Akzeptanzkriterien

- [ ] `character` ist `input.required<CharacterInfo>()`
- [ ] Keine `?.`/`!`-Zugriffe auf `character()` mehr in `DungeonToken`
- [ ] `tokenBorderClass` existiert nicht mehr; alle Tokens haben den goldenen Rahmen
- [ ] `dungeon-token.spec.ts` deckt die Fälle aus Punkt 2 ab
- [ ] Alle Vitest-Tests laufen durch (`npm run test`), Build fehlerfrei (`npm run build`)
