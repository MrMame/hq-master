import { TestBed } from '@angular/core/testing';
import { MockInstance } from 'vitest';

import { DungeonBoardService } from './dungeon-board.service';
import { DungeonPosition } from '../models/dungeon-position.model';
import { CharactersDbService } from '../../../core/services/characters/characters-db.service';
import { StorageService } from '../../../core/services/storage/storage.service';
import { DEFAULT_DUNGEON_BOARD_STATE } from '../models/dungeon-board-state.model';
import { createTestCharacter } from '../../game-session/testing/session.fixtures';

const readStoredPositions: () => DungeonPosition[] | null = (): DungeonPosition[] | null =>
  JSON.parse(localStorage.getItem('dungeon_positions') ?? 'null') as DungeonPosition[] | null;

// Charakter-Synchronisation per effect() im Service; getrennt vom Basis-Spec wegen Dateilimit.
describe('DungeonBoardService – character sync', () => {
  let service: DungeonBoardService;
  let characters: CharactersDbService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    characters = TestBed.inject(CharactersDbService);
    service = TestBed.inject(DungeonBoardService);
    TestBed.tick();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should add and persist a position when a character is added', () => {
    characters.writeCharacter(createTestCharacter('a'));
    TestBed.tick();
    const expected: DungeonPosition[] = [{ characterId: 'a', col: 0, row: 0 }];
    expect(service.positions()).toEqual(expected);
    expect(readStoredPositions()).toEqual(expected);
  });

  it('should drop and persist the position when a character is removed', () => {
    characters.writeCharacter(createTestCharacter('a'));
    characters.writeCharacter(createTestCharacter('b'));
    TestBed.tick();
    characters.removeCharacter(createTestCharacter('a'));
    TestBed.tick();
    const expected: DungeonPosition[] = [{ characterId: 'b', col: 1, row: 0 }];
    expect(service.positions()).toEqual(expected);
    expect(readStoredPositions()).toEqual(expected);
  });

  it('should keep moved positions and place new characters on free fields', () => {
    characters.writeCharacter(createTestCharacter('a'));
    TestBed.tick();
    service.updatePosition('gone', 1, 0);
    characters.writeCharacter(createTestCharacter('b'));
    characters.writeCharacter(createTestCharacter('c'));
    TestBed.tick();
    expect(service.positions()).toEqual([
      { characterId: 'a', col: 0, row: 0 },
      { characterId: 'b', col: 1, row: 0 },
      { characterId: 'c', col: 2, row: 0 },
    ]);
  });

  it('should neither replace positions nor write storage when only a character changes', () => {
    characters.writeCharacter(createTestCharacter('a'));
    TestBed.tick();
    const before: DungeonPosition[] = service.positions();
    const write: MockInstance = vi.spyOn(TestBed.inject(StorageService), 'writeToLocalStorage');

    characters.writeCharacter({ ...createTestCharacter('a'), health: 1 });
    TestBed.tick();

    expect(service.positions()).toBe(before);
    expect(write).not.toHaveBeenCalledWith('dungeon_positions', expect.anything());
  });

  it('should leave restored positions unchanged when characters match', () => {
    const restored: DungeonPosition[] = [
      { characterId: 'a', col: 0, row: 0 },
      { characterId: 'b', col: 0, row: 0 },
    ];
    characters.restore([createTestCharacter('a'), createTestCharacter('b')]);
    service.restore({ board: DEFAULT_DUNGEON_BOARD_STATE, positions: restored });
    TestBed.tick();
    expect(service.positions()).toEqual(restored);
    expect(readStoredPositions()).toEqual(restored);
  });

  it('should expose only tokens whose character exists', () => {
    characters.writeCharacter(createTestCharacter('a'));
    TestBed.tick();
    service.updatePosition('orphan', 3, 3);

    expect(service.positions().map((p) => p.characterId)).toEqual(['a', 'orphan']);
    expect(service.tokens()).toEqual([
      { position: { characterId: 'a', col: 0, row: 0 }, character: createTestCharacter('a') },
    ]);
  });
});
