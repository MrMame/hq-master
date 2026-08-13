import { Component } from '@angular/core';
import { MonsterCard} from '../monster-card/monster-card';

@Component({
  selector: 'app-monster-tracker-page',
  imports: [MonsterCard],
  template: `

  <div class="flex flex-col items-left justify-start min-h-screen bg-gray-100">
    <h1 class="text-3xl font-bold mb-6">Monster Tracker</h1>
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      <app-monster-card></app-monster-card>
    </div>
  </div>
  `,
  styles: ``,
})
export class MonsterTrackerPage {}
