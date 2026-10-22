import { DamageTypes } from '../../core/models/damage-types.model';

/** Angaben für den Titel des Schadensauswahl-Dialogs. */
export interface DamageDialogData {
  characterName: string;
  damageType: DamageTypes;
}
