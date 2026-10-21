# Feature Request: Charakter im Charakter-Editor entfernen

**Datum:** 2026-10-21  
**Priorität:** Mittel  
**Status:** done (2026-10-21 18:51) — #1–#5 umgesetzt; Rückfrage vor dem Löschen auf PC und Tablet entschieden (2026-10-21)  
**Bezug:** `REQUIREMENTS.md` §3 (Dungeon Tracker), `.claude/rules/architecture.md` → „Session-State-Services: reaktive Schnittstelle“ (Regel 6), `docs/feature-requests/done/character-editor-dialog.md`

---

## Problem

Der Charakter-Editor (`CharacterEditorDialog`) bietet im Bearbeiten-Modus nur „Abbrechen“ und
„Übernehmen“. Einen Charakter löschen kann der DM bisher nur im Character Tracker über den Button
`DEL` auf der Charakterkarte. Wer im Dungeon Tracker per Doppelklick ein Token öffnet und den
Charakter loswerden will, muss dafür das Spielbrett verlassen.

---

## Ziel

Im **Bearbeiten-Modus** zeigt der Editor zusätzlich den Button **„Entfernen“**. Nach einer
Bestätigung löscht er den Charakter über `CharactersDbService.removeCharacter()` aus der Session und
schließt sich. Im Neu-Modus gibt es den Button nicht, weil es dort noch nichts zu löschen gibt.

```
Doppelklick auf Token ─► CharacterEditorService.openEdit(character)
                                   │
                                   ▼
CharacterEditorDialog ─► „Entfernen“ ─► ConfirmationDialog
                                          ├─ „Abbrechen“  ─► zurück in den Editor, Arbeitskopie bleibt
                                          └─ „Bestätigen“ ─► CharactersDbService.removeCharacter(character)
                                                             dialogRef.close()
   ├─► DungeonBoardService: Der Sync-Effekt entfernt die Position, tokens (computed) → Token + Legende
   ├─► CharacterCardLayoutService: Der Sync entfernt das Kartenlayout
   ├─► CharacterTrackerPage.characters → Charakterkarten
   └─► GameSessionService.snapshot     → XML-Spielstand
```

Für das Aufräumen ist **keine neue Service-Logik** nötig. `removeCharacter()` gibt es schon, und alle
Konsumenten leiten ihren Zustand von `characters()` ab (Regel 6). Dass Position und Kartenlayout dabei
verschwinden, ist bereits getestet (`dungeon-board-sync.service.spec.ts`, `dungeon-tracker-page.spec.ts`,
`character-card-layout.service.spec.ts`).

### Entwurf der Aktionsleiste

```
│ ───────────────────────────────────────────────── │
│ Entfernen                 Abbrechen  [ Übernehmen ]  │
└──────────────────────────────────────────────────┘
  ↑ rot, linksbündig, nur im Bearbeiten-Modus
```

---

## Anforderungen

### 1. Button „Entfernen“ im Bearbeiten-Modus ✅ done (2026-10-21 18:51)

- `character-editor-dialog.ts`: neues Feld
  `protected readonly isEditMode: boolean = this.character !== null;`. Der Titel nutzt es ebenfalls,
  statt `this.character` erneut zu prüfen.
- `character-editor-dialog.html`: In `mat-dialog-actions` steht als **erster** Button

  ```html
  @if (isEditMode) {
  <button mat-button class="character-editor__remove" (click)="remove()">Entfernen</button>
  }
  ```

  - „Entfernen“ ist **immer** aktiv, auch wenn das Formular ungültig ist. Gelöscht wird der
    gespeicherte Charakter, nicht die Arbeitskopie.

- `character-editor-dialog.css`:
  - `.character-editor__remove` setzt `--mat-button-text-label-text-color: var(--color-red-400)` und
    `margin-inline-end: auto`. Der Button rückt damit nach links, „Abbrechen“ und „Übernehmen“ bleiben
    rechts.
  - Es sind nur Tokens aus `src/styles/tokens.css` erlaubt, keine neuen Tokens.

**Erwartetes Verhalten:** Beim Bearbeiten erscheint links in der Aktionsleiste ein roter Button
„Entfernen“. Im Dialog „Neuer Charakter“ fehlt er.

---

### 2. Entfernen mit Bestätigung ✅ done (2026-10-21 18:51)

