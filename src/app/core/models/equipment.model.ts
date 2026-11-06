/** Werte eines Charakters, die Ausrüstung verändern kann; die Grundwerte im `CharacterInfo` bleiben unverändert. */
export type ModifiableStat = 'attack' | 'defense' | 'speed' | 'maxHealth' | 'maxArmor';

/** Reihenfolge der Anzeige, z. B. auf der Karte. */
export const MODIFIABLE_STATS: readonly ModifiableStat[] = [
  'maxHealth',
  'maxArmor',
  'attack',
  'defense',
  'speed',
];

/** Kurzname eines Werts auf Karte und im Tooltip, z. B. „Rüstung +2“. */
export const STAT_LABELS: Readonly<Record<ModifiableStat, string>> = {
  maxHealth: 'Leben',
  maxArmor: 'Rüstung',
  attack: 'Angriff',
  defense: 'Abwehr',
  speed: 'Tempo',
};

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

export const CARD_SLOT_LABELS: Readonly<Record<CardSlot, string>> = {
  head: 'Kopf',
  body: 'Körper',
  hand: 'Hand',
  amulet: 'Amulett',
};
