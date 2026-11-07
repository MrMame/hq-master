import { computed, inject, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { EquipmentService } from '../../core/services/equipment/equipment.service';
import { CardDraft, DraftMove } from '../models/card-action.model';
import {
  DraftCards,
  draftCards,
  draftTargetLocation,
  withDraftMove,
} from '../utils/card-draft.util';

/**
 * Kartenentwurf eines Charakter-Editors: vorgemerkte Bewegungen (Ablegen, Ins Inventar legen, Anlegen)
 * und die Karten laut Entwurf. Erst `apply()` führt sie über den `EquipmentService` aus. Wird je Editor
 * bereitgestellt (`providers`), nicht app-weit; UI-Zustand ohne Speicherung.
 */
@Injectable()
export class CharacterCardDraftService {
  private readonly equipment: EquipmentService = inject(EquipmentService);
  private readonly characterId: WritableSignal<string> = signal<string>('');
  private readonly moves: WritableSignal<DraftMove[]> = signal<DraftMove[]>([]);

  /** Slot- und Inventarkarten, wie sie nach dem Übernehmen lägen. */
  readonly cards: Signal<DraftCards> = computed(() =>
    draftCards(
      this.characterId(),
      this.equipment.assigned(),
      this.equipment.inventory(),
      this.moves(),
    ),
  );

  /** Entwurf für den Card Viewer; der Charakter bleibt für die Lebensdauer des Editors gleich. */
  start(characterId: string): CardDraft {
    this.characterId.set(characterId);
    return {
      characterId,
      moves: this.moves.asReadonly(),
      equipped: computed(() => this.cards().equipped),
      move: (ref, target) => this.moves.update((moves) => withDraftMove(moves, ref, target)),
    };
  }

  /** Führt die Bewegungen in Reihenfolge aus: Bonus, Begrenzung und Log wie im Card Viewer. */
  apply(): void {
    this.moves().forEach(({ ref, target }) =>
      this.equipment.moveCard(ref, draftTargetLocation(this.characterId(), target)),
    );
  }
}
