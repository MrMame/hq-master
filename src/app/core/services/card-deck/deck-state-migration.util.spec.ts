import { DeckConfig } from '../../models/deck-config.model';
import { DeckState } from '../../models/deck-state.model';
import { createDeckInstance, TOWER_SHIELD } from '../../testing/deck.fixtures';
import { migrateLegacyDeck } from './deck-state-migration.util';

describe('migrateLegacyDeck', () => {
  it('uses "deck-1" as deck id when the old config has no id', () => {
    const config: DeckConfig = { ...createDeckInstance().config, id: '' };
    const state: DeckState = migrateLegacyDeck({
      config,
      drawPile: [],
      discardPile: [],
      activeCard: null,
      bank: [],
      assigned: [{ card: TOWER_SHIELD, characterId: 'a', slot: 'leftHand' }],
    });
    expect(state.decks[0].id).toBe('deck-1');
    expect(state.hand).toEqual([]);
    expect(state.assigned[0].deckId).toBe('deck-1');
  });
});
