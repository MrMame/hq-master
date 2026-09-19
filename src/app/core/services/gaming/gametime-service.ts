import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GametimeService {

  
  public gameDate: Date;

  constructor() {
    this.gameDate = new Date();
    this.gameDate.setFullYear(238, 1, 1); // Setze das Jahr auf 2381, den Monat auf Januar (0-basiert) und den Tag auf 1
    this.gameDate.setHours(23, 55, 0, 0);
  }

  public setGameTime(hours: number,minutes:number,seconds:number): void {
    this.gameDate.setHours(hours, minutes, seconds);
  }

  public get gameTimeAsString(): string {
    const years = this.gameDate.getFullYear();
    const months = (this.gameDate.getMonth() + 1).toString().padStart(2, '0'); // Monate sind 0-basiert
    const days = this.gameDate.getDate().toString().padStart(2, '0');  
    const hours = this.gameDate.getHours().toString().padStart(2, '0');
    const minutes = this.gameDate.getMinutes().toString().padStart(2, '0');
    const seconds = this.gameDate.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds} ${years}-${months}-${days}`;
    
  }

}
