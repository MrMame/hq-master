import { CharacterInfo } from '../../core/models/character-info.model';

/**
 * Startwerte für einen neuen, noch leeren Charakter. Die ID besteht aus Zeitstempel und Zufallszahl;
 * `crypto.randomUUID()` gibt es nur im sicheren Kontext (nicht bei http über die LAN-IP).
 */
export function createNewCharacter(): CharacterInfo {
  return {
    id: `${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    name: '',
    health: 0,
    maxHealth: 0,
    armor: 0,
    maxArmor: 0,
    attack: 0,
    defense: 0,
    speed: 0,
    image: '',
    description: '',
    conditions: [],
    movedThisRound: false,
  };
}
