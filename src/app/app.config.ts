import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { GameSessionService } from './features/game-session/services/game-session.service';
import { ConditionTickService } from './shared/services/condition-tick.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    // Startet den Orchestrator und damit alle Session-Slices samt ihrer Sync-Effekte sofort,
    // nicht erst beim ersten Öffnen einer Page. Der Zustands-Tick wirkt so auf jeder Seite.
    provideAppInitializer(() => {
      inject(GameSessionService);
      inject(ConditionTickService);
    }),
  ],
};
