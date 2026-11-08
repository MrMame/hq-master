/** Werte eines Charakters, die Ausrüstung verändern kann; die Grundwerte im `CharacterInfo` bleiben unverändert. */
export type ModifiableStat = 'attack' | 'defense' | 'speed' | 'maxHealth' | 'maxArmor';

/** Alle Werte, die ein `<modifier stat="…">` nennen darf. */
export const MODIFIABLE_STATS: readonly ModifiableStat[] = [
  'maxHealth',
  'maxArmor',
  'attack',
  'defense',
  'speed',
];

/** Additive Änderung eines Werts, negative Werte erlaubt. */
export interface StatModifier {
  stat: ModifiableStat;
  value: number;
}

/** Slot am Charakter; jeder nimmt höchstens eine Karte. */
export type EquipmentSlot = 'head' | 'body' | 'leftHand' | 'rightHand' | 'amulet';

/** Alle Slots in Anzeigereihenfolge. */
export const EQUIPMENT_SLOTS: readonly EquipmentSlot[] = [
  'head',
  'body',
  'leftHand',
  'rightHand',
  'amulet',
];

export const EQUIPMENT_SLOT_LABELS: Readonly<Record<EquipmentSlot, string>> = {
  head: 'Kopf',
  body: 'Körper',
  leftHand: 'Linke Hand',
  rightHand: 'Rechte Hand',
  amulet: 'Amulett',
};

/** Slot auf der Karte: `hand` passt in die linke oder rechte Hand, der DM wählt beim Zuweisen. */
export type CardSlot = 'head' | 'body' | 'hand' | 'amulet';

export const CARD_SLOTS: readonly CardSlot[] = ['head', 'body', 'hand', 'amulet'];
