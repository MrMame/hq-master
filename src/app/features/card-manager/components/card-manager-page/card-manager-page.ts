import { Component, inject, Signal } from '@angular/core';
import { CardManagerService } from '../../services/card-manager.service';
import { DeckState } from '../../models/deck-state.model';

@Component({
  selector: 'app-card-manager-page',
  imports: [],
  templateUrl: './card-manager-page.html',
  styleUrl: './card-manager-page.scss',
})
export class CardManagerPage {
  private readonly cardManagerService: CardManagerService = inject(CardManagerService);

  readonly state: Signal<DeckState | null> = this.cardManagerService.state;
}
