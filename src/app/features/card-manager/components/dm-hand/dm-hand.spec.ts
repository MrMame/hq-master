import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DmHand } from './dm-hand';
import { CardViewerService } from '../../../../shared/services/card-viewer.service';
import { BASIC_CARD, SWORD_CARD, createTwoDeckState } from '../../../../core/testing/deck.fixtures';
import {
  CardManagerTestbed,
  configureCardManagerTestbed,
} from '../../testing/card-manager-page.fixtures';

describe('DmHand', () => {
  let testbed: CardManagerTestbed;
  let fixture: ComponentFixture<DmHand>;
  let host: HTMLElement;

  const handCards: () => HTMLElement[] = () =>
    Array.from(host.querySelectorAll<HTMLElement>('[data-testid="hand-card"]'));

  beforeEach(() => {
    testbed = configureCardManagerTestbed();
    fixture = TestBed.createComponent(DmHand);
    host = fixture.nativeElement as HTMLElement;
  });

  it('shows every hand card with the name of its deck and the count', async () => {
    testbed.cardManager.restore({
      ...createTwoDeckState(),
      hand: [
        { deckId: 'deck-1', card: BASIC_CARD },
        { deckId: 'deck-2', card: BASIC_CARD },
        { deckId: 'deck-2', card: SWORD_CARD },
      ],
    });
    await fixture.whenStable();

    expect(handCards().map((card) => card.querySelector('.card-origin')?.textContent)).toEqual([
      'aus Testdeck',
      'aus Testdeck (2)',
      'aus Testdeck (2)',
    ]);
  });

  it('opens a clicked card in the card viewer without moving it', async () => {
    testbed.cardManager.restore({
      ...createTwoDeckState(),
      hand: [
        { deckId: 'deck-1', card: BASIC_CARD },
        { deckId: 'deck-2', card: BASIC_CARD },
      ],
    });
    await fixture.whenStable();

    (handCards()[1].querySelector('.card-display') as HTMLElement).click();

    expect(TestBed.inject(CardViewerService).viewed()).toEqual({
      ref: { deckId: 'deck-2', cardId: 'b1' },
      context: { mode: 'live' },
    });
    expect(testbed.cardManager.hand()).toHaveLength(2);
  });

  it('renders no cards without hand cards', async () => {
    testbed.cardManager.restore(createTwoDeckState());
    await fixture.whenStable();
    expect(handCards()).toEqual([]);
  });
});
