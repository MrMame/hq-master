import { Routes } from '@angular/router';

import { MonsterTracker } from './features/monstertracker/monster-tracker/monster-tracker';

export const routes: Routes = [
  // 2. Füge den Pfad und die Komponente hinzu
  { path: 'monstertracker', component: MonsterTracker }
];
