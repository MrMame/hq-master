# CardManager — Service API

## CardManagerService

`providedIn: 'root'` — per `inject(CardManagerService)` verfügbar.

Persistenz: `DeckState` wird automatisch in `localStorage` unter dem Key
`card_manager_deck_state` gespeichert und beim Start wiederhergestellt.

### Signals (readonly)

| Signal  | Typ                    | Beschreibung                          |
|---------|------------------------|---------------------------------------|
| `state` | `Signal<DeckState \| null>` | Gesamtzustand des aktiven Stapels |

Zugriff im Template / Service: `cardManagerService.state()`.

### Methoden

| Methode                        | Parameter         | Rückgabe       | Beschreibung                                                  |
|--------------------------------|-------------------|----------------|---------------------------------------------------------------|
| `loadDeck(url)`                | `url: string`     | `Promise<void>` | Lädt XML von URL, initialisiert gemischten `drawPile`         |
| `loadDeckConfig(config)`       | `config: DeckConfig` | `void`      | Lädt ein bereits geparsten `DeckConfig`-Objekt               |
| `shuffle()`                    | —                 | `void`         | Mischt `drawPile` neu (Fisher-Yates)                          |
| `draw()`                       | —                 | `void`         | Oberste Karte aus `drawPile` → `activeCard`                   |
| `discard()`                    | —                 | `void`         | `activeCard` → `discardPile`, `activeCard = null`             |
| `reset()`                      | —                 | `void`         | Alle Karten zurück in `drawPile`, neu gemischt                |

### Zustandsübergänge

```
loadDeck / loadDeckConfig
  → drawPile = alle Karten (gemischt), discardPile = [], activeCard = null

shuffle()
  → drawPile neu permutiert (kein Wechsel der anderen Felder)

draw()         [nur wenn drawPile.length > 0]
  drawPile[0]  → activeCard
  drawPile     → drawPile.slice(1)

discard()      [nur wenn activeCard != null]
  activeCard   → discardPile[0]
  activeCard   → null

reset()
  drawPile + discardPile + activeCard → drawPile (gemischt)
  discardPile  → []
  activeCard   → null
```

---

## DeckXmlLoaderService

`providedIn: 'root'` — normalerweise nur von `CardManagerService` verwendet.

| Methode            | Parameter          | Rückgabe           | Beschreibung                              |
|--------------------|--------------------|--------------------|-------------------------------------------|
| `loadFromUrl(url)` | `url: string`      | `Promise<DeckConfig>` | Lädt XML via HTTP und parst es          |
| `parseXml(xmlText)` | `xmlText: string` | `DeckConfig`       | Parst XML-String direkt (z.B. für Tests) |
