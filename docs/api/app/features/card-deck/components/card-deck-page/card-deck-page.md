# card-deck-page.ts

**Pfad:** `src/app/features/card-deck/components/card-deck-page/card-deck-page.ts`

## Beschreibung

Haupt-Seiten-Komponente des Kartendeck-Features. Orchestriert alle Unterkomponenten, koordiniert Nutzerinteraktionen mit `CardDeckService` und `DeckXmlLoaderService` und verwaltet den Fokus-View-Zustand.

## Komponente: `CardDeckPage`

`selector: app-card-deck-page` | Standalone | Externe Template- und Style-Dateien

### Injizierte Services

| Service               | Sichtbarkeit  | Beschreibung                               |
|-----------------------|---------------|--------------------------------------------|
| `CardDeckService`     | `protected`   | State-Management für alle Stapel.          |
| `DeckXmlLoaderService`| `private`     | Laden und Parsen von XML-Deck-Dateien.     |

### Computed Signals & lokaler Zustand

| Feld / Signal         | Typ                    | Beschreibung                                                              |
|-----------------------|------------------------|---------------------------------------------------------------------------|
| `drawPile`            | `Signal<Card[]>`       | Direkte Referenz auf `CardDeckService.drawPile`.                          |
| `discardPile`         | `Signal<Card[]>`       | Direkte Referenz auf `CardDeckService.discardPile`.                       |
| `stagingSlots`        | `Signal<StagingSlot[]>`| Direkte Referenz auf `CardDeckService.stagingSlots`.                      |
| `deckBackImagePath`   | `Signal<string>`       | Computed: `backImagePath` des aktiven Decks oder `''`.                    |
| `totalCards`          | `Signal<number>`       | Computed: Summe aller Karten in allen Bereichen.                          |
| `stagingIds`          | `string[]`             | Statisches Array mit CDK-Drop-List-IDs `staging-0` bis `staging-9`.      |
| `focusedCard`         | `WritableSignal<Card\|null>` | Aktuell im Fokus-View angezeigte Karte.                             |

### Initialisierung

Lädt beim ersten Rendern automatisch `public/decks/ereignisse.xml`, sofern noch kein Deck im State vorhanden ist (`currentDeck() === null`).

### Öffentliche Methoden (Toolbar & Stacks)

| Methode                                     | Beschreibung                                                                       |
|---------------------------------------------|------------------------------------------------------------------------------------|
| `onDrawPileClick()`                         | Zieht nach 240 ms eine Karte (Debounce verhindert versehentliches Doppelklick-Auslösen). |
| `onDrawPileDblClick()`                      | Bricht den Debounce-Timer ab und öffnet den Fokus-View der obersten Karte.        |
| `onEmptyDrawPileClick()`                    | Mischt den Ablagestapel zurück in den Nachziehstapel.                             |
| `openFocus(card, source)`                   | Öffnet den Fokus-View für eine Karte; `source` speichert den Ursprungsstapel.     |
| `closeFocus()`                              | Schließt den Fokus-View; zieht bei Quelle `'draw'` die Karte auf den Ablagestapel.|
| `onDroppedToDiscard(event)`                 | Verarbeitet Drag-Drop aus einem Staging-Slot auf den Ablagestapel.                |
| `onDroppedToDraw(event)`                    | Verarbeitet Drag-Drop aus einem Staging-Slot auf den Nachziehstapel.              |
| `triggerLoadDeck()`                         | Öffnet den nativen Datei-Dialog (resetted Eingabefeld vorher).                    |
| `onFileLoaded(event)`                       | Liest die gewählte XML-Datei, parst sie und lädt das Deck.                        |
| `shuffleDrawPile()` / `shuffleDiscardPile()`| Weiterleitung an `CardDeckService`.                                               |
| `combineAndShuffle()`                       | Weiterleitung an `CardDeckService`.                                               |

### Template-Struktur

```
card-deck-page
├── Toolbar (Buttons: Mischen, Stapel zusammenführen, Deck laden; Deckanzeige)
├── Piles-Bereich
│   ├── Nachziehstapel (CardStack, cdkDropList id="draw-pile-list")
│   └── Ablagestapel  (CardStack + cdkDrag, cdkDropList id="discard-pile-list")
├── StagingArea
└── CardFocusView (konditional, wenn focusedCard() ≠ null)
```

## Verwandte Komponenten & Services

- [`CardStack`](../card-stack/card-stack.md)
- [`PlayingCard`](../playing-card/playing-card.md)
- [`StagingArea`](../staging-area/staging-area.md)
- [`CardFocusView`](../card-focus-view/card-focus-view.md)
- [`CardDeckService`](../../services/card-deck.md)
- [`DeckXmlLoaderService`](../../services/deck-xml-loader.md)
