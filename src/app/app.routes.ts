import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'charactertracker', pathMatch: 'full' },
  {
    path: 'charactertracker',
    loadComponent: () => import('./features/character-tracker/components/character-tracker-page/character-tracker-page').then(m => m.CharacterTrackerPage)
  },
  {
    path: 'timetracker',
    loadComponent: () => import('./features/time-tracker/components/time-tracker-page/time-tracker-page').then(m => m.TimeTrackerPage)
  },
  {
    path: 'dungeontracker',
    loadComponent: () => import('./features/dungeon-tracker/components/dungeon-tracker-page/dungeon-tracker-page').then(m => m.DungeonTrackerPage)
  },
  { path: '**', redirectTo: 'charactertracker' },
];
