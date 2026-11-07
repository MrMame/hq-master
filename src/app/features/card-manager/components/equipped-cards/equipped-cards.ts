import { Component, computed, inject, Signal } from '@angular/core';
import { AssignedCard, DeckInstance } from '../../../../core/models/deck-state.model';
import { CardManagerService } from '../../../../core/services/card-deck/card-manager.service';
import { toCardRef } from '../../../../core/services/card-deck/deck-state.util';
import { CardAssignmentService } from '../../../../shared/services/card-assignment.service';
import { CardViewerService } from '../../../../shared/services/card-viewer.service';
import { CardDisplay } from '../../../../shared/components/card-display/card-display';

/**
 * Gemeinsamer Bereich „Ausgerüstet“ aller Decks über dem Spieltisch: Besitzer und Herkunftsdeck je Karte,
 * höchstens zwei Reihen sichtbar, weitere scrollen in sich. Ein Klick öffnet die Karte im Card Viewer.
 */
@Component({
  selector: 'app-equipped-cards',
  imports: [CardDisplay],
  // Ohne Karten nimmt der Bereich auch keinen Abstand in der Spalte ein.
  host: { '[class.equipped--empty]': 'assigned().length === 0' },
  template: `
    @if (assigned().length > 0) {
      <section class="card-strip" aria-label="Ausgerüstet">
        <h2 class="section-heading">Ausgerüstet ({{ assigned().length }})</h2>
        <div class="card-strip__cards">
          @for (entry of assigned(); track entry.deckId + '/' + entry.card.id) {
            @let deck = decksById().get(entry.deckId);
            <app-card-display
              class="card-strip__card"
              [card]="entry.card"
              [backImagePath]="deck?.config?.backImagePath ?? ''"
              [owner]="ownerNames().get(entry.characterId) ?? null"
              [origin]="deck?.name ?? null"
              (cardClick)="view(entry)"
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
  `,
})
export class EquippedCards {
  private readonly cardManager: CardManagerService = inject(CardManagerService);
  private readonly cardViewer: CardViewerService = inject(CardViewerService);
  protected readonly assigned: Signal<AssignedCard[]> = this.cardManager.assigned;
  protected readonly ownerNames: Signal<ReadonlyMap<string, string>> =
    inject(CardAssignmentService).ownerNames;
  protected readonly decksById: Signal<ReadonlyMap<string, DeckInstance>> = computed(
    () => new Map(this.cardManager.decks().map((deck) => [deck.id, deck])),
  );

  protected view(entry: AssignedCard): void {
    this.cardViewer.open(toCardRef(entry));
  }
}
