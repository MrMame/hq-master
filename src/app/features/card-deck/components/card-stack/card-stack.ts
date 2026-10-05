import { Component, input, InputSignal } from '@angular/core';
import { Card } from '../../models/card.model';
import { PlayingCard } from '../playing-card/playing-card';

@Component({
  selector: 'app-card-stack',
  standalone: true,
  imports: [PlayingCard],
  template: `
    @if (cards().length > 0) {
      <div class="relative" style="width:128px; height:176px">
        @if (cards().length > 2) {
          <div
            class="absolute rounded-xl border border-yellow-600/30 bg-gray-700 shadow"
            style="width:120px; height:168px; top:8px; left:8px; z-index:1"
          ></div>
        }
        @if (cards().length > 1) {
          <div
            class="absolute rounded-xl border border-yellow-600/30 bg-gray-700 shadow"
            style="width:120px; height:168px; top:4px; left:4px; z-index:2"
          ></div>
        }
        <div class="absolute" style="width:120px; height:168px; top:0; left:0; z-index:3">
          <app-playing-card
            [card]="cards()[0]"
            [faceUp]="faceUp()"
            [backImagePath]="backImagePath()"
          ></app-playing-card>
        </div>
      </div>
    } @else {
      <div
        class="w-[120px] h-[168px] rounded-xl border-2 border-dashed border-gray-600 flex items-center justify-center text-gray-500 text-xs text-center p-2 cursor-pointer hover:border-yellow-600/50 transition-colors"
      >
        {{ emptyLabel() }}
      </div>
    }
  `,
})
export class CardStack {
  cards: InputSignal<Card[]> = input.required<Card[]>();
  faceUp: InputSignal<boolean> = input.required<boolean>();
  backImagePath: InputSignal<string> = input.required<string>();
  emptyLabel: InputSignal<string> = input<string>('Leer');
}
