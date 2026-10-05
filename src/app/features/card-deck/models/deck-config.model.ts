import { Card } from './card.model';

export interface DeckConfig {
  name: string;
  backImagePath: string;
  cards: Card[];
}
