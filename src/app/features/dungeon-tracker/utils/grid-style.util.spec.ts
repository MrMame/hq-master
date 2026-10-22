import { gridStyle, GridStyle } from './grid-style.util';
import { DEFAULT_DUNGEON_BOARD_STATE } from '../models/dungeon-board-state.model';

describe('gridStyle', () => {
  const board: typeof DEFAULT_DUNGEON_BOARD_STATE = {
    ...DEFAULT_DUNGEON_BOARD_STATE,
    gridCellSizePx: 50,
    gridOffsetX: -10,
    gridOffsetY: 15,
    gridOpacity: 0.5,
  };

  it('repeats a cell of the grid size from the grid offset', () => {
    const style: GridStyle = gridStyle(board, 1);
    expect(style['background-size']).toBe('50px 50px');
    expect(style['background-position']).toBe('-10px 15px');
  });

  it('draws horizontal and vertical lines in white with the grid opacity', () => {
    expect(gridStyle(board, 1)['background-image']).toBe(
      'repeating-linear-gradient(0deg, transparent, transparent 49px, rgba(255,255,255,0.5) 50px), ' +
        'repeating-linear-gradient(90deg, transparent, transparent 49px, rgba(255,255,255,0.5) 50px)',
    );
  });

  it('draws the line with the given width so it stays thin when zoomed', () => {
    expect(gridStyle(board, 0.25)['background-image']).toContain('transparent 49.75px');
  });
});
