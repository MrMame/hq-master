import { Component, computed, inject, Signal } from '@angular/core';
import { AssignedCard, DeckInstance } from '../../../../core/models/deck-state.model';
import { CardManagerService } from '../../../../core/services/card-deck/card-manager.service';
import { CardAssignmentService } from '../../services/card-assignment.service';
import { CardDisplay } from '../card-display/card-display';

/**
 * Gemeinsamer Bereich „Ausgerüstet“ aller Decks über dem Spieltisch: Besitzer und Herkunftsdeck je Karte,
 * höchstens zwei Reihen sichtbar, weitere scrollen in sich.
 */
@Component({
  selector: 'app-equipped-cards',
  imports: [CardDisplay],
  // Ohne Karten nimmt der Bereich auch keinen Abstand in der Spalte ein.
  host: { '[class.equipped--empty]': 'assigned().length === 0' },
  template: `
    @if (assigned().length > 0) {
      <section class="equipped" aria-label="Ausgerüstet">
        <h2 class="section-heading">Ausgerüstet ({{ assigned().length }})</h2>
        <div class="equipped__cards">
          @for (entry of assigned(); track entry.deckId + '/' + entry.card.id) {
            @let deck = decksById().get(entry.deckId);
            <app-card-display
              class="equipped__card"
              [card]="entry.card"
              [backImagePath]="deck?.config?.backImagePath ?? ''"
              [owner]="ownerNames().get(entry.characterId) ?? null"
              [origin]="deck?.name ?? null"
            />
          }
        </div>
      </section>
    }
  `,
  styles: `
    /* Behält in der Spalte des Spieltischs seine Höhe. */
    :host {
      display: block;
      flex-shrink: 0;
    }

    :host(.equipped--empty) {
      display: none;
    }

    .equipped {
      display: flex;
      flex-direction: column;
      gap: var(--space-2);
    }

    /* Karten brechen in Reihen um; höchstens zwei sind sichtbar, weitere scrollen senkrecht in sich. */
    .equipped__cards {
      --equipped-card-height: 12rem;
      display: flex;
      flex-wrap: wrap;
      align-content: flex-start;
      gap: var(--space-2);
      max-height: calc(2 * var(--equipped-card-height) + var(--space-2));
      overflow-x: hidden;
      overflow-y: auto;
    }

    .equipped__card {
      height: var(--equipped-card-height);
      width: auto;
      flex-shrink: 0;
    }

    @media (max-width: 600px) {
      .equipped__cards {
        --equipped-card-height: 8rem;
      }
    }
  `,
})
export class EquippedCards {
  private readonly cardManager: CardManagerService = inject(CardManagerService);
  protected readonly assigned: Signal<AssignedCard[]> = this.cardManager.assigned;
  protected readonly ownerNames: Signal<ReadonlyMap<string, string>> =
    inject(CardAssignmentService).ownerNames;
  protected readonly decksById: Signal<ReadonlyMap<string, DeckInstance>> = computed(
    () => new Map(this.cardManager.decks().map((deck) => [deck.id, deck])),
  );
}
