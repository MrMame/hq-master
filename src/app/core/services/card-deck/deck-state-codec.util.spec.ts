import { AssignedCard, DeckInstance, DeckState } from '../../models/deck-state.model';
import {
  assignedCard,
  BASIC_CARD,
  COMBAT_CARD,
  createDeckInstance,
  createEquipmentDeckState,
  inventoryCard,
  TOWER_SHIELD,
} from '../../testing/deck.fixtures';
import { DECK_STATE_CODEC } from './deck-state-codec.util';

/** Gespeicherter Zustand vor mehreren Decks (ein Deck, Zuweisungen ohne `deckId`). */
function legacyStored(): Record<string, unknown> {
  const { config } = createDeckInstance();
  return {
    config,
    drawPile: [BASIC_CARD],
    discardPile: [],
    activeCard: COMBAT_CARD,
    bank: [],
    assigned: [{ card: TOWER_SHIELD, characterId: 'a', slot: 'leftHand' }, { slot: 'tail' }],
  };
}

describe('DECK_STATE_CODEC', () => {
  it('stores and reads the deck state unchanged', () => {
    const deck: DeckState = {
      ...createEquipmentDeckState('a'),
      inventory: [inventoryCard(BASIC_CARD, 'a')],
    };
    const stored: unknown = JSON.parse(JSON.stringify(DECK_STATE_CODEC.encode(deck)));
    expect(DECK_STATE_CODEC.decode(stored)).toEqual(deck);
  });

  it('reads an older state with one deck as one deck owning the hand card and assignments', () => {
    const state: DeckState | null = DECK_STATE_CODEC.decode(legacyStored());
    expect(state?.decks).toEqual([
      {
        id: 'test-deck',
        name: 'Testdeck',
        source: '',
        config: createDeckInstance().config,
        drawPile: [BASIC_CARD],
        discardPile: [],
        bank: [],
      },
    ]);
    expect(state?.hand).toEqual([{ deckId: 'test-deck', card: COMBAT_CARD }]);
    expect(state?.assigned).toEqual([assignedCard(TOWER_SHIELD, 'a', 'leftHand', 'test-deck')]);
    expect(state?.inventory).toEqual([]);
  });

  it('drops invalid inventory cards and those of missing decks', () => {
    const deck: DeckState = createEquipmentDeckState('a');
    const valid: unknown = inventoryCard(COMBAT_CARD, 'a');
    const stored: unknown = {
      ...deck,
      inventory: [
        null,
        { deckId: 'deck-1', card: COMBAT_CARD },
        { deckId: 'deck-1', card: COMBAT_CARD, characterId: 3 },
        inventoryCard(COMBAT_CARD, 'a', 'gone'),
        valid,
      ],
    };
    expect(DECK_STATE_CODEC.decode(stored)?.inventory).toEqual([valid]);
  });

  it('drops invalid decks and assignments and references to missing decks', () => {
    const deck: DeckState = createEquipmentDeckState('a');
    const valid: AssignedCard = deck.assigned[0];
    const stored: unknown = {
      decks: [...deck.decks, null, { id: 'x', name: 'X' }],
      hand: [...deck.hand, null, { deckId: 'gone', card: COMBAT_CARD }],
      assigned: [
        null,
        { ...valid, slot: 'tail' },
        { ...valid, characterId: 3 },
        { ...valid, card: { ...valid.card, cardType: 'basic' } },
        { ...valid, deckId: undefined },
        { ...valid, deckId: 'gone' },
        valid,
      ],
    };
    expect(DECK_STATE_CODEC.decode(stored)).toEqual(deck);
  });

  it('reads missing lists and sources as empty and an invalid active card as an empty hand', () => {
    const withoutSource: Partial<DeckInstance> = createDeckInstance();
    delete withoutSource.source;
    expect(DECK_STATE_CODEC.decode({ decks: [withoutSource], activeCard: { card: 1 } })).toEqual({
      decks: [createDeckInstance('deck-1', { source: '' })],
      hand: [],
      assigned: [],
      inventory: [],
    });
    expect(DECK_STATE_CODEC.decode({})).toEqual({
      decks: [],
      hand: [],
      assigned: [],
      inventory: [],
    });
  });

  it('reads a stored active card of several decks as the only hand card', () => {
    const stored: unknown = {
      decks: [createDeckInstance('deck-1')],
      activeCard: { deckId: 'deck-1', card: COMBAT_CARD },
    };
    expect(DECK_STATE_CODEC.decode(stored)?.hand).toEqual([
      { deckId: 'deck-1', card: COMBAT_CARD },
    ]);
  });

  it('falls back to no decks for stored values that are no object', () => {
    expect(DECK_STATE_CODEC.decode('x')).toBeNull();
    expect(DECK_STATE_CODEC.decode([])).toBeNull();
  });
});
