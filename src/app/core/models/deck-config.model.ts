import { Card } from './card.model';

export interface DeckConfig {
  id: string;
  name: string;
  backImagePath: string;
  cards: Card[];
}
