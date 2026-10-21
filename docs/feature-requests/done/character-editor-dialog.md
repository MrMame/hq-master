# Feature Request: Systemweiter Charakter-Editor (Dialog) – Doppelklick und „Character Neu“ im Dungeon Tracker

**Datum:** 2026-10-21  
**Priorität:** Mittel  
**Status:** done (2026-10-21 17:26) — #1–#8 umgesetzt; Bild als Pflichtfeld bei der Umsetzung entschieden  
**Bezug:** `REQUIREMENTS.md` §0 (gemeinsame Session-Daten) und §3 (Dungeon Tracker), `.claude/rules/architecture.md` → „Session-State-Services: reaktive Schnittstelle“ (Regeln 1, 4, 6), `docs/feature-requests/done/shared-session-state.md`

---

## Problem

Ein Doppelklick auf ein Charakter-Token im Dungeon Tracker verlässt das Spielbrett:

```typescript
// dungeon-tracker-page.ts:64
onTokenDoubleClick(): void {
  void this.router.navigate(['/charactertracker']);
}
```

- Der DM muss das Spielbrett verlassen, nur um Werte eines Charakters zu ändern.
- Auch im Character Tracker hat die Charakterkarte nur Eingabefelder für Health, Defense, Speed und
  Attack (`character-card.html`). Name, Typ, Rüstung, Fähigkeiten, Bild und Beschreibung lassen sich
  nirgends ändern.
- Neue Charaktere entstehen nur im Character Tracker, und zwar zufällig erzeugt (`Add Monster`,
  `Add Hero`, `Add Character`).
- Es gibt keinen Editor, den andere Features verwenden könnten. Der Charakter-Editor soll aber künftig
  auch aus weiteren Features aufgerufen werden.

---

## Ziel

Ein **systemweiter, autarker Charakter-Editor** als Dialog unter `src/app/shared/`:

- Er legt Charaktere **an** und **bearbeitet** sie. Änderbar sind alle Eigenschaften außer der ID.
- „Übernehmen“ schreibt **sofort** über `CharactersDbService.writeCharacter()` in die Session,
  „Abbrechen“ verwirft die Änderungen.
- Aufrufer öffnen ihn nur. Speichern und Benachrichtigen erledigt der Dialog selbst.
- Er sieht aus wie die Dungeon-Tracker-Seite.

Im Dungeon Tracker öffnen ihn zwei Wege: der Doppelklick auf ein Token (Bearbeiten) und ein neuer
Button „Character Neu“ in der Seitenleiste (Anlegen).

```
Doppelklick auf Token   ─► onTokenDoubleClick(token.character) ─► CharacterEditorService.openEdit(character)
Button „Character Neu“  ─► onNewCharacterClick()               ─► CharacterEditorService.openCreate()
                                          │
                                          ▼
CharacterEditorDialog (Arbeitskopie) ─► „Übernehmen“ ─► CharactersDbService.writeCharacter(draft)
                                                        (Signal + localStorage)
   ├─► DungeonBoardService: Der Sync-Effekt gibt neuen Charakteren das erste freie Feld,
   │   tokens (computed) → Token + Legende
   ├─► CharacterTrackerPage.characters → Charakterkarten
   └─► GameSessionService.snapshot     → XML-Spielstand
```

Für die sofortige Aktualisierung ist **keine neue Service-Logik** nötig. `writeCharacter()` ersetzt den
Charakter anhand der ID oder fügt ihn hinzu und aktualisiert dabei Signal und Storage gemeinsam. Alle
Konsumenten leiten ihren Zustand davon ab (Regel 6).

### Dialog-Entwurf

