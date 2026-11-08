import { CardLocation } from '../../core/models/card-location.model';
import { CharacterInfo } from '../../core/models/character-info.model';
import { AssignedCard } from '../../core/models/deck-state.model';
import { EQUIPMENT_SLOTS, EquipmentSlot } from '../../core/models/equipment.model';
import { slotOccupant } from '../../core/services/card-deck/deck-assignment.util';

/** Ein Slot, in den die Karte kommen kann, mit dem Namen der Karte, die dort bisher liegt. */
export interface SlotTarget {
  slot: EquipmentSlot;
  /** Name der bisherigen Karte; `null` = frei. */
  replaces: string | null;
}

/** Ein Charakter, dem die Karte angelegt werden kann, mit seinen Slots. */
export interface AssignTarget {
  character: CharacterInfo;
  slots: SlotTarget[];
}

/**
 * Slots eines Charakters fürs Anlegen in `EQUIPMENT_SLOTS`-Reihenfolge; jede Karte passt in jeden Slot. Der Slot,
 * in dem die Karte gerade liegt, fehlt.
 */
export function slotTargets(
  characterId: string,
  location: CardLocation,
  assigned: readonly AssignedCard[],
): SlotTarget[] {
  return EQUIPMENT_SLOTS.filter((slot) => !isCurrentSlot(location, characterId, slot)).map(
    (slot) => ({ slot, replaces: slotOccupant(assigned, characterId, slot)?.card.name ?? null }),
  );
}

/** Wem und wohin eine Karte angelegt werden kann: alle Charaktere mit ihren Slots. */
export function assignTargets(
  location: CardLocation,
  characters: readonly CharacterInfo[],
  assigned: readonly AssignedCard[],
): AssignTarget[] {
  return characters.map((character) => ({
    character,
    slots: slotTargets(character.id, location, assigned),
  }));
}

/** Beschriftung eines Ziels, z. B. „Kopf“ oder „Kopf – ersetzt Turmschild“. */
export function replacingLabel(label: string, replaces: string | null): string {
  return replaces ? `${label} – ersetzt ${replaces}` : label;
}

function isCurrentSlot(location: CardLocation, characterId: string, slot: EquipmentSlot): boolean {
  return (
    location.kind === 'equipped' && location.characterId === characterId && location.slot === slot
  );
}
