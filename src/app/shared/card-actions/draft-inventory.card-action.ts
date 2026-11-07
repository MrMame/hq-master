import { inject } from '@angular/core';
import { AssignedCard } from '../../core/models/deck-state.model';
import { EquipmentSlot } from '../../core/models/equipment.model';
import { slotOccupant } from '../../core/services/card-deck/deck-assignment.util';
import { toCardRef } from '../../core/services/card-deck/deck-state.util';
import { preferredSlot } from '../../core/services/equipment/equipment-slots.util';
import { CardAction, CardActionContext } from '../models/card-action.model';
import { SlotOccupiedChoice } from '../models/slot-occupied.model';
import { CardAssignmentService } from '../services/card-assignment.service';
import { CardActionFactory } from './provide-card-actions';

/** Karte liegt laut Entwurf an `kind` des bearbeiteten Charakters. */
function isOwnAt(context: CardActionContext, kind: 'equipped' | 'inventory'): boolean {
  const { location, draft } = context;
  return !!draft && location.kind === kind && location.characterId === draft.characterId;
}

/** „Ins Inventar legen“ im Editor: Slot-Karte ins eigene Inventar, wirkt erst mit „Übernehmen“. */
export const draftStowAction: CardActionFactory = (): CardAction => ({
  id: 'draft-stow',
  label: 'Ins Inventar legen',
  group: 'inventory',
  order: 70,
  modes: ['draft'],
  isAvailable: (context) => isOwnAt(context, 'equipped'),
  run: ({ ref, draft }) => draft?.move(ref, { kind: 'inventory' }),
});

/**
 * „Anlegen“ im Editor: Ausrüstungskarte aus dem eigenen Inventar in den passenden Slot (bei Händen die
 * freie). Ist er laut Entwurf belegt, wählt der DM Inventar oder Ablagestapel für die bisherige Karte.
 */
export const draftEquipAction: CardActionFactory = (): CardAction => {
  const assignment: CardAssignmentService = inject(CardAssignmentService);
  return {
    id: 'draft-equip',
    label: 'Anlegen',
    group: 'equip',
    order: 50,
    modes: ['draft'],
    isAvailable: (context) =>
      context.card.cardType === 'equipment' && isOwnAt(context, 'inventory'),
    run: async ({ card, ref, draft }): Promise<void> => {
      if (!draft || card.cardType !== 'equipment') return;
      const equipped: readonly AssignedCard[] = draft.equipped();
      const slot: EquipmentSlot = preferredSlot(card.slot, equipped, draft.characterId);
      const occupant: AssignedCard | undefined = slotOccupant(equipped, draft.characterId, slot);
      if (occupant) {
        const choice: SlotOccupiedChoice | undefined = await assignment.chooseDisplaced(
          occupant.card.name,
          draft.characterId,
        );
        if (!choice) return;
        draft.move(toCardRef(occupant), { kind: choice });
      }
      draft.move(ref, { kind: 'equipped', slot });
    },
  };
};
