import { TestBed } from '@angular/core/testing';

import { DungeonBoardService } from './dungeon-board.service';
import {
  DEFAULT_DUNGEON_BOARD_STATE,
  DungeonBoardState,
} from '../models/dungeon-board-state.model';
import { DungeonPosition } from '../models/dungeon-position.model';
import { describePersistedState } from '../../../core/session-state/testing/describe-persisted-state';
import { SESSION_KEYS } from '../../../core/session-state/session-keys';

const board: DungeonBoardState = { ...DEFAULT_DUNGEON_BOARD_STATE, gridColumns: 15 };
const positions: DungeonPosition[] = [{ characterId: 'a', col: 2, row: 3 }];

const readStored: <T>(key: string) => T | null = <T>(key: string): T | null =>
  JSON.parse(localStorage.getItem(key) ?? 'null') as T | null;

describe('DungeonBoardService', () => {
  let service: DungeonBoardService;

  const createService: () => DungeonBoardService = (): DungeonBoardService =>
    TestBed.inject(DungeonBoardService);

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describePersistedState('boardState', {
    key: SESSION_KEYS.dungeonBoard,
    create: createService,
    read: (s: DungeonBoardService) => s.boardState(),
    fallback: DEFAULT_DUNGEON_BOARD_STATE,
    stored: { raw: board, expected: board },
    mutate: (s: DungeonBoardService) => s.updateGridSettings({ gridRows: 3 }),
  });

  describePersistedState('positions', {
    key: SESSION_KEYS.dungeonPositions,
    create: createService,
    read: (s: DungeonBoardService) => s.positions(),
    fallback: [],
    stored: { raw: positions, expected: positions },
    mutate: (s: DungeonBoardService) => s.updatePosition('a', 1, 1),
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

    it('should replace board and positions in signals and storage on restore', () => {
      service.restore({ board, positions });
      expect(service.boardState()).toEqual(board);
      expect(service.positions()).toEqual(positions);
      expect(readStored<DungeonBoardState>('dungeon_board')).toEqual(board);
      expect(readStored<DungeonPosition[]>('dungeon_positions')).toEqual(positions);
    });

    it('should not share references with the restored input', () => {
      service.restore({ board, positions });
      expect(service.boardState()).not.toBe(board);
      expect(service.positions()).not.toBe(positions);
    });

    it('should expose board and positions together as sessionState', () => {
      service.restore({ board, positions });
      expect(service.sessionState()).toEqual({ board, positions });
      service.updatePosition('a', 9, 9);
      expect(service.sessionState().positions).toEqual([{ characterId: 'a', col: 9, row: 9 }]);
    });

    it('should reset to the default board without positions', () => {
      service.restore({ board, positions });
      service.reset();
      expect(service.boardState()).toEqual(DEFAULT_DUNGEON_BOARD_STATE);
      expect(service.positions()).toEqual([]);
      expect(readStored<DungeonPosition[]>('dungeon_positions')).toEqual([]);
    });
  });
});
