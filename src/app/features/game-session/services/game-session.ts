import { computed, inject, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { GametimeService } from '../../../core/services/gaming/gametime-service';
import { GameTime, gameTimeFromDate } from '../../../core/services/gaming/game-time';
import { CharactersDbService } from '../../../core/services/persistent/characters-database-service';
import { StorageService } from '../../../core/services/persistent/storage-service';
import { CardManagerService } from '../../card-manager/services/card-manager.service';
import { DungeonBoardService } from '../../dungeon-tracker/services/dungeon-board-service';
import { DEFAULT_SESSION_META, SessionMeta } from '../models/session-meta';
import { SessionSnapshot } from '../models/session-snapshot';

const KEY_SESSION_META: string = 'game_session_meta';

export interface SessionStartOptions {
  name: string;
  startTime: GameTime;
}

/**
 * Steuert den Lebenszyklus der Spielesession (Starten, Beenden, Laden).
 * Fremde Zustände werden ausschließlich über die öffentlichen Methoden
 * der jeweils verantwortlichen Services geändert.
 */
@Injectable({
  providedIn: 'root',
})
export class GameSessionService {
  private readonly storageService: StorageService = inject(StorageService);
  private readonly gametimeService: GametimeService = inject(GametimeService);
  private readonly charactersDbService: CharactersDbService = inject(CharactersDbService);
  private readonly dungeonBoardService: DungeonBoardService = inject(DungeonBoardService);
  private readonly cardManagerService: CardManagerService = inject(CardManagerService);

  private readonly _meta: WritableSignal<SessionMeta> = signal<SessionMeta>(this.loadMeta());

  // REACTIVE INTERFACES ===============================================================================

  readonly meta: Signal<SessionMeta> = this._meta.asReadonly();

  /** Feature-übergreifender Gesamtzustand, z. B. für das Speichern als XML. */
  readonly snapshot: Signal<SessionSnapshot> = computed(() => ({
    meta: this._meta(),
    gameTime: this.gametimeService.gameTime(),
    characters: this.charactersDbService.characters(),
    board: this.dungeonBoardService.boardState(),
    positions: this.dungeonBoardService.positions(),
    deck: this.cardManagerService.state(),
  }));

  // PUBLICS ===============================================================================

  /** Setzt alle Feature-Zustände zurück und startet eine neue Session zur gewählten Ingame-Zeit. */
  startSession({ name, startTime }: SessionStartOptions): void {
    this.charactersDbService.writeCharacters([]);
    this.dungeonBoardService.reset();
    this.cardManagerService.restoreState(null);
    this.gametimeService.setGameTime(startTime);
    this.persist({ name, active: true, startedAt: new Date().toISOString() });
  }

  /** Markiert die Session als beendet; alle Daten bleiben erhalten (z. B. zum Speichern). */
  endSession(): void {
    this.persist({ ...this._meta(), active: false });
  }

  restoreSnapshot(snapshot: SessionSnapshot): void {
    this.charactersDbService.writeCharacters(snapshot.characters);
    this.dungeonBoardService.restore(snapshot.board, snapshot.positions);
    this.cardManagerService.restoreState(snapshot.deck);
    this.gametimeService.setGameTime(gameTimeFromDate(snapshot.gameTime));
    this.persist({ ...snapshot.meta });
  }

  // PRIVATES ===============================================================================

  private persist(meta: SessionMeta): void {
    this._meta.set(meta);
    this.storageService.writeToLocalStorage<SessionMeta>(KEY_SESSION_META, meta);
  }

  private loadMeta(): SessionMeta {
    const stored: SessionMeta | null =
      this.storageService.readFromLocalStorage<SessionMeta>(KEY_SESSION_META);
    return { ...DEFAULT_SESSION_META, ...stored };
  }
}
