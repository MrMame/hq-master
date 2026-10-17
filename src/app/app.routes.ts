import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'charactertracker', pathMatch: 'full' },
  {
    path: 'charactertracker',
    loadComponent: () =>
      import('./features/character-tracker/components/character-tracker-page/character-tracker-page').then(
        (m) => m.CharacterTrackerPage,
      ),
  },
  {
    path: 'timetracker',
    loadComponent: () =>
      import('./features/time-tracker/components/time-tracker-page/time-tracker-page').then(
        (m) => m.TimeTrackerPage,
      ),
  },
  {
    path: 'dungeontracker',
    loadComponent: () =>
      import('./features/dungeon-tracker/components/dungeon-tracker-page/dungeon-tracker-page').then(
        (m) => m.DungeonTrackerPage,
      ),
  },
  {
    path: 'cardmanager',
    loadComponent: () =>
      import('./features/card-manager/components/card-manager-page/card-manager-page').then(
        (m) => m.CardManagerPage,
      ),
  },
  {
    path: 'gamesession',
    loadComponent: () =>
      import('./features/game-session/components/game-session-page/game-session-page').then(
        (m) => m.GameSessionPage,
      ),
  },
  { path: '**', redirectTo: 'charactertracker' },
];
