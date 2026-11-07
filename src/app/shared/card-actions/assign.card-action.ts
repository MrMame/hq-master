import { inject, Signal } from '@angular/core';
import { EquipmentCard } from '../../core/models/card.model';
import { CardLocation } from '../../core/models/card-location.model';
import { AssignedCard, CardRef } from '../../core/models/deck-state.model';
import { EQUIPMENT_SLOT_LABELS } from '../../core/models/equipment.model';
import { CardManagerService } from '../../core/services/card-deck/card-manager.service';
import { CardAction, CardChoice } from '../models/card-action.model';
import { CardAssignmentService } from '../services/card-assignment.service';
import {
  AssignTarget,
  assignTargets,
  replacingLabel,
  SlotTarget,
} from '../utils/assign-targets.util';
import { CardActionFactory } from './provide-card-actions';

/**
 * „Einem Charakter anlegen“ für Ausrüstungskarten von jedem Ort, auch zum Umlegen an einen anderen Charakter
 * oder Slot: Untermenü mit den Charakteren, bei Handkarten danach „Linke Hand / Rechte Hand“ (freie zuerst).
 * Ein belegter Slot zeigt die bisherige Karte; ohne Charaktere ausgegraut.
 */
export const assignAction: CardActionFactory = (): CardAction => {
  const assignment: CardAssignmentService = inject(CardAssignmentService);
  const assigned: Signal<AssignedCard[]> = inject(CardManagerService).assigned;
  const targets: (card: EquipmentCard, location: CardLocation) => AssignTarget[] = (
    card,
    location,
  ) => assignTargets(card, location, assignment.characters(), assigned());

  return {
    id: 'assign',
    label: 'Einem Charakter anlegen',
    group: 'equip',
    order: 50,
    modes: ['live'],
    isAvailable: ({ card, location }) =>
      card.cardType === 'equipment' &&
      (assignment.characters().length === 0 || targets(card, location).length > 0),
    disabledReason: () => assignment.assignDisabledReason(),
    choices: ({ card, ref, location }) =>
      card.cardType === 'equipment'
        ? targets(card, location).map((target) => characterChoice(assignment, ref, card, target))
        : [],
  };
};

/** Ein Charakter: bei Handkarten Untermenü mit den Händen, sonst direkt der passende Slot. */
function characterChoice(
  assignment: CardAssignmentService,
  ref: CardRef,
  card: EquipmentCard,
  { character, slots }: AssignTarget,
): CardChoice {
  if (card.slot !== 'hand') {
    return {
      ...slotChoice(assignment, ref, character.id, slots[0], character.name),
      id: character.id,
    };
  }
  return {
    id: character.id,
    label: character.name,
    choices: () =>
      slots.map((target) =>
        slotChoice(assignment, ref, character.id, target, EQUIPMENT_SLOT_LABELS[target.slot]),
      ),
  };
}

function slotChoice(
  assignment: CardAssignmentService,
  ref: CardRef,
  characterId: string,
  target: SlotTarget,
  label: string,
): CardChoice {
  return {
    id: target.slot,
    label: replacingLabel(label, target.replaces),
    run: () => assignment.assignTo(ref, characterId, target.slot),
  };
}
