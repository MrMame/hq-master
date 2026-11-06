import { DeckConfig } from '../../models/deck-config.model';
import { Card } from '../../models/card.model';
import { DeckState } from '../../models/deck-state.model';
import {
  assignedCard,
  createDeckInstance,
  createTwoDeckState,
  TOWER_SHIELD,
} from '../../testing/deck.fixtures';
import { drawCard } from './deck-draw.util';
import {
  addDeck,
  moveDeck,
  removeDeck,
  renameDeck,
  resetDeck,
  shuffleDrawPile,
  uniqueDeckName,
} from './deck-instance.util';
import { emptyDeckState } from './deck-state.util';

const ids: (cards: Card[]) => string[] = (cards) => cards.map((c) => c.id).sort();

describe('deck instances', () => {
  it('numbers taken names', () => {
    expect(uniqueDeckName('Monster', [])).toBe('Monster');
    expect(uniqueDeckName('Monster', ['Monster'])).toBe('Monster (2)');
    expect(uniqueDeckName('Monster', ['Monster', 'Monster (2)'])).toBe('Monster (3)');
  });

  it('adds at least ten decks of the same file with numbered names', () => {
    const config: DeckConfig = createDeckInstance().config;
    let s: DeckState = emptyDeckState();
    for (let i: number = 0; i < 10; i++) s = addDeck(s, config, 'decks/test.xml', `id-${i}`);
    expect(s.decks).toHaveLength(10);
    expect(s.decks[0].name).toBe('Testdeck');
    expect(s.decks[9].name).toBe('Testdeck (10)');
    expect(ids(s.decks[9].drawPile)).toEqual(['b1', 'c1']);
  });

  it('names a deck without name "Deck"', () => {
    const config: DeckConfig = { ...createDeckInstance().config, name: '  ' };
    expect(addDeck(emptyDeckState(), config, '', 'x').decks[0].name).toBe('Deck');
  });

  it('renames a deck and ignores blank or unchanged names', () => {
    const s: DeckState = createTwoDeckState();
    expect(renameDeck(s, 'deck-2', ' Monster ').decks[1].name).toBe('Monster');
    expect(renameDeck(s, 'deck-2', '  ')).toBe(s);
    expect(renameDeck(s, 'deck-1', 'Testdeck')).toBe(s);
  });

  it('removes a deck with its active card and equipped cards only', () => {
    const s: DeckState = {
      ...drawCard(createTwoDeckState(), 'deck-2'),
      assigned: [
        assignedCard(TOWER_SHIELD, 'a', 'leftHand'),
        assignedCard(TOWER_SHIELD, 'b', 'leftHand', 'deck-2'),
      ],
    };
    const next: DeckState = removeDeck(s, 'deck-2');
    expect(next.decks.map((d) => d.id)).toEqual(['deck-1']);
    expect(next.activeCard).toBeNull();
    expect(next.assigned).toEqual([assignedCard(TOWER_SHIELD, 'a', 'leftHand')]);
    expect(removeDeck(next, 'deck-2')).toBe(next);
  });

  it('keeps the active card of another deck when removing', () => {
    const s: DeckState = drawCard(createTwoDeckState(), 'deck-1');
    expect(removeDeck(s, 'deck-2').activeCard?.deckId).toBe('deck-1');
  });

  it('moves a deck up and down, but not beyond the edges', () => {
    const s: DeckState = createTwoDeckState();
    expect(moveDeck(s, 'deck-2', -1).decks.map((d) => d.id)).toEqual(['deck-2', 'deck-1']);
    expect(moveDeck(s, 'deck-1', 1).decks.map((d) => d.id)).toEqual(['deck-2', 'deck-1']);
    expect(moveDeck(s, 'deck-1', -1)).toBe(s);
    expect(moveDeck(s, 'deck-2', 1)).toBe(s);
    expect(moveDeck(s, 'unknown', 1)).toBe(s);
    expect(moveDeck(s, 'deck-1', 0)).toBe(s);
  });

  it('shuffles only the chosen draw pile', () => {
    const s: DeckState = createTwoDeckState();
    const next: DeckState = shuffleDrawPile(s, 'deck-2');
    expect(ids(next.decks[1].drawPile)).toEqual(['b1', 'c1']);
    expect(next.decks[0]).toBe(s.decks[0]);
  });

  it('resets only the chosen deck including its active card', () => {
    const active: DeckState = drawCard(drawCard(createTwoDeckState(), 'deck-1'), 'deck-2');
    const next: DeckState = resetDeck(active, 'deck-2');
    expect(ids(next.decks[1].drawPile)).toEqual(['b1', 'c1']);
    expect(next.activeCard).toBeNull();
    expect(next.decks[0]).toEqual(active.decks[0]);
    expect(resetDeck(active, 'deck-1').activeCard?.deckId).toBe('deck-2');
    expect(resetDeck(active, 'unknown')).toBe(active);
  });
});
