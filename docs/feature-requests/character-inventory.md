# Feature Request: Inventar der Charaktere

**Datum:** 2026-11-07  
**Priorität:** Hoch  
**Status:** open  
**Bezug:** setzt `docs/feature-requests/done/card-viewer.md` voraus; `src/app/core/models/deck-state.model.ts`,
`src/app/core/services/card-deck/`, `src/app/core/services/equipment/`, `src/app/core/services/characters/`,
`src/app/features/card-manager/`, `src/app/features/game-session/xml/`,
`src/app/shared/components/character-editor-dialog/`, `REQUIREMENTS.md` (Abschnitte 1 und 5)

---

## Reihenfolge der Umsetzung

Die vier Requests bauen aufeinander auf und werden nacheinander umgesetzt. Ein Request wird erst begonnen, wenn
alle vorherigen vollständig umgesetzt und nach `done/` verschoben sind.

1. `docs/refactoring-requests/done/card-move-foundation.md` (keine Voraussetzung)
2. `docs/feature-requests/done/card-viewer.md` – braucht 1.
3. **`docs/feature-requests/character-inventory.md`** ← dieser Request – braucht 1. und 2. (`moveCard`,
   Card Viewer mit Aktions-Registry und Modus `draft`)
4. `docs/feature-requests/card-viewer-comfort.md` – braucht 1. bis 3.

---

## Problem

- Ein Charakter kann Karten nur in seinen fünf Slots haben. Karten, die er bei sich trägt, aber nicht nutzt
  (Tränke, Schlüssel, Ersatzwaffe), haben keinen Ort und landen in Bank oder Ablagestapel. Dann weiß niemand mehr,
  wem sie gehören.

---

## Ziel

- Jeder Charakter hat ein Inventar, in das **alle** Kartentypen passen.
- Karten im Inventar ändern **keine** Werte. Boni wirken nur, solange eine Ausrüstungskarte angelegt ist.
- Der DM sieht im Card Manager auf einen Blick, welcher Charakter welche Karten trägt.

---

## Grundsatz

- Das Inventar ist ein Ort wie Hand oder Slot (`CardLocation`, Ziel von `moveCard`). Eine Karte liegt entweder im
  Inventar, in einem Slot, in der Hand, in einem Stapel oder in der Bank.
- Besitz steht an einer einzigen Stelle. Bevorzugt werden Slot- und Inventarkarten in einer gemeinsamen Liste
  geführt (z. B. `slot: EquipmentSlot | null`, `null` = Inventar). Dann gelten Löschen, Laden und Entfernen für
  beide automatisch gleich. Die Entscheidung fällt bei der Umsetzung und wird im Log begründet.
- Keine Obergrenze für die Zahl der Inventarkarten.

---

## Anforderungen

### 1. Datenmodell und Bewegungen

- Inventarkarten mit `deckId`, Karte und `characterId`.
- `locateCard` und `moveCard` kennen den Ort/das Ziel „Inventar von <Charakter>“.
- Wechselt eine Ausrüstungskarte zwischen Slot und Inventar, gilt:
  - Slot → Inventar: Der Bonus entfällt, Leben und Rüstung werden auf das neue Maximum begrenzt.
  - Inventar → Slot: Leben und Rüstung steigen um den Bonus.
    Das sind dieselben Regeln wie Ablegen und Anlegen.

### 2. Aktionen im Card Viewer

| Aktion                             | Verfügbar, wenn die Karte …                                                                                |
| ---------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Einem Charakter ins Inventar geben | nicht schon im Inventar dieses Charakters liegt; Auswahl des Charakters, auch Weitergeben an einen anderen |
| Ins Inventar legen                 | an einem Charakter angelegt ist; sie kommt in sein eigenes Inventar                                        |
| Einem Charakter anlegen            | eine Ausrüstungskarte ist, auch aus dem Inventar                                                           |

