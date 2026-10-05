import { Component, input, InputSignal, output, OutputEmitterRef } from '@angular/core';
import { Card } from '../../models/card.model';

@Component({
  selector: 'app-card-focus-view',
  standalone: true,
  template: `
    <div
      class="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center"
      (click)="closed.emit()"
      (dblclick)="closed.emit()"
    >
      <div
        class="rounded-2xl shadow-2xl overflow-hidden  h-[90vh] w-[90vw] flex flex-col bg-gray-100"
        (click)="$event.stopPropagation()"
        (dblclick)="$event.stopPropagation()"
      >
        <div class="relative h-[33%] bg-gray-300 flex items-center justify-center overflow-hidden">
          <img
            [src]="'/decks/' + card().imagePath"
            [alt]="card().name"
            class="w-full h-full object-contain"
            onerror="this.style.display='none'"
          >
          <button
            class="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/50 hover:bg-black/70 text-white text-xs flex items-center justify-center transition-colors"
            (click)="closed.emit()"
          >✕</button>
        </div>
        <div class="p-5 bg-gray-50 flex flex-col gap-3">
          <h2 class="text-lg font-bold text-gray-900 leading-tight">{{ card().name }}</h2>
          <p class="text-sm text-gray-700 leading-relaxed">{{ card().description }}</p>
        </div>
      </div>
    </div>
  `,
})
export class CardFocusView {
  card: InputSignal<Card> = input.required<Card>();
  backImagePath: InputSignal<string> = input.required<string>();
  closed: OutputEmitterRef<void> = output<void>();
}
