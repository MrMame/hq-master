import { CardManagerPage } from './card-manager-page';
import { DeckState } from '../../models/deck-state.model';
import { createDeckState } from '../../../game-session/testing/session.fixtures';
import {
  CardManagerAction,
  CardManagerPageHarness,
  setupCardManagerPage,
} from '../../testing/card-manager-page.fixtures';

type ClickHandler = keyof Pick<
  CardManagerPage,
  | 'onDrawPileCardClick'
  | 'onDiscardPileCardClick'
  | 'onDiscardPileClick'
  | 'onBankCardClick'
  | 'onBankContainerClick'
  | 'onActiveCardClick'
  | 'onDrawPileZoneClick'
  | 'onResetClick'
  | 'onShuffleClick'
  | 'onLoadDeckClick'
>;

const ACTIVE: DeckState = createDeckState();
const IDLE: DeckState = { ...createDeckState(), activeCard: null };
const CARD_ID: string = 'b1';

describe('CardManagerPage – clicks', () => {
  let harness: CardManagerPageHarness;

  /** Rendert den Zustand und ruft den Handler auf; Handler mit Karte erhalten `CARD_ID`. */
  const click: (state: DeckState, handler: ClickHandler) => Promise<void> = async (
    state: DeckState,
    handler: ClickHandler,
  ): Promise<void> => {
    await harness.render(state);
    harness.page[handler](CARD_ID);
  };

  beforeEach(async () => {
    harness = await setupCardManagerPage();
  });

  it.each<[ClickHandler, CardManagerAction, DeckState, string[]]>([
    ['onDrawPileCardClick', 'makeCardActive', IDLE, [CARD_ID]],
    ['onDrawPileCardClick', 'shuffleActiveCardIntoDrawPile', ACTIVE, []],
    ['onDiscardPileCardClick', 'makeCardActive', IDLE, [CARD_ID]],
    ['onDiscardPileCardClick', 'discardActiveCard', ACTIVE, []],
    ['onDiscardPileClick', 'discardActiveCard', ACTIVE, []],
    ['onBankCardClick', 'makeCardActive', IDLE, [CARD_ID]],
    ['onBankContainerClick', 'dropActiveCardIntoBank', ACTIVE, []],
    ['onActiveCardClick', 'discardActiveCard', ACTIVE, []],
    ['onDrawPileZoneClick', 'reshuffleAll', ACTIVE, []],
    ['onResetClick', 'reshuffleAll', ACTIVE, []],
    ['onShuffleClick', 'shuffle', ACTIVE, []],
  ])('%s → %s', async (handler, expected, state, args) => {
    await click(state, handler);

    expect(harness.service[expected]).toHaveBeenCalledExactlyOnceWith(...args);
  });

  it.each<ClickHandler>(['onDiscardPileClick', 'onBankContainerClick'])(
    '%s does nothing without an active card',
    async (handler) => {
      await click(IDLE, handler);

      expect(harness.service.discardActiveCard).not.toHaveBeenCalled();
      expect(harness.service.dropActiveCardIntoBank).not.toHaveBeenCalled();
    },
  );

  it('onBankCardClick does nothing while a card is active', async () => {
    await click(ACTIVE, 'onBankCardClick');

    expect(harness.service.makeCardActive).not.toHaveBeenCalled();
  });

  it('onLoadDeckClick loads the default deck', async () => {
    await click(ACTIVE, 'onLoadDeckClick');

    expect(harness.service.loadDeck).toHaveBeenCalledExactlyOnceWith(
      '/decks/default/default-deck.xml',
    );
  });
});
