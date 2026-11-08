import { CardSlot, StatModifier } from './equipment.model';

export type CardType = 'basic' | 'equipment';

export const CARD_TYPES: readonly CardType[] = ['basic', 'equipment'];

/** Unbekannte Kartentypen (auch das frühere `combat`) gelten als `basic`. */
export function toCardType(value: string | null | undefined): CardType {
  return CARD_TYPES.find((type) => type === value) ?? 'basic';
}

/** Eine Karte ist genau zwei Grafiken; die App zeichnet nichts auf sie. */
export interface BaseCard {
  id: string;
  name: string;
  /** Vorderseite, relativ zu `public/`. */
  imagePath: string;
  /** Wirksame Rückseite: karteneigene oder die des Decks. */
  backImagePath: string;
  /** Notiz des DM aus dem Deck-XML; wird nicht angezeigt. */
  description: string;
  cardType: CardType;
}

export interface BasicCard extends BaseCard {
  cardType: 'basic';
}

/** Dauerhafte Ausrüstung: verändert die Werte des Charakters, solange sie in seinem Slot liegt. */
export interface EquipmentCard extends BaseCard {
  cardType: 'equipment';
  slot: CardSlot;
  modifiers: StatModifier[];
}

export type Card = BasicCard | EquipmentCard;
