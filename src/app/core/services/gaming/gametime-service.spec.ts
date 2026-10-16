import { TestBed } from '@angular/core/testing';

import { GametimeService } from './gametime-service';
import { GameTimeSpan } from './game-time-span';

const KEY: string = 'game_time';
const DEFAULT_AS_STRING: string = '23:55:00 2381-01-01';

const readStored: () => Date = (): Date =>
  new Date(JSON.parse(localStorage.getItem(KEY) ?? 'null') as string);

const storeTime: (date: Date) => void = (date: Date): void =>
  localStorage.setItem(KEY, JSON.stringify(date.toISOString()));

describe('GametimeService', () => {
  let service: GametimeService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
  });

  it('should start with the default game time when nothing is stored', () => {
    service = TestBed.inject(GametimeService);
    expect(service.gameTimeAsString()).toBe(DEFAULT_AS_STRING);
  });

  it('should load the stored game time on init', () => {
    storeTime(new Date(2390, 4, 6, 7, 8, 9));
    service = TestBed.inject(GametimeService);
    expect(service.gameTimeAsString()).toBe('07:08:09 2390-05-06');
  });

  it('should fall back to the default when the stored value is invalid', () => {
    localStorage.setItem(KEY, JSON.stringify('not a date'));
    service = TestBed.inject(GametimeService);
    expect(service.gameTimeAsString()).toBe(DEFAULT_AS_STRING);
  });

  it('should persist setGameTime', () => {
    service = TestBed.inject(GametimeService);
    service.setGameTime({ hours: 10, minutes: 20, seconds: 30 });
    expect(service.gameTimeAsString()).toBe('10:20:30 2381-01-01');
    expect(readStored()).toEqual(new Date(2381, 0, 1, 10, 20, 30));
  });

  it('should treat missing parts as 0 in setGameTime', () => {
    service = TestBed.inject(GametimeService);
    service.setGameTime({ hours: 8 });
    expect(service.gameTimeAsString()).toBe('08:00:00 2381-01-01');
  });

  it('should set and persist a full date in setGameTime (1-based month)', () => {
    service = TestBed.inject(GametimeService);
    service.setGameTime({ year: 2390, month: 5, day: 6, hours: 7, minutes: 8, seconds: 9 });
    expect(service.gameTimeAsString()).toBe('07:08:09 2390-05-06');
    expect(readStored()).toEqual(new Date(2390, 4, 6, 7, 8, 9));
  });

  it('should keep missing date parts in setGameTime', () => {
    service = TestBed.inject(GametimeService);
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
    service = TestBed.inject(GametimeService);
    service.addTime(timeSpan);
    expect(readStored()).toEqual(expected);
  });

  it('should update gameTimeAsString after addTime', () => {
    service = TestBed.inject(GametimeService);
    service.addTime({ minutes: 4, seconds: 70 });
    expect(service.gameTimeAsString()).toBe('00:00:10 2381-01-02');
  });

  it('should keep the game time across a service restart', () => {
    TestBed.inject(GametimeService).addTime({ hours: 8 });
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});
    service = TestBed.inject(GametimeService);
    expect(service.gameTimeAsString()).toBe('07:55:00 2381-01-02');
  });
});
