import { Component, computed, inject, Signal } from '@angular/core';
import { DeckInstance, HandCard } from '../../../../core/models/deck-state.model';
import { CardManagerService } from '../../../../core/services/card-deck/card-manager.service';
import { toCardRef } from '../../../../core/services/card-deck/deck-state.util';
import { CardViewerService } from '../../../../shared/services/card-viewer.service';
import { CardDisplay } from '../../../../shared/components/card-display/card-display';

/**
 * Inhalt des Bereichs „Hand des Dungeon Masters“ ganz oben im Card Manager (Überschrift und Ausblenden ohne
 * Karten übernimmt die Seite): alle Handkarten mit ihrem Deck, höchstens zwei Reihen sichtbar. Ein Klick öffnet die Karte im Card Viewer; weitere Bedienelemente gibt es nicht.
 */
@Component({
  selector: 'app-dm-hand',
  imports: [CardDisplay],
  template: `
    <div class="card-strip__cards">
      @for (entry of hand(); track entry.deckId + '/' + entry.card.id) {
        @let deck = decksById().get(entry.deckId);
        <app-card-display
          class="card-strip__card"
          data-testid="hand-card"
          [card]="entry.card"
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
