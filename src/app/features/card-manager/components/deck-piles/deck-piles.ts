import { Component, inject, input, InputSignal } from '@angular/core';
import { DeckInstance } from '../../../../core/models/deck-state.model';
import { CardDisplay } from '../../../../shared/components/card-display/card-display';
import { CardViewerService } from '../../../../shared/services/card-viewer.service';

/**
 * Aufgeklappte Deck-Reihe: Nachziehstapel, Ablagestapel und Bank mit allen Karten. Ein Klick auf eine Karte
 * öffnet sie im Card Viewer; alle Bewegungen laufen über dessen Menü.
 */
@Component({
  selector: 'app-deck-piles',
  imports: [CardDisplay],
  templateUrl: './deck-piles.html',
  styleUrl: './deck-piles.css',
})
export class DeckPiles {
  private readonly cardViewer: CardViewerService = inject(CardViewerService);

  readonly deck: InputSignal<DeckInstance> = input.required<DeckInstance>();

  protected view(cardId: string): void {
    this.cardViewer.open({ deckId: this.deck().id, cardId });
  }
}
