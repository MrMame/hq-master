import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'dungeontracker', pathMatch: 'full' },
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
    path: 'dungeonbuilder',
    loadComponent: () =>
      import('./features/dungeon-builder/components/dungeon-builder-page/dungeon-builder-page').then(
        (m) => m.DungeonBuilderPage,
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
  { path: '**', redirectTo: 'dungeontracker' },
];
