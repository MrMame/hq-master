import { inject } from '@angular/core';
import { CarriedKind } from '../../core/models/card-location.model';
import { AssignedCard, CardRef } from '../../core/models/deck-state.model';
import { EQUIPMENT_SLOT_LABELS, EquipmentSlot } from '../../core/models/equipment.model';
import { slotOccupant } from '../../core/services/card-deck/deck-assignment.util';
import { toCardRef } from '../../core/services/card-deck/deck-state.util';
import { CardAction, CardActionContext, CardDraft } from '../models/card-action.model';
import { SlotOccupiedChoice } from '../models/slot-occupied.model';
import { CardAssignmentService } from '../services/card-assignment.service';
import { replacingLabel, slotTargets } from '../utils/assign-targets.util';
import { CardActionFactory } from './provide-card-actions';

/** Karte liegt laut Entwurf an einem der Orte `kinds` des bearbeiteten Charakters. */
function isOwnAt(context: CardActionContext, ...kinds: ('equipped' | CarriedKind)[]): boolean {
  const { location, draft } = context;
  return (
    !!draft &&
    kinds.some((kind) => kind === location.kind) &&
    'characterId' in location &&
    location.characterId === draft.characterId
  );
}

/** „Ins Inventar legen“ im Editor: Slot- oder Gürtelkarte ins eigene Inventar, wirkt erst mit „Übernehmen“. */
export const draftStowAction: CardActionFactory = (): CardAction => ({
  id: 'draft-stow',
  label: 'Ins Inventar legen',
  group: 'inventory',
  order: 70,
  modes: ['draft'],
  isAvailable: (context) => isOwnAt(context, 'equipped', 'belt'),
  run: ({ ref, draft }) => draft?.move(ref, { kind: 'inventory' }),
});

/**
 * „Anlegen“ im Editor: Karte aus eigenem Inventar oder Gürtel in einen Slot, Untermenü mit allen Slots in
 * `EQUIPMENT_SLOTS`-Reihenfolge (belegte laut Entwurf mit „ersetzt …“). Ist der Slot belegt, wählt der DM, wohin
 * die bisherige Karte kommt; alles wirkt erst mit „Übernehmen“.
 */
export const draftEquipAction: CardActionFactory = (): CardAction => {
  const assignment: CardAssignmentService = inject(CardAssignmentService);
  return {
    id: 'draft-equip',
    label: 'Anlegen',
    group: 'equip',
    order: 50,
    modes: ['draft'],
    isAvailable: (context) => isOwnAt(context, 'inventory', 'belt'),
    choices: ({ ref, location, draft }) =>
      draft
        ? slotTargets(draft.characterId, location, draft.equipped()).map((target) => ({
            id: target.slot,
            label: replacingLabel(EQUIPMENT_SLOT_LABELS[target.slot], target.replaces),
            run: () => equipInDraft(assignment, draft, ref, target.slot),
          }))
        : [],
  };
};

/** Legt die Karte im Entwurf in `slot`; eine dort liegende Karte kommt nach Wahl des DM woandershin. */
async function equipInDraft(
  assignment: CardAssignmentService,
  draft: CardDraft,
  ref: CardRef,
  slot: EquipmentSlot,
): Promise<void> {
  const occupant: AssignedCard | undefined = slotOccupant(
    draft.equipped(),
    draft.characterId,
    slot,
  );
  if (occupant) {
    const choice: SlotOccupiedChoice | undefined = await assignment.chooseDisplaced(
      occupant.card.name,
      draft.characterId,
    );
    if (!choice) return;
    draft.move(toCardRef(occupant), { kind: choice });
  }
  draft.move(ref, { kind: 'equipped', slot });
}