- `character-editor-dialog.ts`: `MatDialog` kommt per `inject()` hinzu.

  ```typescript
  async remove(): Promise<void> {
    if (!(await this.confirmRemoval())) return;
    this.charactersDbService.removeCharacter(this.draft());
    this.dialogRef.close();
  }

  private async confirmRemoval(): Promise<boolean> {
    const confirmation: MatDialogRef<ConfirmationDialog, boolean> = this.dialog.open<
      ConfirmationDialog,
      unknown,
      boolean
    >(ConfirmationDialog);
    return (await firstValueFrom(confirmation.afterClosed())) === true;
  }
  ```

  - `removeCharacter()` löscht anhand der ID, und die Arbeitskopie hat dieselbe ID wie der
    gespeicherte Charakter. Bei der Umsetzung am 2026-10-21 wurde `this.draft()` statt
    `this.character` übergeben. So entfällt die Prüfung `!this.character`. Sie ließe sich nicht
    testen, weil der Button im Neu-Modus gar nicht erscheint, und bliebe ein toter Zweig.
  - Die Bestätigung nutzt den vorhandenen `ConfirmationDialog` aus `src/app/shared/components/`, genau
    wie `GameSessionPage.confirm()`.
  - **Die Rückfrage erscheint immer**, am PC wie auf dem Tablet und mit Maus wie mit Touch
    (entschieden 2026-10-21). Es gibt keine geräteabhängige Logik, und kein Weg überspringt die
    Rückfrage, etwa ein Shift-Klick oder eine Einstellung.
  - Bricht der DM die Bestätigung ab, bleibt der Editor offen, und die Arbeitskopie bleibt erhalten.
  - Nach „Bestätigen“ wird der Charakter gelöscht. Danach schließt sich der Editor **ohne Wert**,
    ungespeicherte Änderungen der Arbeitskopie werden verworfen.

- Die Klassenbeschreibung (JSDoc) von `CharacterEditorDialog` nennt „Entfernen“.
- `character-editor.service.ts`: Die JSDoc der Klasse lautet jetzt „`undefined` bei Abbruch oder
  Entfernen“. Die Signaturen von `openCreate()` und `openEdit()` bleiben gleich, die Service-Spec
  bleibt unverändert.

**Erwartetes Verhalten:** „Entfernen“ fragt nach. Nach „Bestätigen“ verschwindet der Charakter sofort
aus Spielbrett, Legende, Character Tracker und Session-Snapshot, auch nach einem Reload. Der Editor
schließt sich. „Abbrechen“ in der Rückfrage führt zurück in den Editor, und es wird nichts gelöscht.

---

### 3. Tests ✅ done (2026-10-21 18:51)

- `src/app/shared/testing/character-editor-dialog.fixtures.ts`:
  - `MatDialog` wird mit `TestBed.overrideProvider(MatDialog, { useValue: { open: dialogOpen } })`
    gemockt, `dialogOpen` liefert `{ afterClosed: () => of(confirmed) }`, Standard ist `true`.
  - **Nicht** über `providers` mocken: `CharacterEditorDialog` importiert `MatDialogModule`, und dessen
    `providers: [MatDialog]` landen im Standalone-Injector der Komponente und würden einen
    `providers`-Mock aus dem TestBed überdecken.
  - Das Setup gibt zusätzlich `dialogOpen` und `confirmWith(confirmed: boolean)` zurück, wie
    `game-session-page.fixtures.ts`.
- Neue Spec `character-editor-dialog-remove.spec.ts`. `character-editor-dialog.spec.ts` hat schon
  132 Zeilen. Buttons werden über `MatButtonHarness` angesprochen:
  - Im Bearbeiten-Modus gibt es „Entfernen“, im Neu-Modus nicht.
  - „Entfernen“ + Bestätigung: `dialogOpen` wurde mit `ConfirmationDialog` aufgerufen. Der Charakter
    fehlt in `characters()`, ein zweiter gespeicherter Charakter bleibt erhalten. `close` wurde genau
    einmal **ohne** Wert aufgerufen.
  - „Entfernen“ + Abbruch der Rückfrage: `characters()` bleibt unverändert, `close` wurde nicht
    aufgerufen, und die Felder zeigen weiter die Arbeitskopie.
  - Ungespeicherte Änderungen werden nicht geschrieben: Name ändern, dann „Entfernen“ + Bestätigung.
    Danach gibt es weder den alten noch den geänderten Charakter.
  - „Entfernen“ ist auch bei ungültigem Formular aktiv, etwa bei leerem Namen.
