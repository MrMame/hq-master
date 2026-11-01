import {
  effect,
  inject,
  Injectable,
  Signal,
  signal,
  untracked,
  WritableSignal,
} from '@angular/core';
import { CharacterInfo } from '../../core/models/character-info.model';
import { ConditionEvent } from '../../core/models/condition-event.model';
import { CharactersDbService } from '../../core/services/characters/characters-db.service';
import { GameTimeService } from '../../core/services/game-time/game-time.service';
import { advanceConditions, ConditionAdvance } from '../utils/condition-tick.util';

/**
 * Wendet bei jeder Änderung der Spielzeit die fälligen Wirkmomente der Zustände an und entfernt
 * abgelaufene. Hat keinen eigenen Session-Zustand: Der Fortschritt steht in `lastTickAt` am Charakter.
 * Wird app-weit beim Start erzeugt (`app.config.ts`), damit er auf jeder Seite wirkt.
 */
@Injectable({
  providedIn: 'root',
})
export class ConditionTickService {
  private readonly gameTimeService: GameTimeService = inject(GameTimeService);
  private readonly charactersDb: CharactersDbService = inject(CharactersDbService);

  private readonly _lastEvents: WritableSignal<ConditionEvent[]> = signal<ConditionEvent[]>([]);
  /** Ereignisse des letzten Zeitschritts (ohne Persistenz). */
  readonly lastEvents: Signal<ConditionEvent[]> = this._lastEvents.asReadonly();

  constructor() {
    // Nur die Spielzeit ist Abhängigkeit; die Charaktere untracked, sonst löste das Schreiben den
    // Effekt erneut aus.
    effect(() => {
      const now: Date = this.gameTimeService.gameTime();
      untracked(() => this.tick(now));
    });
  }

  private tick(now: Date): void {
    const events: ConditionEvent[] = [];
    this.charactersDb.characters().forEach((character: CharacterInfo) => {
      const advance: ConditionAdvance = advanceConditions(character, now);
      if (advance.character !== character) this.charactersDb.writeCharacter(advance.character);
      events.push(...advance.events);
    });
    this._lastEvents.set(events);
  }
}
