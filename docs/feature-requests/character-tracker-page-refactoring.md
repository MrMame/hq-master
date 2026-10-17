# Feature Request: `CharacterTrackerPage` — Refactoring & Strukturierung

**Datum:** 2026-10-16  
**Priorität:** Mittel  
**Status:** Offen  
**Bezug:** `.claude/rules/clean-code.md` (max. 150 Zeilen, SRP), `.claude/rules/architecture.md` („Session-State-Services“, Punkte 5 und 6), `.claude/rules/testing.md` (kein `any`, Testabdeckung)

---

## Problem

[character-tracker-page.ts](../../src/app/features/character-tracker/components/character-tracker-page/character-tracker-page.ts) hat **179 Zeilen** (Limit: 150) und vereint mehrere Verantwortlichkeiten in einer Klasse:

- Laden und Halten der Charakterliste (lokale Kopie, siehe `characters-db-reactive-read-api.md`)
- Anlegen von Monstern, Helden und Dialog-Charakteren (dreifach duplizierter Code)
- Kartenlayout: Position, Drag & Drop, „nach vorne holen“, Minimieren
- Öffnen und Auswerten von zwei Dialogen (doppelte Dialog-Konfiguration)
- Schadensberechnung inkl. manuellem „Referenz-Auffrischen“ nach In-Place-Mutation

Dazu kommt ein 102 Zeilen langes Template, das Karten-Wrapper, minimierte Ansicht und Vollansicht in einer Datei enthält.

---

## Abgrenzung zu anderen Feature Requests

| Thema                                                                | Umgesetzt in                               |
| -------------------------------------------------------------------- | ------------------------------------------ |
| Einmal-Read im Constructor, `movableCharacterItems` als `computed()` | `characters-db-reactive-read-api.md` §2    |
| Init-Monster im Service seeden                                       | `characters-db-reactive-read-api.md` §3–§5 |
| `addCharacter()` persistiert Dialog-Ergebnis, eindeutige `id`        | `shared-session-state.md` §5               |

Dieser Feature Request baut darauf auf und **setzt `characters-db-reactive-read-api.md` §2 voraus** (bzw. wird gemeinsam damit umgesetzt), da sich die Datenhaltung der Page dadurch grundlegend ändert.

---

## Anforderungen

### 1. Kartenlayout in eigenen Feature-Service auslagern

- **Fund:** Position (`x`/`y`), `showTop` und `isMinimised` werden **in-place** am `MovableCharacterItem` mutiert (`onDragEnded`, `showMovableCharacterItemOnTop`, `toggleMinimise()` im Template). Verstößt gegen Architekturregel Punkt 5 (Immutable Updates).
- Neuer Service `features/character-tracker/services/character-card-layout-service.ts` (per `ng g s`):
  - privates `WritableSignal<Record<string, CardLayout>>`, Schlüssel = `character.id`
  - Methoden: `moveBy(id, offset)`, `bringToFront(id)`, `toggleMinimised(id)`, `layoutFor(id)` als `computed`-fähiger Zugriff
  - Default-Position für neue Karten (aktuell `newCharacterCardPosition` / Index-Staffelung) zentral im Service
- Entscheiden und dokumentieren, ob das Layout persistiert wird (Session-State gemäß REQUIREMENTS §0) — falls ja, über `StorageService`.

**Erwartetes Verhalten:** Karte verschieben/nach vorne holen/minimieren → Zustand ändert sich nur über den Service, die Page enthält keine Layoutlogik mehr.

---

### 2. Dialoge kapseln und typisieren

- **Fund:** `addCharacter()` und `openDamageTakenDialog()` duplizieren die Dialog-Konfiguration (`80vw`/`80vh`). `afterClosed()` liefert ungetypt `any`, das ohne Typprüfung weiterverwendet wird (`{ ...result, id: newId }`). Verstößt gegen `testing.md` (kein `any`).
- Dialog-Konfiguration als gemeinsame Konstante.
- `MatDialogRef<Dialog, Result>` mit konkretem Ergebnistyp (`CharacterInfo` bzw. `number`) in Aufrufer **und** Dialogen; `close(false)` durch `close()` (→ `undefined`) ersetzen.
- Optional: kleiner Service `character-dialogs` mit `openAddCharacter(): Observable<CharacterInfo | undefined>` und `openDamageTaken(): Observable<number | undefined>`.

**Erwartetes Verhalten:** Kein `any` im Dialog-Pfad; Dialog-Größe an genau einer Stelle definiert.

---

### 3. Anlegen von Charakteren vereinheitlichen

- **Fund:** `addMonster()`, `addHero()` und `addCharacter()` enthalten jeweils denselben Block (`newId` berechnen, `MovableCharacterItem` erzeugen, `update()`).
- Gemeinsamer privater Pfad: `CharacterInfo` erzeugen → `charactersDbService.writeCharacter()`. Die Karte entsteht reaktiv über das Signal (siehe Abgrenzung).
- Die fortlaufende `newId` (`length + 1`) entfällt; Kartenidentität ist `character.id` (bei Löschen + Neuanlegen entstehen sonst doppelte IDs).

