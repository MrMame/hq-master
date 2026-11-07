import { Card } from '../../core/models/card.model';
import { CharacterInfo } from '../../core/models/character-info.model';

/** Eingabe des Dialogs „Ins Inventar geben“: die Karte und die wählbaren Charaktere. */
export interface GiveToInventoryDialogData {
  card: Card;
  characters: CharacterInfo[];
}
