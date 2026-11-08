import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeckRow } from './deck-row';
import { CardViewerService } from '../../../../shared/services/card-viewer.service';
import { DeckInstance } from '../../../../core/models/deck-state.model';
import {
  BASIC_CARD,
  OWN_BACK_CARD,
  SWORD_CARD,
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
  const discardButton: () => HTMLButtonElement = () =>
    host.querySelector<HTMLButtonElement>('button[aria-label^="Oberste Karte im Ablagestapel"]')!;

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
        discardPile: [BASIC_CARD, SWORD_CARD],
      }),
    );
    expect(host.querySelector('.deck-row__title')?.textContent).toBe('Monster');
    expect(text('draw-count')).toBe('1');
    expect(text('discard-count')).toBe('2');
    expect(text('bank-count')).toBe('0');
    expect(host.querySelector<HTMLImageElement>('img[alt="Schwert"]')).not.toBeNull();
    expect(drawButton().getAttribute('aria-label')).toBe('Karte ziehen aus Monster');
  });

  it('shows the back of the top draw pile card', async () => {
    await render(createDeckInstance('deck-2', { drawPile: [OWN_BACK_CARD, BASIC_CARD] }));
    expect(drawButton().querySelector('img')?.getAttribute('src')).toBe('cards/special-back.svg');

    await render(createDeckInstance('deck-2', { drawPile: [BASIC_CARD, OWN_BACK_CARD] }));
    expect(drawButton().querySelector('img')?.getAttribute('src')).toBe('cards/back.svg');
  });

  it('shows placeholders for empty piles and disables drawing', async () => {
    await render(createDeckInstance('deck-2'));
    expect(host.querySelectorAll('.deck-row__thumb--empty')).toHaveLength(2);
    expect(drawButton().disabled).toBe(true);
  });

  it('draws the top card into the hand and opens it in the viewer without toggling the row', async () => {
    await render(testbed.cardManager.decks()[1]);
    drawButton().click();
    expect(testbed.cardManager.hand()).toEqual([{ deckId: 'deck-2', card: BASIC_CARD }]);
    expect(TestBed.inject(CardViewerService).viewed()?.ref).toEqual({
      deckId: 'deck-2',
      cardId: 'b1',
    });
    expect(toggles).toBe(0);
  });

  it('opens the top discard card in the viewer without moving it or toggling the row', async () => {
    await render(createDeckInstance('deck-2', { discardPile: [BASIC_CARD, SWORD_CARD] }));
    discardButton().click();
    expect(TestBed.inject(CardViewerService).viewed()?.ref).toEqual({
      deckId: 'deck-2',
      cardId: 'c1',
    });
    expect(testbed.cardManager.hand()).toEqual([]);
    expect(toggles).toBe(0);
  });

  it('disables the discard pile without cards', async () => {
    await render(createDeckInstance('deck-2'));
    expect(discardButton().disabled).toBe(true);
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
