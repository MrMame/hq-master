import { computed, inject, Injectable, signal, Signal, WritableSignal } from '@angular/core';
import { StorageService } from '../persistent/storage-service';
import { GameTime } from './game-time';
import { GameTimeSpan } from './game-time-span';

const KEY_GAME_TIME: string = 'game_time';
const DEFAULT_GAME_TIME: Date = new Date(2381, 0, 1, 23, 55, 0);

@Injectable({
  providedIn: 'root',
})
export class GametimeService {
  private readonly storageService: StorageService = inject(StorageService);
  private readonly _gameTime: WritableSignal<Date> = signal<Date>(this.loadGameTime());

  // REACTIVE INTERFACES ===============================================================================

  /**
   * Aktuelle Spielzeit als reaktive Quelle für andere Services (`effect()` / `computed()`).
   * Jede Änderung liefert eine neue `Date`-Instanz. Das gelieferte `Date` darf nicht
   * verändert werden – Änderungen nur über `setGameTime()` / `addTime()`.
   */
  readonly gameTime: Signal<Date> = this._gameTime.asReadonly();

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
    this.updateAndPersist((d) => {
      d.setFullYear(
        year ?? d.getFullYear(),
        month !== undefined ? month - 1 : d.getMonth(),
        day ?? d.getDate(),
      );
      d.setHours(hours, minutes, seconds);
    });
  }

  public addTime({ hours = 0, minutes = 0, seconds = 0 }: GameTimeSpan): void {
    this.updateAndPersist((d) => {
      d.setHours(d.getHours() + hours);
      d.setMinutes(d.getMinutes() + minutes);
      d.setSeconds(d.getSeconds() + seconds);
    });
  }

  // PRIVATES ===============================================================================

  private updateAndPersist(mutate: (copy: Date) => void): void {
    const updated: Date = new Date(this._gameTime());
    mutate(updated);
    this._gameTime.set(updated);
    this.storageService.writeToLocalStorage<string>(KEY_GAME_TIME, updated.toISOString());
  }

  private loadGameTime(): Date {
    const stored: string | null = this.storageService.readFromLocalStorage<string>(KEY_GAME_TIME);
    const parsed: Date = stored ? new Date(stored) : new Date(NaN);
    return isNaN(parsed.getTime()) ? new Date(DEFAULT_GAME_TIME) : parsed;
  }
}
