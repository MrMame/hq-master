import { signal } from '@angular/core';
import { vi } from 'vitest';

import { DeckState } from '../../core/models/deck-state.model';
import { createMoveState, deck1Ref } from '../../core/testing/card-move.fixtures';
import { CardDraft } from '../models/card-action.model';
import { viewerContext } from './card-viewer-context.util';

describe('viewerContext', () => {
  const state: DeckState = createMoveState();

  it('locates the card with its deck in live mode', () => {
    expect(viewerContext(state, deck1Ref('h3'), { mode: 'live' })).toEqual({
      card: expect.objectContaining({ id: 'h3' }),
      ref: deck1Ref('h3'),
      deck: state.decks[0],
      location: { kind: 'discardPile' },
      mode: 'live',
      draft: null,
    });
  });

  it('uses the location of the draft in draft mode', () => {
    const draft: CardDraft = {
      characterId: 'a',
      moves: signal([{ ref: deck1Ref('h5'), target: { kind: 'inventory' } }]),
      equipped: signal([]),
      move: vi.fn(),
    };
    expect(viewerContext(state, deck1Ref('h5'), { mode: 'draft', draft })).toMatchObject({
      location: { kind: 'inventory', characterId: 'a' },
      mode: 'draft',
      draft,
    });
  });

  it('finds nothing for an unknown card or a removed deck', () => {
    expect(viewerContext(state, deck1Ref('x'), { mode: 'live' })).toBeNull();
    expect(viewerContext({ ...state, decks: [] }, deck1Ref('h1'), { mode: 'live' })).toBeNull();
  });
});
