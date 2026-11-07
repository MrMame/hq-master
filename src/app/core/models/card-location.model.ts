import { EquipmentSlot } from './equipment.model';

/** Hand des Dungeon Masters: gezogene Karten aller Decks. */
export interface HandLocation {
  kind: 'hand';
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
 * Ort einer Karte und Ziel einer Bewegung. Weitere Orte (z. B. Inventar) kommen als neue `kind` dazu.
 * Beim Nachziehstapel als Ziel wird die Karte eingemischt, in der Hand kommt sie ans Ende.
 */
export type CardLocation = HandLocation | PileLocation | EquippedLocation;

export type PileKind = PileLocation['kind'];

export const PILE_KINDS: readonly PileKind[] = ['drawPile', 'discardPile', 'bank'];
