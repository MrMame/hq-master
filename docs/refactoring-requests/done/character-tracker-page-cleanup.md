# Refactoring Request: CharacterTrackerPage aufräumen

**Datum:** 2026-10-17  
**Priorität:** Mittel  
**Status:** done (2026-10-17 18:14) — bereits erfüllt durch `character-tracker-page-refactoring` #1–#7  
**Bezug:** `.claude/rules/architecture.md` (Session-State-Services Regeln 2 und 6, Dateigrößenlimit), `.claude/rules/clean-code.md` (File Length), entdeckt bei `shared-session-state` #5

---

## Problem

Bei der Umsetzung von `shared-session-state` #5 sind in `CharacterTrackerPage` und `CharactersDbService` drei vorbestehende Abweichungen von den Projektregeln aufgefallen:

- `character-tracker-page.ts` ist mit 184 Zeilen länger als das Limit von 150 Zeilen.
- Die Seite kopiert die Charaktere einmalig im Constructor in ein lokales Signal, statt das Signal des `CharactersDbService` zu binden. `readCharacters()` ist ein öffentlicher Snapshot-Getter.
- Die numerischen Item-IDs der Karten (`length + 1`) können nach dem Löschen einer Karte doppelt vergeben werden.

---

## Anforderungen

### 1. `character-tracker-page.ts` — Dateilänge ≤ 150 Zeilen ✅ done (bereits erfüllt, 2026-10-17 18:14)

- **Problem:** `src/app/features/character-tracker/components/character-tracker-page/character-tracker-page.ts` hat 184 Zeilen.
- Logik in kleinere Einheiten auslagern, z. B. Dialog-Handling (`addCharacter`, `openDamageTakenDialog`) in einen eigenen Service oder Kartenpositionierung in eine `*.util.ts`.
- Neue Services/Komponenten nur per Angular CLI erzeugen.

**Erwartetes Verhalten:** Unverändertes Verhalten der Seite; jede beteiligte Datei ≤ 150 Zeilen.

---

### 2. `CharacterTrackerPage` / `CharactersDbService` — Signal binden statt Snapshot kopieren ✅ done (bereits erfüllt, 2026-10-17 18:14)

- **Problem:** `loadMonstersFromDb()` (Aufruf im Constructor) liest `charactersDbService.readCharacters()` einmalig und kopiert das Ergebnis in `movableCharacterItems` (Architekturregel 6). Ändert ein anderes Feature die Charaktere, z. B. `GameSessionService.restoreSnapshot()` beim Laden einer Session, sieht die Seite das erst nach erneuter Navigation.
- `CharactersDbService.readCharacters()` ist ein öffentlicher Snapshot-Getter (Architekturregel 2). Er soll `private` werden (z. B. `load()`) und nur der Initialisierung dienen.
- Die Kartenliste aus `charactersDbService.characters()` ableiten (`computed()`); UI-Zustand wie Position und `showTop` getrennt pro Charakter-`id` halten.
- Fallback auf `getInitMonsterCharacters()` bei leerer DB klären: im Service-Default oder bewusst entfernen.

**Erwartetes Verhalten:** Session laden oder Charakter in einem anderen Feature ändern → Character-Tracker zeigt den neuen Stand sofort, ohne Navigation.

---

### 3. Eindeutige Item-IDs der Charakterkarten ✅ done (bereits erfüllt, 2026-10-17 18:14)

- **Problem:** `addHero()`, `addMonster()` und `addCharacter()` vergeben `newId = movableCharacterItems().length + 1`. Nach dem Löschen einer Karte kann eine ID doppelt vorkommen. `openDamageTakenDialog()` und `updateCharacterInList()` vergleichen über `item.id` und können dadurch die falsche Karte treffen.
- Karten über die eindeutige `characterInfo.id` (string) identifizieren oder eine garantiert eindeutige Item-ID vergeben.

**Erwartetes Verhalten:** Karte löschen, neue Karte anlegen, Schaden auf eine Karte anwenden → nur diese eine Karte wird geändert.

---

## Akzeptanzkriterien

- [x] Alle Dateien der `CharacterTrackerPage` ≤ 150 Zeilen
- [x] Kein öffentlicher `readCharacters()`-Snapshot-Getter mehr; Seite bindet `charactersDbService.characters`
- [x] Karten-IDs sind auch nach Löschen und Neuanlegen eindeutig (Test vorhanden)
- [x] Alle Vitest-Tests grün (`npm run test`), Lint und Build fehlerfrei