```
┌──────────────────────────────────────────────────┐  Fläche gray-800 (wie Seitenleiste)
│ Charakter bearbeiten              ← gelb, fett    │  bzw. „Neuer Charakter“
│ NAME                              ← gray-400, caps│
│ [ Monster 1700000000000-42                    ]   │  Felder gray-900, Rahmen gray-600,
│ TYP                                               │  Fokus gelb, ungültig rot
│ [ Feuer                                     ▾ ]   │
│ ───────────────────────────────────────────────── │  Trennlinie gray-600
│ LEBEN   RÜSTUNG  ANGRIFF  ABWEHR   TEMPO          │
│ [120]   [ 10 ]   [ 20 ]   [ 10 ]   [ 15 ]         │  Zahl, Pflicht, min 0
│ ───────────────────────────────────────────────── │
│ FÄHIGKEITEN                                       │
│ ☑ Flammenwerfer        ☐ Aquatische Angriffe      │  Checkbox, accent gelb (wie Slider)
│ ☑ Erdbeben             ☐ Windstoß                 │
│ ───────────────────────────────────────────────── │
│ BILD                                              │
│ (◯)(◯)(◯)(◉)(◯)(◯)(◯)(◯)(◯)(◯)(◯)(◯)(◯)           │  rund wie Tokens, Auswahl = gelber Rand
│ ───────────────────────────────────────────────── │
│ BESCHREIBUNG                                      │
│ [ Ein gefährlicher Ork …                      ]   │
│                        Abbrechen  [ Übernehmen ]  │  gelber Button wie „Bild hochladen“
└──────────────────────────────────────────────────┘
```

---

## Anforderungen

### 1. Gemeinsame Charakterbilder ✅ done (2026-10-21 17:26)

- Neue Datei `src/app/features/character-tracker/models/character-images.model.ts`, von Hand angelegt
  (für Konstanten gibt es keinen CLI-Blueprint):
  - `HERO_IMAGES: string[]`: die vier Heldenbilder aus `HeroCharacterCreatorService`
  - `MONSTER_IMAGES: string[]`: die neun Monsterbilder aus `MonsterCharacterCreatorService`
  - `CHARACTER_IMAGES: string[]`: beide Listen zusammen, Helden zuerst. Daraus speist sich die
    Bildauswahl des Editors.
- `HeroCharacterCreatorService` und `MonsterCharacterCreatorService` verlieren ihr privates
  `images`-Array und nutzen stattdessen `HERO_IMAGES` bzw. `MONSTER_IMAGES`. Pfade (`./img/…`) und
  Reihenfolge bleiben gleich. Die vorhandenen Creator-Specs (erstes und letztes Bild bei `Math.random`
  0 bzw. ≈ 1) bleiben deshalb unverändert grün.

**Erwartetes Verhalten:** Sichtbar ändert sich nichts. Creators und Editor nutzen dieselbe Bildliste.

---

### 2. Startwerte für neue Charaktere ✅ done (2026-10-21 17:26)

- Neue Datei `src/app/shared/utils/new-character.util.ts` mit `createNewCharacter(): CharacterInfo`,
  von Hand angelegt, dazu eine Spec mit gleichem Dateistamm.
- Die ID folgt dem Schema der Creators: `` `${Date.now()}-${Math.floor(Math.random() * 1000)}` ``.
  `crypto.randomUUID()` kommt nicht in Frage, weil es nur in einem sicheren Kontext (https oder
  localhost) verfügbar ist. Ein Tablet, das den Dev-Server per LAN-IP über http öffnet, hätte es nicht.
- Startwerte: Name `''`, Typ `ElementalTypes.FEUER`, `health`, `armor`, `attack`, `defense` und `speed`
  jeweils `0`, `abilities: []`, `image: ''`, `description: ''`. Ein Bild wählt der DM im Editor; ohne
  Bild lässt sich nicht speichern (siehe Punkt 3, Entscheidung vom 2026-10-21).
- Spec `new-character.util.spec.ts`:
  - Die Startwerte stimmen.
  - Die ID wird mit gemocktem `Date.now`/`Math.random` deterministisch geprüft.
  - Zwei Aufrufe liefern verschiedene Objekte und Arrays, also keine gemeinsame Referenz.

**Erwartetes Verhalten:** Jeder Aufruf liefert einen neuen, leeren Charakter mit eigener ID.

---

### 3. `CharacterEditorDialog` (shared) ✅ done (2026-10-21 17:26)

- Erzeugen mit `ng g c shared/components/character-editor-dialog`. Das ergibt `CharacterEditorDialog` in
  `character-editor-dialog.ts`, `.html`, `.css` und `.spec.ts` mit dem Selector
  `app-character-editor-dialog`.
