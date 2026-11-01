import { TestBed } from '@angular/core/testing';

import { RoundService } from './round.service';
import { CharactersDbService } from '../../core/services/characters/characters-db.service';
import { GameLogService } from '../../core/services/game-log/game-log.service';
import { GameTimeService } from '../../core/services/game-time/game-time.service';
import { GameLogEntry } from '../../core/models/game-log-entry.model';
import { createTestCharacter } from '../../core/testing/character.fixtures';
import { afterStart, TEST_CONDITION_START } from '../../core/testing/condition.fixtures';

describe('RoundService', () => {
  let service: RoundService;
  let charactersDb: CharactersDbService;
  let gameTime: GameTimeService;
  let gameLog: GameLogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    charactersDb = TestBed.inject(CharactersDbService);
    gameTime = TestBed.inject(GameTimeService);
    gameLog = TestBed.inject(GameLogService);
    gameTime.restore(TEST_CONDITION_START);
    charactersDb.writeCharacter({ ...createTestCharacter('a'), movedThisRound: true });
    charactersDb.writeCharacter(createTestCharacter('b'));
    charactersDb.writeCharacter({ ...createTestCharacter('c'), movedThisRound: true });
    service = TestBed.inject(RoundService);
  });

  const movedFlags: () => boolean[] = () => charactersDb.characters().map((c) => c.movedThisRound);

  it('advances the game time by 10 seconds', () => {
    service.startNewRound();

    expect(gameTime.gameTime()).toEqual(afterStart(10));
  });

  it('resets the flag of all characters', () => {
    service.startNewRound();

    expect(movedFlags()).toEqual([false, false, false]);
  });

  it('logs "Neue Runde" at the current game time before the time step', () => {
    service.startNewRound();

    const [round, step]: GameLogEntry[] = gameLog.entries();
    expect(gameLog.entries()).toHaveLength(2);
    expect(round).toMatchObject({
      type: 'round',
      text: 'Neue Runde',
      gameTime: TEST_CONDITION_START.toISOString(),
    });
    expect(step).toMatchObject({ type: 'time', text: '+10 s (12:00:00 → 12:00:10)' });
  });

  it('leaves the flags unchanged for other time changes', () => {
    gameTime.addTime({ seconds: 10 });
    gameTime.addTime({ hours: 8 });
    gameTime.setGameTime({ hours: 6 });

    expect(movedFlags()).toEqual([true, false, true]);
  });
});
