import { CardSlot, StatModifier } from './equipment.model';

export type CardType = 'basic' | 'combat' | 'equipment';

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

/** Dauerhafte Ausrüstung: verändert die Werte des Charakters, solange sie in seinem Slot liegt. */
export interface EquipmentCard extends BaseCard {
  cardType: 'equipment';
  slot: CardSlot;
  modifiers: StatModifier[];
}

export type Card = BasicCard | CombatCard | EquipmentCard;