- **Eingabe** `MAT_DIALOG_DATA: CharacterInfo | null`:
  - `null` öffnet den Neu-Modus. Die Arbeitskopie kommt aus `createNewCharacter()`, der Titel lautet
    „Neuer Charakter“.
  - Ein Charakter öffnet den Bearbeiten-Modus. Die Arbeitskopie ist `{ ...character }`, der Titel
    lautet „Charakter bearbeiten“.
- **Zustand:** `protected readonly draft: WritableSignal<CharacterInfo>`. Geändert wird er nur über zwei
  Methoden:
  - `setField<K extends keyof CharacterInfo>(key: K, value: CharacterInfo[K])`
  - `toggleAbility(ability: string)`: erzeugt ein neues Array statt das vorhandene zu verändern.
- **Felder** (Beschriftungen auf Deutsch):

  | Feld                                                        | Eingabe                                                                       | Regel              |
  | ----------------------------------------------------------- | ----------------------------------------------------------------------------- | ------------------ |
  | Name                                                        | Textfeld                                                                      | Pflicht            |
  | Typ                                                         | `<select>` über `ElementalTypes`                                              | –                  |
  | Leben, Rüstung, Angriff, Abwehr, Tempo (`health` … `speed`) | `type="number"`, per `@for` über eine Feldliste `{ key, label }`              | Pflicht, `min="0"` |
  | Fähigkeiten                                                 | Checkboxen über `CharacterAbilities`                                          | –                  |
  | Bild                                                        | runde Icon-Buttons über `CHARACTER_IMAGES`, Auswahl markiert, je `aria-label` | Pflicht            |
  | Beschreibung                                                | `<textarea>`                                                                  | –                  |

  Die `id` wird weder angezeigt noch geändert, weil sie Token-Position und Kartenlayout verknüpft.

- **Formular:** `FormsModule` mit `[ngModel]` + `(ngModelChange)` wie in `CharacterCard`. Jedes Feld
  hat ein `name`, alles steht in `<form #form="ngForm">`, und „Übernehmen“ hat
  `[disabled]="form.invalid || !draft().image"`.
- **Bild ist Pflicht** (entschieden 2026-10-21, bei der Umsetzung gefunden): Ein Charakter ohne Bild
  erschien in der Legende und auf den Charakterkarten als kaputtes Bild. Deshalb bleibt „Übernehmen“
  gesperrt, bis ein Bild gewählt ist. Ohne Auswahl sind die Bild-Buttons rot umrandet wie ein
  ungültiges Feld. Das gilt auch für Altdaten ohne Bild.
- **Aktionen** in `mat-dialog-actions`, rechtsbündig:
  - „Abbrechen“ (`mat-button`) ruft `dialogRef.close()` auf. Es wird nichts geschrieben.
  - „Übernehmen“ (`mat-flat-button`) ruft `charactersDbService.writeCharacter(draft())` und danach
    `dialogRef.close(draft())` auf.
- **Styling** in `character-editor-dialog.css`. Erlaubt sind nur Tokens aus `src/styles/tokens.css`,
  keine neuen Tokens und keine globalen Styles:
  - `:host` setzt den Hintergrund `--color-gray-800` und die Textfarbe `--color-white`, außerdem
    `--mat-dialog-subhead-color: var(--color-yellow-400)` und
    `--mat-dialog-supporting-text-color: var(--color-white)`. Das funktioniert, weil die Material-Dialogfläche
    ihren Inhalt an den runden Ecken abschneidet (`overflow-y: auto`).
  - Der Titel ist fett wie `.general-sidebar__title`. Feldbeschriftungen nutzen `--color-gray-400`,
    `--text-xs`, Großbuchstaben und `--tracking-wider` wie `.general-sidebar__heading`.
  - Eingabefelder haben den Hintergrund `--color-gray-900` und den Rahmen `--color-gray-600`. Bei Fokus
    wird der Rahmen `--color-yellow-400`, bei `.ng-invalid` `--color-red-400`.
  - Trennlinien nutzen `--color-gray-600`. Checkboxen bekommen `accent-color: var(--color-yellow-400)`
    wie die Raster-Slider.
  - Bild-Buttons sind rund und so groß wie Tokens (`--space-10`). Das gewählte Bild bekommt einen gelben
    Rahmen und Schein wie `.dungeon-token`.
  - „Übernehmen“ wird über `--mat-button-filled-*` eingefärbt: `--color-yellow-500`, beim Hover
    `--color-yellow-400`, schwarze Schrift wie „Bild hochladen“. Im deaktivierten Zustand bleibt er
    dunkel (`--mat-button-filled-disabled-*`). „Abbrechen“ bekommt
    `--mat-button-text-label-text-color: var(--color-gray-400)`.
