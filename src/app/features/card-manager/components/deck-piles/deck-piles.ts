import { Component, computed, inject, input, InputSignal, Signal } from '@angular/core';
import { ActiveCard, DeckInstance } from '../../../../core/models/deck-state.model';
import { CardManagerService } from '../../../../core/services/card-deck/card-manager.service';
import { CardDisplay } from '../card-display/card-display';

/**
 * Aufgeklappte Deck-Reihe: Nachziehstapel, Ablagestapel und Bank mit allen Karten.
 * Ist die aktive Karte aus diesem Deck, gehen Klicks wie gewohnt mit ihr um (zurückmischen, ablegen, in
 * die Bank). Sonst macht ein Klick die Karte aktiv; eine fremde aktive Karte kommt dabei in den
 * Ablagestapel ihres eigenen Decks.
 */
@Component({
  selector: 'app-deck-piles',
  imports: [CardDisplay],
  templateUrl: './deck-piles.html',
  styleUrl: './deck-piles.css',
})
export class DeckPiles {
  private readonly cardManager: CardManagerService = inject(CardManagerService);

  readonly deck: InputSignal<DeckInstance> = input.required<DeckInstance>();
  readonly activeCard: InputSignal<ActiveCard | null> = input<ActiveCard | null>(null);

  /** Die aktive Karte stammt aus diesem Deck. */
  protected readonly activeHere: Signal<boolean> = computed(
    () => this.activeCard()?.deckId === this.deck().id,
  );

  protected onDrawPileCardClick(cardId: string): void {
    if (this.activeHere()) this.cardManager.shuffleActiveCardIntoDrawPile();
    else this.activate(cardId);
  }

  protected onDiscardPileClick(): void {
    if (this.activeHere()) this.cardManager.discardActiveCard();
  }

  protected onDiscardPileCardClick(cardId: string): void {
    if (this.activeHere()) this.cardManager.discardActiveCard();
    else this.activate(cardId);
  }

  protected onBankClick(): void {
    if (this.activeHere()) this.cardManager.dropActiveCardIntoBank();
  }

  protected onBankCardClick(cardId: string): void {
    if (!this.activeHere()) this.activate(cardId);
  }

  private activate(cardId: string): void {
    this.cardManager.makeCardActive(this.deck().id, cardId);
  }
}
