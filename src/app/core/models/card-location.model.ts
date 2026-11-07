import { EquipmentSlot } from './equipment.model';

/** Die eine aktive Karte aller Decks. */
export interface ActiveLocation {
  kind: 'active';
}

/** Stapel oder Bank des eigenen Decks einer Karte; eine Karte liegt nie in einem fremden Deck. */
export interface PileLocation {
  kind: 'drawPile' | 'discardPile' | 'bank';
}

/** Slot eines Charakters. */
export interface EquippedLocation {
  kind: 'equipped';
  characterId: string;
  slot: EquipmentSlot;
}

/**
 * Ort einer Karte und Ziel einer Bewegung. Weitere Orte (z. B. Hand, Inventar) kommen als neue `kind` dazu.
 * Beim Nachziehstapel als Ziel wird die Karte eingemischt.
 */
export type CardLocation = ActiveLocation | PileLocation | EquippedLocation;

export type PileKind = PileLocation['kind'];

export const PILE_KINDS: readonly PileKind[] = ['drawPile', 'discardPile', 'bank'];
