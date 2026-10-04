import { Component, model, inject, OnDestroy, ModelSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { toObservable } from '@angular/core/rxjs-interop';
import { debounceTime, skip, Subscription } from 'rxjs';
import { CharacterInfo } from '../../models/CharacterInfo';
import { CharactersDbService } from '../../../../core/services/persistent/characters-database-service';

@Component({
  selector: 'app-character-card',
  standalone: true,
  imports: [FormsModule],
  template: `
  <div class="bg-yellow-500 shadow-md rounded-lg p-0.5 h-[30vh] overflow-scroll text-xs">

    @if (characterInfo(); as info) {
      <div class="flex mb-1">
        <img [src]="info.image" alt="Monster Image" class="w-[30%] h-auto object-cover mb-2 rounded">
        <div class="flex-col ml-3">
            <span class="text-gray-600">Type: {{ info.type }}</span>
        </div>
      </div>

      <div class="ml-3">
        <div class="flex">
          <span class="basis-1/3 text-gray-600">Health:</span>
          <input type="number" [ngModel]="info.health" (ngModelChange)="updateField('health', $event)" class="border p-1 rounded w-20 mb-0.5">
        </div>

        <div class="flex">
          <span class="basis-1/3 text-gray-600">Defense:</span>
          <input type="number" [ngModel]="info.defense" (ngModelChange)="updateField('defense', $event)" class="border p-1 rounded w-20 mb-0.5">
        </div>

        <div class="flex">
          <span class="basis-1/3 text-gray-600">Speed:</span>
          <input type="number" [ngModel]="info.speed" (ngModelChange)="updateField('speed', $event)" class="border p-1 rounded w-20 mb-0.5">
        </div>

        <div class="flex">
          <span class="basis-1/3 text-gray-600">Attack:</span>
          <input type="number" [ngModel]="info.attack" (ngModelChange)="updateField('attack', $event)" class="border p-1 rounded w-20 mb-0.5">
        </div>
      </div>

      <div class="flex-col m-3">
        <h3 class="text-gray-600">Abilities:</h3>
        <span class="basis-1/3 text-gray-600">{{ info.abilities.join(', ') }}</span>
      </div>
      <div class="flex-col m-3">
        <p class="basis-2/3 text-gray-700 mb-4">{{ info.description }}</p>
      </div>
    }

    <br>
    <button class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Details</button>
  </div>
  `
})
export class CharacterCard implements OnDestroy {
  private charactersDbService: CharactersDbService = inject(CharactersDbService);

  public characterInfo: ModelSignal<CharacterInfo | undefined> = model<CharacterInfo>();

  private readonly subscription: Subscription;

  constructor() {
    // skip(1) verhindert einen Schreibvorgang beim ersten Initialisieren des Signals
    this.subscription = toObservable(this.characterInfo)
      .pipe(skip(1), debounceTime(300))
      .subscribe(info => {
        if (info) {
          this.charactersDbService.writeCharacter(info);
        }
      });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  updateField(key: keyof CharacterInfo, value: number):void {
    this.characterInfo.update(current => {
      if (!current) return current;
      return { ...current, [key]: value };
    });
  }
}
