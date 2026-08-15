import { Routes } from '@angular/router';

import { MonsterTrackerPage } from './features/monster-tracker/components/monster-tracker-page/monster-tracker-page';
import { MonsterTrackerExPage } from './features/monster-tracker/components/monster-tracker-ex-page/monster-tracker-ex-page';

export const routes: Routes = [
  { path: 'monstertracker', component: MonsterTrackerPage },
  { path: 'monstertracker-ex', component: MonsterTrackerExPage },

];
