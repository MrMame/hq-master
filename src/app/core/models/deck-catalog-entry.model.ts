/** Ein bereitgestelltes Deck aus `decks/index.json` (erzeugt von `scripts/build-deck-index.mjs`). */
export interface DeckCatalogEntry {
  id: string;
  name: string;
  /** Pfad der Deck-XML relativ zur `base href`, z. B. `decks/zwerg/zwerg.xml`. */
  url: string;
}
