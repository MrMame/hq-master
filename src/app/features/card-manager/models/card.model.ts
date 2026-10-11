export type CardType = 'basic' | 'combat';

export interface BaseCard {
  id: string;
  name: string;
  imagePath: string;
  description: string;
  cardType: CardType;
}

export interface BasicCard extends BaseCard {
  cardType: 'basic';
}

export interface CombatCard extends BaseCard {
  cardType: 'combat';
  attack: number;
  defense: number;
}

export type Card = BasicCard | CombatCard;
