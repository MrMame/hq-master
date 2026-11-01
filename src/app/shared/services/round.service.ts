import { inject, Injectable } from '@angular/core';
import { CharactersDbService } from '../../core/services/characters/characters-db.service';
import { GameLogService } from '../../core/services/game-log/game-log.service';
import { GameTimeService } from '../../core/services/game-time/game-time.service';

/** Länge einer Spielrunde in Spielsekunden. */
export const ROUND_SECONDS: number = 10;

/**
 * Rundensteuerung: „Neue Runde“ rückt die Spielzeit um eine Runde vor und gibt alle Charaktere für die
 * neue Runde frei. Nur hier wird `movedThisRound` zurückgesetzt, nicht bei anderen Zeitänderungen.
 */
@Injectable({
  providedIn: 'root',
})
export class RoundService {
  private readonly gameLog: GameLogService = inject(GameLogService);
  private readonly gameTime: GameTimeService = inject(GameTimeService);
  private readonly charactersDb: CharactersDbService = inject(CharactersDbService);

  /** Der Eintrag „Neue Runde“ steht vor dem Zeitschritt und den Einträgen des Zustands-Ticks. */
  startNewRound(): void {
    this.gameLog.append({
      type: 'round',
      gameTime: this.gameTime.gameTime().toISOString(),
      text: 'Neue Runde',
    });
    this.gameTime.addTime({ seconds: ROUND_SECONDS });
    this.charactersDb.clearMovedThisRound();
  }
}
