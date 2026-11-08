import { provideDefaultCardActions } from '../../card-actions/default-card-actions';
import { CardViewerSetup, setupCardViewer } from '../../testing/card-viewer.fixtures';
import { DeckInstance, DeckState } from '../../../core/models/deck-state.model';
import {
  BASIC_CARD,
  createDeckInstance,
  OWN_BACK_CARD,
  TEST_BACK,
} from '../../../core/testing/deck.fixtures';
import { GameLogService } from '../../../core/services/game-log/game-log.service';
import { TestBed } from '@angular/core/testing';

/** deck-1: Sonderkarte (eigene Rückseite) und Fackel in der Hand. */
function handState(): DeckState {
  const deck: DeckInstance = createDeckInstance('deck-1');
  return {
    decks: [{ ...deck, config: { ...deck.config, cards: [OWN_BACK_CARD, BASIC_CARD] } }],
    hand: [OWN_BACK_CARD, BASIC_CARD].map((card) => ({ deckId: 'deck-1', card })),
    assigned: [],
    inventory: [],
    belt: [],
  };
}

describe('CardViewerPanel – flip', () => {
  let setup: CardViewerSetup;

  const shownImage: () => HTMLImageElement | null = () =>
    setup.overlay.querySelector<HTMLImageElement>('.card-viewer__card img');
  const flipButton: () => HTMLButtonElement = () =>
    Array.from(setup.overlay.querySelectorAll<HTMLButtonElement>('button')).find(
      (button) => button.textContent?.trim() === 'Umdrehen',
    )!;

  async function click(element: HTMLElement | null): Promise<void> {
    element?.click();
    for (let i: number = 0; i < 3; i++) await setup.stable();
  }

  beforeEach(async () => {
    setup = await setupCardViewer(handState(), provideDefaultCardActions());
  });

  it('opens with the front and turns the card to its own back and again to the front', async () => {
    await setup.open({ deckId: 'deck-1', cardId: 's1' });
    expect(shownImage()?.alt).toBe('Sonderkarte');
    expect(flipButton().getAttribute('aria-pressed')).toBe('false');

    await click(flipButton());
    expect(shownImage()?.getAttribute('src')).toBe('cards/special-back.svg');
    expect(shownImage()?.alt).toBe('Kartenrückseite');
    expect(flipButton().getAttribute('aria-pressed')).toBe('true');

    await click(flipButton());
    expect(shownImage()?.alt).toBe('Sonderkarte');
  });

  it('moves no card, writes no log entry and offers no undo when flipping', async () => {
    await setup.open({ deckId: 'deck-1', cardId: 's1' });
    const before: DeckState = setup.cardManager.state();
    const logSize: number = TestBed.inject(GameLogService).entries().length;

    await click(flipButton());

    expect(setup.cardManager.state()).toBe(before);
    expect(TestBed.inject(GameLogService).entries().length).toBe(logSize);
    expect(document.querySelector('mat-snack-bar-container')).toBeNull();
  });

  it('shows the front again after browsing to another card', async () => {
    await setup.open({ deckId: 'deck-1', cardId: 's1' });
    await click(flipButton());

    await click(setup.overlay.querySelector<HTMLButtonElement>('[aria-label="Nächste Karte"]'));

    expect(setup.viewer.viewed()?.ref.cardId).toBe('b1');
    expect(shownImage()?.alt).toBe('Fackel');
  });

  it('shows the front again after an action', async () => {
    await setup.open({ deckId: 'deck-1', cardId: 'b1' });
    await click(flipButton());
    expect(shownImage()?.getAttribute('src')).toBe(TEST_BACK);

    await click(setup.menuItem('In die Bank legen'));

    expect(setup.location()).toBe('Testdeck · Hand');
    expect(shownImage()?.alt).toBe('Sonderkarte');
  });
});
