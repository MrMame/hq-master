import {
  Component,
  computed,
  input,
  InputSignal,
  output,
  OutputEmitterRef,
  Signal,
} from '@angular/core';
import { Card, CombatCard } from '../../models/card.model';

export type CardSide = 'front' | 'back';

@Component({
  selector: 'app-card-display',
  imports: [],
  templateUrl: './card-display.html',
  styleUrl: './card-display.css',
})
export class CardDisplay {
  card: InputSignal<Card> = input.required<Card>();
  backImagePath: InputSignal<string> = input.required<string>();
  side: InputSignal<CardSide> = input<CardSide>('front');
  cardClick: OutputEmitterRef<string> = output<string>();

  showFront: Signal<boolean> = computed(() => this.side() === 'front');

  asCombat(card: Card): CombatCard | null {
    return card.cardType === 'combat' ? (card as CombatCard) : null;
  }
}
