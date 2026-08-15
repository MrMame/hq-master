export interface MonsterInfo {
  id: string;
  name: string;
  type: string;
  health: number;
  attack: number;
  defense: number;
  speed: number;
  abilities: string[];
  image: string; // Optionales Feld für das Bild des Monsters;
  description: string; // Optionales Feld für die Beschreibung des Monsters
}