- **Tests:** `MatDialogRef` wird per `useValue` gemockt, `close` ist ein `vi.fn()`. `MAT_DIALOG_DATA`
  kommt per `useValue`, `CharactersDbService` ist echt. Buttons werden über `MatButtonHarness`
  angesprochen, native Felder über `input`- und `change`-Events.
  - Die Felder zeigen die Werte des übergebenen Charakters.
  - Jede Feldart wird geändert: Text, Select, Zahl, Checkbox, Bild und Textarea. Nach „Übernehmen“ steht
    der geänderte Charakter in `characters()`, und `close` hat ihn erhalten.
  - „Abbrechen“ lässt `characters()` unverändert, `close` wird ohne Wert aufgerufen. Das übergebene
    Original-Objekt bleibt in jedem Fall unverändert.
  - „Übernehmen“ ist deaktiviert bei leerem Namen, bei leerem oder negativem Zahlenwert und ohne Bild.
  - Fähigkeiten lassen sich an- und abwählen.
  - Altwerte außerhalb der Auswahllisten, etwa Typ `monster` oder die Fähigkeit `Gift` aus
    `createTestCharacter`, bleiben erhalten, solange sie unberührt bleiben.
  - Neu-Modus: Der Titel lautet „Neuer Charakter“. „Übernehmen“ wird erst mit Name und Bild frei.
    Danach entsteht ein zusätzlicher Charakter mit neuer ID.
  - Wird die Spec länger als 150 Zeilen, wird sie nach Aspekt aufgeteilt
    (`character-editor-dialog-create.spec.ts`). Das gemeinsame Setup kommt dann nach
    `src/app/shared/testing/character-editor-dialog.fixtures.ts`.

**Erwartetes Verhalten:** Der Dialog zeigt alle Eigenschaften und lässt sie ändern. „Übernehmen“
speichert sofort und schließt den Dialog. „Abbrechen“ schließt ihn, ohne etwas zu ändern.

---

### 4. `CharacterEditorService` (shared) ✅ done (2026-10-21 17:26)

- Erzeugen mit `ng g s shared/services/character-editor`. Das ergibt `CharacterEditorService` mit
  `providedIn: 'root'`.
- `openCreate(): Observable<CharacterInfo | undefined>` öffnet den Editor mit `data: null`.
- `openEdit(character: CharacterInfo): Observable<CharacterInfo | undefined>` öffnet ihn mit
  `data: character`.
- Beide geben `afterClosed()` zurück, also den gespeicherten Charakter oder bei Abbruch `undefined`.
  Abonnieren ist optional, weil der Dialog selbst speichert.
- `export const CHARACTER_EDITOR_DIALOG_CONFIG: MatDialogConfig = { width: '36rem', maxWidth: '95vw', autoFocus: 'dialog' }`.
  `autoFocus: 'dialog'` fokussiert den Dialog statt des ersten Felds. So springt auf dem Tablet beim
  Öffnen keine Bildschirmtastatur auf.
- Die Spec folgt `character-dialogs.service.spec.ts` (MatDialog-Mock):
  - `openCreate` öffnet `CharacterEditorDialog` mit `{ ...CHARACTER_EDITOR_DIALOG_CONFIG, data: null }`.
  - `openEdit` öffnet ihn mit `data: character`.
  - Das Ergebnis von `afterClosed()` wird durchgereicht.

**Erwartetes Verhalten:** Jedes Feature öffnet den Editor mit einem einzigen Aufruf.

---

### 5. Dungeon Tracker: Doppelklick öffnet den Editor ✅ done (2026-10-21 17:26)

- `dungeon-tracker-page.ts`: `Router` entfällt, `CharacterEditorService` kommt per `inject()` hinzu.

  ```typescript
  onTokenDoubleClick(character: CharacterInfo): void {
    this.characterEditor.openEdit(character);
  }
  ```

