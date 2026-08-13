import { Routes } from '@angular/router';

import { MonsterTrackerPage } from './features/monster-tracker/components/monster-tracker-page/monster-tracker-page';

export const routes: Routes = [
  // 2. Füge den Pfad und die Komponente hinzu
  { path: 'monstertracker', component: MonsterTrackerPage }
];
