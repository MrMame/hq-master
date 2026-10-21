# Feature Request: Bestätigungsdialog im dunklen Look und mit konkretem Text

**Datum:** 2026-10-21  
**Priorität:** Mittel  
**Status:** done (2026-10-21 19:22) — #1–#5 umgesetzt; dunkler Look für alle Aufrufer entschieden (2026-10-21)  
**Bezug:** `docs/feature-requests/done/character-editor-remove.md` (Hinweis „Text der Rückfrage“), `docs/refactoring-requests/done/shared-sidebar-styles.md` (Muster `.general-sidebar`), `.claude/rules/architecture.md` → „Komponenten“

---

## Problem

Der gemeinsame `ConfirmationDialog` (`src/app/shared/components/confirmation-dialog/`) hat zwei
Schwächen:

- **Look:** Er erscheint hell im Material-Standard mit einem türkisen Button „Bestätigen“. Über dem
  dunklen Charakter-Editor wirkt er wie ein Fremdkörper.
- **Text:** Titel und Frage sind fest eingebaut („Auswahl treffen“, „Möchten Sie diese Aktion wirklich
  ausführen?“). Fragt der Editor vor dem Entfernen nach, steht dort nicht, **welcher** Charakter
  gelöscht wird und **was** passiert.

```typescript
// confirmation-dialog.ts (heute)
template: `
  <h2 mat-dialog-title>Auswahl treffen</h2>
  <mat-dialog-content>Möchten Sie diese Aktion wirklich ausführen?</mat-dialog-content>
  <mat-dialog-actions align="end">
    <button mat-button (click)="onNoClick()">Abbrechen</button>
    <button mat-raised-button color="primary" [mat-dialog-close]="true">Bestätigen</button>
  </mat-dialog-actions>
`,
```

Aufrufer heute:

- `CharacterEditorDialog.confirmRemoval()`: Rückfrage vor „Entfernen“
- `GameSessionPage.confirm()`: Rückfrage vor „Session starten“ und vor „Spielstand laden“

---

## Ziel

- Der `ConfirmationDialog` sieht **überall** aus wie der Charakter-Editor: dunkle Fläche, gelber Titel,
  gelber Hauptbutton. Das gilt auch auf der hellen Game-Session-Seite (entschieden 2026-10-21).
- Diesen Look nutzen Editor und Rückfrage gemeinsam über globale Klassen `.general-dialog*`, nach
  dem Muster von `.general-sidebar*`. Die Stile werden nicht dupliziert.
- Aufrufer können Titel, Frage und die Beschriftung des Bestätigen-Buttons übergeben. Ohne Angaben
  bleiben die bisherigen Texte, die Game-Session-Seite bleibt also textlich unverändert.
- Der Editor fragt konkret: **„Charakter entfernen“ – „‚Grimgor‘ wirklich entfernen?“ – [Abbrechen]
  [Entfernen]**.

### Entwurf

```
┌──────────────────────────────────────┐  Fläche gray-800 (wie der Editor)
│ Charakter entfernen      ← gelb, fett │
│ „Grimgor“ wirklich entfernen?  ← weiß │
│              Abbrechen  [ Entfernen ] │  Abbrechen gray-400 (hat den Fokus),
└──────────────────────────────────────┘  Hauptbutton gelb wie „Übernehmen“
```

---

## Anforderungen

### 1. Gemeinsamer Dialog-Look `.general-dialog` ✅ done (2026-10-21 19:22)

- Neue Datei `src/styles/components/dialog.css`, von Hand angelegt (es gibt keinen CLI-Blueprint für
  globales CSS). Eingebunden in `src/styles.css` direkt nach der Seitenleiste:
  `@import './styles/components/dialog.css' layer(components);`
- Die Klassen übernehmen 1:1 die heutigen Werte aus `character-editor-dialog.css`:

  | Klasse                     | Herkunft im Editor          | Inhalt                                                                                                                                          |
  | -------------------------- | --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
  | `.general-dialog`          | `:host`                     | `display: block`, Fläche `--color-gray-800`, Text `--color-white`, `--mat-dialog-subhead-color` gelb, `--mat-dialog-supporting-text-color` weiß |
  | `.general-dialog__title`   | `.character-editor__title`  | `--mat-dialog-subhead-*`: `--text-lg`, fett                                                                                                     |
  | `.general-dialog__cancel`  | `.character-editor__cancel` | `--mat-button-text-label-text-color: var(--color-gray-400)`                                                                                     |
  | `.general-dialog__confirm` | `.character-editor__apply`  | gelber `mat-flat-button` mit Hover und dunklem Disabled-Zustand                                                                                 |