- `dungeon-tracker-page.html`: `(tokenDoubleClicked)="onTokenDoubleClick(token.character)"`. Der
  Charakter kommt direkt aus der `@for`-Schleife, eine Suche über die ID ist nicht nötig. `DungeonToken`
  bleibt unverändert.
- `dungeon-tracker-page-interactions.spec.ts`: Der Navigations-Test wird ersetzt.
  `CharacterEditorService` wird per `useValue` gemockt (`openEdit` und `openCreate` als `vi.fn()`).
  Nach `token().tokenDoubleClicked.emit('a')` muss `openEdit` genau einmal mit Charakter `a` aufgerufen
  werden. `provideRouter([])` entfällt in beiden Page-Specs.
- `dungeon-tracker-page.spec.ts` bekommt einen neuen Test: Charakter `a` wird per `writeCharacter`
  umbenannt, danach zeigen Legende und Token-`title` sofort den neuen Namen.
- `REQUIREMENTS.md` §3: Der Satz „Ein Doppelklcik auf eines der kleinen Charactersymbole springt in die
  Detailansicht des Charakters.“ wird ersetzt durch: „Ein Doppelklick auf eines der kleinen
  Charaktersymbole öffnet den Charakter-Editor als Dialog. Dort können alle Eigenschaften des Charakters
  geändert werden; ‚Übernehmen‘ schreibt die Änderungen sofort in die Spielesession, ‚Abbrechen‘
  verwirft sie.“

**Erwartetes Verhalten:** Ein Doppelklick öffnet den Editor mit den Werten des Charakters, ohne zu
navigieren. Nach „Übernehmen“ zeigen Token und Legende sofort die neuen Werte.

---

### 6. Button „Character Neu“ im Dungeon Tracker ✅ done (2026-10-21 17:26)

- `dungeon-tracker-page.html`: Im Abschnitt „Charaktere (n)“ der Seitenleiste steht direkt unter der
  Überschrift und über der Liste
  `<button class="general-sidebar__button" (click)="onNewCharacterClick()">Character Neu</button>`.
  - Er sieht aus wie „Bild hochladen“ und folgt demselben Muster wie die Buttons im Card Manager.
  - Weil er über der Liste steht, bleibt er auch bei vielen Charakteren ohne Scrollen sichtbar.
  - Falls nötig, regelt eine kleine Klasse in `dungeon-tracker-page.css` den Abstand zur Liste.
- `dungeon-tracker-page.ts`:

  ```typescript
  onNewCharacterClick(): void {
    this.characterEditor.openCreate();
  }
  ```

- Der Leertext der Legende ändert sich von „Keine Charaktere im Character Tracker angelegt.“ zu „Noch
  keine Charaktere angelegt.“, weil Charaktere jetzt auch hier angelegt werden. Kein Test prüft den
  alten Text.
- Den Platz des neuen Tokens bestimmt der vorhandene Sync-Effekt des `DungeonBoardService`
  (`placeNewTokens`, erstes freies Feld). Dafür ist kein zusätzlicher Code nötig.
- `dungeon-tracker-page-interactions.spec.ts`: Ein Klick auf „Character Neu“ (über `clickButton` aus
  `src/app/shared/testing/click-button.ts`) ruft `openCreate()` genau einmal auf.
- `REQUIREMENTS.md` §3 bekommt den zusätzlichen Satz: „Über den Button ‚Character Neu‘ in der
  Seitenleiste legt der DM direkt im Dungeon Tracker einen neuen Charakter an; er erscheint sofort als
  Token auf dem ersten freien Feld.“

**Erwartetes Verhalten:** Ein Klick öffnet den Editor „Neuer Charakter“. Nach „Übernehmen“ erscheinen
ein neues Token auf dem ersten freien Feld und ein Eintrag in der Legende. „Abbrechen“ legt nichts an.

---

### 7. E2E-Smoke-Test (empfohlen, optional) ✅ done (2026-10-21 17:26)

`e2e/character-editor.spec.ts` folgt den Konventionen aus `e2e/dungeon-drag.spec.ts`: Locator über
Rolle, Text oder `data-testid`, kein `waitForTimeout`.

