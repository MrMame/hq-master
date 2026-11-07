# Refactoring Request: Grundlage für Kartenbewegungen von beliebigen Orten

**Datum:** 2026-11-07  
**Priorität:** Hoch  
**Status:** done (2026-11-07 08:14)  
**Bezug:** `src/app/features/card-manager/components/card-display/`, `src/app/core/services/card-deck/`
(`deck-draw.util.ts`, `deck-assignment.util.ts`, `deck-state.util.ts`, `card-manager.service.ts`),
`src/app/core/services/equipment/equipment.service.ts`, `src/app/features/card-manager/services/card-assignment.service.ts`;
Vorarbeit für `docs/feature-requests/card-viewer.md`, `docs/feature-requests/character-inventory.md` und
`docs/feature-requests/card-viewer-comfort.md`

---

## Reihenfolge der Umsetzung

Die vier Requests bauen aufeinander auf und werden nacheinander umgesetzt. Ein Request wird erst begonnen, wenn
alle vorherigen vollständig umgesetzt und nach `done/` verschoben sind.

1. **`docs/refactoring-requests/done/card-move-foundation.md`** ← dieser Request (keine Voraussetzung)
2. `docs/feature-requests/card-viewer.md` – braucht 1.
3. `docs/feature-requests/character-inventory.md` – braucht 1. und 2.
4. `docs/feature-requests/card-viewer-comfort.md` – braucht 1. bis 3.

---

## Problem

- `CardDisplay` liegt unter `features/card-manager`. Ein Card Viewer für alle Features muss unter `shared/` liegen,
  und `shared/` darf nichts aus `features/` importieren.
- Alle Kartenbewegungen gehen nur von der aktiven Karte aus: `activateCard`, `discardActive`,
  `shuffleActiveIntoDrawPile`, `dropActiveIntoBank`, `assignActiveCard` (Util, `CardManagerService`,
  `EquipmentService`, `CardAssignmentService`). „Karte aus dem Ablagestapel anlegen“ oder „Karte von Charakter A an
  Charakter B“ lassen sich so nicht ausdrücken. Für jede neue Kombination aus Herkunft und Ziel bräuchte es eine
  weitere Sonderfunktion.
- Wo eine Karte gerade liegt, ist nirgends als eigene Funktion abfragbar.

---

## Anforderungen

### 1. `CardDisplay` nach `shared/` ✅ done (2026-11-07 08:14)

- `card-display` wandert nach `src/app/shared/components/card-display/` (Komponente, Template, CSS, Spec).
- `CardSide` und `EquipmentInfo` ziehen mit um. Alle Importe im Card Manager werden angepasst.

**Erwartetes Verhalten:** Karten sehen aus wie vorher.

### 2. Ort einer Karte bestimmen ✅ done (2026-11-07 08:14)

- Neues Modell in `core/models/` (z. B. `card-location.model.ts`) mit einem Union-Typ `CardLocation`:
  aktive Karte, Nachziehstapel, Ablagestapel, Bank, ausgerüstet (`characterId`, `slot`).
  Es muss um weitere Orte erweiterbar sein (Hand und Inventar folgen in den Feature Requests).
- Eine reine Funktion `locateCard(state, ref): CardLocation | null` in `core/services/card-deck/` liefert den Ort
  einer Karte über ihre `CardRef`. Unbekannte Karte → `null`.

### 3. Eine allgemeine Bewegung `moveCard` ✅ done (2026-11-07 08:14)

- Eine reine Funktion `moveCard(state, ref, ziel)` nimmt die Karte von ihrem aktuellen Ort und legt sie am Ziel ab.
  Ziele: aktive Karte, Nachziehstapel (eingemischt), Ablagestapel, Bank, Slot eines Charakters.
- Es gelten die bestehenden Regeln:
  - Eine Karte kommt nur in Stapel und Bank ihres eigenen Decks.
  - Ein belegter Slot gibt seine Karte in den Ablagestapel ihres Decks ab.
  - Unbekannte Karte, ungültiges Ziel (z. B. Nicht-Ausrüstung in einen Slot) oder Ziel gleich Herkunft → Zustand
    unverändert (gleiches Objekt).
- `activateCard`, `discardActive`, `shuffleActiveIntoDrawPile`, `dropActiveIntoBank`, `assignActiveCard` und
  `discardAssigned` werden zu dünnen Aufrufen von `moveCard` oder entfallen. Die öffentliche API des
  `CardManagerService` erhält dazu `moveCard(ref, ziel)`.

### 4. Ausrüsten und Ablegen für beliebige Karten ✅ done (2026-11-07 08:14)

- `EquipmentService` weist jede Ausrüstungskarte per `CardRef` zu, nicht nur die aktive. Das gilt auch für eine
  Karte, die schon an einem anderen Charakter oder in einem anderen Slot liegt.
- Die Werte folgen wie bisher den Regeln aus REQUIREMENTS Abschnitt 1:
  - Der Charakter, der die Karte abgibt, wird auf sein neues Maximum begrenzt.
  - Der Charakter, der sie bekommt, steigt um den Bonus.
- Beides kommt ins Log.
- `CardAssignmentService` (Dialog, Rückfrage bei belegtem Slot) nimmt eine `CardRef` statt immer die aktive Karte.

**Erwartetes Verhalten:** Alle bestehenden Abläufe im Card Manager und im Charakter-Editor verhalten sich wie vorher.

---

## Akzeptanzkriterien

- [x] `CardDisplay` liegt unter `shared/components/card-display/`; unter `features/card-manager` gibt es keine Kopie.
- [x] `locateCard` und `moveCard` haben Specs für jede Kombination aus Herkunft und Ziel, für Karten gleicher ID
      aus zwei Deck-Instanzen und für unveränderten Zustand bei ungültigen Bewegungen.
- [x] `EquipmentService` hat Specs für Zuweisen aus Stapel, Ablage, Bank und von einem anderen Charakter, jeweils
      mit Werten und Log-Einträgen.
- [x] Die bestehenden Specs des Card Managers, des Charakter-Editors und des XML-Spielstands sind ohne
      abgeschwächte Assertions grün.
- [x] Coverage-Schwellen, Lint und Build sind erfüllt.