- Der Kopfkommentar folgt `sidebar.css`. Komponenten-CSS ohne Layer hat Vorrang und darf einzelne
  Werte überschreiben.
- **Bei der Umsetzung gefunden (2026-10-21):** Material setzt den Dialog-Host über
  `.mat-mdc-dialog-component-host { display: contents; }`, und zwar ohne Layer. Ein `display: block`
  im Layer `components` verliert dagegen. Deshalb steht `display: block !important` in
  `.general-dialog`, mit Kommentar, nach Freigabe durch den Nutzer. Ohne das `!important` weichen in
  der Pixel-Probe 75 % der Pixel ab, weil die Fläche fehlt.
- `CharacterEditorDialog`:
  - `host: { class: 'general-dialog' }` im `@Component`-Decorator. Der `:host`-Block in
    `character-editor-dialog.css` entfällt.
  - Im Template werden `character-editor__title`, `__cancel` und `__apply` zu `general-dialog__title`,
    `__cancel` und `__confirm`. Die drei lokalen Regeln entfallen.
  - `.character-editor__remove` bleibt lokal, denn nur der Editor hat diesen Button.
- Es sind nur Tokens aus `src/styles/tokens.css` erlaubt, keine neuen Tokens.

**Erwartetes Verhalten:** Der Editor sieht **pixelgleich** aus wie vorher. Seine Stile liegen jetzt zum
Teil global und stehen weiteren Dialogen zur Verfügung.

---

### 2. `ConfirmationDialog`: dunkler Look und übergebbare Texte ✅ done (2026-10-21 19:22)

- Neue Datei `src/app/shared/models/confirmation-dialog-data.model.ts`, von Hand angelegt:

  ```typescript
  /** Texte der Rückfrage; fehlende Werte nutzen die Standardtexte des ConfirmationDialog. */
  export interface ConfirmationDialogData {
    title?: string;
    message?: string;
    confirmLabel?: string;
  }
  ```

- `confirmation-dialog.ts`:
  - `inject<ConfirmationDialogData | null>(MAT_DIALOG_DATA, { optional: true })`. Ohne Daten gelten
    die Standardtexte „Auswahl treffen“, „Möchten Sie diese Aktion wirklich ausführen?“ und
    „Bestätigen“.
  - `host: { class: 'general-dialog' }`. Der Titel bekommt `general-dialog__title`, „Abbrechen“
    bekommt `general-dialog__cancel`.
  - Der Bestätigen-Button wird `mat-flat-button` mit `general-dialog__confirm`, statt
    `mat-raised-button color="primary"`. `[mat-dialog-close]="true"` bleibt.
  - Das Template bleibt inline, weil die Datei unter 100 Zeilen bleibt. Eigenes CSS ist nicht nötig.
  - Den Fokus beim Öffnen behält „Abbrechen“ (Material-Standard `autoFocus: 'first-tabbable'`). Ein
    versehentliches Enter löscht oder ersetzt also nichts.
- `confirmation-dialog.spec.ts` spricht die Buttons über `MatButtonHarness` an (siehe `testing.md`):
  - Ohne `MAT_DIALOG_DATA` erscheinen die drei Standardtexte.
  - Mit Daten erscheinen Titel, Frage und Button-Beschriftung des Aufrufers.
  - Mit nur einem Teil der Daten, etwa nur `message`, gelten für den Rest die Standardtexte.
  - „Abbrechen“ schließt mit `false`, der Bestätigen-Button schließt mit `true`, auch mit eigener
    Beschriftung.
- `GameSessionPage` bleibt unverändert. Sie übergibt keine Daten und behält damit ihre Texte. Auch
  `e2e/session-roundtrip.spec.ts`, das „Bestätigen“ klickt, bleibt unverändert.

**Erwartetes Verhalten:** Jede Rückfrage erscheint dunkel mit gelbem Titel und gelbem Hauptbutton.
Ohne Angaben zeigt sie die bisherigen Texte, mit Angaben die Texte des Aufrufers.

