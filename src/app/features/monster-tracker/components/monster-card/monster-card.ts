import { Component , input} from '@angular/core';
import { MonsterInfo } from '../../models/MonsterInfo';

@Component({
  selector: 'app-monster-card',
  standalone: true,
  imports: [],
  template: `
  <div class="bg-white shadow-md rounded-lg p-4">
    <h2 class="text-xl font-bold mb-2">{{ monsterInfo()?.name }}</h2>
    <img src="{{monsterInfo()?.image}}" alt="Monster Image" class="w-full h-32 object-cover mb-2 rounded">
    <p class="text-gray-700 mb-4">{{ monsterInfo()?.description }}</p>
    <span class="text-gray-600">Type: {{ monsterInfo()?.type }}</span><br>
    <span class="text-gray-600">Health: {{ monsterInfo()?.health }}</span><br>
    <span class="text-gray-600">Attack: {{ monsterInfo()?.attack }}</span><br>
    <span class="text-gray-600">Defense: {{ monsterInfo()?.defense }}</span><br>
    <span class="text-gray-600">Speed: {{ monsterInfo()?.speed }}</span><br>
    <span class="text-gray-600">Abilities: {{ monsterInfo()?.abilities?.join(', ') }}</span><br>
    <br>
    <button class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Details</button>
  </div>
  `,
  styles: ``,
})
export class MonsterCard {

  public monsterInfo = input<MonsterInfo>();

}



