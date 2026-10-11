import { Card } from './card.model';
import { DeckConfig } from './deck-config.model';

export interface DeckState {
  config: DeckConfig;
  drawPile: Card[];
  discardPile: Card[];
  activeCard: Card | null;
}
