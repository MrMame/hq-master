# staging-area.ts

**Pfad:** `src/app/features/card-deck/components/staging-area/staging-area.ts`

## Beschreibung

Smart Component, die die Sammelablage des Kartendecks darstellt. Ermöglicht Drag-&-Drop von Karten zwischen Ablagestapel und Sammelablage-Slots sowie innerhalb der Slots.

## Komponente: `StagingArea`

`selector: app-staging-area` | Standalone | Externe Template- und Style-Dateien

### Inputs (Signal-Inputs)

| Input            | Typ            | Pflicht | Beschreibung                                                        |
|------------------|----------------|---------|---------------------------------------------------------------------|
| `slots`          | `StagingSlot[]`| ✓       | Array der 10 Sammelablage-Slots (`Card` oder `null`).               |
| `backImagePath`  | `string`       | ✓       | Rückseitenbild-Pfad für `PlayingCard`-Unterkomponenten.             |
| `drawListId`     | `string`       | ✓       | CDK-Drop-List-ID des Nachziehstapels (für Drag-Verbindung).         |
| `discardListId`  | `string`       | ✓       | CDK-Drop-List-ID des Ablagestapels (für Drag-Verbindung).           |

### Outputs

| Output              | Typ               | Beschreibung                                          |
|---------------------|-------------------|-------------------------------------------------------|
| `cardDoubleClicked` | `EventEmitter<Card>` | Wird bei Doppelklick auf eine Karte im Slot ausgelöst.|

### Computed Signals

| Signal           | Beschreibung                                                              |
|------------------|---------------------------------------------------------------------------|
| `allConnectedIds`| Alle Drop-List-IDs (Discard, Draw und alle 10 Staging-Slots) als Array.   |

### Öffentliche Methoden

#### `onSlotDrop(event: CdkDragDrop<unknown>, slotIndex: number): void`
Verarbeitet Drop-Events auf einem Slot:
- Drop von `discardListId`: Verschiebt Karte vom Ablagestapel in den Slot (nur wenn Slot leer).
- Drop von anderem Staging-Slot: Tauscht beide Slots über `CardDeckService.moveInStaging()`.

#### `onCardDblClick(card: Card): void`
Leitet Doppelklick-Events auf Karten an den `cardDoubleClicked`-Output weiter.

#### `isOccupied(slot: StagingSlot): slot is Card`
Type-Guard: gibt `true` zurück, wenn der Slot eine Karte enthält (nicht `null`).

### Drag-&-Drop-Verhalten

Jeder Slot ist eine eigene CDK-Drop-List (`id="staging-{index}"`), verbunden mit allen anderen Slots, dem Nachziehstapel und dem Ablagestapel. Karten im Slot sind CDK-Drag-Elemente mit `{ card, slotIndex }` als Drag-Data.

## Verwandte Komponenten & Typen

- [`PlayingCard`](../playing-card/playing-card.md)
- [`CardDeckService`](../../services/card-deck.md)
- [`StagingSlot`, `STAGING_SLOT_COUNT`](../../models/card-deck-state.model.md)
- [`Card`](../../models/card.model.md)