- **Bearbeiten:** Im Character Tracker „Add Monster“ → Dungeon Tracker → Doppelklick auf das Token →
  Name ändern → „Übernehmen“ → Die Legende zeigt den neuen Namen → Nach einem Reload ist der Name noch
  da.
- **Neu:** Dungeon Tracker → „Character Neu“ → Name eingeben → Bild wählen → „Übernehmen“ → Token und Eintrag in der
  Legende erscheinen.

**Erwartetes Verhalten:** Beide Abläufe laufen in `npm run e2e` stabil durch.

---

### 8. Dokumentation ✅ done (2026-10-21 17:26)

`.claude/rules/architecture.md`, Verzeichnisstruktur:

- Bei `shared/` kommen hinzu:
  - `components/ → … ConfirmationDialog, CharacterEditorDialog`
  - `services/ → character-editor.service.ts (öffnet den Charakter-Editor systemweit)`
  - `utils/ → new-character.util.ts (Startwerte für neue Charaktere)`
- Bei den Models von `character-tracker/` kommt `character-images.model.ts` hinzu.

`REQUIREMENTS.md` wird in Punkt 5 und 6 angepasst.

**Erwartetes Verhalten:** Die Architektur-Doku beschreibt die neuen Shared-Bausteine.

---

## Betroffene Dateien

| Datei                                                                                                        | Änderung                                                |
| ------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------- |
| `src/app/features/character-tracker/models/character-images.model.ts`                                        | Neu: gemeinsame Bildlisten (Punkt 1)                    |
| `src/app/features/character-tracker/services/character-creators/hero-character-creator.service.ts`           | Bildliste importieren (Punkt 1)                         |
| `src/app/features/character-tracker/services/character-creators/monster-character-creator.service.ts`        | Bildliste importieren (Punkt 1)                         |
| `src/app/shared/utils/new-character.util.ts` (+ `.spec.ts`)                                                  | Neu: Startwerte (Punkt 2)                               |
| `src/app/shared/components/character-editor-dialog/character-editor-dialog.{ts,html,css,spec.ts}`            | Neu: Editor-Dialog (Punkt 3)                            |
| `src/app/shared/services/character-editor.service.ts` (+ `.spec.ts`)                                         | Neu: Editor öffnen (Punkt 4)                            |
| `src/app/features/dungeon-tracker/components/dungeon-tracker-page/dungeon-tracker-page.ts`                   | Editor statt Router, `onNewCharacterClick` (Punkt 5, 6) |
| `src/app/features/dungeon-tracker/components/dungeon-tracker-page/dungeon-tracker-page.html`                 | Doppelklick, Button, Leertext (Punkt 5, 6)              |
| `src/app/features/dungeon-tracker/components/dungeon-tracker-page/dungeon-tracker-page.css`                  | ggf. Abstand des Buttons (Punkt 6)                      |
| `src/app/features/dungeon-tracker/components/dungeon-tracker-page/dungeon-tracker-page-interactions.spec.ts` | Editor-Mock, Doppelklick- und Button-Test (Punkt 5, 6)  |
| `src/app/features/dungeon-tracker/components/dungeon-tracker-page/dungeon-tracker-page.spec.ts`              | Umbenennung sofort sichtbar, ohne Router (Punkt 5)      |
| `REQUIREMENTS.md`                                                                                            | §3: Doppelklick und Button (Punkt 5, 6)                 |
| `e2e/character-editor.spec.ts`                                                                               | Neu, optional: Smoke-Test (Punkt 7)                     |
| `.claude/rules/architecture.md`                                                                              | Verzeichnisstruktur (Punkt 8)                           |

---

## Hinweise

- **Arbeitskopie statt zweitem Session-Zustand:** `draft` enthält ungespeicherte Formulareingaben und lebt
  nur, solange der Dialog offen ist. Das ist bewusst kein zweiter Session-Zustand im Sinne von Regel 1
  und keine „einmal kopierte“ Session-Kopie im Sinne von Regel 6. Die Session ändert sich ausschließlich
  über `writeCharacter()`. Eine Änderung von anderer Stelle, während der Dialog offen ist, ist derzeit
  nicht möglich, weil der modale Dialog die übrige UI sperrt.
