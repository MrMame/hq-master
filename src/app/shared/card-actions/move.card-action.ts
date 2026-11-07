import { inject } from '@angular/core';
import { HandLocation, PileLocation } from '../../core/models/card-location.model';
import { EquipmentService } from '../../core/services/equipment/equipment.service';
import { CardAction } from '../models/card-action.model';
import { CardActionFactory } from './provide-card-actions';

/**
 * Bewegt die Karte in Hand, Stapel oder Bank ihres eigenen Decks; verfügbar überall außer am Ziel selbst.
 * Läuft über den `EquipmentService`, damit ein Besitzer seinen Bonus verliert und das ins Log kommt.
 */
function moveAction(
  id: string,
  label: string,
  order: number,
  target: HandLocation | PileLocation,
): CardActionFactory {
  return (): CardAction => {
    const equipment: EquipmentService = inject(EquipmentService);
    return {
      id,
      label,
      group: 'move',
      order,
      modes: ['live'],
      isAvailable: ({ location }) => location.kind !== target.kind,
      run: ({ ref }) => equipment.moveCard(ref, target),
    };
  };
}

export const takeIntoHandAction: CardActionFactory = moveAction(
  'take-into-hand',
  'In die Hand nehmen',
  10,
  { kind: 'hand' },
);

export const discardAction: CardActionFactory = moveAction(
  'discard',
  'In den Ablagestapel legen',
  20,
  { kind: 'discardPile' },
);

export const shuffleBackAction: CardActionFactory = moveAction(
  'shuffle-back',
  'In den Nachziehstapel zurückmischen',
  30,
  { kind: 'drawPile' },
);

export const bankAction: CardActionFactory = moveAction('bank', 'In die Bank legen', 40, {
  kind: 'bank',
});
