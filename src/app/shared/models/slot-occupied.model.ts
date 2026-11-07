import { DisplacedTarget } from '../../core/services/equipment/equipment.service';

/** Eingabe der Rückfrage bei belegtem Slot: die bisherige Karte und ihr Besitzer. */
export interface SlotOccupiedDialogData {
  cardName: string;
  characterName: string;
}

/** Wohin die bisherige Karte kommt; Abbrechen schließt ohne Wert. */
export type SlotOccupiedChoice = DisplacedTarget;
