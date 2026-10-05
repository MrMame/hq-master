# playing-card.ts

**Pfad:** `src/app/features/card-deck/components/playing-card/playing-card.ts`

## Beschreibung

Presentational Component, die eine einzelne Spielkarte visuell darstellt — entweder aufgedeckt (Vorderseite) oder verdeckt (Rückseite).

## Komponente: `PlayingCard`

`selector: app-playing-card` | Standalone | Inline-Template

### Inputs (Signal-Inputs)

| Input           | Typ      | Pflicht | Beschreibung                                                   |
|-----------------|----------|---------|----------------------------------------------------------------|
| `card`          | `Card`   | ✓       | Kartendaten (Name, Bild, Beschreibung).                        |
| `faceUp`        | `boolean`| ✓       | `true` = Vorderseite anzeigen; `false` = Rückseite anzeigen.   |
| `backImagePath` | `string` | ✓       | Dateiname des Rückseitenbilds (relativ zu `/decks/`).          |

### Darstellung

**Vorderseite (`faceUp = true`):**
- Kartengröße: 120 × 168 px
- Obere Zone (60 px): Kartenbild aus `/decks/<imagePath>`
- Untere Zone: Kartenname (fett, truncated) und Beschreibung (max. 4 Zeilen)

**Rückseite (`faceUp = false`):**
- Gleiche Größe, dunkelgrauer Hintergrund
- Rückseitenbild aus `/decks/<backImagePath>` als Cover

Fehlende Bilder werden per `onerror` ausgeblendet (`this.style.display='none'`).

## Verwandte Typen

- [`Card`](../../models/card.model.md)
