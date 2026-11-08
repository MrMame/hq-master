import { signal, WritableSignal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';

import { provideDefaultCardActions } from './default-card-actions';
import { CARD_ACTIONS, CardAction, CardActionContext } from '../models/card-action.model';
import { CardAssignmentService } from '../services/card-assignment.service';
import { CardManagerService } from '../../core/services/card-deck/card-manager.service';
import { findCardAt, LocatedCard } from '../../core/services/card-deck/card-location.util';
import { CardLocation } from '../../core/models/card-location.model';
import { CharacterInfo } from '../../core/models/character-info.model';
import { CardRef, DeckInstance, DeckState } from '../../core/models/deck-state.model';
import { createMoveState, deck1Ref, ORIGINS } from '../../core/testing/card-move.fixtures';
import { createTestCharacter } from '../../core/testing/character.fixtures';

describe('default card actions', () => {
  let actions: readonly CardAction[];
  let cardManager: CardManagerService;
  const assignment: {
    assignDisabledReason: WritableSignal<string | null>;
    characters: WritableSignal<CharacterInfo[]>;
    inventoryTargets: ReturnType<typeof vi.fn>;
    beltTargets: ReturnType<typeof vi.fn>;
    assignTo: ReturnType<typeof vi.fn>;
  } = {
    assignDisabledReason: signal<string | null>(null),
    characters: signal<CharacterInfo[]>([createTestCharacter('a')]),
    inventoryTargets: vi.fn(() => [createTestCharacter('b')]),
    beltTargets: vi.fn(() => [createTestCharacter('b')]),
    assignTo: vi.fn(),
  };

  const action: (id: string) => CardAction = (id) => actions.find((a) => a.id === id)!;

  function context(ref: CardRef): CardActionContext {
    const s: DeckState = cardManager.state();
    const found: LocatedCard = findCardAt(s, ref)!;
    const deck: DeckInstance = s.decks.find((d) => d.id === ref.deckId)!;
    return { ...found, ref, deck, mode: 'live', draft: null };
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
    // Zwei Instanzen mit denselben Karten-IDs: h1 Hand, h2 Nachziehstapel, h3 Ablage, h4 Bank, h5 bei „a“,
    // h6 im Inventar von „a“.
    cardManager.restore(createMoveState());
  });

  const give: string[] = ['assign', 'give-to-inventory', 'belt'];
  it.each<[string, string[]]>([
    ['h1', ['discard', 'shuffle-back', 'draw-pile-top', 'bank', ...give]],
    ['h2', ['take-into-hand', 'discard', 'bank', ...give]],
    ['h3', ['take-into-hand', 'shuffle-back', 'draw-pile-top', 'bank', ...give]],
    ['h4', ['take-into-hand', 'discard', 'shuffle-back', 'draw-pile-top', ...give]],
    ['h5', ['take-into-hand', 'discard', 'shuffle-back', 'draw-pile-top', 'bank', ...give, 'stow']],
    ['h6', ['take-into-hand', 'discard', 'shuffle-back', 'draw-pile-top', 'bank', ...give]],
    ['h7', ['take-into-hand', 'discard', 'shuffle-back', 'draw-pile-top', 'bank', ...give]],
  ])('offers for %s every move except to where it lies', (cardId, ids) => {
    expect(available(deck1Ref(cardId))).toEqual(ids);
  });

  it('puts a card on top of the draw pile, also from inside it, so the next draw takes it', () => {
    void action('draw-pile-top').run!(context(deck1Ref('h1')));
    expect(cardManager.state().decks[0].drawPile.map((card) => card.id)).toEqual([
      'h1',
      'h2',
      'b1',
    ]);
    void action('draw-pile-top').run!(context(deck1Ref('b1')));
    expect(cardManager.state().decks[0].drawPile.map((card) => card.id)).toEqual([
      'b1',
      'h1',
      'h2',
    ]);
    cardManager.draw('deck-1');
    expect(cardManager.state().hand.map((entry) => entry.card.id)).toEqual(['b1']);
  });

  it('offers assigning and the inventory for every card', () => {
    expect(available(deck1Ref('b1'))).toContain('assign');
    expect(available(deck1Ref('b1'))).toContain('give-to-inventory');
  });

  it('hides giving to an inventory when only its owner could take the card', () => {
    assignment.inventoryTargets.mockReturnValueOnce([]);
    expect(available(deck1Ref('h6'))).not.toContain('give-to-inventory');
  });

  it('puts a card into the belt of the chosen character and hides it without other characters', async () => {
    const [dwarf] = action('belt').choices!(context(deck1Ref('h1')));
    expect(dwarf.label).toBe(createTestCharacter('b').name);
    await dwarf.run!();
    expect(findCardAt(cardManager.state(), deck1Ref('h1'))?.location).toEqual({
      kind: 'belt',
      characterId: 'b',
    });
    assignment.beltTargets.mockReturnValueOnce([]);
    expect(available(deck1Ref('h7'))).not.toContain('belt');
  });

  it.each<[string, CardLocation]>([
    ['take-into-hand', { kind: 'hand' }],
    ['discard', { kind: 'discardPile' }],
    ['shuffle-back', { kind: 'drawPile' }],
    ['bank', { kind: 'bank' }],
  ])('%s moves the card only within its own deck', (id, target) => {
    const ref: CardRef = deck1Ref(ORIGINS.find((o) => o.location.kind !== target.kind)!.cardId);
    const other: DeckInstance = cardManager.state().decks[1];
    void action(id).run!(context(ref));
    expect(findCardAt(cardManager.state(), ref)?.location).toEqual(target);
    expect(cardManager.state().decks[1]).toBe(other);
  });

  it('stows an equipped card in the inventory of its owner', () => {
    void action('stow').run!(context(deck1Ref('h5')));
    expect(findCardAt(cardManager.state(), deck1Ref('h5'))?.location).toEqual({
      kind: 'inventory',
      characterId: 'a',
    });
    // Ohne Slot als Ort tut die Aktion nichts.
    const before: DeckState = cardManager.state();
    void action('stow').run!(context(deck1Ref('h1')));
    expect(cardManager.state()).toBe(before);
  });

  it('passes the reason for disabled actions without characters', () => {
    assignment.assignDisabledReason.set('Keine Charaktere in der Session');
    assignment.characters.set([]);
    for (const id of give) {
      expect(action(id).isAvailable(context(deck1Ref('h2')))).toBe(true);
      expect(action(id).disabledReason?.(context(deck1Ref('h2')))).toBe(
        'Keine Charaktere in der Session',
      );
    }
    assignment.assignDisabledReason.set(null);
    assignment.characters.set([createTestCharacter('a')]);
  });
});
