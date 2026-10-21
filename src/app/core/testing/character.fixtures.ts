import { CharacterInfo } from '../models/character-info.model';

/** Testdaten für Specs (wird nicht in den App-Code importiert). */
export function createTestCharacter(id: string): CharacterInfo {
  return {
    id,
    name: `Char ${id} <&>`,
    type: 'monster',
    health: 12,
    armor: 2,
    attack: 3,
    defense: 4,
    speed: 5,
    abilities: ['Feuer', 'Gift'],
    image: 'assets/ork.png',
    description: 'Ein "gefährlicher" Ork',
  };
}
