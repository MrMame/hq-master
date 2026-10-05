# deck-config.model.ts

**Pfad:** `src/app/features/card-deck/models/deck-config.model.ts`

## Beschreibung

Beschreibt die Konfiguration eines geladenen Kartendecks — das Ergebnis eines geparsten XML-Deck-Files.

## Interface: `DeckConfig`

| Eigenschaft     | Typ      | Beschreibung                                                        |
|-----------------|----------|---------------------------------------------------------------------|
| `name`          | `string` | Name des Decks (aus XML-Attribut `name` des `<deck>`-Elements).     |
| `backImagePath` | `string` | Dateiname des Kartenrückenbilds (aus XML-Attribut `backImage`).     |
| `cards`         | `Card[]` | Alle Karten des Decks als Array (aus `<card>`-Kindelementen).       |

## Verwendung

`DeckConfig` wird von `DeckXmlLoaderService` zurückgegeben und von `CardDeckService.loadDeck()` entgegengenommen, um den kompletten Deckzustand zu initialisieren.

## Verwandte Typen

- [`Card`](./card.model.md)
