import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EnvironmentProviders, Provider, signal, WritableSignal } from '@angular/core';
import { Mock, vi } from 'vitest';

import { CardManagerPage } from '../components/card-manager-page/card-manager-page';
import { CardManagerService } from '../../../core/services/card-deck/card-manager.service';
import { DeckXmlLoaderService } from '../../../core/services/card-deck/deck-xml-loader.service';
import { DeckCatalogService } from '../../../core/services/card-deck/deck-catalog.service';
import { DeckCatalogEntry } from '../../../core/models/deck-catalog-entry.model';
import { CharacterInfo } from '../../../core/models/character-info.model';
import { DeckConfig } from '../../../core/models/deck-config.model';
import { CardRef, DeckState } from '../../../core/models/deck-state.model';
import { createDeckInstance } from '../../../core/testing/deck.fixtures';
import { CardAssignmentService } from '../../../shared/services/card-assignment.service';

export interface CardAssignmentServiceMock {
  assignDisabledReason: WritableSignal<string | null>;
  ownerNames: WritableSignal<ReadonlyMap<string, string>>;
  assignTo: Mock<(ref: CardRef) => Promise<void>>;
  characters: WritableSignal<CharacterInfo[]>;
  inventoryTargets: Mock<() => CharacterInfo[]>;
}

/** Deckliste mit dem Beispieldeck, ohne HTTP; Specs mit echtem Katalog überschreiben `DeckCatalogService`. */
export const DEFAULT_CATALOG_ENTRY: DeckCatalogEntry = {
  id: 'default-deck',
  name: 'Beispieldeck',
  url: 'decks/default/default-deck.xml',
};

/** Echter Deck-Zustand; nur das Laden der Deck-Datei, die Deckliste und der Zuweisungsablauf sind gemockt. */
export interface CardManagerTestbed {
  cardManager: CardManagerService;
  loadFromUrl: Mock<(url: string) => Promise<DeckConfig>>;
  assignment: CardAssignmentServiceMock;
}

/** Konfiguriert das TestBed für Card-Manager-Komponenten; danach `TestBed.createComponent(…)`. */
export function configureCardManagerTestbed(
  extraProviders: (Provider | EnvironmentProviders)[] = [],
): CardManagerTestbed {
  const loadFromUrl: Mock<(url: string) => Promise<DeckConfig>> = vi
    .fn<(url: string) => Promise<DeckConfig>>()
    .mockResolvedValue(createDeckInstance().config);
  const assignment: CardAssignmentServiceMock = {
    assignDisabledReason: signal<string | null>(null),
    ownerNames: signal<ReadonlyMap<string, string>>(new Map()),
    assignTo: vi.fn<(ref: CardRef) => Promise<void>>().mockResolvedValue(undefined),
    characters: signal<CharacterInfo[]>([]),
    inventoryTargets: vi.fn<() => CharacterInfo[]>(() => []),
  };
  TestBed.configureTestingModule({
    providers: [
      { provide: DeckXmlLoaderService, useValue: { loadFromUrl } },
      { provide: CardAssignmentService, useValue: assignment },
      {
        provide: DeckCatalogService,
        useValue: {
          entries: signal([DEFAULT_CATALOG_ENTRY]),
          isLoading: signal(false),
          loadError: signal(null),
        },
      },
      ...extraProviders,
    ],
  });
  return { cardManager: TestBed.inject(CardManagerService), loadFromUrl, assignment };
}

export interface CardManagerPageHarness extends CardManagerTestbed {
  fixture: ComponentFixture<CardManagerPage>;
  host: HTMLElement;
  render: (state: DeckState) => Promise<void>;
}

/** Erzeugt die CardManagerPage mit echtem Deck-Zustand. */
export async function setupCardManagerPage(): Promise<CardManagerPageHarness> {
  const testbed: CardManagerTestbed = configureCardManagerTestbed();
  const fixture: ComponentFixture<CardManagerPage> = TestBed.createComponent(CardManagerPage);
  const render: CardManagerPageHarness['render'] = async (state: DeckState): Promise<void> => {
    testbed.cardManager.restore(state);
    await fixture.whenStable();
  };
  await fixture.whenStable();
  return { ...testbed, fixture, host: fixture.nativeElement as HTMLElement, render };
}
