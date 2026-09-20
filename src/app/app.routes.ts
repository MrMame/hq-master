import { Routes } from '@angular/router';

import { CharacterTrackerPage } from './features/character-tracker/components/character-tracker-page/character-tracker-page';
import { TimeTrackerPage } from './features/time-tracker/components/time-tracker-page/time-tracker-page';

export const routes: Routes = [
  { path: 'charactertracker', component: CharacterTrackerPage },
  { path: 'timetracker', component: TimeTrackerPage },

];
