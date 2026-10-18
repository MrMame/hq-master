import { CardManagerPage } from './card-manager-page';
import { createDeckState } from '../../../game-session/testing/session.fixtures';
import {
  CardManagerPageHarness,
  CardManagerServiceMock,
  setupCardManagerPage,
} from '../../testing/card-manager-page.fixtures';

describe('CardManagerPage', () => {
  let harness: CardManagerPageHarness;
  let page: CardManagerPage;
  let service: CardManagerServiceMock;
  let host: HTMLElement;

  beforeEach(async () => {
    harness = await setupCardManagerPage();
    ({ page, service, host } = harness);
  });

  describe('without deck', () => {
    beforeEach(() => harness.render(null));

    it('shows the empty state with the default deck url', () => {
      expect(host.textContent).toContain('Kein Deck geladen.');
      expect(host.querySelector('input')?.value).toBe('decks/default/default-deck.xml');
    });

    it('loads the deck from the entered url, trimmed', async () => {
      (host.querySelector('input') as HTMLInputElement).value = '  decks/x.xml ';
      (host.querySelector('button') as HTMLButtonElement).click();
      await harness.fixture.whenStable();

      expect(service.loadDeck).toHaveBeenCalledExactlyOnceWith('decks/x.xml');
      expect(page.isLoading()).toBe(false);
    });

    it('ignores an empty url', async () => {
      await page.onLoadDeck('   ');

      expect(service.loadDeck).not.toHaveBeenCalled();
    });

    it('shows the loading state while the deck loads', async () => {
      service.loadDeck.mockReturnValue(new Promise<void>(() => undefined));
      void page.onLoadDeck('decks/x.xml');
      await harness.fixture.whenStable();

      const button: HTMLButtonElement = host.querySelector('button') as HTMLButtonElement;
      expect(button.disabled).toBe(true);
      expect(button.textContent?.trim()).toBe('Lade...');
    });

    it('shows the error message when loading fails', async () => {
      service.loadDeck.mockRejectedValue(new Error('404'));
      await page.onLoadDeck('decks/x.xml');
      await harness.fixture.whenStable();

      expect(host.querySelector('[data-testid="deck-load-error"]')?.textContent).toBe('404');
      expect(page.isLoading()).toBe(false);
    });

    it('shows a generic message for non-Error failures', async () => {
      service.loadDeck.mockRejectedValue('kaputt');
      await page.onLoadDeck('decks/x.xml');

      expect(page.loadError()).toBe('Deck konnte nicht geladen werden.');
    });
  });

  describe('with deck', () => {
    it('renders deck name, pile counts and all cards', async () => {
      await harness.render(createDeckState());

      expect(host.textContent).toContain('Deck: Testdeck');
      expect(host.textContent).toContain('Nachziehstapel (1)');
      expect(host.textContent).toContain('Ablagestapel (0)');
      expect(host.querySelectorAll('app-card-display')).toHaveLength(2);
    });

    it('activates a draw pile card on click without bubbling to the discard pile', async () => {
      await harness.render({ ...createDeckState(), activeCard: null });

      (host.querySelector('.drawPile app-card-display') as HTMLElement).click();

      expect(service.makeCardActive).toHaveBeenCalledExactlyOnceWith('b1');
      expect(service.discardActiveCard).not.toHaveBeenCalled();
    });
  });
});
