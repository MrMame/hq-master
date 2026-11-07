import { ConditionId } from './character-condition.model';
import { DamageTypes } from './damage-types.model';

/** Art eines Log-Eintrags; neue Ereignisarten (z. B. „Falle ausgelöst“) kommen hier dazu. */
export type GameLogEntryType =
  | 'time'
  | 'condition-damage'
  | 'condition-expired'
  | 'condition-set'
  | 'condition-removed'
  | 'damage'
  | 'round'
  | 'equipment-assigned'
  | 'equipment-removed'
  | 'inventory-added'
  | 'inventory-removed';

export const GAME_LOG_ENTRY_TYPES: readonly GameLogEntryType[] = [
  'time',
  'condition-damage',
  'condition-expired',
  'condition-set',
  'condition-removed',
  'damage',
  'round',
  'equipment-assigned',
  'equipment-removed',
  'inventory-added',
  'inventory-removed',
];

/** Ein Ereignis der Spielesession mit der Spielzeit, zu der es eingetreten ist. */
export interface GameLogEntry {
  id: string;
  type: GameLogEntryType;
  /** ISO-Spielzeit des Ereignisses (bei Zustands-Schaden der Wirkmoment). */
  gameTime: string;
  characterId?: string;
  /** Name zum Zeitpunkt des Ereignisses, damit der Eintrag nach dem Entfernen lesbar bleibt. */
  characterName?: string;
  conditionId?: ConditionId;
  /** Schaden bzw. bei Zeitschritten die Sekunden. */
  value?: number;
  /** Nur bei manuellem Schaden: Rüstung (`Normal`) oder Leben (`Critical`). */
  damageType?: DamageTypes;
  /** Fertiger Anzeigetext, beim Schreiben erzeugt. */
  text: string;
}

/** Eintrag ohne ID; die vergibt der `GameLogService` beim Anhängen. */
export type NewGameLogEntry = Omit<GameLogEntry, 'id'>;
