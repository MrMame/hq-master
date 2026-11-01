import { ConditionId } from '../../../core/models/character-condition.model';

/** Eine Zeile der Zustandsübersicht im TimeTracker. */
export interface ActiveConditionRow {
  characterId: string;
  characterName: string;
  conditionId: ConditionId;
  label: string;
  icon: string;
  damagePerTick: number;
  /** Uhrzeit des nächsten Wirkmoments (`HH:MM:SS`) oder „–“ ohne Schaden. */
  nextTick: string;
  /** Restdauer als `m:ss` oder „unbegrenzt“. */
  remaining: string;
}
