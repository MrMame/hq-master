import { EquipmentCard } from '../../models/card.model';
import { CharacterInfo } from '../../models/character-info.model';
import { AssignedCard, CardRef } from '../../models/deck-state.model';
import { EquipmentSlot } from '../../models/equipment.model';
import { NewGameLogEntry } from '../../models/game-log-entry.model';
import { slotOccupant } from '../card-deck/deck-assignment.util';
import { isSameCard } from '../card-deck/deck-state.util';
import { withAddedEquipment, withinLimits } from '../characters/character-limits.util';
import { cardsOf, modifiersOf } from './effective-stats.util';
import { equipmentEntry } from './equipment-log.util';
import { inventoryRemovedEntry } from './inventory-log.util';

/** Eine Ausrüstungskarte wandert in den Slot von `receiver`; `assigned` ist der Stand vor der Bewegung. */
export interface EquipmentTransferInput {
  assigned: readonly AssignedCard[];
  ref: CardRef;
  card: EquipmentCard;
  /** Bisheriger Besitzer, falls die Karte schon an einem Charakter der Session lag. */
  giver: CharacterInfo | undefined;
  receiver: CharacterInfo;
  slot: EquipmentSlot;
  now: Date;
  /** Besitzer, aus dessen Inventar die Karte kommt; sie wirkte dort nicht, das Log nennt das Inventar. */
  inventoryOwner?: CharacterInfo;
}

/** Neue Werte der beteiligten Charaktere und die Log-Einträge in Reihenfolge. */
export interface EquipmentTransfer {
  characters: CharacterInfo[];
  entries: NewGameLogEntry[];
}

/**
 * Werte nach REQUIREMENTS Abschnitt 0: Wer die Karte abgibt, wird auf sein neues Maximum begrenzt; eine Karte
 * im Zielslot wird ebenso abgelegt; wer die Karte bekommt, steigt um ihren Bonus. Wechselt die Karte nur den
 * Slot desselben Charakters, wirkt sie weiter: kein Bonus, nur der Eintrag für den neuen Slot.
 */
export function transferEquipment(input: EquipmentTransferInput): EquipmentTransfer {
  const { card, giver, receiver, slot, now } = input;
  const without: AssignedCard[] = input.assigned.filter((entry) => !isSameCard(entry, input.ref));
  const previous: AssignedCard | undefined = slotOccupant(without, receiver.id, slot);
  const kept: AssignedCard[] = cardsOf(without, receiver.id).filter((entry) => entry !== previous);
  const removedEntries: NewGameLogEntry[] = previous
    ? [equipmentEntry(receiver, previous.card, null, now)]
    : [];
  const assignedEntry: NewGameLogEntry = input.inventoryOwner
    ? inventoryRemovedEntry(
        input.inventoryOwner,
        card,
        { kind: 'equipped', characterId: receiver.id, slot },
        receiver,
        now,
      )
    : equipmentEntry(receiver, card, slot, now);

  if (giver?.id === receiver.id) {
    return {
      characters: [withinLimits(receiver, [...modifiersOf(kept), ...card.modifiers])],
      entries: [...removedEntries, assignedEntry],
    };
  }
  const afterRemoval: CharacterInfo = withinLimits(receiver, modifiersOf(kept));
  const received: CharacterInfo = withAddedEquipment(
    afterRemoval,
    modifiersOf(kept),
    card.modifiers,
  );
  if (!giver) return { characters: [received], entries: [...removedEntries, assignedEntry] };
  return {
    characters: [withinLimits(giver, modifiersOf(cardsOf(without, giver.id))), received],
    entries: [equipmentEntry(giver, card, null, now), ...removedEntries, assignedEntry],
  };
}
