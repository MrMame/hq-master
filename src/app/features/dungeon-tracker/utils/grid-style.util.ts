import { DungeonBoardState } from '../models/dungeon-board-state.model';

/** CSS-Hintergrund, der die Rasterlinien zeichnet (für `[ngStyle]`). */
export interface GridStyle {
  'background-image': string;
  'background-position': string;
  'background-size': string;
}

/**
 * Rasterlinien aus Zellgröße, Versatz und Deckkraft, alles in Einheiten der Spielfläche.
 * `lineWidth` ist die Linienstärke in diesen Einheiten; so bleibt die Linie bei jedem Zoom 1 px breit.
 */
export function gridStyle(board: DungeonBoardState, lineWidth: number): GridStyle {
  const { gridCellSizePx: size, gridOffsetX, gridOffsetY, gridOpacity } = board;
  const color: string = `rgba(255,255,255,${gridOpacity})`;
  const line: (angle: number) => string = (angle: number): string =>
    `repeating-linear-gradient(${angle}deg, transparent, transparent ${size - lineWidth}px, ${color} ${size}px)`;
  return {
    'background-image': [line(0), line(90)].join(', '),
    'background-position': `${gridOffsetX}px ${gridOffsetY}px`,
    'background-size': `${size}px ${size}px`,
  };
}
