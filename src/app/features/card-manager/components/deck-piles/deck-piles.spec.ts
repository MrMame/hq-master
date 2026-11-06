import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeckPiles } from './deck-piles';
import { DeckInstance, DeckState } from '../../../../core/models/deck-state.model';
import {
  BASIC_CARD,
  COMBAT_CARD,
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

  const deck: (index: number) => DeckInstance = (index) => testbed.cardManager.decks()[index];
  const pile: (label: string) => HTMLElement = (label) =>
    host.querySelector<HTMLElement>(`section[aria-label="${label}"]`)!;
  const clickCard: (label: string) => Promise<void> = async (label) => {
    Array.from(pile(label).querySelectorAll<HTMLElement>('.card-display')).at(-1)!.click();
    await render();
  };
  const clickPile: (label: string) => Promise<void> = async (label) => {
    pile(label).click();
    await render();
  };

  /** Zeigt deck-2 mit dem aktuellen Zustand des Service. */
  async function render(): Promise<void> {
    fixture.componentRef.setInput('deck', deck(1));
    fixture.componentRef.setInput('activeCard', testbed.cardManager.state().activeCard);
    await fixture.whenStable();
  }

  async function start(state: DeckState): Promise<void> {
    testbed.cardManager.restore(state);
    await render();
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

  it('makes a draw pile card active and shuffles it back on the next click', async () => {
    await start(createTwoDeckState());
    await clickCard('Nachziehstapel');
    expect(testbed.cardManager.state().activeCard?.deckId).toBe('deck-2');
    expect(deck(1).drawPile).toHaveLength(1);

    await clickCard('Nachziehstapel');
    expect(testbed.cardManager.state().activeCard).toBeNull();
    expect(deck(1).drawPile).toHaveLength(2);
  });

  it('puts its active card into the discard pile or the bank of this deck', async () => {
    await start({ ...createTwoDeckState(), activeCard: { deckId: 'deck-2', card: TOWER_SHIELD } });
    await clickPile('Bank');
    expect(deck(1).bank).toEqual([TOWER_SHIELD]);

    await clickCard('Bank');
    expect(testbed.cardManager.state().activeCard?.card).toBe(TOWER_SHIELD);
    await clickPile('Ablagestapel');
    expect(deck(1).discardPile).toEqual([TOWER_SHIELD]);
  });

  it('discards the own active card when a discard pile card is clicked, else activates it', async () => {
    const s: DeckState = createTwoDeckState();
    const withDiscard: DeckState = {
      ...s,
      decks: [s.decks[0], { ...s.decks[1], discardPile: [COMBAT_CARD] }],
      activeCard: { deckId: 'deck-2', card: TOWER_SHIELD },
    };
    await start(withDiscard);
    await clickCard('Ablagestapel');
    expect(deck(1).discardPile).toEqual([COMBAT_CARD, TOWER_SHIELD]);
    expect(testbed.cardManager.state().activeCard).toBeNull();

    await clickCard('Ablagestapel');
    expect(testbed.cardManager.state().activeCard?.card).toBe(TOWER_SHIELD);
  });

  it('activates a clicked card while a card of another deck is active, discarding that one', async () => {
    await start({ ...createTwoDeckState(), activeCard: { deckId: 'deck-1', card: COMBAT_CARD } });
    await clickPile('Bank');
    await clickPile('Ablagestapel');
    expect(deck(1).bank).toEqual([]);
    expect(deck(1).discardPile).toEqual([]);

    await clickCard('Nachziehstapel');
    expect(testbed.cardManager.state().activeCard).toEqual({ deckId: 'deck-2', card: COMBAT_CARD });
    expect(deck(0).discardPile).toEqual([COMBAT_CARD]);
    expect(deck(0).drawPile).toEqual([BASIC_CARD]);
  });

  it('shows a placeholder for an empty draw pile', async () => {
    testbed.cardManager.restore(createTwoDeckState());
    testbed.cardManager.draw('deck-2');
    testbed.cardManager.draw('deck-2');
    await render();
    expect(pile('Nachziehstapel').textContent).toContain('leer');
  });

  it('ignores a click on a bank card while its own active card is shown', async () => {
    const s: DeckState = createTwoDeckState();
    await start({
      ...s,
      decks: [s.decks[0], { ...s.decks[1], bank: [COMBAT_CARD] }],
      activeCard: { deckId: 'deck-2', card: TOWER_SHIELD },
    });
    await clickCard('Bank');
    expect(testbed.cardManager.state().activeCard?.card).toBe(TOWER_SHIELD);
    expect(deck(1).bank).toEqual([COMBAT_CARD]);
  });
});
