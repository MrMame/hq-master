import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GametimeService {
  public gameDate: Date;

  constructor() {
    this.gameDate = new Date();
    // Hinweis: Der Kommentar sagte 2381, aber 238 setzt das Jahr auf 238 n. Chr. 
    // Wenn du das Jahr 2381 möchtest, trage direkt 2381 ein. 
    // Der Monat 1 ist zudem Februar (da 0-basiert). Für Januar nutze 0.
    this.gameDate.setFullYear(2381, 0, 1); 
    this.gameDate.setHours(23, 55, 0, 0);
  }

  public setGameTime(hours: number, minutes: number, seconds: number): void {
    this.gameDate.setHours(hours, minutes, seconds);
  }

  /**
   * Addiert eine bestimmte Anzahl an Stunden zur Spielzeit
   */
  public addHours(hours: number): void {
    this.gameDate.setHours(this.gameDate.getHours() + hours);
  }

  /**
   * Addiert eine bestimmte Anzahl an Minuten zur Spielzeit
   */
  public addMinutes(minutes: number): void {
    this.gameDate.setMinutes(this.gameDate.getMinutes() + minutes);
  }

  /**
   * Addiert Stunden und Minuten gleichzeitig (optionale Komfortmethode)
   */
  public addTime(hours: number, minutes: number = 0): void {
    this.addHours(hours);
    this.addMinutes(minutes);
  }

  public get gameTimeAsString(): string {
    const years = this.gameDate.getFullYear();
    const months = (this.gameDate.getMonth() + 1).toString().padStart(2, '0'); 
    const days = this.gameDate.getDate().toString().padStart(2, '0');  
    const hours = this.gameDate.getHours().toString().padStart(2, '0');
    const minutes = this.gameDate.getMinutes().toString().padStart(2, '0');
    const seconds = this.gameDate.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds} ${years}-${months}-${days}`;
  }
}
