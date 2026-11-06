import { Card, EquipmentCard } from './card.model';
import { DeckConfig } from './deck-config.model';
import { EquipmentSlot } from './equipment.model';

/** Adresse einer Karte über alle Decks: Karten-IDs sind nur innerhalb einer Deck-Instanz eindeutig. */
export interface CardRef {
  deckId: string;
  cardId: string;
}

/** Eine Ausrüstungskarte im Slot eines Charakters; einzige Stelle, an der der Besitz steht. */
export interface AssignedCard {
  /** Deck-Instanz, in deren Ablagestapel die Karte beim Ablegen zurückkehrt. */
  deckId: string;
  card: EquipmentCard;
  characterId: string;
  slot: EquipmentSlot;
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

/** Die eine aktive Karte aller Decks mit ihrer Instanz. */
export interface ActiveCard {
  deckId: string;
  card: Card;
}

export interface DeckState {
  /** Reihenfolge = Anzeigereihenfolge auf dem Tisch. */
  decks: DeckInstance[];
  activeCard: ActiveCard | null;
  /** Zugewiesene Karten liegen in keinem anderen Bereich. */
  assigned: AssignedCard[];
}
