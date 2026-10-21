import { CharacterInfo } from '../../core/models/character-info.model';
import { ElementalTypes } from '../../core/models/elemental-types.model';

/**
 * Startwerte für einen neuen, noch leeren Charakter. Die ID folgt dem Schema der Creator-Services;
 * `crypto.randomUUID()` gibt es nur im sicheren Kontext (nicht bei http über die LAN-IP).
 */
export function createNewCharacter(): CharacterInfo {
  return {
    id: `${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    name: '',
    type: ElementalTypes.FEUER,
    health: 0,
    armor: 0,
    attack: 0,
    defense: 0,
    speed: 0,
    abilities: [],
    image: '',
    description: '',
  };
}
