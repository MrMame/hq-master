import { Card } from './card.model';
import { DeckConfig } from './deck-config.model';
import { EquipmentSlot } from './equipment.model';

/** Adresse einer Karte über alle Decks: Karten-IDs sind nur innerhalb einer Deck-Instanz eindeutig. */
export interface CardRef {
  deckId: string;
  cardId: string;
}

/** Eine Karte im Slot eines Charakters (jede Karte passt in jeden Slot, je Slot eine). */
export interface AssignedCard {
  /** Deck-Instanz, in deren Ablagestapel die Karte beim Ablegen zurückkehrt. */
  deckId: string;
  card: Card;
  characterId: string;
  slot: EquipmentSlot;
}

/**
 * Eine Karte im Inventar eines Charakters; jede Kartenart passt, sie ändert keine Werte. Eigene Liste neben
 * `AssignedCard`, damit Boni nur aus Slots kommen.
 */
export interface InventoryCard {
  deckId: string;
  card: Card;
  characterId: string;
}

/** Eine Karte im Gürtel eines Charakters; jede Karte passt, ihre Eigenschaften wirken wie in einem Slot. */
export interface BeltCard {
  deckId: string;
  card: Card;
  characterId: string;
}

/** Ein Deck auf dem Spieltisch; dieselbe Deck-Datei kann mehrere Instanzen haben. */
export interface DeckInstance {
  id: string;
  name: string;
  /** Pfad der Deck-XML-Datei; leer bei älteren Spielständen. */
  source: string;
  config: DeckConfig;
  drawPile: Card[];
  discardPile: Card[];
  bank: Card[];
}

/** Eine Karte in der Hand des Dungeon Masters mit ihrer Instanz. */
export interface HandCard {
  deckId: string;
  card: Card;
}

export interface DeckState {
  /** Reihenfolge = Anzeigereihenfolge auf dem Tisch. */
  decks: DeckInstance[];
  /** Hand des Dungeon Masters; neueste Karte am Ende. */
  hand: HandCard[];
  /** Zugewiesene Karten liegen in keinem anderen Bereich. */
  assigned: AssignedCard[];
  /** Inventarkarten aller Charaktere; neueste Karte am Ende. */
  inventory: InventoryCard[];
  /** Gürtelkarten aller Charaktere, unbegrenzt; neueste Karte am Ende. */
  belt: BeltCard[];
}
