import { Card } from '../../models/card.model';
import { CharacterInfo } from '../../models/character-info.model';
import { AssignedCard, CardRef } from '../../models/deck-state.model';
import { CarriedKind } from '../../models/card-location.model';
import { EquipmentSlot } from '../../models/equipment.model';
import { NewGameLogEntry } from '../../models/game-log-entry.model';
import { slotOccupant } from '../card-deck/deck-assignment.util';
import { isSameCard } from '../card-deck/deck-state.util';
import { equipmentEntry } from './equipment-log.util';
import { inventoryRemovedEntry } from './inventory-log.util';

/** Eine Karte wandert in den Slot von `receiver`; `assigned` ist der Stand vor der Bewegung. */
export interface EquipmentTransferInput {
  assigned: readonly AssignedCard[];
  ref: CardRef;
  card: Card;
  /** Bisheriger Besitzer, falls die Karte schon an einem Charakter der Session lag. */
  giver: CharacterInfo | undefined;
  receiver: CharacterInfo;
  slot: EquipmentSlot;
  now: Date;
  /** Besitzer, aus dessen Inventar bzw. Gürtel (`carriedFrom`) die Karte kommt; das Log nennt den Ort. */
  inventoryOwner?: CharacterInfo;
  carriedFrom?: CarriedKind;
}

/**
 * Log-Einträge, wenn eine Karte in den Slot von `receiver` kommt, in Reihenfolge: Ablegen beim bisherigen
 * Besitzer, Ablegen der Karte im Zielslot, Anlegen (aus dem Inventar mit Inventar-Text). Wechselt die Karte nur den
 * Slot desselben Charakters, fehlt das Ablegen beim Besitzer. Leben und Ruestung folgen `activeChanges`.
 */
export function transferEntries(input: EquipmentTransferInput): NewGameLogEntry[] {
  const { card, giver, receiver, slot, now } = input;
  const without: AssignedCard[] = input.assigned.filter((entry) => !isSameCard(entry, input.ref));
  const previous: AssignedCard | undefined = slotOccupant(without, receiver.id, slot);
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
        input.carriedFrom,
      )
    : equipmentEntry(receiver, card, slot, now);
  const giverEntries: NewGameLogEntry[] =
    giver && giver.id !== receiver.id ? [equipmentEntry(giver, card, null, now)] : [];
  return [...giverEntries, ...removedEntries, assignedEntry];
}