- **„Alle Eigenschaften“** heißt: alle Felder von `CharacterInfo` außer `id`. Die Position auf dem
  Spielbrett gehört dem `DungeonBoardService` und wird weiter per Drag & Drop gesetzt.
- **Altwerte außerhalb der Auswahllisten:** Ist ein Typ unbekannt, bleibt das Select leer. Unbekannte
  Fähigkeiten erscheinen nicht als Checkbox, und bei einem unbekannten Bild ist kein Icon markiert. Die
  Werte bleiben trotzdem erhalten, solange das jeweilige Feld nicht geändert wird.
- **Modelle im Feature-Ordner:** `CharacterInfo`, `ElementalTypes` und `CharacterAbilities` liegen unter
  `features/character-tracker/models/`. Der Shared-Editor importiert sie von dort, so wie
  `CharactersDbService` in `core/` es heute schon tut. Ein Umzug nach `core/models/` (etwa 25 Dateien,
  nur Importpfade) wäre ein eigener Refactoring Request und ist **nicht** Teil dieses Requests.
  Angelegt am 2026-10-21 als `docs/refactoring-requests/character-models-to-core.md`.
- **Beschriftungen:** Der Dialog ist deutsch beschriftet wie die Dungeon-Tracker-Seite (Leben, Rüstung,
  Angriff, Abwehr, Tempo). Die Charakterkarte im Character Tracker nutzt weiterhin englische Begriffe.
  Der Button heißt auf Wunsch „Character Neu“, Überschrift und Dialogtitel schreiben „Charakter“.
- **Weitere Aufrufer** nutzen den Editor genauso wie der Dungeon Tracker, mit `openCreate()` oder
  `openEdit(character)`.
- **Dateilimit 150 Zeilen:** Geschätzt sind für den Dialog ca. 115 Zeilen Template, 120 Zeilen CSS und
  70 Zeilen TS. `dungeon-tracker-page.html` hat schon 137 Zeilen und kommt mit dem Button auf etwa 141.
- **Page-Specs:** Wie bisher nach `writeCharacter` mit `await fixture.whenStable()` warten, damit
  Sync-Effekt und Rendering laufen. Specs mit Effekten mit Timeout ausführen (siehe Effekt-Loop-Problem
  aus `shared-session-state` #9).

---

## Akzeptanzkriterien

- [x] Ein Doppelklick auf ein Token öffnet den Charakter-Editor mit den Werten dieses Charakters, es wird nicht mehr navigiert
- [x] Der Button „Character Neu“ in der Seitenleiste öffnet den Editor im Neu-Modus
- [x] Alle Felder von `CharacterInfo` außer `id` sind änderbar: Name, Typ, Leben, Rüstung, Angriff, Abwehr, Tempo, Fähigkeiten, Bild und Beschreibung
- [x] „Übernehmen“ schreibt über `CharactersDbService.writeCharacter()`. Token, Legende, Character Tracker und Session-Snapshot zeigen die Änderung sofort, auch nach einem Reload
- [x] Ein neu angelegter Charakter erscheint sofort als Token auf einem freien Feld und in der Legende
- [x] „Abbrechen“ ändert nichts und legt nichts an
- [x] „Übernehmen“ ist bei leerem Namen, bei leerem oder negativem Zahlenwert und ohne Bild deaktiviert
- [x] Unberührte Altwerte außerhalb der Auswahllisten bleiben beim Übernehmen erhalten
- [x] Editor und Öffner-Service liegen unter `src/app/shared/` und brauchen keine Feature-Services
- [x] Der Dialog sieht aus wie der Dungeon Tracker und nutzt nur Tokens aus `tokens.css`, ohne neue Tokens
- [x] Die Creator-Services nutzen die gemeinsame Bildliste, ihr Verhalten ist unverändert
- [x] Jede Datei hat höchstens 150 Zeilen, und Specs prüfen mehr als `should create`
- [x] `REQUIREMENTS.md` §3 und `.claude/rules/architecture.md` sind aktualisiert
- [x] `npm run lint`, `npm run test -- --watch=false --coverage` (Schwellen eingehalten), `npm run build` und `npm run e2e` laufen grün
