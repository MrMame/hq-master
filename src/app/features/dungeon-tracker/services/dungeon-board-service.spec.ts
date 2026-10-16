import { TestBed } from '@angular/core/testing';

import { DungeonBoardService } from './dungeon-board-service';
import { DEFAULT_DUNGEON_BOARD_STATE, DungeonBoardState } from '../models/DungeonBoardState';
import { DungeonPosition } from '../models/DungeonPosition';

const board: DungeonBoardState = { ...DEFAULT_DUNGEON_BOARD_STATE, gridColumns: 15 };
const positions: DungeonPosition[] = [{ characterId: 'a', col: 2, row: 3 }];

const readStored: <T>(key: string) => T | null = <T>(key: string): T | null =>
  JSON.parse(localStorage.getItem(key) ?? 'null') as T | null;

describe('DungeonBoardService', () => {
  let service: DungeonBoardService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(DungeonBoardService);
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
