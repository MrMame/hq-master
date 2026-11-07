import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Provider, signal, WritableSignal } from '@angular/core';
import { Mock, vi } from 'vitest';

import { CardManagerPage } from '../components/card-manager-page/card-manager-page';
import { CardManagerService } from '../../../core/services/card-deck/card-manager.service';
import { DeckXmlLoaderService } from '../../../core/services/card-deck/deck-xml-loader.service';
import { DeckConfig } from '../../../core/models/deck-config.model';
import { CardRef, DeckState } from '../../../core/models/deck-state.model';
import { createDeckInstance } from '../../../core/testing/deck.fixtures';
import { CardAssignmentService } from '../../../shared/services/card-assignment.service';

export interface CardAssignmentServiceMock {
  assignDisabledReason: WritableSignal<string | null>;
  ownerNames: WritableSignal<ReadonlyMap<string, string>>;
  assignCard: Mock<(ref: CardRef) => Promise<void>>;
}

/** Echter Deck-Zustand; nur das Laden der Deck-Datei und der Zuweisungsablauf sind gemockt. */
export interface CardManagerTestbed {
  cardManager: CardManagerService;
  loadFromUrl: Mock<(url: string) => Promise<DeckConfig>>;
  assignment: CardAssignmentServiceMock;
}

/** Konfiguriert das TestBed für Card-Manager-Komponenten; danach `TestBed.createComponent(…)`. */
export function configureCardManagerTestbed(extraProviders: Provider[] = []): CardManagerTestbed {
  const loadFromUrl: Mock<(url: string) => Promise<DeckConfig>> = vi
    .fn<(url: string) => Promise<DeckConfig>>()
    .mockResolvedValue(createDeckInstance().config);
  const assignment: CardAssignmentServiceMock = {
    assignDisabledReason: signal<string | null>(null),
    ownerNames: signal<ReadonlyMap<string, string>>(new Map()),
    assignCard: vi.fn<(ref: CardRef) => Promise<void>>().mockResolvedValue(undefined),
  };
  TestBed.configureTestingModule({
    providers: [
      { provide: DeckXmlLoaderService, useValue: { loadFromUrl } },
      { provide: CardAssignmentService, useValue: assignment },
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
