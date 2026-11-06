import { Card, EquipmentCard } from './card.model';
import { DeckConfig } from './deck-config.model';
import { EquipmentSlot } from './equipment.model';

/** Eine Ausrüstungskarte im Slot eines Charakters; einzige Stelle, an der der Besitz steht. */
export interface AssignedCard {
  card: EquipmentCard;
  characterId: string;
  slot: EquipmentSlot;
}

export interface DeckState {
  config: DeckConfig;
  drawPile: Card[];
  discardPile: Card[];
  activeCard: Card | null;
  bank: Card[];
  /** Zugewiesene Karten liegen in keinem anderen Bereich. */
  assigned: AssignedCard[];
}
