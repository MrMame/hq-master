import { Component, computed, inject, Signal } from '@angular/core';
import { DeckInstance, HandCard } from '../../../../core/models/deck-state.model';
import { CardManagerService } from '../../../../core/services/card-deck/card-manager.service';
import { toCardRef } from '../../../../core/services/card-deck/deck-state.util';
import { CardViewerService } from '../../../../shared/services/card-viewer.service';
import { CardDisplay } from '../../../../shared/components/card-display/card-display';

/**
 * Bereich „Hand des Dungeon Masters“ ganz oben im Card Manager: alle Handkarten mit ihrem Deck, höchstens
 * zwei Reihen sichtbar. Ein Klick öffnet die Karte im Card Viewer; weitere Bedienelemente gibt es nicht.
 */
@Component({
  selector: 'app-dm-hand',
  imports: [CardDisplay],
  // Ohne Handkarten nimmt der Bereich auch keinen Abstand in der Spalte ein.
  host: { '[class.dm-hand--empty]': 'hand().length === 0' },
  template: `
    @if (hand().length > 0) {
      <section class="card-strip" aria-label="Hand des Dungeon Masters">
        <h2 class="section-heading">Hand des Dungeon Masters ({{ hand().length }})</h2>
        <div class="card-strip__cards">
          @for (entry of hand(); track entry.deckId + '/' + entry.card.id) {
            @let deck = decksById().get(entry.deckId);
            <app-card-display
              class="card-strip__card"
              data-testid="hand-card"
              [card]="entry.card"
              [backImagePath]="deck?.config?.backImagePath ?? ''"
              [origin]="deck?.name ?? null"
              (cardClick)="view(entry)"
            />
          }
        </div>
      </section>
    }
  `,
  styles: `
    :host {
      display: block;
      flex-shrink: 0;
    }

    :host(.dm-hand--empty) {
      display: none;
    }
  `,
})
export class DmHand {
  private readonly cardManager: CardManagerService = inject(CardManagerService);
  private readonly cardViewer: CardViewerService = inject(CardViewerService);
  protected readonly hand: Signal<HandCard[]> = this.cardManager.hand;
  protected readonly decksById: Signal<ReadonlyMap<string, DeckInstance>> = computed(
    () => new Map(this.cardManager.decks().map((deck) => [deck.id, deck])),
  );

  protected view(entry: HandCard): void {
    this.cardViewer.open(toCardRef(entry));
  }
}
