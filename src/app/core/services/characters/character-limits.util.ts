import { CharacterInfo } from '../../models/character-info.model';
import { CardProperty } from '../../models/card-property.model';
import { bonusOf } from '../equipment/effective-stats.util';

/** Ganze Zahl ≥ 0; Nachkommastellen werden abgeschnitten, ungültige Werte gelten als 0. */
export function wholeNonNegative(value: number): number {
  return Number.isFinite(value) ? Math.max(0, Math.floor(value)) : 0;
}

/** Leben und Rüstung als ganze Zahlen ≥ 0; eine Obergrenze gibt es nicht. */
export function withinLimits(character: CharacterInfo): CharacterInfo {
  return {
    ...character,
    Leben: wholeNonNegative(character.Leben),
    Ruestung: wholeNonNegative(character.Ruestung),
  };
}

/**
 * Ausrüstung beginnt (`1`) oder endet (`-1`) zu wirken: Leben und Rüstung ändern sich um die Summe ihrer
 * Eigenschaften `Leben` und `Ruestung`, nie unter 0. Ablegen kann so töten.
 */
export function withEquipmentChange(
  character: CharacterInfo,
  properties: readonly CardProperty[],
  direction: 1 | -1,
): CharacterInfo {
  return withinLimits({
    ...character,
    Leben: character.Leben + direction * bonusOf(properties, 'Leben'),
    Ruestung: character.Ruestung + direction * bonusOf(properties, 'Ruestung'),
  });
}
