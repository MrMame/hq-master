import { STAGE_WIDTH } from './board-scale.util';

/** Grenzen der Zellgröße in Einheiten der Spielfläche. */
export const CELL_SIZE_LIMITS: { min: number; max: number } = { min: 20, max: 150 };

/** Grenzen der Spaltenanzahl für „Spalten über Bildbreite“. */
export const COLUMN_LIMITS: { min: number; max: number } = { min: 1, max: 100 };

function withinCellLimits(value: number): boolean {
  return value >= CELL_SIZE_LIMITS.min && value <= CELL_SIZE_LIMITS.max;
}

/** Zellgröße aus einer Eingabe (Punkt oder Komma); `null`, wenn leer, keine Zahl oder außerhalb der Grenzen. */
export function parseCellSize(raw: string): number | null {
  const text: string = raw.trim().replace(',', '.');
  const value: number = text === '' ? NaN : Number(text);
  return Number.isFinite(value) && withinCellLimits(value) ? value : null;
}

/** Ergebnis von „Spalten über Bildbreite“: neue Zellgröße oder ein Hinweis, warum es nicht geht. */
export type ColumnFit = { cellSize: number } | { hint: string };

/** Zellgröße, mit der genau `columns` Spalten die Bildbreite füllen (ungerundet). */
export function fitColumns(columns: number): ColumnFit {
  if (!Number.isInteger(columns) || columns < COLUMN_LIMITS.min || columns > COLUMN_LIMITS.max) {
    return {
      hint: `Bitte eine ganze Zahl von ${COLUMN_LIMITS.min} bis ${COLUMN_LIMITS.max} eingeben.`,
    };
  }
  const cellSize: number = STAGE_WIDTH / columns;
  if (cellSize < CELL_SIZE_LIMITS.min) {
    return { hint: `Bei so vielen Spalten wäre eine Zelle kleiner als ${CELL_SIZE_LIMITS.min}.` };
  }
  if (cellSize > CELL_SIZE_LIMITS.max) {
    return { hint: `Bei so wenigen Spalten wäre eine Zelle größer als ${CELL_SIZE_LIMITS.max}.` };
  }
  return { cellSize };
}

/** Zellgröße für Anzeige und Zahlenfeld: höchstens zwei Nachkommastellen. */
export function roundCellSize(value: number): number {
  return Math.round(value * 100) / 100;
}

/** Deutsche Anzeige mit höchstens zwei Nachkommastellen, z. B. „38,46“ oder „60“. */
export function formatCellSize(value: number): string {
  return roundCellSize(value).toLocaleString('de-DE', { maximumFractionDigits: 2 });
}
