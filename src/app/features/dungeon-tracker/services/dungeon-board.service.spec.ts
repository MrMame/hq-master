import { TestBed } from '@angular/core/testing';

import { DungeonBoardService } from './dungeon-board.service';
import {
  DEFAULT_DUNGEON_BOARD_STATE,
  DungeonBoardState,
} from '../models/dungeon-board-state.model';
import { DungeonPosition } from '../models/dungeon-position.model';
import { createTestCharacter } from '../../game-session/testing/session.fixtures';

const board: DungeonBoardState = { ...DEFAULT_DUNGEON_BOARD_STATE, gridColumns: 15 };
const positions: DungeonPosition[] = [{ characterId: 'a', col: 2, row: 3 }];

const readStored: <T>(key: string) => T | null = <T>(key: string): T | null =>
  JSON.parse(localStorage.getItem(key) ?? 'null') as T | null;

describe('DungeonBoardService', () => {
  let service: DungeonBoardService;

  const createService: () => DungeonBoardService = (): DungeonBoardService =>
    TestBed.inject(DungeonBoardService);

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('initialization', () => {
    it('should load board and positions from storage', () => {
      localStorage.setItem('dungeon_board', JSON.stringify(board));
      localStorage.setItem('dungeon_positions', JSON.stringify(positions));
      service = createService();
      expect(service.boardState()).toEqual(board);
      expect(service.positions()).toEqual(positions);
    });

    it('should fall back to defaults when storage is empty', () => {
      service = createService();
      expect(service.boardState()).toEqual(DEFAULT_DUNGEON_BOARD_STATE);
      expect(service.positions()).toEqual([]);
    });

    it('should fall back to defaults when stored JSON is invalid', () => {
      vi.spyOn(console, 'warn').mockImplementation(() => undefined);
      localStorage.setItem('dungeon_board', '{kaputt');
      localStorage.setItem('dungeon_positions', '[kaputt');
      service = createService();
      expect(service.boardState()).toEqual(DEFAULT_DUNGEON_BOARD_STATE);
      expect(service.positions()).toEqual([]);
    });
  });

  describe('mutations', () => {
    beforeEach(() => {
      service = createService();
    });

    it('should set the board image in signal and storage', () => {
      service.setBoardImage('data:image/png;base64,abc');
      expect(service.boardState().boardImageBase64).toBe('data:image/png;base64,abc');
      expect(readStored<DungeonBoardState>('dungeon_board')).toEqual(service.boardState());
    });

    it('should merge grid settings in signal and storage', () => {
      service.updateGridSettings({ gridCellSizePx: 42, gridOpacity: 0.8 });
      const expected: DungeonBoardState = {
        ...DEFAULT_DUNGEON_BOARD_STATE,
        gridCellSizePx: 42,
        gridOpacity: 0.8,
      };
      expect(service.boardState()).toEqual(expected);
      expect(readStored<DungeonBoardState>('dungeon_board')).toEqual(expected);
    });

    it('should add a position for an unknown character', () => {
      service.updatePosition('a', 2, 3);
      expect(service.positions()).toEqual(positions);
      expect(readStored<DungeonPosition[]>('dungeon_positions')).toEqual(positions);
    });

    it('should move an existing position', () => {
      service.updatePosition('a', 2, 3);
      service.updatePosition('a', 4, 5);
      const expected: DungeonPosition[] = [{ characterId: 'a', col: 4, row: 5 }];
      expect(service.positions()).toEqual(expected);
      expect(readStored<DungeonPosition[]>('dungeon_positions')).toEqual(expected);
    });

    it('should add positions for new and drop positions of removed characters', () => {
      service.updatePosition('gone', 7, 7);
      service.updatePosition('a', 2, 3);
      service.initPositionsForCharacters([createTestCharacter('a'), createTestCharacter('b')]);
      const expected: DungeonPosition[] = [...positions, { characterId: 'b', col: 0, row: 0 }];
      expect(service.positions()).toEqual(expected);
      expect(readStored<DungeonPosition[]>('dungeon_positions')).toEqual(expected);
    });

    it('should replace board and positions in signals and storage on restore', () => {
      service.restore(board, positions);
      expect(service.boardState()).toEqual(board);
      expect(service.positions()).toEqual(positions);
      expect(readStored<DungeonBoardState>('dungeon_board')).toEqual(board);
      expect(readStored<DungeonPosition[]>('dungeon_positions')).toEqual(positions);
    });

    it('should not share references with the restored input', () => {
      service.restore(board, positions);
      expect(service.boardState()).not.toBe(board);
      expect(service.positions()).not.toBe(positions);
    });

    it('should reset to the default board without positions', () => {
      service.restore(board, positions);
      service.reset();
      expect(service.boardState()).toEqual(DEFAULT_DUNGEON_BOARD_STATE);
      expect(service.positions()).toEqual([]);
      expect(readStored<DungeonPosition[]>('dungeon_positions')).toEqual([]);
    });
  });
});
