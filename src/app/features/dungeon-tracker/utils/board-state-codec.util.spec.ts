import { BOARD_STATE_CODEC } from './board-state-codec.util';
import {
  DEFAULT_DUNGEON_BOARD_STATE,
  DungeonBoardState,
} from '../models/dungeon-board-state.model';

describe('BOARD_STATE_CODEC', () => {
  it('should store and restore the board settings unchanged', () => {
    const board: DungeonBoardState = { ...DEFAULT_DUNGEON_BOARD_STATE, tokenScale: 1.2 };
    expect(BOARD_STATE_CODEC.encode(board)).toEqual(board);
    expect(BOARD_STATE_CODEC.decode(board)).toEqual(board);
  });

  it('should give an older stored board without tokenScale the default 85 %', () => {
    const oldBoard: Partial<DungeonBoardState> = {
      ...DEFAULT_DUNGEON_BOARD_STATE,
      gridCellSizePx: 42,
    };
    delete oldBoard.tokenScale;
    expect(BOARD_STATE_CODEC.decode(oldBoard)).toEqual({
      ...DEFAULT_DUNGEON_BOARD_STATE,
      gridCellSizePx: 42,
      tokenScale: 0.85,
    });
  });

  it.each<[string, unknown]>([
    ['a list', [1, 2]],
    ['a text', 'board'],
    ['null', null],
  ])('should reject %s', (_case, stored) => {
    expect(BOARD_STATE_CODEC.decode(stored)).toBeNull();
  });
});
