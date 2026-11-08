import { ActiveCondition } from './character-condition.model';

/**
 * Einzige Liste der festen Werte eines Charakters. Der Name ist zugleich Feldname im Modell, Attribut im
 * Spielstand, Name einer Karteneigenschaft und Beschriftung im Editor.
 */
export type FixedProperty = 'Leben' | 'Ruestung' | 'Tempo';

export const FIXED_PROPERTIES: readonly FixedProperty[] = ['Leben', 'Ruestung', 'Tempo'];

export interface CharacterInfo {
  id: string;
  name: string;
  /** Aktuelles Leben, ganze Zahl ≥ 0; Ausrüstung ändert es beim Anlegen und Ablegen. */
  Leben: number;
  /** Aktuelle Rüstung, ganze Zahl ≥ 0; Ausrüstung ändert sie beim Anlegen und Ablegen. */
  Ruestung: number;
  /** Grundwert; Ausrüstung gibt einen Bonus darauf, der nicht gespeichert wird. */
  Tempo: number;
  image: string; // Optionales Feld für das Bild des Monsters;
  description: string; // Optionales Feld für die Beschreibung des Monsters
  /** Aktive Zustände (Gift, Benommen, …); jeder Zustand höchstens einmal. */
  conditions: ActiveCondition[];
  /** Im Dungeon Tracker in dieser Runde auf ein anderes Feld gezogen; „Neue Runde“ setzt es zurück. */
  movedThisRound: boolean;
}
