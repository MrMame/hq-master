import { Provider } from '@angular/core';
import { assignAction } from './assign.card-action';
import { draftDiscardAction } from './draft-discard.card-action';
import { draftEquipAction, draftStowAction } from './draft-inventory.card-action';
import { giveToInventoryAction, stowAction } from './inventory.card-action';
import {
  bankAction,
  discardAction,
  shuffleBackAction,
  takeIntoHandAction,
} from './move.card-action';
import { provideCardActions } from './provide-card-actions';

/** Allgemeine Kartenaktionen aller Features; app-weit in `app.config.ts` registriert. */
export function provideDefaultCardActions(): Provider[] {
  return provideCardActions(
    takeIntoHandAction,
    discardAction,
    shuffleBackAction,
    bankAction,
    assignAction,
    giveToInventoryAction,
    stowAction,
    draftDiscardAction,
    draftStowAction,
    draftEquipAction,
  );
}
