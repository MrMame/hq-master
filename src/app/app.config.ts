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
import { EquipmentSyncService } from './core/services/equipment/equipment-sync.service';
import { provideDefaultCardActions } from './shared/card-actions/default-card-actions';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    // Menü des Card Viewers; weitere Aktionen per provideCardActions(...).
    ...provideDefaultCardActions(),
    // Startet den Orchestrator und damit alle Session-Slices samt ihrer Sync-Effekte sofort,
    // nicht erst beim ersten Öffnen einer Page. Zustands-Tick und Ausrüstungs-Abgleich wirken so auf jeder Seite.
    provideAppInitializer(() => {
      inject(GameSessionService);
      inject(ConditionTickService);
      inject(EquipmentSyncService);
    }),
  ],
};
