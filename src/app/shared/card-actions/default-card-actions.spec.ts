import { signal, WritableSignal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';

import { provideDefaultCardActions } from './default-card-actions';
import {
  CARD_ACTIONS,
  CardAction,
  CardActionContext,
  CardDraft,
} from '../models/card-action.model';
import { CardAssignmentService } from '../services/card-assignment.service';
import { CardManagerService } from '../../core/services/card-deck/card-manager.service';
import { findCardAt, LocatedCard } from '../../core/services/card-deck/card-location.util';
import { CardLocation } from '../../core/models/card-location.model';
import { CardRef, DeckInstance, DeckState } from '../../core/models/deck-state.model';
import { createMoveState, deck1Ref, ORIGINS } from '../../core/testing/card-move.fixtures';

describe('default card actions', () => {
  let actions: readonly CardAction[];
  let cardManager: CardManagerService;
  const assignment: {
    assignDisabledReason: WritableSignal<string | null>;
    assignCard: ReturnType<typeof vi.fn>;
  } = { assignDisabledReason: signal<string | null>(null), assignCard: vi.fn() };

  const action: (id: string) => CardAction = (id) => actions.find((a) => a.id === id)!;

  function context(ref: CardRef, draft: CardDraft | null = null): CardActionContext {
    const s: DeckState = cardManager.state();
    const found: LocatedCard = findCardAt(s, ref)!;
    const deck: DeckInstance = s.decks.find((d) => d.id === ref.deckId)!;
    return { ...found, ref, deck, mode: draft ? 'draft' : 'live', draft };
  }

  const available: (ref: CardRef) => string[] = (ref) =>
    actions.filter((a) => a.modes.includes('live') && a.isAvailable(context(ref))).map((a) => a.id);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ...provideDefaultCardActions(),
        { provide: CardAssignmentService, useValue: assignment },
      ],
    });
    actions = TestBed.inject(CARD_ACTIONS);
    cardManager = TestBed.inject(CardManagerService);
    // Zwei Instanzen mit denselben Karten-IDs: h1 Hand, h2 Nachziehstapel, h3 Ablage, h4 Bank, h5 bei „a“.
    cardManager.restore(createMoveState());
  });

  it.each<[string, string[]]>([
    ['h1', ['discard', 'shuffle-back', 'bank', 'assign']],
    ['h2', ['take-into-hand', 'discard', 'bank', 'assign']],
    ['h3', ['take-into-hand', 'shuffle-back', 'bank', 'assign']],
    ['h4', ['take-into-hand', 'discard', 'shuffle-back', 'assign']],
    ['h5', ['take-into-hand', 'discard', 'shuffle-back', 'bank', 'assign']],
  ])('offers for %s every move except to where it lies', (cardId, ids) => {
    expect(available(deck1Ref(cardId))).toEqual(ids);
  });

  it('offers no assignment for cards that are no equipment', () => {
    expect(available(deck1Ref('b1'))).not.toContain('assign');
  });

  it.each<[string, CardLocation]>([
    ['take-into-hand', { kind: 'hand' }],
    ['discard', { kind: 'discardPile' }],
    ['shuffle-back', { kind: 'drawPile' }],
    ['bank', { kind: 'bank' }],
  ])('%s moves the card only within its own deck', (id, target) => {
    const ref: CardRef = deck1Ref(ORIGINS.find((o) => o.location.kind !== target.kind)!.cardId);
    const other: DeckInstance = cardManager.state().decks[1];
    void action(id).run(context(ref));
    expect(findCardAt(cardManager.state(), ref)?.location).toEqual(target);
    expect(cardManager.state().decks[1]).toBe(other);
  });

  it('starts the assignment dialog and passes the reason for a disabled assignment', () => {
    void action('assign').run(context(deck1Ref('h2')));
    expect(assignment.assignCard).toHaveBeenCalledWith(deck1Ref('h2'));
    assignment.assignDisabledReason.set('Keine Charaktere in der Session');
    expect(action('assign').disabledReason?.(context(deck1Ref('h2')))).toBe(
      'Keine Charaktere in der Session',
    );
  });

  it('marks a card of the edited character in the draft and moves nothing', () => {
    const discarded: WritableSignal<CardRef[]> = signal<CardRef[]>([]);
    const draft: CardDraft = {
      characterId: 'a',
      discarded,
      discard: (ref) => discarded.update((refs) => [...refs, ref]),
    };
    const before: DeckState = cardManager.state();
    const draftDiscard: CardAction = action('draft-discard');

    expect(draftDiscard.modes).toEqual(['draft']);
    expect(draftDiscard.isAvailable(context(deck1Ref('h5'), draft))).toBe(true);
    void draftDiscard.run(context(deck1Ref('h5'), draft));

    expect(discarded()).toEqual([deck1Ref('h5')]);
    expect(cardManager.state()).toBe(before);
    expect(draftDiscard.isAvailable(context(deck1Ref('h5'), draft))).toBe(false);
    // Karten anderer Orte oder anderer Charaktere bietet der Entwurf nicht an.
    expect(draftDiscard.isAvailable(context(deck1Ref('h1'), draft))).toBe(false);
    expect(draftDiscard.isAvailable(context({ deckId: 'deck-2', cardId: 'h5' }, draft))).toBe(
      false,
    );
    expect(draftDiscard.isAvailable(context(deck1Ref('h5')))).toBe(false);
  });
});