---

### 3. Charakter-Editor: konkrete Rückfrage beim Entfernen ✅ done (2026-10-21 19:22)

- `CharacterEditorDialog.confirmRemoval()` öffnet die Rückfrage mit

  ```typescript
  { data: { title: 'Charakter entfernen', message: `„${name}“ wirklich entfernen?`, confirmLabel: 'Entfernen' } }
  ```

  - `name` ist der Name des **gespeicherten** Charakters, nicht der ungespeicherten Arbeitskopie.
    Gelöscht wird der gespeicherte Stand, und eine Umbenennung im Formular wird verworfen.
  - Im Bearbeiten-Modus ist `character` immer gesetzt. Die Umsetzung soll keinen Zweig erzeugen, der
    im Test nicht erreichbar ist. Ein Weg dahin ist, den gespeicherten Namen beim Öffnen in einem
    eigenen Feld abzulegen.

- `character-editor-dialog-remove.spec.ts`:
  - `dialogOpen` wird mit `ConfirmationDialog` und genau diesen Daten aufgerufen.
  - Wurde der Name vorher im Formular geändert, nennt die Rückfrage trotzdem den gespeicherten Namen.
- Die JSDoc von `confirmWith` in `character-editor-dialog.fixtures.ts` spricht von „bestätigt“ statt
  von „Bestätigen“, weil der Button jetzt „Entfernen“ heißt.

**Erwartetes Verhalten:** Vor dem Entfernen steht in der Rückfrage der Name des Charakters, und der
Hauptbutton heißt „Entfernen“.

---

### 4. E2E-Tests ✅ done (2026-10-21 19:22)

`e2e/character-editor.spec.ts` (Szenarien `"Entfernen" on PC/Tablet`):

- `confirmation(page)` sucht den Dialog `'Charakter entfernen'` statt `'Auswahl treffen'`.
- Vor „Entfernen“ wird der Name aus dem Feld „Name“ gelesen. Danach zeigt die Rückfrage
  `„<Name>“ wirklich entfernen?`.
- In der Rückfrage hat „Abbrechen“ beim Öffnen den Fokus (`toBeFocused()`).
- Bestätigt wird über den Button „Entfernen“ **innerhalb** der Rückfrage.

**Erwartetes Verhalten:** Alle vier Szenarien (PC und Tablet, jeweils Bestätigen und Abbrechen) sind
grün, und `e2e/session-roundtrip.spec.ts` ist unverändert grün.

---

### 5. Dokumentation ✅ done (2026-10-21 19:22)

`.claude/rules/architecture.md`:

- In der Verzeichnisstruktur bekommt `shared/` den Eintrag
  `models/ → confirmation-dialog-data.model.ts (Texte der Rückfrage)`.
- Unter „Komponenten“ nennt der Satz zu feature-übergreifenden Bausteinen neben `.general-sidebar`
  auch `.general-dialog`. Die Bausteine liegen unter `src/styles/components/`.

**Erwartetes Verhalten:** Die Architektur-Doku beschreibt den gemeinsamen Dialog-Look und das neue
Model.

---

## Betroffene Dateien

| Datei                                                                                      | Änderung                                                  |
| ------------------------------------------------------------------------------------------ | --------------------------------------------------------- |
| `src/styles/components/dialog.css`                                                         | Neu: `.general-dialog*` (Punkt 1)                         |
| `src/styles.css`                                                                           | `@import` in Layer `components` (Punkt 1)                 |
| `src/app/shared/components/character-editor-dialog/character-editor-dialog.ts`             | Host-Klasse (Punkt 1), Rückfrage-Daten (Punkt 3)          |
| `src/app/shared/components/character-editor-dialog/character-editor-dialog.html`           | `general-dialog__*`-Klassen (Punkt 1)                     |
| `src/app/shared/components/character-editor-dialog/character-editor-dialog.css`            | `:host`, Titel, Abbrechen, Übernehmen entfallen (Punkt 1) |
| `src/app/shared/models/confirmation-dialog-data.model.ts`                                  | Neu: `ConfirmationDialogData` (Punkt 2)                   |
| `src/app/shared/components/confirmation-dialog/confirmation-dialog.ts`                     | Daten, Standardtexte, dunkler Look (Punkt 2)              |
| `src/app/shared/components/confirmation-dialog/confirmation-dialog.spec.ts`                | Harness, Standard- und eigene Texte (Punkt 2)             |
| `src/app/shared/components/character-editor-dialog/character-editor-dialog-remove.spec.ts` | Rückfrage-Daten, gespeicherter Name (Punkt 3)             |
| `src/app/shared/testing/character-editor-dialog.fixtures.ts`                               | JSDoc von `confirmWith` (Punkt 3)                         |
| `e2e/character-editor.spec.ts`                                                             | Name, Text, Fokus und Button der Rückfrage (Punkt 4)      |
| `.claude/rules/architecture.md`                                                            | `shared/models/`, `.general-dialog` (Punkt 5)             |

