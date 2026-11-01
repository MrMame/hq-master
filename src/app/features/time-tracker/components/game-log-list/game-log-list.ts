import { Component, computed, inject, signal, Signal, WritableSignal } from '@angular/core';
import { GameLogService } from '../../../../core/services/game-log/game-log.service';
import { ConfirmationService } from '../../../../shared/services/confirmation.service';
import { GameLogFilter, GameLogRow } from '../../models/game-log-row.model';
import { gameLogRows } from '../../utils/game-log-rows.util';

/** Ereignis-Log der Spielesession, neueste Einträge oben, filterbar und nach Rückfrage leerbar. */
@Component({
  selector: 'app-game-log-list',
  templateUrl: './game-log-list.html',
  styleUrl: './game-log-list.css',
})
export class GameLogList {
  private readonly gameLog: GameLogService = inject(GameLogService);
  private readonly confirmation: ConfirmationService = inject(ConfirmationService);

  protected readonly filters: readonly { id: GameLogFilter; label: string }[] = [
    { id: 'all', label: 'Alle' },
    { id: 'time', label: 'Zeit' },
    { id: 'conditions', label: 'Zustände' },
    { id: 'damage', label: 'Schaden' },
  ];
  protected readonly filter: WritableSignal<GameLogFilter> = signal<GameLogFilter>('all');
  protected readonly isEmpty: Signal<boolean> = computed(() => this.gameLog.entries().length === 0);
  protected readonly rows: Signal<GameLogRow[]> = computed(() =>
    gameLogRows(this.gameLog.entries(), this.filter()),
  );

  async clear(): Promise<void> {
    const confirmed: boolean = await this.confirmation.confirm({
      title: 'Log leeren',
      message: 'Alle Ereignisse der Spielesession wirklich aus dem Log löschen?',
      confirmLabel: 'Leeren',
    });
    if (confirmed) this.gameLog.clear();
  }
}
