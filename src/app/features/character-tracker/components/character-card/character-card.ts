import { Component, model } from '@angular/core'; // 1. model importieren
import { FormsModule } from '@angular/forms'; // 2. FormsModule importieren
import { CharacterInfo } from '../../models/CharacterInfo';

@Component({
  selector: 'app-character-card',
  standalone: true,
  imports: [FormsModule], // 3. Hier FormsModule hinzufügen
  template: `
  <div class="bg-yellow-500 shadow-md rounded-lg p-0.5 h-[30vh] overflow-scroll text-xs">
    
    @if (characterInfo(); as info) {
      <div class="flex mb-1">
        <img [src]="characterInfo()?.image" alt="Monster Image" class="w-[30%] h-auto object-cover mb-2 rounded">
        <div class="flex-col ml-3">
            <span class="text-gray-600">Type: {{ characterInfo()?.type }}</span>
        </div>
      </div>

      <div class="ml-3">
        <div class="flex">
          <span class="basis-1/3 text-gray-600">Health:</span>
          <input class="basis-2/3" type="number" [(ngModel)]="info.health" class="border p-1 rounded w-20 mb-0.5">
        </div>
        
        <div class="flex">
          <span class="basis-1/3 text-gray-600">Defense:</span>
          <input class="basis-2/3" type="number" [(ngModel)]="info.defense" class="border p-1 rounded w-20 mb-0.5">
        </div>
        
        <div class="flex">
          <span class="basis-1/3 text-gray-600">Speed:</span>
          <input class="basis-2/3" type="number" [(ngModel)]="info.speed" class="border p-1 rounded w-20 mb-0.5">
        </div>
      
        <div class="flex">
          <span class="basis-1/3 text-gray-600">Attack:</span>
          <input class="basis-2/3" type="number" [(ngModel)]="info.attack" class="border p-1 rounded w-20 mb-0.5">
        </div>
      </div>
      
        <div class="flex-col m-3">
          <h3 class="text-gray-600">Abilities:</h3>
          <span class="basis-1/3 text-gray-600">{{ characterInfo()?.abilities?.join(', ') }}</span>
        </div>
        <div class="flex-col m-3">
          <p class="basis-2/3 text-gray-700 mb-4">{{ characterInfo()?.description }}</p>
        </div>  
    }
    
    <br>
    <button class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Details</button>
  </div>
  `,
  styles: `
  `,
})
export class CharacterCard {
  // 5. Von 'input' auf 'model' wechseln, um Änderungen zu erlauben
  public characterInfo = model<CharacterInfo>();
}
