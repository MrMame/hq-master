import { withNormalizedCards } from './card-normalize.util';
import { DECK_STATE_CODEC } from './deck-state-codec.util';
import { moveCard } from './card-move.util';
import { Card } from '../../models/card.model';
import { DeckInstance, DeckState } from '../../models/deck-state.model';
import {
  assignedCard,
  BASIC_CARD,
  createDeckInstance,
  inventoryCard,
  SWORD_CARD,
} from '../../testing/deck.fixtures';

const ids: (cards: Card[]) => string[] = (cards) => cards.map((card) => card.id);

function stateWith(deck: DeckInstance, carried: Partial<DeckState> = {}): DeckState {
  return { decks: [deck], hand: [], assigned: [], inventory: [], belt: [], ...carried };
}

describe('card-normalize.util – unique ids', () => {
  it('makes ids unique across draw pile, discard pile and bank', () => {
    const deck: DeckInstance = createDeckInstance('deck-1', {
      drawPile: [BASIC_CARD, BASIC_CARD],
      discardPile: [BASIC_CARD],
      bank: [BASIC_CARD, SWORD_CARD],
    });
    const [loaded] = withNormalizedCards(stateWith(deck)).decks;

    expect(ids(loaded.drawPile)).toEqual(['b1', 'b1-2']);
    expect(ids(loaded.discardPile)).toEqual(['b1-3']);
    expect(ids(loaded.bank)).toEqual(['b1-4', 'c1']);
  });

  it('makes the ids of the deck cards unique on their own', () => {
    const deck: DeckInstance = createDeckInstance('deck-1');
    const loaded: DeckState = withNormalizedCards(
      stateWith({
        ...deck,
        config: { ...deck.config, cards: [SWORD_CARD, SWORD_CARD, BASIC_CARD] },
      }),
    );

    expect(ids(loaded.decks[0].config.cards)).toEqual(['c1', 'c1-2', 'b1']);
  });

  it('keeps carried ids and gives pile cards ids that no carried card uses', () => {
    const deck: DeckInstance = createDeckInstance('deck-1', {
      drawPile: [BASIC_CARD, SWORD_CARD],
      bank: [BASIC_CARD],
    });
    const loaded: DeckState = withNormalizedCards(
      stateWith(deck, {
        hand: [{ deckId: 'deck-1', card: BASIC_CARD }],
        assigned: [assignedCard({ ...BASIC_CARD, id: 'b1-2' }, 'hero', 'body')],
        inventory: [inventoryCard(SWORD_CARD, 'hero')],
        belt: [inventoryCard({ ...SWORD_CARD, id: 'c1-2' }, 'hero')],
      }),
    );

    expect(ids(loaded.decks[0].drawPile)).toEqual(['b1-3', 'c1-3']);
    expect(ids(loaded.decks[0].bank)).toEqual(['b1-4']);
    expect(loaded.hand[0].card.id).toBe('b1');
    expect(loaded.assigned[0].card.id).toBe('b1-2');
    expect(loaded.inventory[0].card.id).toBe('c1');
    expect(loaded.belt[0].card.id).toBe('c1-2');
  });

  it('only reserves carried ids of the same deck instance', () => {
    const loaded: DeckState = withNormalizedCards({
      ...stateWith(createDeckInstance('deck-1', { drawPile: [BASIC_CARD] })),
      decks: [
        createDeckInstance('deck-1', { drawPile: [BASIC_CARD] }),
        createDeckInstance('deck-2', { drawPile: [BASIC_CARD] }),
      ],
      hand: [{ deckId: 'deck-2', card: BASIC_CARD }],
    });

    expect(ids(loaded.decks[0].drawPile)).toEqual(['b1']);
    expect(ids(loaded.decks[1].drawPile)).toEqual(['b1-2']);
  });

  it('loads a state without duplicates with the same ids in the same order', () => {
    const deck: DeckInstance = createDeckInstance('deck-1', {
      drawPile: [SWORD_CARD, BASIC_CARD],
    });
    const [loaded] = withNormalizedCards(stateWith(deck)).decks;

    expect(loaded.drawPile).toEqual([SWORD_CARD, BASIC_CARD]);
    expect(ids(loaded.config.cards)).toEqual(['c1', 'b1']);
  });

  it('loses no card when moving one after loading a stored state with duplicates', () => {
    const stored: DeckState = stateWith(
      createDeckInstance('deck-1', { drawPile: [BASIC_CARD, BASIC_CARD, BASIC_CARD] }),
    );
    const loaded: DeckState | null = DECK_STATE_CODEC.decode(JSON.parse(JSON.stringify(stored)));
    if (!loaded) throw new Error('state not decoded');

    const moved: DeckState = moveCard(
      loaded,
      { deckId: 'deck-1', cardId: 'b1-2' },
      { kind: 'belt', characterId: 'hero' },
    );

    expect(ids(moved.decks[0].drawPile)).toEqual(['b1', 'b1-3']);
    expect(moved.belt.map((entry) => entry.card.id)).toEqual(['b1-2']);
  });
});
