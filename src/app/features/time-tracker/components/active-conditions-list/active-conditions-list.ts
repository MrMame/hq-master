import { Component, computed, inject, Signal } from '@angular/core';
import { CharactersDbService } from '../../../../core/services/characters/characters-db.service';
import { GameTimeService } from '../../../../core/services/game-time/game-time.service';
import { ActiveConditionRow } from '../../models/active-condition-row.model';
import { activeConditionRows } from '../../utils/active-condition-rows.util';

/** Übersicht aller aktiven Zustände, damit der DM vor jedem Zeitschritt sieht, was als Nächstes passiert. */
@Component({
  selector: 'app-active-conditions-list',
  templateUrl: './active-conditions-list.html',
  styleUrl: './active-conditions-list.css',
})
export class ActiveConditionsList {
  private readonly charactersDb: CharactersDbService = inject(CharactersDbService);
  private readonly gameTimeService: GameTimeService = inject(GameTimeService);

  protected readonly rows: Signal<ActiveConditionRow[]> = computed(() =>
    activeConditionRows(this.charactersDb.characters(), this.gameTimeService.gameTime()),
  );
}
