import { Card, CardType } from './card.model';

export interface DeckConfig {
  id: string;
  name: string;
  backImagePath: string;
  defaultCardType: CardType;
  cards: Card[];
}
