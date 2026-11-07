import { inject } from '@angular/core';
import { EquipmentService } from '../../core/services/equipment/equipment.service';
import { CardAction } from '../models/card-action.model';
import { CardAssignmentService } from '../services/card-assignment.service';
import { CardActionFactory } from './provide-card-actions';

/**
 * „Einem Charakter ins Inventar geben“ für jede Karte, auch zum Weitergeben an einen anderen Charakter.
 * Fehlt ein anderer Charakter als der Inventarbesitzer, ist die Aktion ausgeblendet; ohne Charaktere
 * ausgegraut.
 */
export const giveToInventoryAction: CardActionFactory = (): CardAction => {
  const assignment: CardAssignmentService = inject(CardAssignmentService);
  return {
    id: 'give-to-inventory',
    label: 'Einem Charakter ins Inventar geben',
    group: 'inventory',
    order: 60,
    modes: ['live'],
    isAvailable: ({ location }) =>
      assignment.characters().length === 0 || assignment.inventoryTargets(location).length > 0,
    disabledReason: () => assignment.assignDisabledReason(),
    run: ({ ref, location }) => assignment.giveToInventory(ref, location),
  };
};

/** „Ins Inventar legen“ für eine angelegte Karte: Sie kommt ins Inventar ihres Besitzers. */
export const stowAction: CardActionFactory = (): CardAction => {
  const equipment: EquipmentService = inject(EquipmentService);
  return {
    id: 'stow',
    label: 'Ins Inventar legen',
    group: 'inventory',
    order: 70,
    modes: ['live'],
    isAvailable: ({ location }) => location.kind === 'equipped',
    run: ({ ref, location }): void => {
      if (location.kind === 'equipped') {
        equipment.moveCard(ref, { kind: 'inventory', characterId: location.characterId });
      }
    },
  };
};
