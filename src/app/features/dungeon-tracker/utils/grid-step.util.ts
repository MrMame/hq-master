import { STAGE_WIDTH } from './board-scale.util';

/** Bereich des Nullpunkts (`gridOffsetX` / `gridOffsetY`); enthält den alten Versatz −100 bis 100. */
export const ORIGIN_LIMITS: { min: number; max: number } = { min: -100, max: STAGE_WIDTH };

/** Bereich der Deckkraft (0 bis 100 %). */
export const OPACITY_LIMITS: { min: number; max: number } = { min: 0, max: 1 };

/** Feinste Stufe je Raster-Regler; „−“ und „+“ ändern den Wert um genau diesen Schritt. */
export const GRID_STEPS: { cellSize: number; origin: number; opacity: number } = {
  cellSize: 0.01,
  origin: 0.1,
  opacity: 0.05,
};

export function clamp(value: number, limits: { min: number; max: number }): number {
  return Math.min(limits.max, Math.max(limits.min, value));
}

/** Rundet auf `decimals` Nachkommastellen, z. B. 38.4715 → 38.47 bei 2. */
export function roundTo(value: number, decimals: number): number {
  const factor: number = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

/** Nachkommastellen eines Schritts, z. B. 2 für 0,05. */
function decimalsOf(step: number): number {
  return (String(step).split('.')[1] ?? '').length;
}

/**
 * Wert um einen Schritt verringern (−1) oder erhöhen (1), auf die Genauigkeit des Schritts runden
 * (kein Gleitkomma-Rest wie 0.45000000000000007) und auf den Bereich begrenzen.
 */
export function stepWithin(
  value: number,
  direction: -1 | 1,
  step: number,
  limits: { min: number; max: number },
): number {
  return clamp(roundTo(value + direction * step, decimalsOf(step)), limits);
}

/** Deutsche Anzeige des Nullpunkts mit höchstens einer Nachkommastelle, z. B. „412,4“. */
export function formatOrigin(value: number): string {
  return value.toLocaleString('de-DE', { maximumFractionDigits: 1 });
}
