# Feature Request: Card Viewer mit Kartenmenü und Hand des Dungeon Masters

**Datum:** 2026-11-07  
**Priorität:** Hoch  
**Status:** done (2026-11-07 08:45)  
**Bezug:** setzt `docs/refactoring-requests/done/card-move-foundation.md` voraus;
`src/app/features/card-manager/` (`active-card-overlay`, `card-manager-page`, `deck-row`, `deck-piles`,
`equipped-cards`, `card-assignment.service.ts`), `src/app/core/models/deck-state.model.ts`,
`src/app/core/services/card-deck/` (Codec, Migration), `src/app/features/game-session/xml/`,
`src/app/shared/components/character-editor-dialog/`, `src/app/shared/components/character-equipment-editor/`,
`src/app/app.html`, `src/app/app.config.ts`, `REQUIREMENTS.md` (Abschnitte 1 und 5)

---

## Reihenfolge der Umsetzung

Die vier Requests bauen aufeinander auf und werden nacheinander umgesetzt. Ein Request wird erst begonnen, wenn
alle vorherigen vollständig umgesetzt und nach `done/` verschoben sind.

1. `docs/refactoring-requests/done/card-move-foundation.md` (keine Voraussetzung)
2. **`docs/feature-requests/done/card-viewer.md`** ← dieser Request – braucht 1. (`CardDisplay` in `shared/`,
   `locateCard`, `moveCard`, Zuweisen per `CardRef`)
3. `docs/feature-requests/character-inventory.md` – braucht 1. und 2.
4. `docs/feature-requests/card-viewer-comfort.md` – braucht 1. bis 3.

---

## Problem

- Die aktive Karte schwebt nur im Card Manager. Ausgerüstete Karten im Card Manager und im Charakter-Editor kann
  man nicht groß ansehen.
- Kartenaktionen sind über viele Klickflächen verteilt:
  - Klick auf die aktive Karte legt sie ab.
  - Klicks auf Ablagestapel und Bank legen sie dort hin.
  - Ein Klick auf eine Karte im Stapel macht sie aktiv.
  - „Charakter zuweisen“ steht als Knopf unter der Karte.
    Das ist schwer zu entdecken, und jede neue Aktion bräuchte eine weitere Fläche.
- Es gibt nur **eine** aktive Karte. Wer zieht, während eine aktiv ist, legt die bisherige automatisch ab. Am echten
  Tisch hält der DM oft mehrere gezogene Karten in der Hand.

---

## Ziel

- Ein Klick auf eine Karte, egal in welchem Feature, öffnet sie im **Card Viewer**: groß, mit Herkunft und einem
  Menü aller Aktionen, die für diese Karte an ihrem Ort möglich sind.
- Alle Kartenaktionen laufen nur noch über den Viewer.
- Die aktive Karte wird zur **Hand des Dungeon Masters**, die beliebig viele Karten hält.
- Das Menü ist erweiterbar: Eine neue Aktion braucht keine Änderung am Viewer.

---

## Grundsatz

- **Ansehen bewegt nichts.** Der Viewer zeigt eine Karte an ihrem aktuellen Ort. Erst eine Aktion verschiebt sie.
- **Die Hand ist ein Ort** wie Ablagestapel oder Slot. Sie wird gespeichert, der Viewer nicht.
- Der Viewer kennt die Karte nur über ihre Adresse (`CardRef`) und bestimmt den Ort bei jeder Anzeige neu
  (`locateCard`). Nach einer Aktion zeigt er den neuen Ort.

---

## Anforderungen

### 1. Hand des Dungeon Masters statt aktiver Karte ✅ done (2026-11-07 08:45)

- `DeckState.activeCard` wird zur geordneten Liste `hand` (Einträge mit `deckId` und Karte). Neuester Eintrag
  steht am Ende.
- Ziehen legt die oberste Karte des Nachziehstapels zur Hand und öffnet sie im Viewer. Karten in der Hand bleiben
  dabei unverändert; nichts wird automatisch abgelegt.
