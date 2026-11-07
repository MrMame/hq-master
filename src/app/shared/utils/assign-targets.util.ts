import { EquipmentCard } from '../../core/models/card.model';
import { CardLocation } from '../../core/models/card-location.model';
import { CharacterInfo } from '../../core/models/character-info.model';
import { AssignedCard } from '../../core/models/deck-state.model';
import { EquipmentSlot } from '../../core/models/equipment.model';
import { slotOccupant } from '../../core/services/card-deck/deck-assignment.util';
import { slotsForCard } from '../../core/services/equipment/equipment-slots.util';

/** Ein Slot, in den die Karte kommen kann, mit dem Namen der Karte, die dort bisher liegt. */
export interface SlotTarget {
  slot: EquipmentSlot;
  /** Name der bisherigen Karte; `null` = frei. */
  replaces: string | null;
}

/** Ein Charakter, dem die Karte angelegt werden kann, mit den passenden Slots. */
export interface AssignTarget {
  character: CharacterInfo;
  /** Freie Slots zuerst; nie leer. */
  slots: SlotTarget[];
}

/**
 * Wem und wohin eine Ausrüstungskarte angelegt werden kann: alle Charaktere mit den Slots der Karte, außer
 * dem Slot, in dem sie gerade liegt. Charaktere ohne möglichen Slot fehlen.
 */
export function assignTargets(
  card: EquipmentCard,
  location: CardLocation,
  characters: readonly CharacterInfo[],
  assigned: readonly AssignedCard[],
): AssignTarget[] {
  return characters
    .map((character) => ({
      character,
      slots: slotsForCard(card.slot)
        .filter((slot) => !isCurrentSlot(location, character.id, slot))
        .map((slot) => ({
          slot,
          replaces: slotOccupant(assigned, character.id, slot)?.card.name ?? null,
        }))
        .sort((a, b) => Number(a.replaces !== null) - Number(b.replaces !== null)),
    }))
    .filter((target) => target.slots.length > 0);
}

/** Beschriftung eines Ziels, z. B. „Barbar“ oder „Barbar – ersetzt Turmschild“. */
export function replacingLabel(label: string, replaces: string | null): string {
  return replaces ? `${label} – ersetzt ${replaces}` : label;
}

function isCurrentSlot(location: CardLocation, characterId: string, slot: EquipmentSlot): boolean {
  return (
    location.kind === 'equipped' && location.characterId === characterId && location.slot === slot
  );
}
