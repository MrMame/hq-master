import { EquipmentCard } from '../../core/models/card.model';
import { CharacterInfo } from '../../core/models/character-info.model';
import { AssignedCard } from '../../core/models/deck-state.model';
import { EquipmentSlot } from '../../core/models/equipment.model';

/** Eingabe des Zuweisungsdialogs: die Karte, wählbare Charaktere und die bestehenden Zuweisungen. */
export interface AssignEquipmentDialogData {
  card: EquipmentCard;
  characters: CharacterInfo[];
  assigned: AssignedCard[];
}

/** Ergebnis des Zuweisungsdialogs; Abbruch schließt ohne Wert. */
export interface AssignEquipmentChoice {
  characterId: string;
  slot: EquipmentSlot;
}
