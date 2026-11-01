import { TestBed } from '@angular/core/testing';

import { GameTimeService } from './game-time.service';
import { GameLogService } from '../game-log/game-log.service';
import { GameLogEntry } from '../../models/game-log-entry.model';

const START: Date = new Date(2381, 0, 1, 12, 0, 0);

describe('GameTimeService – game log', () => {
  let service: GameTimeService;
  let gameLog: GameLogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameTimeService);
    gameLog = TestBed.inject(GameLogService);
    service.restore(START);
  });

  it('logs a time step with old and new time at the new game time', () => {
    service.addTime({ hours: 1 });

    expect(gameLog.entries()).toEqual([
      expect.objectContaining<Partial<GameLogEntry>>({
        type: 'time',
        gameTime: new Date(2381, 0, 1, 13, 0, 0).toISOString(),
        value: 3600,
        text: '+1 h (12:00:00 → 13:00:00)',
      }),
    ]);
  });

  it('logs a set game time', () => {
    service.setGameTime({ hours: 8 });

    expect(gameLog.entries().map((entry) => [entry.value, entry.text])).toEqual([
      [-4 * 3600, 'Spielzeit gesetzt (12:00:00 → 08:00:00)'],
    ]);
  });

  it('writes no entry on restore(), reset() or startAt()', () => {
    service.restore(new Date(2390, 0, 1));
    service.reset();
    service.startAt({ hours: 9 });

    expect(service.gameTimeAsString()).toBe('09:00:00 2381-01-01');
    expect(gameLog.entries()).toEqual([]);
  });
});