- Die bestehenden Editor-Specs bleiben unverändert grün.

**Erwartetes Verhalten:** Das Löschen ist über die DOM-Buttons getestet, einschließlich Bestätigung,
Abbruch und Neu-Modus.

---

### 4. E2E-Test: Rückfrage auf PC und Tablet ✅ done (2026-10-21 18:51)

In jsdom gibt es keinen Unterschied zwischen PC und Tablet. Deshalb prüft Playwright die Rückfrage für
beide Eingabearten. `e2e/character-editor.spec.ts` bekommt dafür neue Szenarien nach denselben
Konventionen: Locator über Rolle oder Text, kein `waitForTimeout`.

- **Ablauf:** Im Character Tracker „Add Monster“ → Dungeon Tracker → Doppelklick auf das Token →
  „Entfernen“ → Die Rückfrage erscheint.
  - **Bestätigen:** „Bestätigen“ → Der Editor ist geschlossen, Token und Eintrag in der Legende sind
    weg → Nach einem Reload fehlen sie weiterhin.
  - **Abbrechen:** „Abbrechen“ in der Rückfrage → Der Editor ist noch offen → Nach „Abbrechen“ im
    Editor sind Token und Eintrag in der Legende noch da.
- **PC:** Das Projekt `chromium` (Desktop Chrome) klickt die Buttons mit `click()`.
- **Tablet:** Ein `test.describe('Tablet')` mit
  `test.use({ viewport: { width: 1024, height: 768 }, hasTouch: true })` tippt „Entfernen“,
  „Bestätigen“ und „Abbrechen“ mit `tap()` an.
  - Der Editor öffnet sich wie in den bestehenden Szenarien per `dblclick()`. Ob ein Doppeltipp auf
    echten Tablets einen Doppelklick auslöst, gehört zum Öffnen des Editors und ist **nicht** Teil
    dieses Requests.
  - Gerätevorlagen wie `devices['iPad …']` eignen sich nicht, weil sie `defaultBrowserType` setzen,
    und das ist in einer `describe`-Gruppe nicht erlaubt.
- **Umgesetzt** als Schleife über `INPUT_DEVICES` (PC und Tablet, jeweils mit eigener Druckmethode).
  Daraus entstehen die Gruppen `"Entfernen" on PC` und `"Entfernen" on Tablet`. Weil zwei Dialoge
  übereinanderliegen, findet der Test sie über ihren Namen:
  `getByRole('dialog', { name: 'Auswahl treffen' })` für die Rückfrage, die Titel des Editors für den
  Editor.
- Die Szenarien für PC und Tablet nutzen gemeinsame Schritte, etwa einen Helfer mit der Druckmethode
  als Parameter. So bleibt die Datei unter 150 Zeilen.

**Erwartetes Verhalten:** Alle vier Szenarien (PC und Tablet, jeweils Bestätigen und Abbrechen) laufen
in `npm run e2e` stabil durch.

---

### 5. Dokumentation ✅ done (2026-10-21 18:51)

`REQUIREMENTS.md` §3: Nach dem Satz über den Doppelklick („… ‚Abbrechen‘ verwirft sie.“) kommt hinzu:
„Über ‚Entfernen‘ löscht der DM den Charakter nach einer Rückfrage, am PC wie auf dem Tablet, aus der Spielesession; er
verschwindet sofort vom Spielbrett und aus dem Character Tracker, und der Dialog schließt sich.“

**Erwartetes Verhalten:** Die Anforderungen beschreiben das Entfernen über den Editor.

---

## Betroffene Dateien

