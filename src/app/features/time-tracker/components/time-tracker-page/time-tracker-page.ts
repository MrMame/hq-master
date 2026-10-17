import { Component, inject } from '@angular/core';
import { GameTimeService } from '../../../../core/services/game-time/game-time.service';

@Component({
  selector: 'app-time-tracker-page',
  imports: [],
  templateUrl: './time-tracker-page.html',
  styleUrl: './time-tracker-page.scss',
})
export class TimeTrackerPage {
  gameTimeService: GameTimeService = inject(GameTimeService);

  readonly secondSteps: readonly number[] = [1, 5, 10];

  addSeconds(seconds: number): void {
    this.gameTimeService.addTime({ seconds });
  }

  addTime1Hour(): void {
    this.gameTimeService.addTime({ hours: 1 });
  }

  addTime8Hour(): void {
    this.gameTimeService.addTime({ hours: 8 });
  }
}
