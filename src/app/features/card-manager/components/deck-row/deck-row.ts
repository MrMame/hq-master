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
import { ActiveCard, DeckInstance } from '../../../../core/models/deck-state.model';
import { CardManagerService } from '../../../../core/services/card-deck/card-manager.service';
import { DeckMenu } from '../deck-menu/deck-menu';
import { DeckPiles } from '../deck-piles/deck-piles';

/**
 * Ein Deck auf dem Tisch als kompakte Reihe: Name, Nachziehstapel (Klick zieht), oberste Karte der Ablage,
 * Bank-Anzahl und Menü ⋮. Ein Klick auf die Reihe klappt Stapel und Bank auf.
 */
@Component({
  selector: 'app-deck-row',
  imports: [DeckMenu, DeckPiles],
  templateUrl: './deck-row.html',
  styleUrl: './deck-row.css',
})
export class DeckRow {
  private readonly cardManager: CardManagerService = inject(CardManagerService);

  readonly deck: InputSignal<DeckInstance> = input.required<DeckInstance>();
  readonly expanded: InputSignal<boolean> = input<boolean>(false);
  readonly activeCard: InputSignal<ActiveCard | null> = input<ActiveCard | null>(null);
  readonly first: InputSignal<boolean> = input<boolean>(false);
  readonly last: InputSignal<boolean> = input<boolean>(false);
  /** Reihe auf- bzw. zuklappen. */
  readonly toggled: OutputEmitterRef<void> = output<void>();

  protected readonly topDiscard: Signal<Card | null> = computed(
    () => this.deck().discardPile.at(-1) ?? null,
  );

  protected draw(): void {
    this.cardManager.draw(this.deck().id);
  }
}
