import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal, WritableSignal } from '@angular/core';
import { Mock, vi } from 'vitest';

import { CardManagerPage } from '../components/card-manager-page/card-manager-page';
import { CardManagerService } from '../../../core/services/card-deck/card-manager.service';
import { DeckState } from '../../../core/models/deck-state.model';
import { CardAssignmentService } from '../services/card-assignment.service';

export type CardManagerAction =
  | 'shuffle'
  | 'reshuffleAll'
  | 'discardActiveCard'
  | 'makeCardActive'
  | 'shuffleActiveCardIntoDrawPile'
  | 'dropActiveCardIntoBank';

export type CardManagerServiceMock = {
  state: WritableSignal<DeckState | null>;
  loadDeck: Mock<(url: string) => Promise<void>>;
} & Record<CardManagerAction, Mock>;

export interface CardAssignmentServiceMock {
  assignDisabledReason: WritableSignal<string | null>;
  ownerNames: WritableSignal<ReadonlyMap<string, string>>;
  assignActiveCard: Mock<() => Promise<void>>;
  confirmNewDeck: Mock<() => Promise<boolean>>;
}

export interface CardManagerPageHarness {
  fixture: ComponentFixture<CardManagerPage>;
  page: CardManagerPage;
  service: CardManagerServiceMock;
  assignment: CardAssignmentServiceMock;
  host: HTMLElement;
  render: (state: DeckState | null) => Promise<void>;
}

/** Erzeugt die CardManagerPage mit vollständig gemocktem CardManagerService und CardAssignmentService. */
export async function setupCardManagerPage(): Promise<CardManagerPageHarness> {
  const service: CardManagerServiceMock = {
    state: signal<DeckState | null>(null),
    loadDeck: vi.fn().mockResolvedValue(undefined),
    shuffle: vi.fn(),
    reshuffleAll: vi.fn(),
    discardActiveCard: vi.fn(),
    makeCardActive: vi.fn(),
    shuffleActiveCardIntoDrawPile: vi.fn(),
    dropActiveCardIntoBank: vi.fn(),
  };
  const assignment: CardAssignmentServiceMock = {
    assignDisabledReason: signal<string | null>(null),
    ownerNames: signal<ReadonlyMap<string, string>>(new Map()),
    assignActiveCard: vi.fn().mockResolvedValue(undefined),
    confirmNewDeck: vi.fn().mockResolvedValue(true),
  };
  await TestBed.configureTestingModule({
    imports: [CardManagerPage],
    providers: [
      { provide: CardManagerService, useValue: service },
      { provide: CardAssignmentService, useValue: assignment },
    ],
  }).compileComponents();

  const fixture: ComponentFixture<CardManagerPage> = TestBed.createComponent(CardManagerPage);
  const render: CardManagerPageHarness['render'] = async (
    state: DeckState | null,
  ): Promise<void> => {
    service.state.set(state);
    await fixture.whenStable();
  };

  return {
    fixture,
    page: fixture.componentInstance,
    service,
    assignment,
    host: fixture.nativeElement as HTMLElement,
    render,
  };
}
