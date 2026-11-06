import { DeckState } from '../../models/deck-state.model';
import { createDeckState, createEquipmentDeckState } from '../../testing/deck.fixtures';
import { DECK_STATE_CODEC } from './deck-state-codec.util';

describe('DECK_STATE_CODEC', () => {
  it('stores and reads the deck state unchanged', () => {
    const deck: DeckState = createEquipmentDeckState('a');
    const stored: unknown = JSON.parse(JSON.stringify(DECK_STATE_CODEC.encode(deck)));
    expect(DECK_STATE_CODEC.decode(stored)).toEqual(deck);
  });

  it('gives older states without assignments an empty list', () => {
    const older: Partial<DeckState> = createDeckState();
    delete older.assigned;
    expect(DECK_STATE_CODEC.decode(older)).toEqual(createDeckState());
  });

  it('drops invalid assignments', () => {
    const deck: DeckState = createEquipmentDeckState('a');
    const invalid: unknown[] = [
      null,
      { ...deck.assigned[0], slot: 'tail' },
      { ...deck.assigned[0], characterId: 3 },
      { ...deck.assigned[0], card: { ...deck.assigned[0].card, cardType: 'basic' } },
      deck.assigned[0],
    ];
    expect(DECK_STATE_CODEC.decode({ ...deck, assigned: invalid })).toEqual(deck);
  });

  it('falls back to no deck for stored values that are no object', () => {
    expect(DECK_STATE_CODEC.decode('x')).toBeNull();
    expect(DECK_STATE_CODEC.decode([])).toBeNull();
  });
});
