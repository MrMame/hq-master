import { TestBed } from '@angular/core/testing';

import { ConditionTickService } from './condition-tick.service';
import { CharactersDbService } from '../../core/services/characters/characters-db.service';
import { GameLogService } from '../../core/services/game-log/game-log.service';
import { GameTimeService } from '../../core/services/game-time/game-time.service';
import { GameLogEntryType } from '../../core/models/game-log-entry.model';
import {
  afterStart,
  createConditionedCharacter,
  createTestCondition,
  TEST_CONDITION_START,
} from '../../core/testing/condition.fixtures';

describe('ConditionTickService', () => {
  let gameTime: GameTimeService;
  let charactersDb: CharactersDbService;
  let gameLog: GameLogService;

  const logTypes: () => GameLogEntryType[] = () => gameLog.entries().map((entry) => entry.type);

  beforeEach(() => {
    TestBed.configureTestingModule({});
    gameTime = TestBed.inject(GameTimeService);
    charactersDb = TestBed.inject(CharactersDbService);
    gameLog = TestBed.inject(GameLogService);
    gameTime.restore(TEST_CONDITION_START);
    charactersDb.writeCharacter({ ...createConditionedCharacter('a'), name: 'Ork' });
    TestBed.inject(ConditionTickService);
    TestBed.tick();
  });

  it('applies due ticks to Leben and conditions in the session on addTime()', () => {
    gameTime.addTime({ minutes: 2 });
    TestBed.tick();

    const [character] = charactersDb.characters();
    expect(character.Leben).toBe(10);
    expect(character.conditions[0].lastTickAt).toBe(afterStart(120).toISOString());
    expect(JSON.parse(localStorage.getItem('characters') ?? '[]')[0].Leben).toBe(10);
  });

  it('logs the time step first and each tick at its own moment', () => {
    gameTime.addTime({ minutes: 2 });
    TestBed.tick();

    expect(logTypes()).toEqual(['time', 'condition-damage', 'condition-damage']);
    expect(gameLog.entries()[1]).toEqual(
      expect.objectContaining({
        gameTime: afterStart(60).toISOString(),
        characterId: 'a',
        characterName: 'Ork',
        conditionId: 'poison',
        value: 1,
        text: 'Ork: 1 Schaden durch Gift',
      }),
    );
    expect(gameLog.entries()[2].gameTime).toBe(afterStart(120).toISOString());
  });

  it('removes the condition after +1 h with 10 damage and logs every tick and the expiry', () => {
    gameTime.addTime({ hours: 1 });
    TestBed.tick();

    expect(charactersDb.characters()[0].Leben).toBe(2);
    expect(charactersDb.characters()[0].conditions).toEqual([]);
    expect(logTypes().filter((type) => type === 'condition-damage')).toHaveLength(10);
    expect(gameLog.entries().at(-1)).toEqual(
      expect.objectContaining({
        type: 'condition-expired',
        gameTime: afterStart(600).toISOString(),
        text: 'Gift bei Ork abgelaufen',
      }),
    );
  });

  it('logs the ticks of several time steps before the next effect run', () => {
    gameTime.addTime({ minutes: 1 });
    gameTime.addTime({ minutes: 1 });
    TestBed.tick();

    expect(logTypes()).toEqual(['time', 'time', 'condition-damage', 'condition-damage']);
  });

  it('writes only characters that changed', () => {
    charactersDb.writeCharacter(createConditionedCharacter('b', []));
    const write: ReturnType<typeof vi.spyOn> = vi.spyOn(charactersDb, 'writeCharacter');

    gameTime.addTime({ seconds: 30 });
    TestBed.tick();
    expect(write).not.toHaveBeenCalled();

    gameTime.addTime({ seconds: 30 });
    TestBed.tick();
    expect(write).toHaveBeenCalledExactlyOnceWith(expect.objectContaining({ id: 'a' }));
  });

  it('applies and logs no ticks when the time is set back', () => {
    gameTime.addTime({ minutes: 1 });
    TestBed.tick();
    gameLog.clear();
    gameTime.restore(TEST_CONDITION_START);
    TestBed.tick();

    expect(charactersDb.characters()[0].Leben).toBe(11);
    expect(gameLog.entries()).toEqual([]);
  });

  it('applies and logs no extra ticks after restoring a saved game', () => {
    const loadedTime: Date = new Date(2381, 5, 1, 8, 0, 0);
    const saved: ReturnType<typeof createConditionedCharacter> = createConditionedCharacter('s', [
      createTestCondition({
        startedAt: new Date(loadedTime.getTime() - 90_000).toISOString(),
        lastTickAt: new Date(loadedTime.getTime() - 30_000).toISOString(),
      }),
    ]);

    // Wie GameSessionService.restoreSnapshot(): erst die Spielzeit, dann die Charaktere.
    gameTime.restore(loadedTime);
    charactersDb.restore([saved]);
    TestBed.tick();

    expect(charactersDb.characters()).toEqual([saved]);
    expect(gameLog.entries()).toEqual([]);
  });
});
