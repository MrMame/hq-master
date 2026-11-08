import { inject, Signal } from '@angular/core';
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
 * „Einem Charakter anlegen“ für jede Karte von jedem Ort, auch zum Umlegen an einen anderen Charakter oder Slot:
 * Untermenü mit den Charakteren, danach alle Slots in `EQUIPMENT_SLOTS`-Reihenfolge (belegte mit „ersetzt …“,
 * der aktuelle Slot fehlt). Ohne Charaktere ausgegraut.
 */
export const assignAction: CardActionFactory = (): CardAction => {
  const assignment: CardAssignmentService = inject(CardAssignmentService);
  const assigned: Signal<AssignedCard[]> = inject(CardManagerService).assigned;

  return {
    id: 'assign',
    label: 'Einem Charakter anlegen',
    group: 'equip',
    order: 50,
    modes: ['live'],
    isAvailable: () => true,
    disabledReason: () => assignment.assignDisabledReason(),
    choices: ({ ref, location }) =>
      assignTargets(location, assignment.characters(), assigned()).map((target) =>
        characterChoice(assignment, ref, target),
      ),
  };
};

/** Ein Charakter mit dem Untermenü seiner Slots. */
function characterChoice(
  assignment: CardAssignmentService,
  ref: CardRef,
  { character, slots }: AssignTarget,
): CardChoice {
  return {
    id: character.id,
    label: character.name,
    choices: () => slots.map((target) => slotChoice(assignment, ref, character.id, target)),
  };
}

function slotChoice(
  assignment: CardAssignmentService,
  ref: CardRef,
  characterId: string,
  target: SlotTarget,
): CardChoice {
  return {
    id: target.slot,
    label: replacingLabel(EQUIPMENT_SLOT_LABELS[target.slot], target.replaces),
    run: () => assignment.assignTo(ref, characterId, target.slot),
  };
}
