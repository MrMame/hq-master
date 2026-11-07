import { inject } from '@angular/core';
import { CardAction } from '../models/card-action.model';
import { CardAssignmentService } from '../services/card-assignment.service';
import { CardActionFactory } from './provide-card-actions';

/**
 * „Einem Charakter anlegen“ für Ausrüstungskarten von jedem Ort, auch zum Umlegen an einen anderen Charakter
 * oder Slot. Ohne Charaktere ausgegraut.
 */
export const assignAction: CardActionFactory = (): CardAction => {
  const assignment: CardAssignmentService = inject(CardAssignmentService);
  return {
    id: 'assign',
    label: 'Einem Charakter anlegen',
    group: 'equip',
    order: 50,
    modes: ['live'],
    isAvailable: ({ card }) => card.cardType === 'equipment',
    disabledReason: () => assignment.assignDisabledReason(),
    run: ({ ref }) => assignment.assignCard(ref),
  };
};
