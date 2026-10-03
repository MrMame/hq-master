import { computed, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GametimeService {
  private readonly _gameTime = signal<Date>(new Date(2381, 0, 1, 23, 55, 0));

  readonly gameTimeAsString = computed(() => {
    const d = this._gameTime();
    const hours = d.getHours().toString().padStart(2, '0');
    const minutes = d.getMinutes().toString().padStart(2, '0');
    const seconds = d.getSeconds().toString().padStart(2, '0');
    const years = d.getFullYear();
    const months = (d.getMonth() + 1).toString().padStart(2, '0');
    const days = d.getDate().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds} ${years}-${months}-${days}`;
  });

  public setGameTime(hours: number, minutes: number, seconds: number): void {
    this._gameTime.update(d => {
      const updated = new Date(d);
      updated.setHours(hours, minutes, seconds);
      return updated;
    });
  }

  public addHours(hours: number): void {
    this._gameTime.update(d => {
      const updated = new Date(d);
      updated.setHours(updated.getHours() + hours);
      return updated;
    });
  }

  public addMinutes(minutes: number): void {
    this._gameTime.update(d => {
      const updated = new Date(d);
      updated.setMinutes(updated.getMinutes() + minutes);
      return updated;
    });
  }

  public addTime(hours: number, minutes: number = 0): void {
    this._gameTime.update(d => {
      const updated = new Date(d);
      updated.setHours(updated.getHours() + hours);
      updated.setMinutes(updated.getMinutes() + minutes);
      return updated;
    });
  }
}
