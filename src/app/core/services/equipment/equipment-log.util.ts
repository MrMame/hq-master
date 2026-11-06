import { EquipmentCard } from '../../models/card.model';
import { CharacterInfo } from '../../models/character-info.model';
import { EQUIPMENT_SLOT_LABELS, EquipmentSlot } from '../../models/equipment.model';
import { NewGameLogEntry } from '../../models/game-log-entry.model';
import { equipmentText } from '../game-log/game-log-text.util';

/** Log-Eintrag zum Zuweisen (`slot` gesetzt) bzw. Ablegen (`slot` = `null`) einer Ausrüstungskarte. */
export function equipmentEntry(
  character: CharacterInfo,
  card: EquipmentCard,
  slot: EquipmentSlot | null,
  now: Date,
): NewGameLogEntry {
  return {
    type: slot === null ? 'equipment-removed' : 'equipment-assigned',
    gameTime: now.toISOString(),
    characterId: character.id,
    characterName: character.name,
    text: equipmentText(
      character.name,
      card.name,
      slot === null ? null : EQUIPMENT_SLOT_LABELS[slot],
    ),
  };
}
