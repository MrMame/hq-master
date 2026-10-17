import { TestBed } from '@angular/core/testing';
import { MockInstance } from 'vitest';

import { GameSessionService } from './game-session.service';
import { GameTimeService } from '../../../core/services/game-time/game-time.service';
import { CharactersDbService } from '../../../core/services/characters/characters-db.service';
import { CardManagerService } from '../../card-manager/services/card-manager.service';
import { DungeonBoardService } from '../../dungeon-tracker/services/dungeon-board.service';
import { DEFAULT_DUNGEON_BOARD_STATE } from '../../dungeon-tracker/models/dungeon-board-state.model';
import { SessionMeta } from '../models/session-meta.model';
import { describePersistedState } from '../../../core/session-state/testing/describe-persisted-state';
import { SESSION_KEYS } from '../../../core/session-state/session-keys';
import { SessionStateSlice } from '../../../core/session-state/session-state-slice';
import { SessionSnapshot } from '../models/session-snapshot.model';
import {
  createDeckState,
  createSessionSnapshot,
  createTestCharacter,
} from '../testing/session.fixtures';

const readStoredMeta: () => SessionMeta | null = (): SessionMeta | null =>
  JSON.parse(localStorage.getItem('game_session_meta') ?? 'null') as SessionMeta | null;

describe('GameSessionService', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
  });

  const inject: () => GameSessionService = (): GameSessionService =>
    TestBed.inject(GameSessionService);

  describePersistedState('meta', {
    key: SESSION_KEYS.sessionMeta,
    create: () => inject(),
    read: (s: GameSessionService) => s.meta(),
    fallback: { name: '', active: false, startedAt: null },
    stored: {
      raw: { name: 'Gruft', active: true, startedAt: '2026-10-16T10:00:00Z' },
      expected: { name: 'Gruft', active: true, startedAt: '2026-10-16T10:00:00Z' },
    },
    mutate: (s: GameSessionService) => s.startSession({ name: 'Neu', startTime: {} }),
  });

  it('should complete an incomplete stored meta with the defaults', () => {
    localStorage.setItem('game_session_meta', JSON.stringify({ name: 'Alt' }));
    expect(inject().meta()).toEqual({ name: 'Alt', active: false, startedAt: null });
  });

  it('should reset all feature states and set the start time on startSession', () => {
    const characters: CharactersDbService = TestBed.inject(CharactersDbService);
    const board: DungeonBoardService = TestBed.inject(DungeonBoardService);
    const cards: CardManagerService = TestBed.inject(CardManagerService);
    characters.writeCharacter(createTestCharacter('a'));
    board.updateGridSettings({ gridColumns: 20 });
    cards.restore(createDeckState());

    inject().startSession({
      name: 'Neue Runde',
      startTime: { year: 2390, month: 5, day: 6, hours: 7 },
    });

    expect(characters.characters()).toEqual([]);
    expect(board.boardState()).toEqual(DEFAULT_DUNGEON_BOARD_STATE);
    expect(board.positions()).toEqual([]);
    expect(cards.state()).toBeNull();
    expect(TestBed.inject(GameTimeService).gameTime()).toEqual(new Date(2390, 4, 6, 7, 0, 0));
  });

  it('should mark the session active and persist the meta on startSession', () => {
    const service: GameSessionService = inject();
    service.startSession({ name: 'Neue Runde', startTime: { year: 2390 } });
    expect(service.meta().active).toBe(true);
    expect(service.meta().name).toBe('Neue Runde');
    expect(service.meta().startedAt).not.toBeNull();
    expect(readStoredMeta()).toEqual(service.meta());
  });

  it('should keep all data but mark the session inactive on endSession', () => {
    const service: GameSessionService = inject();
    service.startSession({ name: 'Runde', startTime: { year: 2390 } });
    TestBed.inject(CharactersDbService).writeCharacter(createTestCharacter('a'));

    service.endSession();

    expect(service.meta().active).toBe(false);
    expect(service.meta().name).toBe('Runde');
    expect(readStoredMeta()?.active).toBe(false);
    expect(TestBed.inject(CharactersDbService).characters()).toHaveLength(1);
  });

  it('should restore every feature state from a snapshot', () => {
    const service: GameSessionService = inject();
    const snapshot: SessionSnapshot = createSessionSnapshot();

    service.restoreSnapshot(snapshot);

    expect(service.snapshot()).toEqual(snapshot);
    expect(readStoredMeta()).toEqual(snapshot.meta);
  });

  describe('slice orchestration', () => {
    const slices: () => SessionStateSlice<unknown>[] = (): SessionStateSlice<unknown>[] => [
      TestBed.inject(GameTimeService),
      TestBed.inject(CharactersDbService),
      TestBed.inject(DungeonBoardService),
      TestBed.inject(CardManagerService),
    ];

    it('should reset every slice on startSession', () => {
      const service: GameSessionService = inject();
      const spies: MockInstance[] = slices().map((slice) => vi.spyOn(slice, 'reset'));
      service.startSession({ name: 'Runde', startTime: { year: 2390 } });
      spies.forEach((spy) => expect(spy).toHaveBeenCalledTimes(1));
    });

    it('should restore every slice with its part of the snapshot', () => {
      const service: GameSessionService = inject();
      const snapshot: SessionSnapshot = createSessionSnapshot();
      const parts: unknown[] = [
        snapshot.gameTime,
        snapshot.characters,
        snapshot.dungeon,
        snapshot.deck,
      ];
      const spies: MockInstance[] = slices().map((slice) => vi.spyOn(slice, 'restore'));
      service.restoreSnapshot(snapshot);
      spies.forEach((spy, i) => expect(spy).toHaveBeenCalledExactlyOnceWith(parts[i]));
    });
  });

  it('should update the snapshot signal when a feature state changes', () => {
    const service: GameSessionService = inject();
    TestBed.inject(CharactersDbService).writeCharacter(createTestCharacter('x'));
    expect(service.snapshot().characters.map((c) => c.id)).toEqual(['x']);
  });
});