- `CardLocation` und `moveCard` erhalten den Ort/das Ziel „Hand“. Der Ort „aktive Karte“ entfällt.
- Die Sonderregel „Deckwahl in der Seitenleiste legt die aktive Karte ab“ entfällt: Die Seitenleiste klappt das
  Deck nur noch auf.
- Zurücksetzen eines Decks mischt auch seine Handkarten zurück. Entfernen eines Decks entfernt seine Handkarten.

### 2. Bereich „Hand des Dungeon Masters“ ✅ done (2026-11-07 08:45)

- Ganz oben im Hauptbereich des Card Managers, über „Ausgerüstet“, steht der Bereich „Hand des Dungeon Masters“
  mit Anzahl. Er zeigt alle Handkarten mit dem Namen ihres Decks.
- Ein Klick auf eine Karte öffnet sie im Viewer. Weitere Bedienelemente hat der Bereich nicht.
- Ohne Handkarten ist der Bereich ausgeblendet, wie „Ausgerüstet“.
- Höhe und Scrollverhalten wie „Ausgerüstet“ (höchstens zwei Reihen sichtbar, weitere scrollen in sich).

### 3. Card Viewer ✅ done (2026-11-07 08:45)

- Neuer globaler Viewer unter `src/app/shared/components/card-viewer/`, gesteuert von einem Root-Service
  (`CardViewerService`: `open(ref, kontext?)`, `close()`, `viewed`). Er ist einmal in `app.html` eingebunden und
  aus jedem Feature nutzbar. Er ersetzt `active-card-overlay`.
- Er zeigt die Karte groß (Größe wie heute: höchstens 60 % der Fensterhöhe und 30 % der Breite, Format 63 : 88).
- Immer die **Vorderseite**, auch für Karten im Nachziehstapel: Der DM darf in den Stapel schauen.
- Über der Karte stehen Deck und Ort, z. B. „Monster (2) · Ablagestapel“, „Hand“, „Barbar · Linke Hand“.
- Neben der Karte steht das Aktionsmenü; auf schmalen Bildschirmen darunter.
- Der Hintergrund ist abgedunkelt. Ein Klick daneben, ein Schließen-Knopf oder `Esc` schließt den Viewer. Die
  Karte bleibt dabei, wo sie ist.
- Ein Klick auf die Karte selbst löst keine Aktion aus.
- Der Viewer liegt auch über offenen Dialogen (z. B. dem Charakter-Editor).
- Verschwindet die Karte (z. B. Deck entfernt, Spielstand geladen), schließt der Viewer.

### 4. Aktions-Registry ✅ done (2026-11-07 08:45)

- Eine Kartenaktion beschreibt sich selbst: ID, Beschriftung, Gruppe (für Trennlinien), Reihenfolge, „verfügbar?“
  (sonst ausgeblendet), optional „Grund für deaktiviert“ (ausgegraut mit Tooltip) und „ausführen“.
- Aktionen erhalten einen Kontext: Karte, `CardRef`, Deck, `CardLocation` und Modus (`live` oder `draft`,
  siehe 7.).
- Aktionen werden über ein Multi-`InjectionToken` mit einer Hilfsfunktion `provideCardActions(...)` registriert.
  Der Viewer zeigt alle verfügbaren Aktionen, ohne eine einzelne zu kennen.
- Allgemeine Aktionen liegen unter `shared/` und werden in `app.config.ts` registriert.

### 5. Aktionen ✅ done (2026-11-07 08:45)

| Aktion                              | Verfügbar, wenn die Karte …                                                   |
| ----------------------------------- | ----------------------------------------------------------------------------- |
| In die Hand nehmen                  | nicht in der Hand liegt                                                       |
| In den Ablagestapel legen           | nicht im Ablagestapel liegt                                                   |
| In den Nachziehstapel zurückmischen | nicht im Nachziehstapel liegt                                                 |
| In die Bank legen                   | nicht in der Bank liegt                                                       |
| Einem Charakter anlegen             | eine Ausrüstungskarte ist (auch umlegen an einen anderen Charakter oder Slot) |

- „Einem Charakter anlegen“ nutzt den bestehenden Zuweisungsdialog (Charakter, bei Handkarten links/rechts, freie
  Hand vorausgewählt). Ohne Charaktere ist die Aktion deaktiviert mit „Keine Charaktere in der Session“.
