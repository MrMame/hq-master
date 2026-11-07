import {
  afterNextRender,
  Component,
  computed,
  inject,
  Injector,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { CardManagerService } from '../../../../core/services/card-deck/card-manager.service';
import { findDeck, toCardRef } from '../../../../core/services/card-deck/deck-state.util';
import { CardAssignmentService } from '../../services/card-assignment.service';
import { ActiveCard, DeckInstance } from '../../../../core/models/deck-state.model';
import { ActiveCardOverlay } from '../active-card-overlay/active-card-overlay';
import { AddDeckForm } from '../add-deck-form/add-deck-form';
import { DeckList } from '../deck-list/deck-list';
import { DeckRow } from '../deck-row/deck-row';
import { EquippedCards } from '../equipped-cards/equipped-cards';
import { CollapsibleSidebar } from '../../../../shared/components/collapsible-sidebar/collapsible-sidebar';
import { SidebarSection } from '../../../../shared/components/sidebar-section/sidebar-section';
import { SidebarSectionToggleAll } from '../../../../shared/components/sidebar-section-toggle-all/sidebar-section-toggle-all';

/**
 * Spieltisch mit beliebig vielen Decks als kompakte Reihen (höchstens eine aufgeklappt), der einen aktiven
 * Karte und dem gemeinsamen Bereich „Ausgerüstet“. Welche Reihe offen ist, ist UI-Zustand ohne Speicherung.
 */
@Component({
  selector: 'app-card-manager-page',
  imports: [
    ActiveCardOverlay,
    AddDeckForm,
    DeckList,
    DeckRow,
    EquippedCards,
    CollapsibleSidebar,
    SidebarSection,
    SidebarSectionToggleAll,
  ],
  templateUrl: './card-manager-page.html',
  styleUrl: './card-manager-page.css',
})
export class CardManagerPage {
  private readonly cardManagerService: CardManagerService = inject(CardManagerService);
  private readonly cardAssignment: CardAssignmentService = inject(CardAssignmentService);
  private readonly injector: Injector = inject(Injector);

  readonly decks: Signal<DeckInstance[]> = this.cardManagerService.decks;
  readonly activeCard: Signal<ActiveCard | null> = computed(
    () => this.cardManagerService.state().activeCard,
  );
  /** Deck der aktiven Karte (Rückseite und Name im Overlay). */
  readonly activeDeck: Signal<DeckInstance | null> = computed(() => {
    const active: ActiveCard | null = this.activeCard();
    return active ? (findDeck(this.cardManagerService.state(), active.deckId) ?? null) : null;
  });
  readonly assignDisabledReason: Signal<string | null> = this.cardAssignment.assignDisabledReason;

  private readonly _expandedDeckId: WritableSignal<string | null> = signal<string | null>(null);
  readonly expandedDeckId: Signal<string | null> = this._expandedDeckId.asReadonly();

  /** Klappt die Reihe auf bzw. zu; eine andere offene Reihe klappt dabei zu. */
  onToggle(deckId: string): void {
    this._expandedDeckId.update((current) => (current === deckId ? null : deckId));
  }

  /**
   * Aus der Seitenleiste: Eine aktive Karte eines anderen Decks kommt in den Ablagestapel ihres Decks, dann
   * klappt die Reihe auf und wird nach dem Rendern ins Bild gescrollt.
   */
  onReveal(deckId: string): void {
    const active: ActiveCard | null = this.activeCard();
    if (active && active.deckId !== deckId) this.cardManagerService.discardActiveCard();
    this._expandedDeckId.set(deckId);
    afterNextRender(
      () =>
        document
          .getElementById(`deck-row-${deckId}`)
          ?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
      { injector: this.injector },
    );
  }

  onAssignClick(): void {
    const active: ActiveCard | null = this.activeCard();
    if (active) this.cardAssignment.assignCard(toCardRef(active));
  }

  onActiveCardClick(): void {
    this.cardManagerService.discardActiveCard();
  }
}
