import { Component, input, InputSignal } from '@angular/core';
import { Card } from '../../models/card.model';

@Component({
  selector: 'app-playing-card',
  standalone: true,
  template: `
    @if (faceUp()) {
      <div class="w-[120px] h-[168px] rounded-xl border-2 border-gray-500 overflow-hidden flex flex-col shadow-lg bg-gray-100 select-none">
        <div class="h-[100px] bg-gray-200 flex items-center justify-center overflow-hidden shrink-0">
          <img
            [src]="'/decks/' + card().imagePath"
            [alt]="card().name"
            class="w-full h-full object-contain"
            onerror="this.style.display='none'"
          >
        </div>
        <div class="flex-1 p-1.5 bg-gray-100 overflow-hidden">
          <div class="text-xs font-bold text-gray-800 truncate mb-0.5">{{ card().name }}</div>
          <div class="text-[9px] text-gray-600 leading-tight line-clamp-4">{{ card().description }}</div>
        </div>
      </div>
    } @else {
      <div class="w-[120px] h-[168px] rounded-xl border-2 border-yellow-600/50 overflow-hidden shadow-lg select-none bg-gray-800">
        <img
          [src]="'/decks/' + backImagePath()"
          alt="Kartenrückseite"
          class="w-full h-full object-cover"
          onerror="this.style.display='none'"
        >
      </div>
    }
  `,
})
export class PlayingCard {
  card: InputSignal<Card> = input.required<Card>();
  faceUp: InputSignal<boolean> = input.required<boolean>();
  backImagePath: InputSignal<string> = input.required<string>();
}
