import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeckRow } from './deck-row';
import { DeckInstance } from '../../../../core/models/deck-state.model';
import {
  BASIC_CARD,
  COMBAT_CARD,
  createDeckInstance,
  createTwoDeckState,
} from '../../../../core/testing/deck.fixtures';
import {
  CardManagerTestbed,
  configureCardManagerTestbed,
} from '../../testing/card-manager-page.fixtures';

describe('DeckRow', () => {
  let testbed: CardManagerTestbed;
  let fixture: ComponentFixture<DeckRow>;
  let host: HTMLElement;
  let toggles: number;

  const text: (testId: string) => string | undefined = (testId) =>
    host.querySelector(`[data-testid="${testId}"]`)?.textContent?.trim();
  const drawButton: () => HTMLButtonElement = () =>
    host.querySelector<HTMLButtonElement>('button[aria-label^="Karte ziehen"]')!;

  async function render(deck: DeckInstance, expanded: boolean = false): Promise<void> {
    fixture.componentRef.setInput('deck', deck);
    fixture.componentRef.setInput('expanded', expanded);
    await fixture.whenStable();
  }

  beforeEach(() => {
    testbed = configureCardManagerTestbed();
    testbed.cardManager.restore(createTwoDeckState());
    fixture = TestBed.createComponent(DeckRow);
    host = fixture.nativeElement as HTMLElement;
    toggles = 0;
    fixture.componentInstance.toggled.subscribe(() => toggles++);
  });

  it('shows name, draw pile, top discard card and bank count', async () => {
    await render(
      createDeckInstance('deck-2', {
        name: 'Monster',
        drawPile: [BASIC_CARD],
        discardPile: [BASIC_CARD, COMBAT_CARD],
      }),
    );
    expect(host.querySelector('.deck-row__title')?.textContent).toBe('Monster');
    expect(text('draw-count')).toBe('1');
    expect(text('discard-count')).toBe('2');
    expect(text('bank-count')).toBe('0');
    expect(host.querySelector<HTMLImageElement>('img[alt="Schwert"]')).not.toBeNull();
    expect(drawButton().getAttribute('aria-label')).toBe('Karte ziehen aus Monster');
  });

  it('shows placeholders for empty piles and disables drawing', async () => {
    await render(createDeckInstance('deck-2'));
    expect(host.querySelectorAll('.deck-row__thumb--empty')).toHaveLength(2);
    expect(drawButton().disabled).toBe(true);
  });

  it('draws a card of its own deck without toggling the row', async () => {
    await render(testbed.cardManager.decks()[1]);
    drawButton().click();
    expect(testbed.cardManager.state().activeCard?.deckId).toBe('deck-2');
    expect(toggles).toBe(0);
  });

  it('asks to toggle when the row or its name is clicked', async () => {
    await render(testbed.cardManager.decks()[1]);
    host.querySelector<HTMLElement>('.deck-row__summary')!.click();
    host.querySelector<HTMLButtonElement>('.deck-row__name')!.click();
    expect(toggles).toBe(2);
  });

  it('shows the piles only when expanded', async () => {
    await render(testbed.cardManager.decks()[1]);
    expect(host.querySelector('app-deck-piles')).toBeNull();
    expect(host.querySelector('.deck-row__name')?.getAttribute('aria-expanded')).toBe('false');

    await render(testbed.cardManager.decks()[1], true);
    expect(host.querySelector('app-deck-piles')).not.toBeNull();
    expect(host.querySelector('.deck-row__name')?.getAttribute('aria-expanded')).toBe('true');
  });
});
