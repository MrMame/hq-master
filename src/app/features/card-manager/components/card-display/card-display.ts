import {
  Component,
  computed,
  input,
  InputSignal,
  output,
  OutputEmitterRef,
  Signal,
} from '@angular/core';
import { Card, CombatCard } from '../../../../core/models/card.model';
import { CARD_SLOT_LABELS } from '../../../../core/models/equipment.model';
import { modifiersText } from '../../../../core/services/equipment/equipment-text.util';

export type CardSide = 'front' | 'back';

/** Slot und Modifikatoren einer Ausrüstungskarte als Anzeigetext. */
export interface EquipmentInfo {
  slot: string;
  modifiers: string;
}

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
  /** Name des Charakters, dem die Karte zugewiesen ist; `null` = frei. */
  owner: InputSignal<string | null> = input<string | null>(null);
  cardClick: OutputEmitterRef<string> = output<string>();

  showFront: Signal<boolean> = computed(() => this.side() === 'front');

  protected readonly equipment: Signal<EquipmentInfo | null> = computed(() => {
    const card: Card = this.card();
    return card.cardType === 'equipment'
      ? { slot: CARD_SLOT_LABELS[card.slot], modifiers: modifiersText(card.modifiers) }
      : null;
  });

  asCombat(card: Card): CombatCard | null {
    return card.cardType === 'combat' ? (card as CombatCard) : null;
  }
}
