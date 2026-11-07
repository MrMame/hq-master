import { signal, WritableSignal } from '@angular/core';
import { Mock, vi } from 'vitest';

import { CardRef } from '../../../core/models/deck-state.model';
import { createTwoDeckState } from '../../../core/testing/deck.fixtures';
import { provideCardActions } from '../../card-actions/provide-card-actions';
import { CardAction, CardActionContext, CardDraft } from '../../models/card-action.model';
import { CardViewerSetup, setupCardViewer } from '../../testing/card-viewer.fixtures';

const DRAW_CARD: CardRef = { deckId: 'deck-2', cardId: 'c1' };

describe('CardViewer – actions', () => {
  let setup: CardViewerSetup;
  let run: Mock<(context: CardActionContext) => void>;
  let blocked: WritableSignal<string | null>;

  /** Nur hier registrierte Test-Aktionen; der Viewer kennt keine davon. */
  function testAction(id: string, overrides: Partial<CardAction> = {}): () => CardAction {
    return () => ({
      id,
      label: id,
      group: 'test',
      order: 1,
      modes: ['live'],
      isAvailable: () => true,
      run,
      ...overrides,
    });
  }

  beforeEach(async () => {
    run = vi.fn<(context: CardActionContext) => void>();
    blocked = signal<string | null>('Gesperrt');
    setup = await setupCardViewer(
      createTwoDeckState(),
      provideCardActions(
        testAction('Zweite', { order: 2, group: 'other' }),
        testAction('Erste'),
        testAction('Nur im Stapel', { order: 3, isAvailable: (c) => c.location.kind === 'bank' }),
        testAction('Gesperrt', { order: 4, disabledReason: () => blocked() }),
        testAction('Entwurf', { order: 5, modes: ['draft'] }),
      ),
    );
  });

  it('shows every registered and available action of the mode in order', async () => {
    await setup.open(DRAW_CARD);
    expect(setup.menuLabels()).toEqual(['Erste', 'Zweite', 'Gesperrt']);
    expect(setup.overlay.querySelectorAll('[role="separator"]')).toHaveLength(2);
  });

  it('runs an action with the card at its current location and stays open', async () => {
    await setup.open(DRAW_CARD);
    setup.menuItem('Erste').click();
    await setup.stable();

    expect(run).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({
        ref: DRAW_CARD,
        card: expect.objectContaining({ id: 'c1' }),
        deck: expect.objectContaining({ id: 'deck-2' }),
        location: { kind: 'drawPile' },
        mode: 'live',
        draft: null,
      }),
    );
    expect(setup.viewer.viewed()?.ref).toEqual(DRAW_CARD);
  });

  it('greys out a blocked action with its reason and enables it once the reason is gone', async () => {
    await setup.open(DRAW_CARD);
    expect(setup.menuItem('Gesperrt').disabled).toBe(true);
    expect(setup.menuItem('Gesperrt').parentElement?.title).toBe('Gesperrt');

    blocked.set(null);
    await setup.stable();
    expect(setup.menuItem('Gesperrt').disabled).toBe(false);
    expect(setup.menuItem('Gesperrt').parentElement?.hasAttribute('title')).toBe(false);
  });

  it('shows only draft actions in draft mode and passes the draft', async () => {
    const draft: CardDraft = { characterId: 'a', discarded: signal([]), discard: vi.fn() };
    await setup.open(DRAW_CARD, { mode: 'draft', draft });

    expect(setup.menuLabels()).toEqual(['Entwurf']);
    setup.menuItem('Entwurf').click();
    expect(run).toHaveBeenCalledWith(expect.objectContaining({ mode: 'draft', draft }));
  });
});
