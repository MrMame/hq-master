import {
  Component,
  computed,
  inject,
  input,
  InputSignal,
  output,
  OutputEmitterRef,
  Signal,
} from '@angular/core';
import { Card } from '../../../../core/models/card.model';
import { DeckInstance } from '../../../../core/models/deck-state.model';
import { CardManagerService } from '../../../../core/services/card-deck/card-manager.service';
import { CardViewerService } from '../../../../shared/services/card-viewer.service';
import { CardDisplay } from '../../../../shared/components/card-display/card-display';
import { DeckMenu } from '../deck-menu/deck-menu';
import { DeckPiles } from '../deck-piles/deck-piles';

/**
 * Ein Deck auf dem Tisch als kompakte Reihe: Name, Nachziehstapel (Klick zieht in die Hand und zeigt die Karte
 * im Card Viewer), oberste Karte der Ablage (Klick zeigt sie im Viewer), Bank-Anzahl und Menü ⋮. Ein Klick auf
 * die Reihe klappt Stapel und Bank auf.
 */
@Component({
  selector: 'app-deck-row',
  imports: [CardDisplay, DeckMenu, DeckPiles],
  templateUrl: './deck-row.html',
  styleUrl: './deck-row.css',
})
export class DeckRow {
  private readonly cardManager: CardManagerService = inject(CardManagerService);
  private readonly cardViewer: CardViewerService = inject(CardViewerService);

  readonly deck: InputSignal<DeckInstance> = input.required<DeckInstance>();
  readonly expanded: InputSignal<boolean> = input<boolean>(false);
  readonly first: InputSignal<boolean> = input<boolean>(false);
  readonly last: InputSignal<boolean> = input<boolean>(false);
  /** Reihe auf- bzw. zuklappen. */
  readonly toggled: OutputEmitterRef<void> = output<void>();

  protected readonly topDiscard: Signal<Card | null> = computed(
    () => this.deck().discardPile.at(-1) ?? null,
  );

  protected draw(): void {
    const { id: deckId, drawPile } = this.deck();
    const top: Card | undefined = drawPile[0];
    if (!top) return;
    this.cardManager.draw(deckId);
    this.cardViewer.open({ deckId, cardId: top.id });
  }

  protected viewTopDiscard(): void {
    const top: Card | null = this.topDiscard();
    if (top) this.cardViewer.open({ deckId: this.deck().id, cardId: top.id });
  }
}
