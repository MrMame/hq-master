import { BonusSource } from './effective-stats.util';

/** Vorzeichen immer sichtbar, Minus als typografisches „−“: `+2`, `−1`, `+0`. */
export function formatBonus(value: number): string {
  return value < 0 ? `−${Math.abs(value)}` : `+${value}`;
}

/** Tooltip mit den Quellen eines Bonus, z. B. „Turmschild +2, Schutzamulett +1“. */
export function bonusSourcesText(sources: readonly BonusSource[]): string {
  return sources.map((source) => `${source.name} ${formatBonus(source.value)}`).join(', ');
}
