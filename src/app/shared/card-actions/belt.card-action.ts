import { inject } from '@angular/core';
import { EquipmentService } from '../../core/services/equipment/equipment.service';
import { CardAction, CardActionContext } from '../models/card-action.model';
import { CardAssignmentService } from '../services/card-assignment.service';
import { CardActionFactory } from './provide-card-actions';

/**
 * „In den Gürtel legen“ für jede Karte: Untermenü mit den Charakteren, der bisherige Gürtelbesitzer fehlt. Ohne
 * Charaktere ausgegraut.
 */
export const beltAction: CardActionFactory = (): CardAction => {
  const assignment: CardAssignmentService = inject(CardAssignmentService);
  const equipment: EquipmentService = inject(EquipmentService);
  return {
    id: 'belt',
    label: 'In den Gürtel legen',
    group: 'inventory',
    order: 65,
    modes: ['live'],
    isAvailable: ({ location }) =>
      assignment.characters().length === 0 || assignment.beltTargets(location).length > 0,
    disabledReason: () => assignment.assignDisabledReason(),
    choices: ({ ref, location }) =>
      assignment.beltTargets(location).map((character) => ({
        id: character.id,
        label: character.name,
        run: () => equipment.moveCard(ref, { kind: 'belt', characterId: character.id }),
      })),
  };
};

/** Karte liegt laut Entwurf in Slot oder Inventar des bearbeiteten Charakters. */
function isOwnSlotOrInventoryCard({ location, draft }: CardActionContext): boolean {
  return (
    !!draft &&
    (location.kind === 'equipped' || location.kind === 'inventory') &&
    location.characterId === draft.characterId
  );
}

/** „In den Gürtel legen“ im Editor: Slot- oder Inventarkarte in den eigenen Gürtel, wirkt erst mit „Übernehmen“. */
export const draftBeltAction: CardActionFactory = (): CardAction => ({
  id: 'draft-belt',
  label: 'In den Gürtel legen',
  group: 'inventory',
  order: 65,
  modes: ['draft'],
  isAvailable: isOwnSlotOrInventoryCard,
  run: ({ ref, draft }) => draft?.move(ref, { kind: 'belt' }),
});
