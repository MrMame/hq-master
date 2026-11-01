import { ConditionId } from './character-condition.model';

/** Ereignis eines Zustands bei einem Zeitschritt: Schaden je Wirkmoment oder Ablauf. */
export interface ConditionEvent {
  type: 'damage' | 'expired';
  characterId: string;
  conditionId: ConditionId;
  /** ISO-Spielzeit des Wirkmoments bzw. des Ablaufs. */
  gameTime: string;
  /** Tatsächlich angewandter Schaden (nur bei `damage`). */
  damage?: number;
}
