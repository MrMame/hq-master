# card-deck.ts

**Pfad:** `src/app/features/card-deck/services/card-deck.ts`

## Beschreibung

Zentraler State-Service des Kartendeck-Features. Verwaltet Nachziehstapel, Ablagestapel und Sammelablage als reactive Signals und persistiert den Zustand über `StorageService` im LocalStorage.

## Klasse: `CardDeckService`

`@Injectable({ providedIn: 'root' })`

### LocalStorage-Schlüssel (intern)

| Konstante      | Wert                  | Beschreibung               |
|----------------|-----------------------|----------------------------|
| `KEY_DRAW`     | `'card_deck_draw'`    | Nachziehstapel-Karten      |
| `KEY_DISCARD`  | `'card_deck_discard'` | Ablagestapel-Karten        |
| `KEY_STAGING`  | `'card_deck_staging'` | Sammelablage-Slots         |
| `KEY_DECK`     | `'card_deck_config'`  | Aktive Deck-Konfiguration  |

### Öffentliche Signals (readonly)

| Signal          | Typ                        | Beschreibung                             |
|-----------------|----------------------------|------------------------------------------|
| `drawPile`      | `Signal<Card[]>`           | Karten im Nachziehstapel (oben = Index 0)|
| `discardPile`   | `Signal<Card[]>`           | Karten im Ablagestapel (oben = Index 0)  |
| `stagingSlots`  | `Signal<StagingSlot[]>`    | 10 Slots der Sammelablage                |
| `currentDeck`   | `Signal<DeckConfig\|null>` | Aktive Deck-Konfiguration                |

### Öffentliche Methoden

#### `loadDeck(config: DeckConfig): void`
Lädt ein neues Deck: setzt `currentDeck`, mischt alle Karten in den Nachziehstapel, leert Ablage- und Sammelablage. Persistiert vollständig.

#### `drawCard(): void`
Zieht die oberste Karte vom Nachziehstapel auf den Ablagestapel. Ist der Nachziehstapel leer, wird automatisch `reshuffleDiscardToDraw()` aufgerufen.

#### `reshuffleDiscardToDraw(): void`
Mischt alle Karten des Ablagestapels in den Nachziehstapel. Hat keine Wirkung, wenn der Ablagestapel leer ist.

#### `shuffleDrawPile(): void`
Mischt den bestehenden Nachziehstapel ohne Änderung der anderen Stapel.

#### `shuffleDiscardPile(): void`
Mischt den bestehenden Ablagestapel ohne Änderung der anderen Stapel.

#### `combineAndShuffle(): void`
Führt alle Karten (Nachziehstapel + Ablagestapel + belegte Sammelablage-Slots) zusammen, mischt sie und legt das Ergebnis als neuen Nachziehstapel ab. Ablage und Sammelablage werden geleert.

#### `moveInStaging(fromSlot: number, toSlot: number): void`
Tauscht zwei Slots in der Sammelablage. Hat keine Wirkung bei identischem `fromSlot` und `toSlot`.

#### `moveFromDiscardToStaging(card: Card, slotIndex: number): void`
Verschiebt eine bestimmte Karte vom Ablagestapel in den angegebenen Sammelablage-Slot.

#### `returnFromStagingToDiscard(slotIndex: number): void`
Legt die Karte aus einem Sammelablage-Slot oben auf den Ablagestapel zurück. Hat keine Wirkung bei leerem Slot.

#### `returnFromStagingToDrawPile(slotIndex: number): void`
Mischt die Karte aus einem Sammelablage-Slot in den Nachziehstapel ein. Hat keine Wirkung bei leerem Slot.

## Verwandte Typen & Services

- [`Card`](../models/card.model.md)
- [`DeckConfig`](../models/deck-config.model.md)
- [`StagingSlot`, `STAGING_SLOT_COUNT`](../models/card-deck-state.model.md)
- `StorageService` (`src/app/core/services/persistent/storage-service`)
