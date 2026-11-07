import { createTwoDeckState } from '../../../../core/testing/deck.fixtures';
import { clickButton } from '../../../../shared/testing/click-button';
import { spyOnScrollIntoView } from '../../../../shared/testing/scroll-into-view.fixtures';
import {
  CardManagerPageHarness,
  setupCardManagerPage,
} from '../../testing/card-manager-page.fixtures';

describe('CardManagerPage', () => {
  let harness: CardManagerPageHarness;
  let host: HTMLElement;
  const scrolled: () => Element[] = spyOnScrollIntoView();

  const rows: () => HTMLElement[] = () =>
    Array.from(host.querySelectorAll<HTMLElement>('[data-testid="deck-row"]'));
  const expandedRows: () => HTMLElement[] = () =>
    rows().filter((row) => row.querySelector('app-deck-piles'));
  const toggle: (index: number) => Promise<void> = async (index) => {
    rows()[index].querySelector<HTMLButtonElement>('.deck-row__name')!.click();
    await harness.fixture.whenStable();
  };

  beforeEach(async () => {
    harness = await setupCardManagerPage();
    host = harness.host;
  });

  it('uses the dark feature page with sidebar title and deck group', () => {
    expect(host.querySelector('.feature-page .feature-page__main')).not.toBeNull();
    expect(host.querySelector('.general-sidebar__title')?.textContent).toBe('Card Manager');
    expect(host.textContent).toContain('Decks');
    expect(host.textContent).not.toContain('Deck Aktionen');
  });

  it('puts path and "Deck hinzufügen" in "Deck Management" above the deck list group', () => {
    const sections: HTMLElement[] = Array.from(host.querySelectorAll('app-sidebar-section'));
    expect(sections.map((section) => section.getAttribute('sectionid'))).toEqual([
      'card-manager.deck-management',
      'card-manager.decks',
    ]);
    expect(sections[0].querySelector('app-add-deck-form')).not.toBeNull();
    expect(sections[1].querySelector('app-deck-list')).not.toBeNull();
    expect(sections[1].querySelector('app-add-deck-form')).toBeNull();
  });

  it('shows a hint with "Deck hinzufügen" without decks and adds a deck from there', async () => {
    const main: HTMLElement = host.querySelector('.feature-page__main')!;
    expect(main.textContent).toContain('Noch keine Decks auf dem Tisch.');

    clickButton(main, 'Deck hinzufügen');
    await harness.fixture.whenStable();

    expect(harness.loadFromUrl).toHaveBeenCalledWith('decks/default/default-deck.xml');
    expect(rows()).toHaveLength(1);
    expect(expandedRows()).toEqual([]);
  });

  it('shows every deck as a row in table order', async () => {
    await harness.render(createTwoDeckState());
    expect(rows().map((row) => row.querySelector('.deck-row__title')?.textContent)).toEqual([
      'Testdeck',
      'Testdeck (2)',
    ]);
  });

  it('expands at most one row at a time and collapses it again', async () => {
    await harness.render(createTwoDeckState());
    await toggle(0);
    expect(expandedRows()).toEqual([rows()[0]]);
    await toggle(1);
    expect(expandedRows()).toEqual([rows()[1]]);
    await toggle(1);
    expect(expandedRows()).toEqual([]);
  });

  it('expands and scrolls to a deck chosen in the sidebar', async () => {
    await harness.render(createTwoDeckState());
    const entries: HTMLButtonElement[] = Array.from(
      host.querySelectorAll<HTMLButtonElement>('[data-testid="deck-list-entry"]'),
    );
    entries[1].click();
    await harness.fixture.whenStable();

    expect(expandedRows()).toEqual([rows()[1]]);
    expect(scrolled()).toEqual([rows()[1]]);
  });

  describe('choosing a deck in the sidebar with hand cards', () => {
    beforeEach(async () => {
      await harness.render(createTwoDeckState());
      harness.cardManager.draw('deck-1');
      await harness.fixture.whenStable();
    });

    it('only expands the chosen deck and keeps the hand cards of other decks', async () => {
      host.querySelectorAll<HTMLButtonElement>('[data-testid="deck-list-entry"]')[1].click();
      await harness.fixture.whenStable();
      expect(harness.cardManager.hand().map((entry) => entry.deckId)).toEqual(['deck-1']);
      expect(harness.cardManager.decks()[0].discardPile).toEqual([]);
      expect(expandedRows()).toEqual([rows()[1]]);
    });
  });
});
