# Feature Request: Komfortfunktionen für den Card Viewer

**Datum:** 2026-11-07  
**Priorität:** Mittel  
**Status:** open  
**Bezug:** setzt `docs/feature-requests/done/card-viewer.md` und `docs/feature-requests/character-inventory.md` voraus;
`src/app/shared/components/card-viewer/`, Kartenaktionen unter `shared/`,
`src/app/features/dungeon-tracker/components/character-status/`, `src/app/core/services/game-log/`,
`REQUIREMENTS.md` (Abschnitte 1, 3 und 5)

---

## Reihenfolge der Umsetzung

Die vier Requests bauen aufeinander auf und werden nacheinander umgesetzt. Ein Request wird erst begonnen, wenn
alle vorherigen vollständig umgesetzt und nach `done/` verschoben sind.

1. `docs/refactoring-requests/done/card-move-foundation.md` (keine Voraussetzung)
2. `docs/feature-requests/done/card-viewer.md` – braucht 1.
3. `docs/feature-requests/character-inventory.md` – braucht 1. und 2.
4. **`docs/feature-requests/card-viewer-comfort.md`** ← dieser Request – braucht 1. bis 3. (Untermenüs und
   Rückgängig betreffen auch die Inventaraktionen, Blättern auch das Inventar)

---

## Problem

- Viele Kartenaktionen brauchen noch einen Dialog (Charakter und Slot wählen) und mehrere Klicks.
- Ein Klick daneben im Menü lässt sich nur durch weitere Aktionen von Hand korrigieren.
- Wer mehrere Karten eines Stapels durchsehen will, muss den Viewer jedes Mal schließen und neu öffnen.
- Im Dungeon Tracker, wo der DM während des Spiels ist, sieht man die Karten der Charaktere nicht.

---

## Ziel

Der DM erledigt jede Kartenaktion mit möglichst wenigen Klicks, kann sie sofort zurücknehmen und
erreicht die Karten der Charaktere auch aus dem Dungeon Tracker.

---

## Anforderungen

### 1. Untermenüs statt Dialog

- „Einem Charakter anlegen“ und „Einem Charakter ins Inventar geben“ öffnen ein Untermenü mit den Charakteren der
  Session.
- Beim Anlegen ergibt sich der Slot aus der Karte. Nur bei Handkarten folgt ein weiteres Untermenü „Linke Hand /
  Rechte Hand“, die freie Hand steht oben.
- Ist der Slot belegt, zeigt der Eintrag den Namen der bisherigen Karte, z. B. „Barbar – ersetzt Turmschild“.
  Die Abfrage, wohin die bisherige Karte kommt (Inventar / Ablagestapel), bleibt.
- Der Zuweisungsdialog `assign-equipment-dialog` entfällt.
- Die Registry erlaubt Untermenüs allgemein: Eine Aktion kann statt „ausführen“ eine Liste von Unteraktionen
  liefern.

### 2. Rückgängig

- Nach jeder Aktion im Modus `live` erscheint kurz ein Hinweis mit der Aktion und „Rückgängig“, z. B.
  „Runenrüstung an Barbar angelegt – Rückgängig“. Er verschwindet nach einigen Sekunden oder bei der nächsten
  Aktion.
- „Rückgängig“ bringt alle Karten, die die Aktion bewegt hat, an ihren vorherigen Ort zurück. Dazu gehört auch eine
  dabei aus einem Slot verdrängte Karte.
- Werte und Log folgen den normalen Regeln der Rückbewegung: Bonus entfällt bzw. kommt dazu, Log-Eintrag der
  Rückbewegung. Eine zurückgemischte Karte kommt aus dem Nachziehstapel wieder heraus.
- Nur die letzte Aktion ist rücknehmbar. Ist die Rückbewegung nicht mehr möglich (Karte inzwischen bewegt, Deck
  oder Charakter entfernt), entfällt der Hinweis.
- Im Modus `draft` (Charakter-Editor) gibt es keinen Hinweis, dort übernimmt „Abbrechen“ diese Rolle.

### 3. Blättern

- Liegt die Karte an einem Ort mit mehreren Karten, blättern Pfeil-Knöpfe neben der Karte zur vorherigen bzw. nächsten Karte desselben Ortes. Solche Orte sind Hand, Nachziehstapel, Ablagestapel, Bank,
  Ausrüstung eines Charakters und Inventar eines Charakters.
- Angezeigt wird die Position, z. B. „3 / 12“. Am Anfang und Ende ist der jeweilige Pfeil deaktiviert.
- Nach einer Aktion, die die Karte vom Ort wegbewegt, bleibt der Viewer am Ort und zeigt die nächste Karte. Ist der
  Ort leer, zeigt er die bewegte Karte an ihrem neuen Ort.

### 4. Weitere Aktion „Oben auf den Nachziehstapel legen“

- Legt die Karte oben auf den Nachziehstapel ihres Decks, ohne zu mischen. Der nächste Zug zieht sie.
- Verfügbar, wenn die Karte nicht schon oben auf dem Nachziehstapel liegt.

### 5. Karten im Dungeon Tracker

- `character-status` zeigt die ausgerüsteten Karten und die Anzahl der Inventarkarten des Charakters als kleine
  Bilder bzw. Hinweis.
- Ein Klick öffnet den Viewer im Modus `live` mit allen Aktionen. Ein Klick auf den Inventarhinweis öffnet die
  erste Inventarkarte, weiter per Blättern.

### 6. Dokumentation

- `REQUIREMENTS.md` beschreibt Untermenüs, Rückgängig, Blättern und die Karten im Dungeon Tracker.

---

## Akzeptanzkriterien

- [ ] Eine Ausrüstungskarte lässt sich ohne Dialog in höchstens drei Klicks anlegen (Aktion → Charakter →
      ggf. Hand).
- [ ] „Rückgängig“ stellt nach Anlegen mit verdrängter Karte, Zurückmischen, Inventarbewegung und Ablegen die
      vorherigen Orte und die Werte wieder her (Specs mit Fake-Timern).
- [ ] Blättern mit den Pfeil-Knöpfen durchläuft alle Karten eines Ortes mit Positionsanzeige.
- [ ] Es gibt keine Tastenkürzel für Kartenaktionen, Blättern oder Rückgängig.
- [ ] „Oben auf den Nachziehstapel legen“ bewirkt, dass der nächste Zug diese Karte zieht.
- [ ] Im Dungeon Tracker öffnet ein Klick auf eine Karte eines Charakters den Viewer.
- [ ] `assign-equipment-dialog` ist entfernt.
