import { Component,inject } from '@angular/core';
import { GametimeService } from '../../../../core/services/gaming/gametime-service';

@Component({
  selector: 'app-time-tracker-page',
  imports: [],
  templateUrl: './time-tracker-page.html',
  styleUrl: './time-tracker-page.scss',
})
export class TimeTrackerPage {

  gameTimeService:GametimeService = inject(GametimeService);

  addTime1Hour() {
    this.gameTimeService.addTime(1);
  }

  addTime8Hour() {
    this.gameTimeService.addTime(8);
  }
}
