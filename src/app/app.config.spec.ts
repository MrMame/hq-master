import { ApplicationInitStatus } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { appConfig } from './app.config';
import { CharactersDbService } from './core/services/characters/characters-db.service';
import { DungeonPosition } from './features/dungeon-tracker/models/dungeon-position.model';
import { createTestCharacter } from './features/game-session/testing/session.fixtures';

const readStoredPositions: () => DungeonPosition[] | null = (): DungeonPosition[] | null =>
  JSON.parse(localStorage.getItem('dungeon_positions') ?? 'null') as DungeonPosition[] | null;

describe('appConfig', () => {
  beforeEach(async () => {
    localStorage.setItem('characters', JSON.stringify([createTestCharacter('a')]));
    localStorage.setItem(
      'dungeon_positions',
      JSON.stringify([
        { characterId: 'a', col: 2, row: 2 },
        { characterId: 'gone', col: 0, row: 0 },
      ]),
    );
    TestBed.configureTestingModule({ providers: appConfig.providers });
    await TestBed.inject(ApplicationInitStatus).donePromise;
  });

  it('should sync dungeon positions on startup without any page injecting the board', () => {
    TestBed.tick();
    expect(readStoredPositions()).toEqual([{ characterId: 'a', col: 2, row: 2 }]);
  });

  it('should drop the position of a character removed without an open dungeon tracker', () => {
    TestBed.inject(CharactersDbService).removeCharacter(createTestCharacter('a'));
    TestBed.tick();
    expect(readStoredPositions()).toEqual([]);
  });
});
