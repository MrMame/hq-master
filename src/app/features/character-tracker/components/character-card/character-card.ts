import { Component, input, InputSignal, output, OutputEmitterRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CharacterInfo } from '../../models/character-info.model';

/** Vollansicht eines Charakters; Änderungen werden nur ausgegeben, gespeichert wird beim Aufrufer. */
@Component({
  selector: 'app-character-card',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="bg-yellow-500 shadow-md rounded-lg p-0.5 h-[30vh] overflow-scroll text-xs">
      @if (character(); as info) {
        <div class="flex mb-1">
          <img
            [src]="info.image"
            alt="Monster Image"
            class="w-[30%] h-auto object-cover mb-2 rounded"
          />
          <div class="flex-col ml-3">
            <span class="text-gray-600">Type: {{ info.type }}</span>
          </div>
        </div>

        <div class="ml-3">
          <div class="flex">
            <span class="basis-1/3 text-gray-600">Health:</span>
            <input
              type="number"
              [ngModel]="info.health"
              (ngModelChange)="updateField('health', $event)"
              class="border p-1 rounded w-20 mb-0.5"
            />
          </div>

          <div class="flex">
            <span class="basis-1/3 text-gray-600">Defense:</span>
            <input
              type="number"
              [ngModel]="info.defense"
              (ngModelChange)="updateField('defense', $event)"
              class="border p-1 rounded w-20 mb-0.5"
            />
          </div>

          <div class="flex">
            <span class="basis-1/3 text-gray-600">Speed:</span>
            <input
              type="number"
              [ngModel]="info.speed"
              (ngModelChange)="updateField('speed', $event)"
              class="border p-1 rounded w-20 mb-0.5"
            />
          </div>

          <div class="flex">
            <span class="basis-1/3 text-gray-600">Attack:</span>
            <input
              type="number"
              [ngModel]="info.attack"
              (ngModelChange)="updateField('attack', $event)"
              class="border p-1 rounded w-20 mb-0.5"
            />
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

      <br />
      <button class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Details</button>
    </div>
  `,
})
export class CharacterCard {
  readonly character: InputSignal<CharacterInfo> = input.required<CharacterInfo>();
  readonly characterChange: OutputEmitterRef<CharacterInfo> = output<CharacterInfo>();

  updateField(key: keyof CharacterInfo, value: number): void {
    this.characterChange.emit({ ...this.character(), [key]: value });
  }
}
