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
