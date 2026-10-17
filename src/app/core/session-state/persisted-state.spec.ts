import { effect, signal, WritableSignal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { PersistedState, persistedState, StorageCodec } from './persisted-state';
import { SESSION_KEYS } from './session-keys';

const KEY: string = SESSION_KEYS.gameTime;

const dateCodec: StorageCodec<Date> = {
  encode: (value: Date): string => value.toISOString(),
  decode: (stored: unknown): Date | null => {
    const date: Date = new Date(typeof stored === 'string' ? stored : NaN);
    return isNaN(date.getTime()) ? null : date;
  },
};

const createNumber: () => PersistedState<number> = (): PersistedState<number> =>
  TestBed.runInInjectionContext(() => persistedState<number>(SESSION_KEYS.gameTime, () => 7));

const createDate: () => PersistedState<Date> = (): PersistedState<Date> =>
  TestBed.runInInjectionContext(() =>
    persistedState<Date>(SESSION_KEYS.gameTime, () => new Date(2000, 0, 1), dateCodec),
  );

const readRaw: () => unknown = (): unknown => JSON.parse(localStorage.getItem(KEY) ?? 'null');

describe('persistedState', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should initialise from storage and fall back when nothing is stored', () => {
    expect(createNumber().value()).toBe(7);
    localStorage.setItem(KEY, '42');
    expect(createNumber().value()).toBe(42);
  });

  it('should fall back when the stored JSON is invalid', () => {
    vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    localStorage.setItem(KEY, '{kaputt');
    expect(createNumber().value()).toBe(7);
  });

  it('should write signal and storage together on set and update', () => {
    const state: PersistedState<number> = createNumber();
    state.set(10);
    expect(state.value()).toBe(10);
    expect(readRaw()).toBe(10);
    state.update((n) => n + 1);
    expect(state.value()).toBe(11);
    expect(state.current()).toBe(11);
    expect(readRaw()).toBe(11);
  });

  describe('codec', () => {
    it('should decode the stored value on init', () => {
      localStorage.setItem(KEY, JSON.stringify(new Date(2390, 4, 6).toISOString()));
      expect(createDate().value()).toEqual(new Date(2390, 4, 6));
    });

    it('should fall back when the codec rejects the stored value', () => {
      localStorage.setItem(KEY, JSON.stringify('kein Datum'));
      expect(createDate().value()).toEqual(new Date(2000, 0, 1));
    });

    it('should encode the value on set', () => {
      const date: Date = new Date(2390, 4, 6, 7, 8, 9);
      createDate().set(date);
      expect(readRaw()).toBe(date.toISOString());
    });
  });

  describe('untracked reads', () => {
    it('should not let current() create a dependency', () => {
      const state: PersistedState<number> = createNumber();
      const runs: WritableSignal<number> = signal(0);
      TestBed.runInInjectionContext(() =>
        effect(() => {
          state.current();
          runs.update((n) => n + 1);
        }),
      );
      TestBed.tick();
      state.set(99);
      TestBed.tick();
      expect(runs()).toBe(1);
    });

    it('should not loop when update() is called from an effect()', () => {
      const state: PersistedState<number> = createNumber();
      const trigger: WritableSignal<number> = signal(0);
      TestBed.runInInjectionContext(() => effect(() => state.update((n) => n + trigger())));
      TestBed.tick();
      expect(state.value()).toBe(7);
      trigger.set(3);
      TestBed.tick();
      expect(state.value()).toBe(10);
    });
  });
});
