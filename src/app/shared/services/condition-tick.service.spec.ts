import { TestBed } from '@angular/core/testing';

import { ConditionTickService } from './condition-tick.service';
import { CharactersDbService } from '../../core/services/characters/characters-db.service';
import { GameTimeService } from '../../core/services/game-time/game-time.service';
import {
  afterStart,
  createConditionedCharacter,
  createTestCondition,
  TEST_CONDITION_START,
} from '../../core/testing/condition.fixtures';

describe('ConditionTickService', () => {
  let service: ConditionTickService;
  let gameTime: GameTimeService;
  let charactersDb: CharactersDbService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    gameTime = TestBed.inject(GameTimeService);
    charactersDb = TestBed.inject(CharactersDbService);
    gameTime.restore(TEST_CONDITION_START);
    charactersDb.writeCharacter(createConditionedCharacter('a'));
    service = TestBed.inject(ConditionTickService);
    TestBed.tick();
  });

  it('applies due ticks to health and conditions in the session on addTime()', () => {
    gameTime.addTime({ minutes: 2 });
    TestBed.tick();

    const [character] = charactersDb.characters();
    expect(character.health).toBe(10);
    expect(character.conditions[0].lastTickAt).toBe(afterStart(120).toISOString());
    expect(JSON.parse(localStorage.getItem('characters') ?? '[]')[0].health).toBe(10);
    expect(service.lastEvents().map((e) => e.type)).toEqual(['damage', 'damage']);
  });

  it('removes the condition after +1 h with 10 damage', () => {
    gameTime.addTime({ hours: 1 });
    TestBed.tick();

    expect(charactersDb.characters()[0].health).toBe(2);
    expect(charactersDb.characters()[0].conditions).toEqual([]);
    expect(service.lastEvents().at(-1)?.type).toBe('expired');
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

  it('applies no ticks when the time is set back', () => {
    gameTime.addTime({ minutes: 1 });
    TestBed.tick();
    gameTime.restore(TEST_CONDITION_START);
    TestBed.tick();

    expect(charactersDb.characters()[0].health).toBe(11);
    expect(service.lastEvents()).toEqual([]);
  });

  it('applies no extra ticks after restoring a saved game', () => {
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
    expect(service.lastEvents()).toEqual([]);
  });
});
