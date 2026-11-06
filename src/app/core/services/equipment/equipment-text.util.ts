import { STAT_LABELS, StatModifier } from '../../models/equipment.model';
import { BonusSource } from './effective-stats.util';

/** Vorzeichen immer sichtbar, Minus als typografisches „−“: `+2`, `−1`, `+0`. */
export function formatBonus(value: number): string {
  return value < 0 ? `−${Math.abs(value)}` : `+${value}`;
}

/** z. B. „Rüstung +2 · Tempo −1“ für die Karte. */
export function modifiersText(modifiers: readonly StatModifier[]): string {
  return modifiers
    .map((modifier) => `${STAT_LABELS[modifier.stat]} ${formatBonus(modifier.value)}`)
    .join(' · ');
}

/** Tooltip mit den Quellen eines Bonus, z. B. „Turmschild +2, Schutzamulett +1“. */
export function bonusSourcesText(sources: readonly BonusSource[]): string {
  return sources.map((source) => `${source.name} ${formatBonus(source.value)}`).join(', ');
}
