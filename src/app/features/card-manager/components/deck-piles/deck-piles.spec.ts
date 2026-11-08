import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeckPiles } from './deck-piles';
import { DeckState } from '../../../../core/models/deck-state.model';
import { CardViewerService } from '../../../../shared/services/card-viewer.service';
import {
  BASIC_CARD,
  OWN_BACK_CARD,
  SWORD_CARD,
  createTwoDeckState,
  TOWER_SHIELD,
} from '../../../../core/testing/deck.fixtures';
import {
  CardManagerTestbed,
  configureCardManagerTestbed,
} from '../../testing/card-manager-page.fixtures';

describe('DeckPiles', () => {
  let testbed: CardManagerTestbed;
  let fixture: ComponentFixture<DeckPiles>;
  let host: HTMLElement;

  const pile: (label: string) => HTMLElement = (label) =>
    host.querySelector<HTMLElement>(`section[aria-label="${label}"]`)!;
  const topCard: (label: string) => HTMLElement = (label) =>
    Array.from(pile(label).querySelectorAll<HTMLElement>('.card-display')).at(-1)!;
  const viewed: () => string | undefined = () =>
    TestBed.inject(CardViewerService).viewed()?.ref.cardId;

  /** Zeigt deck-2 des Zustands. */
  async function start(state: DeckState): Promise<void> {
    testbed.cardManager.restore(state);
    fixture.componentRef.setInput('deck', testbed.cardManager.decks()[1]);
    await fixture.whenStable();
  }

  /** deck-2: c1 im Nachziehstapel, b1 abgelegt, Turmschild in der Bank. */
  function filledState(): DeckState {
    const s: DeckState = createTwoDeckState();
    return {
      ...s,
      decks: [
        s.decks[0],
        { ...s.decks[1], drawPile: [SWORD_CARD], discardPile: [BASIC_CARD], bank: [TOWER_SHIELD] },
      ],
    };
  }

  beforeEach(() => {
    testbed = configureCardManagerTestbed();
    fixture = TestBed.createComponent(DeckPiles);
    host = fixture.nativeElement as HTMLElement;
  });

  it('shows draw pile, discard pile and bank with counts and placeholders', async () => {
    await start(createTwoDeckState());
    expect(pile('Nachziehstapel').textContent).toContain('Nachziehstapel (2)');
    expect(pile('Ablagestapel').textContent).toContain('leer');
    expect(pile('Bank').textContent).toContain('Keine Karten in der Bank.');
  });

  it.each([
    ['Nachziehstapel', 'c1'],
    ['Ablagestapel', 'b1'],
    ['Bank', 'e2'],
  ])('opens a card of the %s in the viewer without moving it', async (label, cardId) => {
    const state: DeckState = filledState();
    await start(state);

    topCard(label).click();

    expect(TestBed.inject(CardViewerService).viewed()?.ref).toEqual({ deckId: 'deck-2', cardId });
    expect(testbed.cardManager.decks()[1]).toEqual(state.decks[1]);
  });

  it('shows the back of draw pile cards and the front of the others', async () => {
    await start(filledState());
    expect(pile('Nachziehstapel').querySelector('.card-back')).not.toBeNull();
    expect(pile('Ablagestapel').querySelector('.card-front')).not.toBeNull();
    expect(pile('Bank').querySelector('.card-front')).not.toBeNull();
  });

  it('shows the back of the next card to draw on top and opens it on click', async () => {
    const state: DeckState = filledState();
    state.decks[1] = { ...state.decks[1], drawPile: [OWN_BACK_CARD, BASIC_CARD] };
    await start(state);

    const top: HTMLElement = topCard('Nachziehstapel');
    expect(top.querySelector('img')?.getAttribute('src')).toBe('cards/special-back.svg');
    top.click();
    expect(viewed()).toBe('s1');
  });

  it('does nothing on a click on a pile or the bank outside of a card', async () => {
    const state: DeckState = filledState();
    await start(state);
    pile('Ablagestapel').click();
    pile('Bank').click();
    expect(viewed()).toBeUndefined();
    expect(testbed.cardManager.decks()[1]).toEqual(state.decks[1]);
  });
});
