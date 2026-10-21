# Feature Request: Character Tracker entfernen

**Datum:** 2026-10-21  
**Priorität:** Hoch  
**Status:** done (2026-10-21 20:17) — #1–#7 umgesetzt; Startseite Dungeon Tracker, Schadenslogik und Creator nach `core/`/`shared/` verschoben, localStorage-Key bleibt liegen (entschieden 2026-10-21)  
**Bezug:** `REQUIREMENTS.md` (Character Tracker, Dungeon Tracker), `.claude/rules/architecture.md` → „Session-State-Services: reaktive Schnittstelle“ (Regel 9), Folge-Requests `docs/feature-requests/dungeon-token-damage.md` und `docs/feature-requests/character-editor-random-character.md`

---

## Problem

Der Character Tracker (`/charactertracker`) ist inzwischen eine zweite Oberfläche für dieselben
Charaktere. Anlegen, Bearbeiten und Entfernen laufen über den systemweiten `CharacterEditorDialog`
im Dungeon Tracker. Der Character Tracker hält dazu einen eigenen Session-Slice (`characterCards`:
Kartenposition, Minimierung, Stapelreihenfolge), der nur für ihn existiert und in jedem Spielstand
mitgeschrieben wird.

Zwei Funktionen gibt es nur im Character Tracker. Sie bleiben als Bausteine erhalten und kommen mit
den Folge-Requests in den Dungeon Tracker bzw. den Editor:

| Funktion                                      | Bausteine                                                       | Folge-Request                          |
| --------------------------------------------- | --------------------------------------------------------------- | -------------------------------------- |
| Schaden auf Rüstung bzw. direkt auf Leben     | `DamageTypes`, `applyDamage()`, `DamageTakenDialog`             | `dungeon-token-damage.md`              |
| Zufällige Charaktere („Add Hero/Add Monster“) | `HeroCharacterCreatorService`, `MonsterCharacterCreatorService` | `character-editor-random-character.md` |

---

## Ziel

- Feature-Ordner `src/app/features/character-tracker/`, Route und Navigationslink sind entfernt.
- **Startseite ist der Dungeon Tracker** (`''` und `'**'` leiten auf `/dungeontracker` um).
- Der Session-Slice `characterCards` ist entfernt. Neue Spielstände enthalten kein `<characterCards>`
  mehr, ältere Dateien mit `<characterCards>` lassen sich weiterhin laden.
- Schadenslogik und Zufalls-Generatoren liegen unverändert unter `core/` bzw. `shared/`.
- Der Key `character_card_layout` bleibt im localStorage vorhandener Browser liegen
  (entschieden 2026-10-21). Die App liest und löscht ihn nicht.

---

## Anforderungen

### 1. Bausteine verschieben, die erhalten bleiben ✅ done (2026-10-21 20:17)

Per `git mv`, damit die Historie erhalten bleibt. Inhalt unverändert, nur Importpfade anpassen:

| Von (`src/app/features/character-tracker/…`)                           | Nach (`src/app/…`)                         |
| ---------------------------------------------------------------------- | ------------------------------------------ |
| `models/damage-types.model.ts`                                         | `core/models/damage-types.model.ts`        |
| `utils/damage.util.ts` + `.spec.ts`                                    | `shared/utils/damage.util.ts` + `.spec.ts` |
| `components/damage-taken-dialog/` (`.ts`, `.html`, `.css`, `.spec.ts`) | `shared/components/damage-taken-dialog/`   |
| `services/character-creators/` (2 Services + 2 Specs)                  | `shared/services/character-creators/`      |

- `DamageTypes` kommt nach `core/models/`, weil `shared/` und der Dungeon Tracker es nutzen werden
  (Importregel in `architecture.md`).
- Die verschobenen Dateien importieren danach nur noch aus `core/` und `shared/`, nichts aus
  `features/`.
- Look (dunkler Dialog) und Verwendung ändern sich erst mit den Folge-Requests. Bis dahin hat
  kein Produktivcode einen Aufrufer für diese Bausteine; ihre Specs laufen am neuen Ort weiter.

**Erwartetes Verhalten:** Die verschobenen Specs laufen am neuen Ort unverändert grün.

---

### 2. Session-Slice `characterCards` entfernen ✅ done (2026-10-21 20:17)

- `core/session-state/session-slices.ts`: Feld `characterCards` und Import von `CardLayoutState`
  entfernen.
- `core/session-state/session-keys.ts`: `characterCardLayout` entfernen. Bei der Umsetzung am
  2026-10-21 nach #4 verschoben: Der `CharacterCardLayoutService` im Feature nutzt den Key bis zu
  seiner Löschung, sonst bräche der Build zwischen #2 und #4.
- `features/game-session/services/game-session.service.ts`: Import, Eintrag in `slices` und Feld im
  `snapshot` entfernen.
