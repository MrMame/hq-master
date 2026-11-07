import {
  afterNextRender,
  Component,
  inject,
  Injector,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { CardManagerService } from '../../../../core/services/card-deck/card-manager.service';
import { DeckInstance } from '../../../../core/models/deck-state.model';
import { AddDeckForm } from '../add-deck-form/add-deck-form';
import { DeckList } from '../deck-list/deck-list';
import { DeckRow } from '../deck-row/deck-row';
import { DmHand } from '../dm-hand/dm-hand';
import { EquippedCards } from '../equipped-cards/equipped-cards';
import { CollapsibleSidebar } from '../../../../shared/components/collapsible-sidebar/collapsible-sidebar';
import { SidebarSection } from '../../../../shared/components/sidebar-section/sidebar-section';
import { SidebarSectionToggleAll } from '../../../../shared/components/sidebar-section-toggle-all/sidebar-section-toggle-all';

/**
 * Spieltisch mit beliebig vielen Decks als kompakte Reihen (höchstens eine aufgeklappt), darüber die Hand des
 * Dungeon Masters und der gemeinsame Bereich „Ausgerüstet“. Karten zeigt der app-weite Card Viewer. Welche
 * Reihe offen ist, ist UI-Zustand ohne Speicherung.
 */
@Component({
  selector: 'app-card-manager-page',
  imports: [
    AddDeckForm,
    DeckList,
    DeckRow,
    DmHand,
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
  private readonly injector: Injector = inject(Injector);

  readonly decks: Signal<DeckInstance[]> = this.cardManagerService.decks;

  private readonly _expandedDeckId: WritableSignal<string | null> = signal<string | null>(null);
  readonly expandedDeckId: Signal<string | null> = this._expandedDeckId.asReadonly();

  /** Klappt die Reihe auf bzw. zu; eine andere offene Reihe klappt dabei zu. */
  onToggle(deckId: string): void {
    this._expandedDeckId.update((current) => (current === deckId ? null : deckId));
  }

  /** Aus der Seitenleiste: Die Reihe klappt auf und wird nach dem Rendern ins Bild gescrollt; Karten bleiben. */
  onReveal(deckId: string): void {
    this._expandedDeckId.set(deckId);
    afterNextRender(
      () =>
        document
          .getElementById(`deck-row-${deckId}`)
          ?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
      { injector: this.injector },
    );
  }
}
