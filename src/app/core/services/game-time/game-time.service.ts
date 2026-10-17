import { computed, Injectable, Signal } from '@angular/core';
import { GameTime } from '../../models/game-time.model';
import { GameTimeSpan } from '../../models/game-time-span.model';
import { PersistedState, persistedState, StorageCodec } from '../../session-state/persisted-state';
import { SESSION_KEYS } from '../../session-state/session-keys';
import { SessionStateSlice } from '../../session-state/session-state-slice';

const DEFAULT_GAME_TIME: Date = new Date(2381, 0, 1, 23, 55, 0);

/** Spielzeit liegt als ISO-String im Storage. */
const GAME_TIME_CODEC: StorageCodec<Date> = {
  encode: (value: Date): string => value.toISOString(),
  decode: (stored: unknown): Date | null => {
    const parsed: Date = new Date(typeof stored === 'string' ? stored : NaN);
    return isNaN(parsed.getTime()) ? null : parsed;
  },
};

@Injectable({
  providedIn: 'root',
})
export class GameTimeService implements SessionStateSlice<Date> {
  private readonly _gameTime: PersistedState<Date> = persistedState<Date>(
    SESSION_KEYS.gameTime,
    () => new Date(DEFAULT_GAME_TIME),
    GAME_TIME_CODEC,
  );

  // REACTIVE INTERFACES ===============================================================================

  /**
   * Aktuelle Spielzeit als reaktive Quelle für andere Services (`effect()` / `computed()`).
   * Jede Änderung liefert eine neue `Date`-Instanz. Das gelieferte `Date` darf nicht
   * verändert werden – Änderungen nur über `setGameTime()` / `addTime()`.
   */
  readonly gameTime: Signal<Date> = this._gameTime.value;
  readonly sessionState: Signal<Date> = this.gameTime;

  readonly gameTimeAsString: Signal<string> = computed(() => {
    const d: Date = this.gameTime();
    const hours: string = d.getHours().toString().padStart(2, '0');
    const minutes: string = d.getMinutes().toString().padStart(2, '0');
    const seconds: string = d.getSeconds().toString().padStart(2, '0');
    const years: number = d.getFullYear();
    const months: string = (d.getMonth() + 1).toString().padStart(2, '0');
    const days: string = d.getDate().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds} ${years}-${months}-${days}`;
  });

  // PUBLICS ===============================================================================

  public setGameTime(gameTime: GameTime): void {
    const { year, month, day, hours = 0, minutes = 0, seconds = 0 }: GameTime = gameTime;
    this.mutateCopy((d) => {
      d.setFullYear(
        year ?? d.getFullYear(),
        month !== undefined ? month - 1 : d.getMonth(),
        day ?? d.getDate(),
      );
      d.setHours(hours, minutes, seconds);
    });
  }

  public addTime({ hours = 0, minutes = 0, seconds = 0 }: GameTimeSpan): void {
    this.mutateCopy((d) => {
      d.setHours(d.getHours() + hours);
      d.setMinutes(d.getMinutes() + minutes);
      d.setSeconds(d.getSeconds() + seconds);
    });
  }

  public restore(gameTime: Date): void {
    this._gameTime.set(new Date(gameTime));
  }

  public reset(): void {
    this._gameTime.set(new Date(DEFAULT_GAME_TIME));
  }

  // PRIVATES ===============================================================================

  // Das Date im Signal wird nie verändert, sonst feuern Abhängige nicht.
  private mutateCopy(mutate: (copy: Date) => void): void {
    this._gameTime.update((current) => {
      const copy: Date = new Date(current);
      mutate(copy);
      return copy;
    });
  }
}
