import { signal } from '@angular/core';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatSnackBarHarness } from '@angular/material/snack-bar/testing';
import { vi } from 'vitest';

import { provideDefaultCardActions } from '../../card-actions/default-card-actions';
import { CardViewerSetup, setupCardViewer } from '../../testing/card-viewer.fixtures';
import { DeckInstance, DeckState } from '../../../core/models/deck-state.model';
import { CardDraft } from '../../models/card-action.model';
import { createDeckInstance, BASIC_CARD } from '../../../core/testing/deck.fixtures';
import { deck1Ref, HAND_CARDS } from '../../../core/testing/card-move.fixtures';
import { findCardAt } from '../../../core/services/card-deck/card-location.util';
import { UNDO_HINT_DURATION_MS } from '../../services/card-undo.service';

/** deck-1: h1–h3 in der Hand, nur b1 im Nachziehstapel. */
function handState(): DeckState {
  const deck: DeckInstance = createDeckInstance('deck-1', { drawPile: [BASIC_CARD] });
  return {
    decks: [{ ...deck, config: { ...deck.config, cards: [BASIC_CARD, ...HAND_CARDS] } }],
    hand: HAND_CARDS.slice(0, 3).map((card) => ({ deckId: 'deck-1', card })),
    assigned: [],
    inventory: [],
  };
}

describe('CardViewerPanel', () => {
  let setup: CardViewerSetup;

  const button: (label: string) => HTMLButtonElement | null = (label) =>
    setup.overlay.querySelector<HTMLButtonElement>(`button[aria-label="${label}"]`);
  const position: () => string | undefined = () =>
    setup.overlay.querySelector('[data-testid="card-viewer-position"]')?.textContent?.trim();
  const viewedId: () => string | undefined = () => setup.viewer.viewed()?.ref.cardId;

  async function click(element: HTMLButtonElement | null): Promise<void> {
    element?.click();
    // Aktionen laufen asynchron (Rückgängig wartet auf die Aktion).
    for (let i: number = 0; i < 3; i++) await setup.stable();
  }

  beforeEach(async () => {
    setup = await setupCardViewer(handState(), provideDefaultCardActions());
  });

  afterEach(() => vi.useRealTimers());

  it('shows the position at the place and browses with the arrows, disabled at both ends', async () => {
    await setup.open(deck1Ref('h1'));
    expect(position()).toBe('1 / 3');
    expect(button('Vorherige Karte')?.disabled).toBe(true);

    await click(button('Nächste Karte'));
    expect([viewedId(), position()]).toEqual(['h2', '2 / 3']);
    await click(button('Nächste Karte'));
    expect([viewedId(), position()]).toEqual(['h3', '3 / 3']);
    expect(button('Nächste Karte')?.disabled).toBe(true);
    await click(button('Vorherige Karte'));
    expect(viewedId()).toBe('h2');
  });

  it('shows no arrows for the only card at its place and in draft mode', async () => {
    await setup.open({ deckId: 'deck-1', cardId: 'b1' });
    expect(button('Nächste Karte')).toBeNull();
    expect(position()).toBeUndefined();

    const draft: CardDraft = {
      characterId: 'a',
      moves: signal([]),
      equipped: signal([]),
      move: vi.fn(),
    };
    await setup.open(deck1Ref('h1'), { mode: 'draft', draft });
    expect(button('Nächste Karte')).toBeNull();
  });

  it('stays at the place and shows the next card after an action moves the card away', async () => {
    await setup.open(deck1Ref('h2'));
    await click(setup.menuItem('In die Bank legen'));
    expect([viewedId(), position()]).toEqual(['h3', '2 / 2']);

    await click(setup.menuItem('In die Bank legen'));
    expect([viewedId(), position()]).toEqual(['h1', undefined]);

    // Ort leer: die bewegte Karte an ihrem neuen Ort.
    await click(setup.menuItem('In die Bank legen'));
    expect(viewedId()).toBe('h1');
    expect(setup.location()).toBe('Testdeck · Bank');
  });

  it('offers undo after an action and brings the card back', async () => {
    await setup.open(deck1Ref('h1'));
    await click(setup.menuItem('In den Ablagestapel legen'));
    const hint: MatSnackBarHarness = await TestbedHarnessEnvironment.documentRootLoader(
      setup.fixture,
    ).getHarness(MatSnackBarHarness);
    expect(await hint.getMessage()).toBe('Schild 1 in den Ablagestapel gelegt');
    expect(await hint.getActionDescription()).toBe('Rückgängig');

    await hint.dismissWithAction();
    expect(findCardAt(setup.cardManager.state(), deck1Ref('h1'))?.location).toEqual({
      kind: 'hand',
    });
  });

  it('removes the undo hint after a few seconds', async () => {
    await setup.open(deck1Ref('h1'));
    vi.useFakeTimers();
    setup.menuItem('In den Ablagestapel legen').click();
    await vi.advanceTimersByTimeAsync(0);
    expect(document.querySelector('mat-snack-bar-container')?.textContent).toContain('Rückgängig');

    await vi.advanceTimersByTimeAsync(UNDO_HINT_DURATION_MS + 1000);
    expect(document.querySelector('mat-snack-bar-container')).toBeNull();
  });
});
