import { Component, inject, input, InputSignal } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { DeckInstance } from '../../../../core/models/deck-state.model';
import { CardManagerService } from '../../../../core/services/card-deck/card-manager.service';
import { DeckActionsService } from '../../services/deck-actions.service';

/** Menü ⋮ einer Deck-Reihe: Aktionen wirken nur auf dieses Deck. */
@Component({
  selector: 'app-deck-menu',
  imports: [MatMenuModule],
  template: `
    <button
      type="button"
      class="deck-menu__trigger"
      [attr.aria-label]="'Aktionen für ' + deck().name"
      [matMenuTriggerFor]="menu"
      (click)="$event.stopPropagation()"
    >
      ⋮
    </button>
    <mat-menu #menu="matMenu">
      <button mat-menu-item (click)="cardManager.shuffle(deck().id)">Mischen</button>
      <button mat-menu-item (click)="cardManager.resetDeck(deck().id)">Zurücksetzen</button>
      <button mat-menu-item (click)="actions.rename(deck())">Umbenennen</button>
      <button mat-menu-item [disabled]="first()" (click)="cardManager.moveDeck(deck().id, -1)">
        Nach oben
      </button>
      <button mat-menu-item [disabled]="last()" (click)="cardManager.moveDeck(deck().id, 1)">
        Nach unten
      </button>
      <button mat-menu-item (click)="actions.remove(deck())">Entfernen</button>
    </mat-menu>
  `,
  styles: `
    .deck-menu__trigger {
      width: var(--space-10);
      height: var(--space-10);
      border-radius: var(--radius-sm);
      color: var(--color-gray-400);
      font-size: var(--text-lg);
      line-height: var(--text-lg--line-height);
      cursor: pointer;

      &:hover {
        background-color: var(--color-gray-700);
        color: var(--color-white);
      }
    }
  `,
})
export class DeckMenu {
  protected readonly cardManager: CardManagerService = inject(CardManagerService);
  protected readonly actions: DeckActionsService = inject(DeckActionsService);

  readonly deck: InputSignal<DeckInstance> = input.required<DeckInstance>();
  /** Erstes bzw. letztes Deck auf dem Tisch: kann nicht weiter nach oben bzw. unten. */
  readonly first: InputSignal<boolean> = input<boolean>(false);
  readonly last: InputSignal<boolean> = input<boolean>(false);
}
