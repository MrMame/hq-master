# CardManager — Datenmodell

## Typen-Hierarchie

```
BaseCard
├── BasicCard   (cardType: 'basic')
└── CombatCard  (cardType: 'combat')

Card = BasicCard | CombatCard   ← Discriminated Union
```

Das `cardType`-Feld dient als Diskriminator: TypeScript kann den konkreten Typ damit
zur Compile-Zeit narrowen — keine optionalen Felder, keine Typecasts nötig.

---

## BaseCard

Felder, die alle Kartentypen teilen.

| Feld          | Typ        | Beschreibung                             |
|---------------|------------|------------------------------------------|
| `id`          | `string`   | Eindeutige ID (aus XML oder UUID)        |
| `name`        | `string`   | Anzeigename der Karte                    |
| `imagePath`   | `string`   | Pfad zur Kartenillustration              |
| `description` | `string`   | Beschreibungstext                        |
| `cardType`    | `CardType` | Diskriminator: `'basic'` oder `'combat'` |

---

## BasicCard

Erbt alle Felder von `BaseCard`. Keine zusätzlichen Felder.
Wird für Ereignis- und Erzähl-Karten verwendet (nur Bild + Text).

---

## CombatCard

Erbt alle Felder von `BaseCard` und ergänzt Kampfwerte.

| Feld      | Typ      | Beschreibung             |
|-----------|----------|--------------------------|
| `attack`  | `number` | Angriffswert (0–99)      |
| `defense` | `number` | Verteidigungswert (0–99) |

---

## DeckConfig

Beschreibt ein Deck, wie es aus einer XML-Datei geladen wird.

| Feld              | Typ        | Beschreibung                                       |
|-------------------|------------|----------------------------------------------------|
| `id`              | `string`   | Deck-ID (aus XML-Attribut oder UUID)               |
| `name`            | `string`   | Anzeigename des Decks                              |
| `backImagePath`   | `string`   | Pfad zum Kartenbild-Rücken                         |
| `defaultCardType` | `CardType` | Standard-Kartentyp für Karten ohne `type`-Attribut |
| `cards`           | `Card[]`   | Alle Karten des Decks                              |

---

## DeckState

Laufzeit-Zustand eines aktiven Kartenstapels.

| Feld          | Typ            | Beschreibung                                |
|---------------|----------------|---------------------------------------------|
| `config`      | `DeckConfig`   | Die zugrunde liegende Deck-Konfiguration    |
| `drawPile`    | `Card[]`       | Nachziehstapel — Index 0 = nächste Karte    |
| `discardPile` | `Card[]`       | Ablagestapel — Index 0 = zuletzt abgelegte |
| `activeCard`  | `Card \| null` | Gerade gezogene, noch nicht abgelegte Karte |

### Invariante

Jede Karte aus `config.cards` befindet sich zu jedem Zeitpunkt in genau einem
der drei Bereiche: `drawPile`, `discardPile` oder `activeCard`.