- Ist der Slot belegt, fragt die App wie heute, ob die bisherige Karte in den Ablagestapel soll.
- Legt eine Aktion eine ausgerüstete Karte woanders hin, verliert der Besitzer den Bonus (Regeln aus
  REQUIREMENTS Abschnitt 1). Das kommt ins Log.

### 6. Viewer öffnen statt Direktaktionen ✅ done (2026-11-07 08:45)

- **Card Manager:** Ein Klick auf eine Karte öffnet den Viewer. Das gilt für die Hand, „Ausgerüstet“, die Karten
  im aufgeklappten Nachziehstapel, Ablagestapel und in der Bank sowie die oberste Ablagekarte in der kompakten
  Reihe.
- Die Klickflächen der Bereiche Ablagestapel und Bank sowie alle Direktaktionen auf Karten entfallen.
- Der Klick auf den Nachziehstapel in der kompakten Reihe zieht weiterhin sofort (siehe 1.).
- **Charakter-Editor:** Ein Klick auf Bild oder Name einer ausgerüsteten Karte öffnet den Viewer (siehe 7.).
  Der Knopf „Ablegen“ im Editor entfällt zugunsten der Viewer-Aktion.

### 7. Viewer im Charakter-Editor (Entwurf) ✅ done (2026-11-07 08:45)

- Aus dem Editor geöffnet, arbeitet der Viewer im Modus `draft`. Er zeigt nur Aktionen, die den Entwurf
  unterstützen, für Karten dieses Charakters zunächst „In den Ablagestapel legen“.
- Diese Aktionen schreiben in den Entwurf des Editors. Erst „Übernehmen“ wendet sie an, „Abbrechen“ verwirft sie.
- Der Ort im Viewer zeigt den Entwurfsstand, z. B. „wird abgelegt“.

### 8. Spielesession und XML-Spielstand ✅ done (2026-11-07 08:45)

- Die Hand gehört zur Spielesession und zum XML-Spielstand.
- Ältere Spielstände und gespeicherte Sessions mit `activeCard` laden diese als einzige Handkarte.

### 9. Dokumentation ✅ done (2026-11-07 08:45)

- `REQUIREMENTS.md` Abschnitte 1 (Charakter-Editor: Ausrüstung) und 5 (Card Manager) beschreiben Hand, Viewer und
  Menü statt aktiver Karte und Direktklicks.

---

## Akzeptanzkriterien

- [x] Der DM zieht nacheinander drei Karten aus zwei Decks; alle drei liegen in der Hand, keine wurde abgelegt.
- [x] Der Bereich „Hand des Dungeon Masters“ steht über „Ausgerüstet“ und ist ohne Handkarten ausgeblendet.
- [x] Jede Karte im Card Manager und jede ausgerüstete Karte im Charakter-Editor öffnet beim Klick den Viewer mit
      Deck und Ort; Karten im Nachziehstapel zeigen die Vorderseite.
- [x] Klick daneben und `Esc` schließen den Viewer, ohne die Karte zu bewegen.
- [x] Die Aktionen aus 5. erscheinen nur, wo sie verfügbar sind, und bringen die Karte immer in Stapel oder Bank
      ihres eigenen Decks.
- [x] Anlegen und Umlegen ändern Werte und Log wie in REQUIREMENTS Abschnitt 1.
- [x] Eine Test-Aktion, die nur per `provideCardActions` registriert wird, erscheint im Menü, ohne den Viewer zu
      ändern (Spec).
- [x] Im Charakter-Editor wirkt „In den Ablagestapel legen“ erst nach „Übernehmen“; „Abbrechen“ lässt die Karte am
      Charakter.
- [x] Spielstände mit `activeCard` laden die Karte in die Hand; Hand übersteht Speichern/Laden.
- [x] Klickflächen Ablagestapel/Bank und `active-card-overlay` sind entfernt.
- [x] Ein Playwright-Smoke-Test zieht zwei Karten, öffnet eine aus der Hand und legt sie über das Menü ab.
