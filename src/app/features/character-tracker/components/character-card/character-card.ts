import { Component , input} from '@angular/core';
import { CharacterInfo } from '../../models/CharacterInfo';

@Component({
  selector: 'app-character-card',
  standalone: true,
  imports: [],
  template: `
  <div class="bg-white shadow-md rounded-lg p-4">
    <h2 class="text-xl font-bold mb-2">{{ characterInfo()?.name }}</h2>
    <img src="{{characterInfo()?.image}}" alt="Monster Image" class="w-full h-auto object-cover mb-2 rounded">
    <p class="text-gray-700 mb-4">{{ characterInfo()?.description }}</p>
    <span class="text-gray-600">Type: {{ characterInfo()?.type }}</span><br>
    <span class="text-gray-600">Health: {{ characterInfo()?.health }}</span><br>
    <span class="text-gray-600">Attack: {{ characterInfo()?.attack }}</span><br>
    <span class="text-gray-600">Defense: {{ characterInfo()?.defense }}</span><br>
    <span class="text-gray-600">Speed: {{ characterInfo()?.speed }}</span><br>
    <span class="text-gray-600">Abilities: {{ characterInfo()?.abilities?.join(', ') }}</span><br>
    <br>
    <button class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Details</button>
  </div>
  `,
  styles: ``,
})
export class CharacterCard {

  public characterInfo = input<CharacterInfo>();

}



