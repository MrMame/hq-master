import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal, WritableSignal } from '@angular/core';
import { Mock, vi } from 'vitest';

import { CardManagerPage } from '../components/card-manager-page/card-manager-page';
import { CardManagerService } from '../services/card-manager.service';
import { DeckState } from '../models/deck-state.model';

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

export interface CardManagerPageHarness {
  fixture: ComponentFixture<CardManagerPage>;
  page: CardManagerPage;
  service: CardManagerServiceMock;
  host: HTMLElement;
  render: (state: DeckState | null) => Promise<void>;
}

/** Erzeugt die CardManagerPage mit vollständig gemocktem CardManagerService. */
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
  await TestBed.configureTestingModule({
    imports: [CardManagerPage],
    providers: [{ provide: CardManagerService, useValue: service }],
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
    host: fixture.nativeElement as HTMLElement,
    render,
  };
}
