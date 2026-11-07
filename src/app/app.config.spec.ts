import { ApplicationInitStatus } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { appConfig } from './app.config';
import { CharactersDbService } from './core/services/characters/characters-db.service';
import { DungeonPosition } from './features/dungeon-tracker/models/dungeon-position.model';
import { createTestCharacter } from './core/testing/character.fixtures';
import { GameTimeService } from './core/services/game-time/game-time.service';
import { createConditionedCharacter } from './core/testing/condition.fixtures';
import { CARD_ACTIONS } from './shared/models/card-action.model';

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

  it('should tick conditions on a time change without any page being open', () => {
    const gameTime: GameTimeService = TestBed.inject(GameTimeService);
    const charactersDb: CharactersDbService = TestBed.inject(CharactersDbService);
    gameTime.restore(new Date(createConditionedCharacter('p').conditions[0].startedAt));
    charactersDb.writeCharacter(createConditionedCharacter('p'));
    TestBed.tick();

    gameTime.addTime({ minutes: 1 });
    TestBed.tick();

    expect(charactersDb.characters().find((c) => c.id === 'p')?.health).toBe(11);
  });

  it('registers the general card actions for the card viewer', () => {
    expect(TestBed.inject(CARD_ACTIONS).map((action) => action.id)).toEqual([
      'take-into-hand',
      'discard',
      'shuffle-back',
      'draw-pile-top',
      'bank',
      'assign',
      'give-to-inventory',
      'stow',
      'draft-discard',
      'draft-stow',
      'draft-equip',
    ]);
  });
});