---

## Hinweise

- **Dunkel überall (entschieden 2026-10-21):** Die Rückfragen der Game-Session-Seite werden dunkel,
  obwohl die Seite hell ist (`color-scheme: light`). Gemeinsame Dialoge unter `shared/` haben damit
  einen einheitlichen Look, unabhängig von der Seite, die sie öffnet.
- **Pixelgleicher Editor:** Vor der Umsetzung eine Playwright-Probe mit Screenshot des Editors anlegen,
  einmal im Bearbeiten- und einmal im Neu-Modus. Nach Punkt 1 muss sie mit Toleranz 0 gleich
  bleiben, wie beim Refactoring `tailwind-to-css`. Für die Rückfrage gibt es Screenshots vorher und
  nachher, aus dem Editor und aus der Game-Session-Seite.
- **Hintergrund auf dem Host:** Wie beim Editor liegt die Fläche auf dem Host-Element. Die
  Material-Dialogfläche schneidet ihren Inhalt an den runden Ecken ab. `--mat-dialog-container-color`
  wird deshalb nicht gebraucht.
- **Nicht im Scope:**
  - `AddCharacterDialog` und `DamageTakenDialog` im Character Tracker bleiben hell. Sie könnten
    `.general-dialog` später übernehmen.
  - Eine „destruktive“ Variante mit rotem Bestätigen-Button ist nicht vorgesehen. Rot ist im Editor
    schon der Button „Entfernen“, der die Rückfrage auslöst.
  - Konkrete Texte für die Game-Session-Rückfragen, etwa „Spielstand laden? Die aktuelle Session
    wird ersetzt.“, wären ein eigener kleiner Request.
- **Doppelte Bestätigungslogik:** `confirmRemoval()` und `GameSessionPage.confirm()` bleiben getrennt.
  Erst ab einem dritten Aufrufer lohnt sich ein gemeinsamer Helfer (siehe `character-editor-remove`).
- **Dateilimit 150 Zeilen:** Geschätzt kommt `dialog.css` auf etwa 45 Zeilen,
  `character-editor-dialog.css` sinkt von 136 auf etwa 105, und `confirmation-dialog.ts` landet bei
  etwa 45.

---

## Akzeptanzkriterien

- [x] Der `ConfirmationDialog` erscheint überall dunkel mit gelbem Titel, weißer Frage, grauem „Abbrechen“ und gelbem Hauptbutton, auch auf der Game-Session-Seite
- [x] Editor und Rückfrage nutzen gemeinsam `.general-dialog*` aus `src/styles/components/dialog.css`, ohne doppelte Stile und ohne neue Tokens
- [x] Der Charakter-Editor sieht pixelgleich aus wie vorher (Probe mit Toleranz 0)
- [x] Ohne Daten zeigt der `ConfirmationDialog` die bisherigen Texte, mit Daten die des Aufrufers, auch teilweise
- [x] Die Rückfrage im Editor lautet „Charakter entfernen“ / „‚<gespeicherter Name>‘ wirklich entfernen?“ / „Entfernen“
- [x] „Abbrechen“ hat in der Rückfrage beim Öffnen den Fokus
- [x] Die Game-Session-Seite ist im Code unverändert, und `e2e/session-roundtrip.spec.ts` ist grün
- [x] Jede Datei hat höchstens 150 Zeilen, und die Specs prüfen das Verhalten über Harness und DOM
- [x] `.claude/rules/architecture.md` ist aktualisiert
- [x] `npm run lint`, `npm run test -- --watch=false --coverage` (Schwellen eingehalten), `npm run build` und `npm run e2e` laufen grün
