import { computed, inject, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { Card } from '../../core/models/card.model';
import { CardProperty } from '../../core/models/card-property.model';
import { activeChangeOf } from '../../core/services/equipment/property-transfer.util';
import { activeCardsOf } from '../../core/services/equipment/effective-stats.util';
import { EquipmentService } from '../../core/services/equipment/equipment.service';
import { CardDraft, DraftMove } from '../models/card-action.model';
import {
  DraftCards,
  draftCards,
  draftTargetLocation,
  withDraftMove,
} from '../utils/card-draft.util';

/**
 * Kartenentwurf eines Charakter-Editors: vorgemerkte Bewegungen (Ablegen, Inventar, Gürtel, Anlegen)
 * und die Karten laut Entwurf. Erst `apply()` führt sie über den `EquipmentService` aus. Wird je Editor
 * bereitgestellt (`providers`), nicht app-weit; UI-Zustand ohne Speicherung.
 */
@Injectable()
export class CharacterCardDraftService {
  private readonly equipment: EquipmentService = inject(EquipmentService);
  private readonly characterId: WritableSignal<string> = signal<string>('');
  private readonly moves: WritableSignal<DraftMove[]> = signal<DraftMove[]>([]);

  /** Slot-, Inventar- und Gürtelkarten, wie sie nach dem Übernehmen lägen. */
  readonly cards: Signal<DraftCards> = computed(() =>
    draftCards(
      this.characterId(),
      {
        assigned: this.equipment.assigned(),
        inventory: this.equipment.inventory(),
        belt: this.equipment.belt(),
      },
      this.moves(),
    ),
  );

  /** Karten, die nach dem Übernehmen beim Charakter wirken (Slots, dann Gürtel). */
  readonly activeCards: Signal<Card[]> = computed(() =>
    activeCardsOf({ assigned: this.cards().equipped, belt: this.cards().belt }, this.characterId()),
  );

  /**
   * Änderung an Leben/Ruestung, die die vorgemerkten Bewegungen beim Übernehmen bewirken (Eigenschaften der Karten,
   * die zu wirken beginnen bzw. aufhören); ohne Änderung leer.
   */
  readonly fixedChange: Signal<CardProperty[]> = computed(
    () =>
      activeChangeOf(
        this.characterId(),
        { assigned: this.equipment.assigned(), belt: this.equipment.belt() },
        { assigned: this.cards().equipped, belt: this.cards().belt },
      ) ?? [],
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

  /** Führt die Bewegungen in Reihenfolge aus: Leben/Ruestung und Log wie im Card Viewer. */
  apply(): void {
    this.moves().forEach(({ ref, target }) =>
      this.equipment.moveCard(ref, draftTargetLocation(this.characterId(), target)),
    );
  }
}