- `features/game-session/services/session-xml.service.ts`: Import, `writeCardLayouts(…)` und
  `readCardLayouts(…)` entfernen. `FORMAT_VERSION` bleibt `'1'`: Der Parser liest nur die Elemente,
  die er kennt, ein vorhandenes `<characterCards>` wird übersprungen.
- `features/game-session/xml/card-layout.xml-mapper.ts` löschen.
- Tests:
  - `game-session.service.spec.ts`: Import sowie die Einträge in `slices()` und `parts` entfernen.
  - `session-xml.service.spec.ts`: Die beiden Tests zu `<characterCards>` ersetzen durch
    „liest eine ältere Datei mit `<characterCards>` und ignoriert das Element“. Dazu ein
    `<characterCards>`-Element in serialisiertes XML einfügen und prüfen, dass `parse()` den
    Snapshot ohne Abweichung liefert.
  - `game-session/testing/session.fixtures.ts`: Block `characterCards` entfernen.

**Erwartetes Verhalten:** Speichern schreibt kein `<characterCards>` mehr. Ältere Spielstände mit
diesem Element laden ohne Fehler, alle übrigen Zustände kommen vollständig zurück.

---

### 3. Routing und Navigation ✅ done (2026-10-21 20:17)

- `app.routes.ts`: Route `charactertracker` entfernen; `''` und `'**'` leiten auf `dungeontracker` um.
- `app.ts`: Link „Character Tracker“ entfernen.
- `app.spec.ts`: Erwartete Navigationslinks ohne `/charactertracker`.

**Erwartetes Verhalten:** Die App startet im Dungeon Tracker. Unbekannte Pfade landen ebenfalls dort.
Die Navigation zeigt Game Session, Card Manager, Time Tracker und Dungeon Tracker.

---

### 4. Feature-Ordner löschen ✅ done (2026-10-21 20:17)

