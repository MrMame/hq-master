import { ActiveCondition } from './character-condition.model';

export interface CharacterInfo {
  id: string;
  name: string;
  type: string;
  health: number;
  armor: number;
  attack: number;
  defense: number;
  speed: number;
  abilities: string[];
  image: string; // Optionales Feld für das Bild des Monsters;
  description: string; // Optionales Feld für die Beschreibung des Monsters
  /** Aktive Zustände (Gift, Benommen, …); jeder Zustand höchstens einmal. */
  conditions: ActiveCondition[];
  /** Im Dungeon Tracker in dieser Runde auf ein anderes Feld gezogen; „Neue Runde“ setzt es zurück. */
  movedThisRound: boolean;
}
