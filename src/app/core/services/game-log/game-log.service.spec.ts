import { TestBed } from '@angular/core/testing';

import { GAME_LOG_LIMIT, GameLogService } from './game-log.service';
import { GameLogEntry, NewGameLogEntry } from '../../models/game-log-entry.model';
import { describePersistedState } from '../../session-state/testing/describe-persisted-state';
import { SESSION_KEYS } from '../../session-state/session-keys';
import { createTestLog, createTestLogEntry } from '../../testing/game-log.fixtures';

const newEntry: (text: string) => NewGameLogEntry = (text: string): NewGameLogEntry => ({
  type: 'time',
  gameTime: createTestLogEntry().gameTime,
  text,
});

const texts: (service: GameLogService) => string[] = (service) =>
  service.entries().map((entry) => entry.text);

describe('GameLogService', () => {
  let service: GameLogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  describePersistedState('entries', {
    key: SESSION_KEYS.gameLog,
    create: () => TestBed.inject(GameLogService),
    read: (s: GameLogService) => s.entries(),
    fallback: [],
    stored: {
      raw: [...createTestLog(), { id: 'x', type: 'unknown', gameTime: '', text: '' }, 'kaputt'],
      expected: createTestLog(),
    },
    mutate: (s: GameLogService) => s.append(newEntry('neu')),
  });

  it('falls back to an empty log when the stored value is not a list', () => {
    localStorage.setItem(SESSION_KEYS.gameLog, JSON.stringify({ entries: [] }));
    expect(TestBed.inject(GameLogService).entries()).toEqual([]);
  });

  describe('with a service', () => {
    beforeEach(() => {
      service = TestBed.inject(GameLogService);
    });

    it('appends entries in order with unique ids', () => {
      service.append(newEntry('a'), newEntry('b'));
      service.append(newEntry('c'));

      expect(texts(service)).toEqual(['a', 'b', 'c']);
      expect(new Set(service.entries().map((entry) => entry.id)).size).toBe(3);
    });

    it('leaves the log untouched when nothing is appended', () => {
      const before: GameLogEntry[] = service.entries();
      service.append();
      expect(service.entries()).toBe(before);
    });

    it(`keeps at most ${GAME_LOG_LIMIT} entries and drops the oldest first`, () => {
      service.append(...Array.from({ length: GAME_LOG_LIMIT }, (_, i) => newEntry(`${i}`)));
      service.append(newEntry('neu'));

      expect(service.entries()).toHaveLength(GAME_LOG_LIMIT);
      expect(texts(service)[0]).toBe('1');
      expect(texts(service).at(-1)).toBe('neu');
    });

    it('clears the log and its storage', () => {
      service.append(newEntry('a'));
      service.clear();

      expect(service.entries()).toEqual([]);
      expect(JSON.parse(localStorage.getItem(SESSION_KEYS.gameLog) ?? 'null')).toEqual([]);
    });

    it('replaces the log on restore() and empties it on reset()', () => {
      service.append(newEntry('alt'));
      service.restore(createTestLog());
      expect(service.sessionState()).toEqual(createTestLog());

      service.reset();
      expect(service.entries()).toEqual([]);
    });

    it(`keeps only the newest ${GAME_LOG_LIMIT} entries of a restored log`, () => {
      const log: GameLogEntry[] = Array.from({ length: GAME_LOG_LIMIT + 2 }, (_, i) =>
        createTestLogEntry({ id: `${i}` }),
      );
      service.restore(log);
      expect(service.entries()[0].id).toBe('2');
    });
  });
});
