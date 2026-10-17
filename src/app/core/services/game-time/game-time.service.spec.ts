import { computed, effect, Signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Mock } from 'vitest';

import { GameTimeService } from './game-time.service';
import { GameTimeSpan } from '../../models/game-time-span.model';
import { describePersistedState } from '../../session-state/testing/describe-persisted-state';
import { SESSION_KEYS } from '../../session-state/session-keys';

const KEY: string = 'game_time';
const DEFAULT_AS_STRING: string = '23:55:00 2381-01-01';

const readStored: () => Date = (): Date =>
  new Date(JSON.parse(localStorage.getItem(KEY) ?? 'null') as string);

describe('GameTimeService', () => {
  let service: GameTimeService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
  });

  describePersistedState('gameTime', {
    key: SESSION_KEYS.gameTime,
    create: () => TestBed.inject(GameTimeService),
    read: (s: GameTimeService) => s.gameTime(),
    fallback: new Date(2381, 0, 1, 23, 55, 0),
    stored: {
      raw: new Date(2390, 4, 6, 7, 8, 9).toISOString(),
      expected: new Date(2390, 4, 6, 7, 8, 9),
    },
    mutate: (s: GameTimeService) => s.addTime({ minutes: 1 }),
    encode: (value: Date) => value.toISOString(),
  });

  it('should start with the default game time string when nothing is stored', () => {
    service = TestBed.inject(GameTimeService);
    expect(service.gameTimeAsString()).toBe(DEFAULT_AS_STRING);
  });

  it('should fall back to the default when the stored value is not a date', () => {
    localStorage.setItem(KEY, JSON.stringify('not a date'));
    service = TestBed.inject(GameTimeService);
    expect(service.gameTimeAsString()).toBe(DEFAULT_AS_STRING);
  });

  it('should persist setGameTime', () => {
    service = TestBed.inject(GameTimeService);
    service.setGameTime({ hours: 10, minutes: 20, seconds: 30 });
    expect(service.gameTimeAsString()).toBe('10:20:30 2381-01-01');
    expect(readStored()).toEqual(new Date(2381, 0, 1, 10, 20, 30));
  });

  it('should treat missing parts as 0 in setGameTime', () => {
    service = TestBed.inject(GameTimeService);
    service.setGameTime({ hours: 8 });
    expect(service.gameTimeAsString()).toBe('08:00:00 2381-01-01');
  });

  it('should set and persist a full date in setGameTime (1-based month)', () => {
    service = TestBed.inject(GameTimeService);
    service.setGameTime({ year: 2390, month: 5, day: 6, hours: 7, minutes: 8, seconds: 9 });
    expect(service.gameTimeAsString()).toBe('07:08:09 2390-05-06');
    expect(readStored()).toEqual(new Date(2390, 4, 6, 7, 8, 9));
  });

  it('should keep missing date parts in setGameTime', () => {
    service = TestBed.inject(GameTimeService);
    service.setGameTime({ month: 12, hours: 6 });
    expect(service.gameTimeAsString()).toBe('06:00:00 2381-12-01');
  });

  it.each([
    [{ hours: 2 }, new Date(2381, 0, 2, 1, 55, 0)],
    [{ minutes: 10 }, new Date(2381, 0, 2, 0, 5, 0)],
    [{ seconds: 65 }, new Date(2381, 0, 1, 23, 56, 5)],
    [{ hours: 1, minutes: 5 }, new Date(2381, 0, 2, 1, 0, 0)],
    [{ minutes: 4, seconds: 70 }, new Date(2381, 0, 2, 0, 0, 10)],
    [{}, new Date(2381, 0, 1, 23, 55, 0)],
  ])('should add and persist %o', (timeSpan: GameTimeSpan, expected: Date) => {
    service = TestBed.inject(GameTimeService);
    service.addTime(timeSpan);
    expect(readStored()).toEqual(expected);
  });

  it('should update gameTimeAsString after addTime', () => {
    service = TestBed.inject(GameTimeService);
    service.addTime({ minutes: 4, seconds: 70 });
    expect(service.gameTimeAsString()).toBe('00:00:10 2381-01-02');
  });

  it('should emit a new Date instance on addTime and setGameTime', () => {
    service = TestBed.inject(GameTimeService);
    const initial: Date = service.gameTime();
    service.addTime({ minutes: 10 });
    const afterAdd: Date = service.gameTime();
    expect(afterAdd).not.toBe(initial);
    expect(afterAdd).toEqual(new Date(2381, 0, 2, 0, 5, 0));
    expect(initial).toEqual(new Date(2381, 0, 1, 23, 55, 0));
    service.setGameTime({ year: 2390, month: 5, day: 6, hours: 7 });
    expect(service.gameTime()).not.toBe(afterAdd);
    expect(service.gameTime()).toEqual(new Date(2390, 4, 6, 7, 0, 0));
  });

  it('should restore a copy of the given time in signal and storage', () => {
    service = TestBed.inject(GameTimeService);
    const restored: Date = new Date(2390, 4, 6, 7, 8, 9);
    service.restore(restored);
    expect(service.sessionState()).toEqual(restored);
    expect(service.sessionState()).not.toBe(restored);
    expect(readStored()).toEqual(restored);
  });

  it('should reset to the default game time', () => {
    service = TestBed.inject(GameTimeService);
    service.addTime({ hours: 3 });
    service.reset();
    expect(service.gameTimeAsString()).toBe(DEFAULT_AS_STRING);
    expect(readStored()).toEqual(new Date(2381, 0, 1, 23, 55, 0));
  });

  it('should recompute a consumer computed() after a time change', () => {
    service = TestBed.inject(GameTimeService);
    const hour: Signal<number> = computed(() => service.gameTime().getHours());
    expect(hour()).toBe(23);
    service.addTime({ hours: 2 });
    expect(hour()).toBe(1);
  });

  it('should trigger a consumer effect() on every time change', () => {
    service = TestBed.inject(GameTimeService);
    const onTick: Mock<(time: Date) => void> = vi.fn();
    TestBed.runInInjectionContext(() => effect(() => onTick(service.gameTime())));
    TestBed.tick();
    expect(onTick).toHaveBeenCalledTimes(1);
    service.addTime({ seconds: 10 });
    TestBed.tick();
    expect(onTick).toHaveBeenCalledTimes(2);
    expect(onTick).toHaveBeenLastCalledWith(new Date(2381, 0, 1, 23, 55, 10));
  });

  it('should keep the game time across a service restart', () => {
    TestBed.inject(GameTimeService).addTime({ hours: 8 });
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameTimeService);
    expect(service.gameTimeAsString()).toBe('07:55:00 2381-01-02');
  });
});
