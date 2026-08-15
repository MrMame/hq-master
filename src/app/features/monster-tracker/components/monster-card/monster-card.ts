import { Component } from '@angular/core';

@Component({
  selector: 'app-monster-card',
  standalone: true,
  imports: [],
  template: `
  <div class="bg-white shadow-md rounded-lg p-4">
    <h2 class="text-xl font-bold mb-2">{{ monsterName }}</h2>
    <img src="{{monsterImage}}" alt="Monster Image" class="w-full h-32 object-cover mb-2 rounded">
    <p class="text-gray-700 mb-4">{{ monsterDescription }}</p>
    <button class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Details</button>
  </div>
  `,
  styles: ``,
})
export class MonsterCard {
 public monsterImage = './img/monster-icon-Gargoyle.png';
 public monsterDescription = 'This is a description of the monster.';
 public monsterName = 'Gargoyle';

}