| Datei                                                                                      | Änderung                                                  |
| ------------------------------------------------------------------------------------------ | --------------------------------------------------------- |
| `src/app/shared/components/character-editor-dialog/character-editor-dialog.ts`             | `isEditMode`, `remove()`, `confirmRemoval()` (Punkt 1, 2) |
| `src/app/shared/components/character-editor-dialog/character-editor-dialog.html`           | Button „Entfernen“ (Punkt 1)                              |
| `src/app/shared/components/character-editor-dialog/character-editor-dialog.css`            | `.character-editor__remove` (Punkt 1)                     |
| `src/app/shared/components/character-editor-dialog/character-editor-dialog-remove.spec.ts` | Neu: Tests zum Entfernen (Punkt 3)                        |
| `src/app/shared/testing/character-editor-dialog.fixtures.ts`                               | `MatDialog`-Mock, `confirmWith` (Punkt 3)                 |
| `src/app/shared/services/character-editor.service.ts`                                      | JSDoc: `undefined` auch nach Entfernen (Punkt 2)          |
| `e2e/character-editor.spec.ts`                                                             | Szenarien „Entfernen“ für PC und Tablet (Punkt 4)         |
| `REQUIREMENTS.md`                                                                          | §3: Entfernen über den Editor (Punkt 5)                   |

---

## Hinweise

- **Rückfrage vor dem Löschen (entschieden 2026-10-21):** Die Rückfrage erscheint auf PC und Tablet.
  „Entfernen“ steht in derselben Leiste wie „Abbrechen“ und „Übernehmen“, und ein versehentlicher Klick
  oder Tipp ließe sich nicht rückgängig machen. Der Button `DEL` im Character Tracker löscht weiterhin
  ohne Rückfrage. Eine Rückfrage dort wäre ein eigener Request.
- **Text der Rückfrage:** `ConfirmationDialog` zeigt einen festen Text („Möchten Sie diese Aktion
  wirklich ausführen?“). Ein Text mit Namen, etwa „Charakter ‚Ork‘ entfernen?“, bräuchte
  `MAT_DIALOG_DATA` im `ConfirmationDialog`. Das ist **nicht** Teil dieses Requests.
- **Rückgabewert:** Nach dem Entfernen schließt der Editor ohne Wert, genau wie bei „Abbrechen“. Kein
  Aufrufer abonniert das Ergebnis heute. Braucht ein Aufrufer später die Unterscheidung, wäre ein
  Ergebnistyp wie `{ action: 'saved' | 'removed'; character }` die Erweiterung.
- **Doppelte Bestätigungslogik:** `confirmRemoval()` entspricht `GameSessionPage.confirm()`. Bei zwei
  Stellen bleibt das bewusst so. Kommt eine dritte hinzu, lohnt sich ein gemeinsamer Helfer unter
  `shared/` als eigener Refactoring Request.
- **Gestapelte Dialoge:** Der `ConfirmationDialog` öffnet sich über dem Editor. Material legt ihn
  darüber und gibt den Fokus nach dem Schließen an den Editor zurück.
- **Dateilimit 150 Zeilen:** Geschätzt kommt `character-editor-dialog.ts` auf etwa 90 Zeilen,
  `.html` auf etwa 125 und `.css` auf etwa 136. Die Fixture wächst von 104 auf etwa 115 Zeilen.

---

## Akzeptanzkriterien

- [x] Im Bearbeiten-Modus zeigt der Editor links in der Aktionsleiste einen roten Button „Entfernen“, im Neu-Modus nicht
- [x] „Entfernen“ fragt über den `ConfirmationDialog` nach, ausnahmslos am PC (Maus) und auf dem Tablet (Touch)
- [x] Die E2E-Szenarien prüfen Bestätigen und Abbrechen der Rückfrage für PC (`click()`) und Tablet (`tap()`, `hasTouch`)
- [x] Nach „Bestätigen“ ist der Charakter über `CharactersDbService.removeCharacter()` gelöscht: Token, Legende, Character Tracker und Session-Snapshot zeigen ihn sofort nicht mehr, auch nach einem Reload
- [x] Danach schließt sich der Editor ohne Wert. Ungespeicherte Änderungen werden nicht geschrieben
- [x] Bricht der DM die Rückfrage ab, bleibt der Editor mit unveränderter Arbeitskopie offen, und es wird nichts gelöscht
- [x] „Entfernen“ ist auch bei ungültigem Formular aktiv
- [x] Es gibt keine neuen Tokens und keine neue Service-Logik
- [x] Jede Datei hat höchstens 150 Zeilen, und die neue Spec prüft das Verhalten über die DOM-Buttons
- [x] `REQUIREMENTS.md` §3 ist aktualisiert
- [x] `npm run lint`, `npm run test -- --watch=false --coverage` (Schwellen eingehalten), `npm run build` und `npm run e2e` laufen grün
