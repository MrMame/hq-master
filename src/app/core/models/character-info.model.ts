import { ActiveCondition } from './character-condition.model';

export interface CharacterInfo {
  id: string;
  name: string;
  type: string;
  /** Aktuelles Leben, immer zwischen 0 und `maxHealth`. */
  health: number;
  /** Maximales Leben (ganze Zahl ≥ 0); Schaden ändert es nicht. */
  maxHealth: number;
  /** Aktuelle Rüstung, immer zwischen 0 und `maxArmor`. */
  armor: number;
  /** Maximale Rüstung (ganze Zahl ≥ 0); Schaden ändert sie nicht. */
  maxArmor: number;
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