- `git rm -r src/app/features/character-tracker` (die nach #1 verbliebenen 28 Dateien).
- Danach findet eine Suche nach
  `character-tracker|charactertracker|CharacterTracker|CardLayout|characterCards|CharacterDialogsService|AddCharacterDialog|MovableCharacterCard`
  in `src/` und `e2e/` (ohne `e2e/probe/`) keinen Treffer mehr. Ausnahmen: der
  Kompatibilitätstest für alte Spielstände in `session-xml.service.spec.ts` (#2) und der
  Umleitungstest für `/charactertracker` in `e2e/routes.spec.ts` (#6).

**Erwartetes Verhalten:** Lint, Tests und Build laufen ohne das Feature.

---

### 5. Verwaiste Design-Tokens entfernen ✅ done (2026-10-21 20:17)

- `src/styles/tokens.css` enthält heute nur genutzte Tokens. Tokens, die nach #1–#4 nirgends mehr
  per `var(--…)` referenziert werden, werden gelöscht. Ermitteln per Skript über `src/`.
- Tokens, die der verschobene `DamageTakenDialog` nutzt, bleiben.
- Umgesetzt am 2026-10-21: 14 Tokens gelöscht (`--color-gray-200/-300`, `--color-red-500`,
  `--color-yellow-700`, `--color-blue-400`, `--color-pink-500/-900`, `--color-indigo-material`,
  `--color-border-light`, `--space-0-5`, `--space-20`, `--shadow-md`, `--shadow-hover`,
  `--shadow-box`). `--color-card-manager-menu` war schon vorher ungenutzt; er bleibt, weil er nicht
  zu diesem Request gehört.
- **Bleiben erhalten:** `public/img/hit-normal.svg` und `hit-critical.svg` (Folge-Request
  `dungeon-token-damage.md`) sowie alle Helden- und Monsterbilder (`CHARACTER_IMAGES`).

**Erwartetes Verhalten:** Die Optik aller verbliebenen Seiten bleibt gleich.

---

### 6. E2E-Smoke-Tests umstellen ✅ done (2026-10-21 20:17)

- Neuer Helfer `e2e/support/create-character.ts` (kein `*.spec.ts`, wird also nicht als Test
  ausgeführt): `createCharacter(page, name)` öffnet `/dungeontracker`, klickt „Character Neu“,
  füllt den Namen, wählt „Bild 1“ und klickt „Übernehmen“.
- `routes.spec.ts`: Eintrag `/charactertracker` entfernen. Die Umleitungstests für `/` und
  `/gibt-es-nicht` erwarten `/dungeontracker` und den Marker „Dungeon Tracker“. Bei der Umsetzung
  kam `/charactertracker` als dritter Umleitungsfall hinzu (alte Lesezeichen).
- `character-editor.spec.ts`: `editNewMonster()` legt den Charakter über den Helfer an (neuer Name
  `editNewCharacter()`). Der Test „Character Neu“ darf den Helfer ebenfalls nutzen.
- `dungeon-drag.spec.ts`: Charakter über den Helfer anlegen.
- `session-roundtrip.spec.ts`: `character_card_layout` aus der Key-Liste entfernen; Charaktere über
  den Helfer anlegen.
- `character-persistence.spec.ts` löschen. Persistenz nach einem Reload prüft
  `character-editor.spec.ts` („keeps its new name after a reload“).
- Lokale Proben unter `e2e/probe/` (gitignored), die `/charactertracker` aufrufen, werden gelöscht.

**Erwartetes Verhalten:** `npm run e2e` läuft ohne den Character Tracker stabil durch.

---

### 7. Dokumentation ✅ done (2026-10-21 20:17)

- `REQUIREMENTS.md`:
  - Abschnitt „1. Character Tracker“ entfernen, die übrigen Abschnitte neu nummerieren.
  - Dungeon Tracker: „Alle im Charakter Tracker erstellen Charactere …“ wird zu „Alle Charaktere der
    Spielesession …“; „… vom Spielbrett und aus dem Character Tracker“ wird zu „… vom Spielbrett und
    aus der Legende“. Ergänzen: Der Dungeon Tracker ist die Startseite.
- `.claude/rules/architecture.md`:
  - Block `character-tracker/` aus dem Verzeichnisbaum entfernen.
  - Neue Orte eintragen: `core/models/damage-types.model.ts`,
    `shared/components/` (`DamageTakenDialog`), `shared/services/character-creators/`,
    `shared/utils/damage.util.ts`.
  - Beispiel in der Namenstabelle: `character-card.ts` → `CharacterCard` wird zu
    `dungeon-token.ts` → `DungeonToken`.
- Offene Refactoring Requests:
  - `docs/refactoring-requests/done/add-character-dialog-unused-field.md`: Status `rejected`
    (`AddCharacterDialog` entfällt mit diesem Request), per `git mv` nach `done/`.
- `architecture.md` nennt zusätzlich `e2e/support/` als Ort für gemeinsame E2E-Schritte.
  - `docs/refactoring-requests/orphaned-files-and-doc-formatting.md`: Punkt 1 als obsolet markieren
    (`add-character-dialog.html` ist gelöscht; `damage-taken-dialog.html` ist per `templateUrl`
    eingebunden und zieht nach `shared/`). Punkt 2 (Prettier) bleibt offen.

**Erwartetes Verhalten:** Anforderungen und Architektur beschreiben die App ohne Character Tracker.

---

## Hinweise

- **Alte Spielstände:** `SessionXmlService.parse()` liest die Kinder des Wurzelelements einzeln über
  `requireChild`/`firstChild`. Ein zusätzliches `<characterCards>` stört nicht; der neue Test in #2
  sichert das ab.
- **localStorage:** `character_card_layout` bleibt in vorhandenen Browsern liegen (wenige Bytes, ohne
  Wirkung). Ein einmaliges Aufräumen beim Start wäre zusätzlicher Code ohne Nutzen.
- **Coverage:** Das Feature ist gut getestet. Fällt es weg, kann die Gesamt-Coverage sinken. Die
  Schwellen in `vitest.config.ts` müssen nach #4 weiter eingehalten werden.
- **Bis zu den Folge-Requests** kann der DM keinen Schaden eintragen und keine Zufallscharaktere
  anlegen. Leben und Rüstung lassen sich im Charakter-Editor von Hand ändern.
- **Keine Paket-Änderungen:** `@angular/cdk/drag-drop`, `@angular/forms` und `MatDialog` werden
  weiterhin vom Dungeon Tracker, der Game Session und den Shared-Dialogen genutzt.

---

## Akzeptanzkriterien

- [x] `src/app/features/character-tracker/` existiert nicht mehr; Route und Navigationslink sind entfernt
- [x] `/`, unbekannte Pfade und der App-Start landen im Dungeon Tracker
- [x] `DamageTypes` liegt unter `core/models/`, `applyDamage()`, `DamageTakenDialog` und die beiden Creator-Services unter `shared/`, jeweils mit grünen Specs
- [x] `SessionSliceData`, `SESSION_KEYS`, `GameSessionService` und `SessionXmlService` kennen `characterCards` nicht mehr
- [x] Ein Spielstand mit `<characterCards>` lädt ohne Fehler (Unit-Test)
- [x] `tokens.css` enthält keine Tokens, die durch das Entfernen frei wurden; `hit-*.svg` sind noch vorhanden
- [x] Die Suche aus #4 findet in `src/` und `e2e/` nur die beiden genannten Ausnahmen
- [x] Die E2E-Smoke-Tests legen Charaktere über „Character Neu“ an
- [x] `REQUIREMENTS.md`, `architecture.md` und die beiden offenen Refactoring Requests sind angepasst
- [x] `npm run lint`, `npm run test -- --watch=false --coverage` (Schwellen eingehalten), `npm run build` und `npm run e2e` laufen grün
