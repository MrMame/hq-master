import { Component, inject, Signal, signal, WritableSignal } from '@angular/core';
import { CardManagerService } from '../../services/card-manager.service';
import { DeckState } from '../../models/deck-state.model';
import { CardDisplay } from '../card-display/card-display';
import { CollapsibleSidebar } from '../../../../shared/components/collapsible-sidebar/collapsible-sidebar';
import { SidebarSection } from '../../../../shared/components/sidebar-section/sidebar-section';
import { SidebarSectionToggleAll } from '../../../../shared/components/sidebar-section-toggle-all/sidebar-section-toggle-all';

@Component({
  selector: 'app-card-manager-page',
  imports: [CardDisplay, CollapsibleSidebar, SidebarSection, SidebarSectionToggleAll],
  templateUrl: './card-manager-page.html',
  styleUrl: './card-manager-page.css',
})
export class CardManagerPage {
  private readonly cardManagerService: CardManagerService = inject(CardManagerService);

  readonly state: Signal<DeckState | null> = this.cardManagerService.state;

  private readonly _isLoading: WritableSignal<boolean> = signal(false);
  readonly isLoading: Signal<boolean> = this._isLoading.asReadonly();

  private readonly _loadError: WritableSignal<string | null> = signal<string | null>(null);
  readonly loadError: Signal<string | null> = this._loadError.asReadonly();

  async onLoadDeck(url: string): Promise<void> {
    const trimmed: string = url.trim();
    if (!trimmed) return;
    this._isLoading.set(true);
    this._loadError.set(null);
    try {
      await this.cardManagerService.loadDeck(trimmed);
    } catch (err) {
      this._loadError.set(err instanceof Error ? err.message : 'Deck konnte nicht geladen werden.');
    } finally {
      this._isLoading.set(false);
    }
  }

  onDiscardPileClick(): void {
    if (this.cardManagerService.state()!.activeCard !== null) {
      this.cardManagerService.discardActiveCard();
    }
  }
  onDrawPileCardClick(cardId: string): void {
    if (this.cardManagerService.state()!.activeCard === null) {
      this.cardManagerService.makeCardActive(cardId);
    } else {
      this.cardManagerService.shuffleActiveCardIntoDrawPile();
    }
  }
  onDiscardPileCardClick(cardId: string): void {
    if (this.cardManagerService.state()!.activeCard === null) {
      this.cardManagerService.makeCardActive(cardId);
    } else {
      this.cardManagerService.discardActiveCard();
    }
  }
  onActiveCardClick(): void {
    this.cardManagerService.discardActiveCard();
  }
  onDrawPileZoneClick(): void {
    this.cardManagerService.reshuffleAll();
  }
  onLoadDeckClick(): void {
    // const url: string = prompt('Deck URL eingeben:') ?? '/decks/default/default-deck.xml';
    const url: string = '/decks/default/default-deck.xml';
    this.onLoadDeck(url);
  }
  onShuffleClick(): void {
    this.cardManagerService.shuffle();
  }
  onResetClick(): void {
    this.cardManagerService.reshuffleAll();
  }
  onBankCardClick(cardId: string): void {
    if (this.cardManagerService.state()!.activeCard === null) {
      this.cardManagerService.makeCardActive(cardId);
    }
  }
  onBankContainerClick(): void {
    if (this.cardManagerService.state()!.activeCard !== null) {
      this.cardManagerService.dropActiveCardIntoBank();
    }
  }
}
