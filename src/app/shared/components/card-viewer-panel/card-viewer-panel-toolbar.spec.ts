import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';

import { provideDefaultCardActions } from '../../card-actions/default-card-actions';
import { CardViewerSetup, setupCardViewer } from '../../testing/card-viewer.fixtures';
import { DeckInstance, DeckState } from '../../../core/models/deck-state.model';
import { CardDraft } from '../../models/card-action.model';
import { createDeckInstance, BASIC_CARD } from '../../../core/testing/deck.fixtures';
import { deck1Ref, HAND_CARDS } from '../../../core/testing/card-move.fixtures';
import { TOOL_STATE_KEYS } from '../../../core/session-state/tool-state-keys';

/** deck-1: h1–h3 in der Hand, nur b1 im Nachziehstapel. */
function handState(): DeckState {
  const deck: DeckInstance = createDeckInstance('deck-1', { drawPile: [BASIC_CARD] });
  return {
    decks: [{ ...deck, config: { ...deck.config, cards: [BASIC_CARD, ...HAND_CARDS] } }],
    hand: HAND_CARDS.slice(0, 3).map((card) => ({ deckId: 'deck-1', card })),
    ...{ assigned: [], inventory: [], belt: [] },
  };
}

describe('CardViewerPanel – toolbar and action menu', () => {
  let setup: CardViewerSetup;

  const query: (selector: string) => HTMLElement | null = (selector) =>
    setup.overlay.querySelector<HTMLElement>(selector);
  const toolbarLabels: () => string[] = () =>
    Array.from(query('[data-testid="card-viewer-toolbar"]')?.children ?? []).map(
      (child) => child.getAttribute('aria-label') ?? child.textContent?.replace(/\s+/g, ' ').trim(),
    ) as string[];
  const toggle: () => HTMLButtonElement = () =>
    Array.from(setup.overlay.querySelectorAll<HTMLButtonElement>('button')).find(
      (button) => button.textContent?.trim() === 'Aktionen',
    )!;
  const menu: () => HTMLElement | null = () => query('[role="menu"]');

  async function click(element: HTMLElement | null): Promise<void> {
    element?.click();
    // Aktionen laufen asynchron (Rückgängig wartet auf die Aktion).
    for (let i: number = 0; i < 3; i++) await setup.stable();
  }

  async function reopen(): Promise<void> {
    setup.viewer.close();
    await setup.stable();
    await setup.open(deck1Ref('h1'));
  }

  beforeEach(async () => {
    setup = await setupCardViewer(handState(), provideDefaultCardActions(), {
      menuExpanded: false,
    });
  });

  it('shows place, arrows with position, flip, actions and close in one toolbar above the card', async () => {
    await setup.open(deck1Ref('h1'));

    expect(toolbarLabels()).toEqual([
      'Testdeck · Hand',
      '‹ 1 / 3 ›',
      'Umdrehen',
      'Aktionen',
      'Schließen',
    ]);
    expect(query('.card-viewer__stage button')).toBeNull();
  });

  it('leaves out the arrows for the only card at its place', async () => {
    await setup.open({ deckId: 'deck-1', cardId: 'b1' });

    expect(toolbarLabels()).toEqual([
      'Testdeck · Nachziehstapel',
      'Umdrehen',
      'Aktionen',
      'Schließen',
    ]);
  });

  it('starts collapsed and expands and collapses the menu with "Aktionen"', async () => {
    await setup.open(deck1Ref('h1'));
    expect(toggle().getAttribute('aria-expanded')).toBe('false');
    expect(menu()).toBeNull();

    await click(toggle());
    expect(toggle().getAttribute('aria-expanded')).toBe('true');
    expect(setup.menuLabels()).toContain('In den Ablagestapel legen');

    await click(toggle());
    expect(toggle().getAttribute('aria-expanded')).toBe('false');
    expect(menu()).toBeNull();
  });

  it('keeps the menu state after closing and opening and stores it as tool state', async () => {
    await setup.open(deck1Ref('h1'));
    await click(toggle());

    await reopen();
    expect(toggle().getAttribute('aria-expanded')).toBe('true');
    expect(localStorage.getItem(TOOL_STATE_KEYS.cardViewerMenuOpen)).toBe('true');
  });

  it('opens with the stored expanded menu', async () => {
    localStorage.setItem(TOOL_STATE_KEYS.cardViewerMenuOpen, 'true');
    TestBed.resetTestingModule();
    setup = await setupCardViewer(handState(), provideDefaultCardActions(), {
      menuExpanded: 'stored',
    });

    await setup.open(deck1Ref('h1'));
    expect(menu()).not.toBeNull();
  });

  it('keeps the menu open after an action and shows the actions of the next card', async () => {
    await setup.open(deck1Ref('h1'));
    await click(toggle());

    await click(setup.menuItem('In die Bank legen'));
    expect(setup.viewer.viewed()?.ref.cardId).toBe('h2');
    expect(toggle().getAttribute('aria-expanded')).toBe('true');
    expect(setup.menuLabels()).toContain('In die Bank legen');
  });

  it('offers the toggle without arrows in draft mode', async () => {
    const draft: CardDraft = {
      characterId: 'a',
      moves: signal([]),
      equipped: signal([]),
      move: vi.fn(),
    };
    await setup.open(deck1Ref('h1'), { mode: 'draft', draft });

    expect(toolbarLabels()).not.toContain('‹ 1 / 3 ›');
    await click(toggle());
    expect(menu()).not.toBeNull();
  });

  it('closes on a click beside the card but not on the card itself', async () => {
    await setup.open(deck1Ref('h1'));
    await click(query('app-card-display'));
    expect(setup.viewer.viewed()).not.toBeNull();

    await click(query('.card-viewer__stage'));
    expect(setup.viewer.viewed()).toBeNull();

    await setup.open(deck1Ref('h1'));
    await click(query('.card-viewer'));
    expect(setup.viewer.viewed()).toBeNull();
  });
});
