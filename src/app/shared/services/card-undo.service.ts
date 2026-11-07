import {
  computed,
  effect,
  EffectRef,
  inject,
  Injectable,
  Signal,
  signal,
  untracked,
  WritableSignal,
} from '@angular/core';
import { MatSnackBar, MatSnackBarRef, TextOnlySnackBar } from '@angular/material/snack-bar';
import { CharacterInfo } from '../../core/models/character-info.model';
import { CardRef, DeckState } from '../../core/models/deck-state.model';
import { CardManagerService } from '../../core/services/card-deck/card-manager.service';
import { ownerOf } from '../../core/services/card-deck/card-location.util';
import { isSameRef } from '../../core/services/card-deck/deck-state.util';
import {
  isRevertible,
  MovedCard,
  movedCards,
  revertOrder,
} from '../../core/services/card-deck/moved-cards.util';
import { CharactersDbService } from '../../core/services/characters/characters-db.service';
import { EquipmentService } from '../../core/services/equipment/equipment.service';
import { undoHintText } from '../utils/undo-hint-text.util';

/** So lange steht der Hinweis mit „Rückgängig“. */
export const UNDO_HINT_DURATION_MS: number = 5000;

/**
 * Rückgängig für die letzte Kartenaktion im Modus `live`: Nach der Aktion steht kurz ein Hinweis mit
 * „Rückgängig“, das alle bewegten Karten (auch eine verdrängte) über den `EquipmentService` an ihren vorherigen
 * Ort zurückbringt; Werte und Log folgen den normalen Regeln. Nur die letzte Aktion zählt; ist die Rückbewegung
 * nicht mehr möglich, verschwindet der Hinweis. UI-Zustand ohne Speicherung.
 */
@Injectable({
  providedIn: 'root',
})
export class CardUndoService {
  private readonly snackBar: MatSnackBar = inject(MatSnackBar);
  private readonly cardManager: CardManagerService = inject(CardManagerService);
  private readonly equipment: EquipmentService = inject(EquipmentService);
  private readonly characters: Signal<CharacterInfo[]> = inject(CharactersDbService).characters;
  private readonly _moves: WritableSignal<readonly MovedCard[]> = signal<readonly MovedCard[]>([]);
  private hint: MatSnackBarRef<TextOnlySnackBar> | null = null;

  /** Die letzte Aktion lässt sich noch zurücknehmen. */
  readonly canUndo: Signal<boolean> = computed(() =>
    isRevertible(
      this.cardManager.state(),
      this._moves(),
      this.characters().map((character) => character.id),
    ),
  );

  private readonly dismissStale: EffectRef = effect(() => {
    if (!this.canUndo()) untracked(() => this.forget());
  });

  /**
   * Führt eine Aktion für die Karte `ref` aus und bietet danach „Rückgängig“ an, wenn sie die Karte bewegt hat.
   * Sonst verschwindet ein bisheriger Hinweis.
   */
  async track(ref: CardRef, run: () => void | Promise<void>): Promise<void> {
    const before: DeckState = this.cardManager.state();
    await run();
    const moves: MovedCard[] = movedCards(before, this.cardManager.state());
    const main: MovedCard | undefined = moves.find((move) => isSameRef(move.ref, ref));
    this.forget();
    if (!main) return;
    this._moves.set(moves);
    this.showHint(undoHintText(main.card.name, main.to, this.ownerName(main)));
  }

  /** Bringt die Karten der letzten Aktion zurück; nicht mehr möglich → keine Änderung. */
  undo(): void {
    if (!this.canUndo()) return;
    const moves: MovedCard[] = revertOrder(this._moves());
    this.forget();
    moves.forEach(({ ref, from }) => this.equipment.moveCard(ref, from));
  }

  private showHint(text: string): void {
    const hint: MatSnackBarRef<TextOnlySnackBar> = this.snackBar.open(text, 'Rückgängig', {
      duration: UNDO_HINT_DURATION_MS,
    });
    hint.onAction().subscribe(() => this.undo());
    hint.afterDismissed().subscribe(() => {
      if (this.hint === hint) this.forget();
    });
    this.hint = hint;
  }

  private forget(): void {
    const hint: MatSnackBarRef<TextOnlySnackBar> | null = this.hint;
    this.hint = null;
    this._moves.set([]);
    hint?.dismiss();
  }

  private ownerName(move: MovedCard): string | undefined {
    const ownerId: string | undefined = ownerOf(move.to);
    return this.characters().find((character) => character.id === ownerId)?.name;
  }
}
