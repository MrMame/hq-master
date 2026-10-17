import { DeckState } from '../../models/deck-state.model';
import { Card } from '../../models/card.model';
import { createDeckState } from '../../../game-session/testing/session.fixtures';
import {
  CardManagerAction,
  CardManagerPageHarness,
  setupCardManagerPage,
} from '../../testing/card-manager-page.fixtures';

type Pile = 'drawPile' | 'discardPile' | 'bank';

const CARD_ID: string = 'b1';
const CARD: Card = createDeckState().drawPile[0];

/** Deck mit der Karte `CARD_ID` nur im angegebenen Stapel; `active` setzt eine aktive Karte. */
function cardIn(pile: Pile, active: boolean): DeckState {
  const base: DeckState = createDeckState();
  return {
    ...base,
    drawPile: [],
    discardPile: [],
    bank: [],
    [pile]: [CARD],
    activeCard: active ? base.activeCard : null,
  };
}

const ACTIVE: DeckState = cardIn('drawPile', true);

describe('CardManagerPage – clicks', () => {
  let harness: CardManagerPageHarness;

  /** Rendert den Zustand und klickt das Element im DOM. */
  const click: (state: DeckState, selector: string) => Promise<void> = async (
    state: DeckState,
    selector: string,
  ): Promise<void> => {
    await harness.render(state);
    const element: HTMLElement | null = harness.host.querySelector<HTMLElement>(selector);
    expect(element, selector).not.toBeNull();
    element!.click();
  };

  beforeEach(async () => {
    harness = await setupCardManagerPage();
  });

  it.each<[string, CardManagerAction, DeckState, string[]]>([
    ['.drawPile app-card-display', 'makeCardActive', cardIn('drawPile', false), [CARD_ID]],
    ['.drawPile app-card-display', 'shuffleActiveCardIntoDrawPile', ACTIVE, []],
    ['.discardPile app-card-display', 'makeCardActive', cardIn('discardPile', false), [CARD_ID]],
    ['.discardPile app-card-display', 'discardActiveCard', cardIn('discardPile', true), []],
    ['.discardPile', 'discardActiveCard', ACTIVE, []],
    ['.bankContainer app-card-display', 'makeCardActive', cardIn('bank', false), [CARD_ID]],
    ['.bankContainer', 'dropActiveCardIntoBank', ACTIVE, []],
    ['.activeCardPile app-card-display', 'discardActiveCard', ACTIVE, []],
    ['.drawPile h3', 'reshuffleAll', ACTIVE, []],
    ['.menueContainer button:nth-child(2)', 'shuffle', ACTIVE, []],
    ['.menueContainer button:nth-child(3)', 'reshuffleAll', ACTIVE, []],
  ])('click on %s → %s', async (selector, expected, state, args) => {
    await click(state, selector);

    expect(harness.service[expected]).toHaveBeenCalledExactlyOnceWith(...args);
  });

  it.each<string>(['.discardPile', '.bankContainer'])(
    'click on %s does nothing without an active card',
    async (selector) => {
      await click(cardIn('drawPile', false), selector);

      expect(harness.service.discardActiveCard).not.toHaveBeenCalled();
      expect(harness.service.dropActiveCardIntoBank).not.toHaveBeenCalled();
    },
  );

  it('a bank card click does nothing while a card is active and does not bubble', async () => {
    await click(cardIn('bank', true), '.bankContainer app-card-display');

    expect(harness.service.makeCardActive).not.toHaveBeenCalled();
    expect(harness.service.dropActiveCardIntoBank).not.toHaveBeenCalled();
  });

  it('the load button loads the default deck', async () => {
    await click(ACTIVE, '.menueContainer button:nth-child(1)');

    expect(harness.service.loadDeck).toHaveBeenCalledExactlyOnceWith(
      '/decks/default/default-deck.xml',
    );
  });
});
