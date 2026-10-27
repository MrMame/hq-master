import { Provider, signal, WritableSignal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { ElementCatalog } from '../models/element-catalog.model';
import { BuilderUiService } from '../services/builder-ui.service';
import { DungeonLayoutService } from '../services/dungeon-layout.service';
import { ElementCatalogService } from '../services/element-catalog.service';
import { PlanPointerService } from '../services/plan-pointer.service';
import { TEST_CATALOG } from './builder.fixtures';

export interface BuilderServices {
  catalog: WritableSignal<ElementCatalog | null>;
  layout: DungeonLayoutService;
  ui: BuilderUiService;
  pointer: PlanPointerService;
}

/** Katalog-Service ohne HTTP: Katalog und Ladefehler sind steuerbare Signale. */
export function catalogProvider(
  catalog: WritableSignal<ElementCatalog | null>,
  loadError: WritableSignal<string | null> = signal<string | null>(null),
): Provider {
  return { provide: ElementCatalogService, useValue: { catalog, loadError } };
}

/** Provider für Builder-Specs; Komponenten-Specs ergänzen danach ihre `imports`. */
export function builderProviders(
  catalog: WritableSignal<ElementCatalog | null> = signal<ElementCatalog | null>(TEST_CATALOG),
): Provider[] {
  return [catalogProvider(catalog), BuilderUiService, PlanPointerService];
}

/** Konfiguriert TestBed mit Test-Katalog und liefert die Builder-Services. */
export function setupBuilderServices(): BuilderServices {
  const catalog: WritableSignal<ElementCatalog | null> = signal<ElementCatalog | null>(
    TEST_CATALOG,
  );
  TestBed.configureTestingModule({ providers: builderProviders(catalog) });
  return injectBuilderServices(catalog);
}

/** Liefert die Services aus einem bereits konfigurierten TestBed. */
export function injectBuilderServices(
  catalog: WritableSignal<ElementCatalog | null> = signal<ElementCatalog | null>(TEST_CATALOG),
): BuilderServices {
  return {
    catalog,
    layout: TestBed.inject(DungeonLayoutService),
    ui: TestBed.inject(BuilderUiService),
    pointer: TestBed.inject(PlanPointerService),
  };
}
