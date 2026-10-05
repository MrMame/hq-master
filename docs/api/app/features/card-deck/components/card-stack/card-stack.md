# card-stack.ts

**Pfad:** `src/app/features/card-deck/components/card-stack/card-stack.ts`

## Beschreibung

Presentational Component, die einen Stapel mehrerer Karten visualisiert. Zeigt die oberste Karte vollständig und simuliert Tiefe durch versetzte Hintergrundebenen.

## Komponente: `CardStack`

`selector: app-card-stack` | Standalone | Inline-Template

### Inputs (Signal-Inputs)

| Input           | Typ      | Pflicht | Default  | Beschreibung                                                |
|-----------------|----------|---------|----------|-------------------------------------------------------------|
| `cards`         | `Card[]` | ✓       | —        | Karten des Stapels; Index 0 ist die oberste Karte.          |
| `faceUp`        | `boolean`| ✓       | —        | Gibt an, ob die oberste Karte aufgedeckt dargestellt wird.  |
| `backImagePath` | `string` | ✓       | —        | Dateiname des Rückseitenbilds (relativ zu `/decks/`).       |
| `emptyLabel`    | `string` | —       | `'Leer'` | Beschriftung des leeren Stapel-Platzhalters.                |

### Darstellung

- **Leer (`cards.length === 0`):** Gestrichelter Rahmen mit `emptyLabel` als Text.
- **1 Karte:** Nur die oberste Karte via `PlayingCard`.
- **2 Karten:** Oberste Karte + eine versetzte Hintergrundebene (+4 px Offset).
- **3+ Karten:** Oberste Karte + zwei versetzte Hintergrundebenen (+4 px und +8 px Offset).

Gesamtcontainer: 128 × 176 px (etwas größer als eine einzelne Karte, um die Versatz-Ebenen aufzunehmen).

## Verwandte Komponenten & Typen

- [`PlayingCard`](../playing-card/playing-card.md)
- [`Card`](../../models/card.model.md)
