# card.model.ts

**Pfad:** `src/app/features/card-deck/models/card.model.ts`

## Beschreibung

Definiert die Grunddatenstruktur einer einzelnen Spielkarte im Kartendeck-Feature.

## Interface: `Card`

| Eigenschaft   | Typ      | Beschreibung                                              |
|---------------|----------|-----------------------------------------------------------|
| `id`          | `string` | Eindeutiger Bezeichner der Karte (aus XML-Attribut `id`). |
| `name`        | `string` | Anzeigename der Karte.                                    |
| `imagePath`   | `string` | Dateiname des Kartenbilds (relativ zu `/decks/`).         |
| `description` | `string` | Beschreibungstext der Karte.                              |

## Verwendung

`Card` ist das zentrale Datenmodell und wird in allen Komponenten, Services und anderen Modellen des Kartendeck-Features genutzt.
