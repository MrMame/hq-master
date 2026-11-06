import { CharacterInfo } from '../../models/character-info.model';
import { StatModifier } from '../../models/equipment.model';
import { bonusOf, EffectiveStats, effectiveStats } from '../equipment/effective-stats.util';

/** Gespeichertes Maximum, wenn es eine ganze Zahl ≥ 0 ist; sonst (Altdaten, ungültig) der aktuelle Wert. */
export function readLimit(stored: unknown, current: number): number {
  return typeof stored === 'number' && Number.isInteger(stored) && stored >= 0 ? stored : current;
}

function clamp(value: number, max: number): number {
  return Math.min(Math.max(0, value), max);
}

function wholeLimit(max: number): number {
  return Math.max(0, Math.floor(max));
}

/**
 * Für Codec und XML: Maxima als ganze Zahlen ≥ 0, aktuelle Werte ≥ 0. Nach oben begrenzt erst `withinLimits`
 * mit den Modifikatoren der Ausrüstung, sonst fiele Rüstung 6/6 mit „+2“-Karte beim Laden auf 4.
 */
export function normalizedLimits(character: CharacterInfo): CharacterInfo {
  return {
    ...character,
    maxHealth: wholeLimit(character.maxHealth),
    maxArmor: wholeLimit(character.maxArmor),
    health: Math.max(0, character.health),
    armor: Math.max(0, character.armor),
  };
}

/**
 * Maxima als ganze Zahlen ≥ 0; aktuelles Leben und Rüstung liegen danach zwischen 0 und ihrem wirksamen
 * Maximum (Grundwert plus Ausrüstung).
 */
export function withinLimits(
  character: CharacterInfo,
  modifiers: readonly StatModifier[] = [],
): CharacterInfo {
  const base: CharacterInfo = {
    ...character,
    maxHealth: wholeLimit(character.maxHealth),
    maxArmor: wholeLimit(character.maxArmor),
  };
  const effective: EffectiveStats = effectiveStats(base, modifiers);
  return {
    ...base,
    health: clamp(character.health, effective.maxHealth),
    armor: clamp(character.armor, effective.maxArmor),
  };
}

/**
 * Neue Ausrüstung: Leben und Rüstung steigen (bzw. sinken) um den Bonus der hinzugekommenen Karte auf
 * ihr Maximum; `kept` sind die Modifikatoren, die schon vorher wirkten.
 */
export function withAddedEquipment(
  character: CharacterInfo,
  kept: readonly StatModifier[],
  added: readonly StatModifier[],
): CharacterInfo {
  return withinLimits(
    {
      ...character,
      health: character.health + bonusOf(added, 'maxHealth'),
      armor: character.armor + bonusOf(added, 'maxArmor'),
    },
    [...kept, ...added],
  );
}
