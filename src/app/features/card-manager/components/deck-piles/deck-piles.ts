import { Component, computed, inject, input, InputSignal, Signal } from '@angular/core';
import { ActiveCard, CardRef, DeckInstance } from '../../../../core/models/deck-state.model';
import { CardLocation } from '../../../../core/models/card-location.model';
import { CardManagerService } from '../../../../core/services/card-deck/card-manager.service';
import { toCardRef } from '../../../../core/services/card-deck/deck-state.util';
import { CardDisplay } from '../../../../shared/components/card-display/card-display';

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

  /** Die aktive Karte, wenn sie aus diesem Deck stammt; sonst `null`. */
  private readonly activeHere: Signal<CardRef | null> = computed(() => {
    const active: ActiveCard | null = this.activeCard();
    return active?.deckId === this.deck().id ? toCardRef(active) : null;
  });

  protected onDrawPileCardClick(cardId: string): void {
    this.moveActiveOrActivate({ kind: 'drawPile' }, cardId);
  }

  protected onDiscardPileClick(): void {
    this.moveActiveOrActivate({ kind: 'discardPile' });
  }

  protected onDiscardPileCardClick(cardId: string): void {
    this.moveActiveOrActivate({ kind: 'discardPile' }, cardId);
  }

  protected onBankClick(): void {
    this.moveActiveOrActivate({ kind: 'bank' });
  }

  protected onBankCardClick(cardId: string): void {
    if (!this.activeHere()) this.activate(cardId);
  }

  /** Aktive Karte dieses Decks → `target`; sonst wird die geklickte Karte (falls vorhanden) aktiv. */
  private moveActiveOrActivate(target: CardLocation, cardId?: string): void {
    const active: CardRef | null = this.activeHere();
    if (active) this.cardManager.moveCard(active, target);
    else if (cardId) this.activate(cardId);
  }

  private activate(cardId: string): void {
    this.cardManager.moveCard({ deckId: this.deck().id, cardId }, { kind: 'active' });
  }
}
