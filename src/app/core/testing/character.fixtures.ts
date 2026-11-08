import { CharacterInfo } from '../models/character-info.model';

/** Testdaten für Specs (wird nicht in den App-Code importiert). */
export function createTestCharacter(id: string): CharacterInfo {
  return {
    id,
    name: `Char ${id} <&>`,
    Leben: 12,
    Ruestung: 2,
    Tempo: 5,
    image: 'assets/ork.png',
    description: 'Ein "gefährlicher" Ork',
    conditions: [],
    movedThisRound: false,
  };
}
