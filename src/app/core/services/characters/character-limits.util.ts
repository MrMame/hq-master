import { CharacterInfo } from '../../models/character-info.model';

/** Gespeichertes Maximum, wenn es eine ganze Zahl ≥ 0 ist; sonst (Altdaten, ungültig) der aktuelle Wert. */
export function readLimit(stored: unknown, current: number): number {
  return typeof stored === 'number' && Number.isInteger(stored) && stored >= 0 ? stored : current;
}

function clamp(value: number, max: number): number {
  return Math.min(Math.max(0, value), max);
}

/** Maxima als ganze Zahlen ≥ 0; aktuelles Leben und Rüstung liegen danach zwischen 0 und ihrem Maximum. */
export function withinLimits(character: CharacterInfo): CharacterInfo {
  const maxHealth: number = Math.max(0, Math.floor(character.maxHealth));
  const maxArmor: number = Math.max(0, Math.floor(character.maxArmor));
  return {
    ...character,
    maxHealth,
    maxArmor,
    health: clamp(character.health, maxHealth),
    armor: clamp(character.armor, maxArmor),
  };
}