- Ohne Charaktere sind „ins Inventar geben“ und „anlegen“ deaktiviert mit „Keine Charaktere in der Session“.
- Ist beim Anlegen der Slot belegt, wählt der DM, wohin die bisherige Karte kommt: **ins Inventar** des
  Charakters, in den **Ablagestapel** ihres Decks oder **Abbrechen**.
- Alle Aktionen aus `card-viewer.md` (Hand, Ablagestapel, Zurückmischen, Bank) gelten auch für Inventarkarten.

### 3. Bereich „Inventar“ im Card Manager

- Eigener Bereich „Inventar“ im Hauptbereich unter „Ausgerüstet“ und über dem Spieltisch.
- Er zeigt die Inventarkarten **aller** Charaktere übersichtlich, gruppiert nach Charakter: aktueller Name mit
  Anzahl, darunter die Karten mit Herkunftsdeck.
- Charaktere ohne Inventarkarten erscheinen nicht. Ohne Inventarkarten ist der Bereich ausgeblendet.
- Höhe begrenzt wie „Ausgerüstet“, weitere Inhalte scrollen in sich.
- Ein Klick auf eine Karte öffnet den Viewer.

### 4. Inventar im Charakter-Editor

- Neuer Abschnitt „Inventar“ unter „Ausrüstung“ mit Bild und Name je Karte; leer: „Keine Karten im Inventar“.
- Ein Klick öffnet den Viewer im Modus `draft`.
- Folgende Aktionen schreiben in den Entwurf und wirken erst mit „Übernehmen“:
  - „In den Ablagestapel legen“
  - „Ins Inventar legen“ (aus einem Slot)
  - „Anlegen“ (aus dem Inventar in einen eigenen Slot)
- Die Werte unter Angriff, Abwehr usw. zeigen den Entwurfsstand.

### 5. Löschen, Entfernen, Speichern

- Wird ein Charakter gelöscht, kommen seine Inventarkarten in den Ablagestapel ihres Decks.
- Wird ein Deck entfernt, verschwinden seine Inventarkarten.
- Zurücksetzen eines Decks lässt Inventarkarten wie ausgerüstete Karten beim Besitzer.
- Das Inventar gehört zur Spielesession und zum XML-Spielstand. Ältere Spielstände laden mit leerem Inventar.
  Inventarkarten fehlender Charaktere landen beim Laden im Ablagestapel ihres Decks, Inventarkarten fehlender Decks
  werden verworfen.

### 6. Ereignis-Log

- Jede Bewegung in ein Inventar und aus einem Inventar steht im Ereignis-Log (wie Zuweisen/Ablegen, nur unter
  „Alle“), z. B. „Heiltrank ins Inventar von Zwerg“ oder „Runenrüstung von Barbar aus dem Inventar angelegt“.

### 7. Dokumentation

- `REQUIREMENTS.md` Abschnitte 1 und 5 beschreiben das Inventar.

---

## Akzeptanzkriterien

- [ ] Basis-, Kampf- und Ausrüstungskarten lassen sich über den Viewer jedem Charakter ins Inventar geben und an
      einen anderen weitergeben.
- [ ] Eine Ausrüstungskarte im Inventar ändert keine Werte; angelegt wirkt ihr Bonus, zurück ins Inventar entfällt
      er (Beispielrechnung aus REQUIREMENTS Abschnitt 1 als Spec).
- [ ] Belegter Slot beim Anlegen bietet Inventar, Ablagestapel und Abbrechen an.
- [ ] Der Bereich „Inventar“ im Card Manager zeigt alle Charaktere mit Inventarkarten gruppiert und ist sonst
      ausgeblendet.
- [ ] Im Charakter-Editor wirken Inventaraktionen erst nach „Übernehmen“.
- [ ] Löschen eines Charakters, Entfernen eines Decks und Laden alter oder unvollständiger Spielstände verhalten
      sich wie in 5.; Specs decken das ab.
- [ ] Alle Inventarbewegungen stehen im Ereignis-Log.
