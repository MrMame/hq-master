import { Component, computed, inject, input, InputSignal, Signal } from '@angular/core';
import { Card } from '../../../../core/models/card.model';
import { DeckInstance } from '../../../../core/models/deck-state.model';
import { CardDisplay } from '../../../../shared/components/card-display/card-display';
import { CardViewerService } from '../../../../shared/services/card-viewer.service';

/**
 * Aufgeklappte Deck-Reihe: Nachziehstapel, Ablagestapel und Bank mit allen Karten. Ein Klick auf eine Karte
 * öffnet sie im Card Viewer; alle Bewegungen laufen über dessen Menü. Der Nachziehstapel zeigt oben die Rückseite
 * der Karte, die als nächste gezogen wird.
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

  /** Nachziehstapel von unten nach oben: Die oberste (zuletzt gezeichnete) Karte wird als nächste gezogen. */
  protected readonly drawStack: Signal<Card[]> = computed(() =>
    [...this.deck().drawPile].reverse(),
  );

  protected view(cardId: string): void {
    this.cardViewer.open({ deckId: this.deck().id, cardId });
  }
}
