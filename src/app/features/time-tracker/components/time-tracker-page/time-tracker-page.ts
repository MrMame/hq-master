import { Component, inject } from '@angular/core';
import { GameTimeService } from '../../../../core/services/game-time/game-time.service';
import { CollapsibleSidebar } from '../../../../shared/components/collapsible-sidebar/collapsible-sidebar';
import { SidebarSection } from '../../../../shared/components/sidebar-section/sidebar-section';
import { SidebarSectionToggleAll } from '../../../../shared/components/sidebar-section-toggle-all/sidebar-section-toggle-all';
import { RoundService } from '../../../../shared/services/round.service';
import { TIME_STEPS, TimeStep } from '../../models/time-step.model';
import { ActiveConditionsList } from '../active-conditions-list/active-conditions-list';
import { GameLogList } from '../game-log-list/game-log-list';

/** Time Tracker: Seitenleiste „Zeit vorrücken“, rechts Spielzeit, aktive Zustände und Ereignis-Log. */
@Component({
  selector: 'app-time-tracker-page',
  imports: [
    CollapsibleSidebar,
    SidebarSection,
    SidebarSectionToggleAll,
    ActiveConditionsList,
    GameLogList,
  ],
  templateUrl: './time-tracker-page.html',
  styleUrl: './time-tracker-page.css',
})
export class TimeTrackerPage {
  protected readonly gameTimeService: GameTimeService = inject(GameTimeService);
  private readonly roundService: RoundService = inject(RoundService);

  protected readonly timeSteps: readonly TimeStep[] = TIME_STEPS;

  protected startNewRound(): void {
    this.roundService.startNewRound();
  }

  protected advance(step: TimeStep): void {
    this.gameTimeService.addTime(step.span);
  }
}