**Erwartetes Verhalten:** Jede Anlege-Methode ist ein Einzeiler bzw. delegiert an denselben Pfad.

---

### 4. Schadensberechnung ohne In-Place-Mutation

- **Fund:** `CombatCalculatorService.applyDamage(item, …)` mutiert `item.characterInfo` direkt; die Page erzeugt danach per Spread eine neue Referenz, damit Signals feuern (inkl. auskommentiertem Alternativcode).
- `applyDamage` als reine Funktion: `(character: CharacterInfo, type, damage) => CharacterInfo`.
- Page schreibt das Ergebnis nur noch über `writeCharacter()`.
- Gleiches für `updateCharacterInList()`: Signal-Update entfällt, nur noch `writeCharacter()` (aktuell Schreibzugriff **innerhalb** eines `update()`-Callbacks).

**Erwartetes Verhalten:** Schaden zufügen → neuer `CharacterInfo` wird persistiert, Karte und Dungeon-Tracker aktualisieren sich über das Service-Signal.

---

### 5. Template in Unterkomponenten aufteilen

- Karten-Wrapper (Drag, Position, Griffleiste) als eigene Komponente, z. B. `movable-character-card` (per `ng g c`).
- Minimierte Ansicht (Bild, Treffer-Buttons, Health/Armor) als eigene Komponente, z. B. `character-card-minimised`.
- Signal-Inputs/Outputs (`input()`, `output()`), keine `@Input()`/`@Output()`.

**Erwartetes Verhalten:** `character-tracker-page.html` enthält nur Menü und `@for`-Schleife; keine Datei > 150 Zeilen.

---

### 6. Aufräumen

- Selector `app-monster-tracker-page` → `app-character-tracker-page`.
- Spec-Beschreibung `CharacterTrackerExPage` → `CharacterTrackerPage`.
- Injizierte Services `private readonly`; `DamageTypes`-Feld `protected readonly`.
- Tippfehler `removeMovableCharacteritem` → `removeCharacter`.
- Veraltete Kommentare entfernen („HIER KORRIGIERT“, „Diese Methode in die Klasse … einfügen“, nummerierte Schritt-Kommentare, auskommentierter Code).

---

### 7. Tests

- **Fund:** Die Page hat nur einen `should create`-Test.
- Tests für: Anlegen (Monster/Held/Dialog → `writeCharacter` aufgerufen), Löschen, Schaden (Dialog-Ergebnis → neuer `CharacterInfo` persistiert, Abbruch → nichts passiert), Layout-Service (verschieben, nach vorne holen, minimieren, immutable Updates), reine `applyDamage`-Funktion.
- Mocks mit `vi.fn()`.

---

## Betroffene Dateien

| Datei                                                                                                 | Änderung                                     |
| ----------------------------------------------------------------------------------------------------- | -------------------------------------------- |
| `src/app/features/character-tracker/components/character-tracker-page/character-tracker-page.ts`      | Verantwortlichkeiten auslagern, < 150 Zeilen |
| `src/app/features/character-tracker/components/character-tracker-page/character-tracker-page.html`    | Auf Menü + Schleife reduzieren               |
| `src/app/features/character-tracker/components/character-tracker-page/character-tracker-page.spec.ts` | Neue Tests                                   |
| `src/app/features/character-tracker/services/character-card-layout-service.ts` (neu)                  | Kartenlayout-State                           |
| `src/app/features/character-tracker/components/movable-character-card/` (neu)                         | Karten-Wrapper                               |
| `src/app/features/character-tracker/components/character-card-minimised/` (neu)                       | Minimierte Ansicht                           |
| `src/app/features/character-tracker/services/combat-calculator.service.ts`                            | `applyDamage` als reine Funktion             |
| `src/app/features/character-tracker/components/add-character-dialog/add-character-dialog.ts`          | Typisiertes Dialog-Ergebnis                  |
| `src/app/features/character-tracker/components/damage-taken-dialog/damage-taken-dialog.ts`            | Typisiertes Dialog-Ergebnis                  |
| `src/app/features/character-tracker/models/movable-character-item.model.ts`, `movable-item.model.ts`  | Ggf. ersetzen durch `CardLayout`-Typ         |

---

## Akzeptanzkriterien

- [ ] Keine Datei im Feature `character-tracker` hat mehr als 150 Zeilen
- [ ] `CharacterTrackerPage` enthält keine Layout-, Dialog-Konfigurations- oder Schadenslogik mehr
- [ ] Keine In-Place-Mutation von `CharacterInfo` oder Karten-Layout
- [ ] Kein `any` im Dialog-Pfad (typisierte `MatDialogRef<…, Result>`)
- [ ] Anlegen, Löschen, Schaden und Layout sind mit Vitest-Tests abgedeckt
- [ ] Verhalten in der UI unverändert (Drag & Drop, Minimieren, nach vorne holen, Schaden, Löschen)
- [ ] `npm run lint`, `npm run test`, `npm run build` fehlerfrei
