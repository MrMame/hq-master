import { effect, inject, Injectable, untracked } from '@angular/core';
import { CharacterInfo } from '../../core/models/character-info.model';
import { CharactersDbService } from '../../core/services/characters/characters-db.service';
import { GameLogService } from '../../core/services/game-log/game-log.service';
import { GameTimeService } from '../../core/services/game-time/game-time.service';
import { advanceConditions, ConditionAdvance } from '../utils/condition-tick.util';
import { conditionEventEntry } from '../utils/game-log-entries.util';

/**
 * Wendet bei jeder Änderung der Spielzeit die fälligen Wirkmomente der Zustände an und entfernt
 * abgelaufene. Hat keinen eigenen Session-Zustand: Der Fortschritt steht in `lastTickAt` am Charakter,
 * die Ereignisse gehen direkt ins Log (`GameLogService`).
 * Wird app-weit beim Start erzeugt (`app.config.ts`), damit er auf jeder Seite wirkt.
 */
@Injectable({
  providedIn: 'root',
})
export class ConditionTickService {
  private readonly gameTimeService: GameTimeService = inject(GameTimeService);
  private readonly charactersDb: CharactersDbService = inject(CharactersDbService);
  private readonly gameLog: GameLogService = inject(GameLogService);

  constructor() {
    // Nur die Spielzeit ist Abhängigkeit; die Charaktere untracked, sonst löste das Schreiben den
    // Effekt erneut aus.
    effect(() => {
      const now: Date = this.gameTimeService.gameTime();
      untracked(() => this.tick(now));
    });
  }

  private tick(now: Date): void {
    this.charactersDb.characters().forEach((character: CharacterInfo) => {
      const advance: ConditionAdvance = advanceConditions(character, now);
      if (advance.character !== character) this.charactersDb.writeCharacter(advance.character);
      this.gameLog.append(
        ...advance.events.map((event) => conditionEventEntry(event, character.name)),
      );
    });
  }
}
