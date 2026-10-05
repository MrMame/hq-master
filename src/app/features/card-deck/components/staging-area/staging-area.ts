import { Component, computed, inject, input, InputSignal, output, OutputEmitterRef, Signal } from '@angular/core';
import { CdkDrag, CdkDropList, CdkDragDrop } from '@angular/cdk/drag-drop';
import { Card } from '../../models/card.model';
import { STAGING_SLOT_COUNT, StagingSlot } from '../../models/card-deck-state.model';
import { CardDeckService } from '../../services/card-deck';
import { PlayingCard } from '../playing-card/playing-card';

@Component({
  selector: 'app-staging-area',
  standalone: true,
  imports: [CdkDrag, CdkDropList, PlayingCard],
  templateUrl: './staging-area.html',
  styleUrl: './staging-area.scss',
})
export class StagingArea {
  slots: InputSignal<StagingSlot[]> = input.required<StagingSlot[]>();
  backImagePath: InputSignal<string> = input.required<string>();
  drawListId: InputSignal<string> = input.required<string>();
  discardListId: InputSignal<string> = input.required<string>();

  cardDoubleClicked: OutputEmitterRef<Card> = output<Card>();

  private readonly service: CardDeckService = inject(CardDeckService);

  readonly allConnectedIds: Signal<string[]> = computed(() => {
    const stagingIds: string[] = Array.from(
      { length: STAGING_SLOT_COUNT },
      (_: unknown, i: number) => `staging-${i}`
    );
    return [this.discardListId(), this.drawListId(), ...stagingIds];
  });

  onSlotDrop(event: CdkDragDrop<unknown>, slotIndex: number): void {
    const sourceId: string = event.previousContainer.id;

    if (sourceId === this.discardListId()) {
      if (this.slots()[slotIndex] !== null) return;
      const card: Card = event.item.data as Card;
      this.service.moveFromDiscardToStaging(card, slotIndex);
    } else if (sourceId.startsWith('staging-')) {
      const fromSlot: number = parseInt(sourceId.replace('staging-', ''), 10);
      this.service.moveInStaging(fromSlot, slotIndex);
    }
  }

  onCardDblClick(card: Card): void {
    this.cardDoubleClicked.emit(card);
  }

  isOccupied(slot: StagingSlot): slot is Card {
    return slot !== null;
  }
}
