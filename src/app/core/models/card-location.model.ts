import { EquipmentSlot } from './equipment.model';

/** Hand des Dungeon Masters: gezogene Karten aller Decks. */
export interface HandLocation {
  kind: 'hand';
}

/** Stapel oder Bank des eigenen Decks einer Karte; eine Karte liegt nie in einem fremden Deck. */
export interface PileLocation {
  kind: 'drawPile' | 'discardPile' | 'bank';
  /** Nur als Ziel beim Nachziehstapel: oben auflegen statt einmischen; der nächste Zug zieht die Karte. */
  top?: true;
}

/** Slot eines Charakters. */
export interface EquippedLocation {
  kind: 'equipped';
  characterId: string;
  slot: EquipmentSlot;
}

/** Inventar eines Charakters: Karten, die er trägt, ohne dass sie Werte ändern. */
export interface InventoryLocation {
  kind: 'inventory';
  characterId: string;
}

/**
 * Ort einer Karte und Ziel einer Bewegung. Weitere Orte kommen als neue `kind` dazu.
 * Beim Nachziehstapel als Ziel wird die Karte eingemischt (mit `top` oben aufgelegt), in Hand und Inventar
 * kommt sie ans Ende.
 */
export type CardLocation = HandLocation | PileLocation | EquippedLocation | InventoryLocation;

export type PileKind = PileLocation['kind'];

export const PILE_KINDS: readonly PileKind[] = ['drawPile', 'discardPile', 'bank'];
