import { Component, computed, inject, input, InputSignal, Signal } from '@angular/core';
import { CharacterInfo } from '../../../../core/models/character-info.model';
import { AssignedCard, InventoryCard } from '../../../../core/models/deck-state.model';
import { EQUIPMENT_SLOTS } from '../../../../core/models/equipment.model';
import { CardManagerService } from '../../../../core/services/card-deck/card-manager.service';
import { toCardRef } from '../../../../core/services/card-deck/deck-state.util';
import { cardsOf } from '../../../../core/services/equipment/effective-stats.util';
import { CardViewerService } from '../../../../shared/services/card-viewer.service';

/**
 * Karten eines Charakters an Token und Legende: ausgerüstete Karten als kleine Bilder (Kopf bis Amulett) und die
 * Anzahl seiner Inventarkarten. Ein Klick öffnet die Karte im Card Viewer (`live`), der Inventarhinweis die
 * erste Inventarkarte; Klicks gehen nicht an Token oder Legende weiter.
 */
@Component({
  selector: 'app-character-cards',
  imports: [],
  host: { '(click)': '$event.stopPropagation()', '(dblclick)': '$event.stopPropagation()' },
  template: `
    @for (entry of equipped(); track entry.deckId + '/' + entry.card.id) {
      <button
        type="button"
        class="character-cards__card"
        [attr.aria-label]="entry.card.name + ' ansehen'"
        [title]="entry.card.name"
        (click)="view(entry)"
      >
        <img class="character-cards__image" [src]="entry.card.imagePath" alt="" />
      </button>
    }
    @if (inventory().length > 0) {
      <button
        type="button"
        class="character-cards__inventory"
        [attr.aria-label]="'Inventar ansehen (' + inventory().length + ')'"
        [title]="'Inventar: ' + inventory().length"
        (click)="view(inventory()[0])"
      >
        🎒 {{ inventory().length }}
      </button>
    }
  `,
  styles: `
    :host {
      display: inline-flex;
      align-items: center;
      gap: var(--space-1);
    }

    .character-cards__card,
    .character-cards__inventory {
      display: inline-flex;
      align-items: center;
      min-height: var(--space-6);
      padding: 0;
      border: none;
      border-radius: var(--radius-sm);
      background: none;
      color: var(--color-gray-400);
      font: inherit;
      cursor: pointer;

      &:hover,
      &:focus-visible {
        background-color: var(--color-gray-700);
      }
    }

    .character-cards__image {
      height: var(--space-6);
      aspect-ratio: var(--card-aspect-ratio);
      border-radius: var(--radius-sm);
      object-fit: cover;
    }

    .character-cards__inventory {
      padding: 0 var(--space-1);
      white-space: nowrap;
    }
  `,
})
export class CharacterCards {
  private readonly cardManager: CardManagerService = inject(CardManagerService);
  private readonly viewer: CardViewerService = inject(CardViewerService);

  readonly character: InputSignal<CharacterInfo> = input.required<CharacterInfo>();

  protected readonly equipped: Signal<AssignedCard[]> = computed(() =>
    cardsOf(this.cardManager.assigned(), this.character().id).sort(
      (a, b) => EQUIPMENT_SLOTS.indexOf(a.slot) - EQUIPMENT_SLOTS.indexOf(b.slot),
    ),
  );

  protected readonly inventory: Signal<InventoryCard[]> = computed(() =>
    this.cardManager.inventory().filter((entry) => entry.characterId === this.character().id),
  );

  protected view(entry: AssignedCard | InventoryCard): void {
    this.viewer.open(toCardRef(entry));
  }
}
