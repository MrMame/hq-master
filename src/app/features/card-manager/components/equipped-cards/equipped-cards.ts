import { Component, computed, inject, Signal } from '@angular/core';
import { AssignedCard, DeckInstance } from '../../../../core/models/deck-state.model';
import { CardManagerService } from '../../../../core/services/card-deck/card-manager.service';
import { toCardRef } from '../../../../core/services/card-deck/deck-state.util';
import { CardAssignmentService } from '../../../../shared/services/card-assignment.service';
import { CardViewerService } from '../../../../shared/services/card-viewer.service';
import { CardDisplay } from '../../../../shared/components/card-display/card-display';

/**
 * Inhalt des gemeinsamen Bereichs „Ausgerüstet“ aller Decks über dem Spieltisch (Überschrift und Ausblenden
 * übernimmt die Seite): Besitzer und Herkunftsdeck je Karte,
 * höchstens zwei Reihen sichtbar, weitere scrollen in sich. Ein Klick öffnet die Karte im Card Viewer.
 */
@Component({
  selector: 'app-equipped-cards',
  imports: [CardDisplay],
  template: `
    <div class="card-strip__cards">
      @for (entry of assigned(); track entry.deckId + '/' + entry.card.id) {
        @let deck = decksById().get(entry.deckId);
        <app-card-display
          class="card-strip__card"
          [card]="entry.card"
          [owner]="ownerNames().get(entry.characterId) ?? null"
          [origin]="deck?.name ?? null"
          (cardClick)="view(entry)"
        />
      }
    </div>
  `,
  styles: `
    :host {
      display: block;
    }

    /* Zwei Zeilen unter jeder Karte: Besitzer und Herkunftsdeck. */
    .card-strip__cards {
      --card-strip-caption-height: 2rem;
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
