import { computed, signal, WritableSignal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Mock, vi } from 'vitest';

import { provideDefaultCardActions } from './default-card-actions';
import {
  CARD_ACTIONS,
  CardAction,
  CardActionContext,
  CardDraft,
  DraftMove,
  DraftTarget,
} from '../models/card-action.model';
import { CardAssignmentService } from '../services/card-assignment.service';
import { CardManagerService } from '../../core/services/card-deck/card-manager.service';
import { findCardAt, LocatedCard } from '../../core/services/card-deck/card-location.util';
import { CardLocation } from '../../core/models/card-location.model';
import { CardRef, DeckState } from '../../core/models/deck-state.model';
import { createMoveState, deck1Ref } from '../../core/testing/card-move.fixtures';
import { SlotOccupiedChoice } from '../models/slot-occupied.model';
import { draftCards, locationInDraft, withDraftMove } from '../utils/card-draft.util';

describe('draft card actions', () => {
  let actions: readonly CardAction[];
  let cardManager: CardManagerService;
  let moves: WritableSignal<DraftMove[]>;
  let draft: CardDraft;
  let chooseDisplaced: Mock<() => Promise<SlotOccupiedChoice | undefined>>;

  const action: (id: string) => CardAction = (id) => actions.find((a) => a.id === id)!;

  /** Kontext wie im Viewer: Ort laut Entwurf. */
  function context(ref: CardRef): CardActionContext {
    const s: DeckState = cardManager.state();
    const found: LocatedCard = findCardAt(s, ref)!;
    const location: CardLocation = locationInDraft('a', moves(), ref, found.location);
    return { card: found.card, location, ref, deck: s.decks[0], mode: 'draft', draft };
  }

  const offered: (ref: CardRef) => string[] = (ref) =>
    actions
      .filter((a) => a.modes.includes('draft') && a.isAvailable(context(ref)))
      .map((a) => a.id);

  beforeEach(() => {
    chooseDisplaced = vi.fn<() => Promise<SlotOccupiedChoice | undefined>>();
    TestBed.configureTestingModule({
      providers: [
        ...provideDefaultCardActions(),
        { provide: CardAssignmentService, useValue: { chooseDisplaced } },
      ],
    });
    actions = TestBed.inject(CARD_ACTIONS);
    cardManager = TestBed.inject(CardManagerService);
    // „a“: h5 in der linken Hand, h6 im Inventar (deck-1).
    cardManager.restore(createMoveState());
    moves = signal<DraftMove[]>([]);
    draft = {
      characterId: 'a',
      moves,
      equipped: computed(() => {
        const s: DeckState = cardManager.state();
        return draftCards('a', s.assigned, s.inventory, moves()).equipped;
      }),
      move: (ref: CardRef, target: DraftTarget): void =>
        moves.update((m) => withDraftMove(m, ref, target)),
    };
  });

  it('offers discard and stow for an own slot card, discard and equip for an own inventory card', () => {
    expect(offered(deck1Ref('h5'))).toEqual(['draft-discard', 'draft-stow']);
    expect(offered(deck1Ref('h6'))).toEqual(['draft-discard', 'draft-equip']);
    // Karten anderer Orte oder anderer Charaktere bietet der Entwurf nicht an.
    expect(offered(deck1Ref('h1'))).toEqual([]);
    expect(offered({ deckId: 'deck-2', cardId: 'h6' })).toEqual([]);
  });

  it('only records moves and moves nothing in the session', async () => {
    const before: DeckState = cardManager.state();
    await action('draft-stow').run(context(deck1Ref('h5')));
    expect(moves()).toEqual([{ ref: deck1Ref('h5'), target: { kind: 'inventory' } }]);
    expect(offered(deck1Ref('h5'))).toEqual(['draft-discard', 'draft-equip']);

    await action('draft-discard').run(context(deck1Ref('h6')));
    expect(offered(deck1Ref('h6'))).toEqual([]);
    expect(cardManager.state()).toBe(before);
  });

  it('equips into the free hand without asking', async () => {
    await action('draft-equip').run(context(deck1Ref('h6')));
    expect(chooseDisplaced).not.toHaveBeenCalled();
    expect(moves()).toEqual([
      { ref: deck1Ref('h6'), target: { kind: 'equipped', slot: 'rightHand' } },
    ]);
  });

  it('asks where the previous card goes when both hands are taken, and stops on cancel', async () => {
    cardManager.moveCard(deck1Ref('h4'), { kind: 'equipped', characterId: 'a', slot: 'rightHand' });
    chooseDisplaced.mockResolvedValueOnce(undefined);
    await action('draft-equip').run(context(deck1Ref('h6')));
    expect(chooseDisplaced).toHaveBeenCalledWith('Schild 5', 'a');
    expect(moves()).toEqual([]);

    chooseDisplaced.mockResolvedValueOnce('inventory');
    await action('draft-equip').run(context(deck1Ref('h6')));
    expect(moves()).toEqual([
      { ref: deck1Ref('h5'), target: { kind: 'inventory' } },
      { ref: deck1Ref('h6'), target: { kind: 'equipped', slot: 'leftHand' } },
    ]);
  });

  it('does nothing without a draft or for a card that is no equipment', async () => {
    await action('draft-equip').run({ ...context(deck1Ref('h6')), draft: null });
    await action('draft-equip').run({ ...context(deck1Ref('b1')) });
    expect(moves()).toEqual([]);
  });
});
