import { normalizedCard, withNormalizedCards } from './card-normalize.util';
import { Card } from '../../models/card.model';
import { DeckInstance, DeckState } from '../../models/deck-state.model';
import {
  assignedCard,
  BASIC_CARD,
  createDeckInstance,
  inventoryCard,
  OWN_BACK_CARD,
  RUNE_ARMOR,
  TEST_BACK,
} from '../../testing/deck.fixtures';

/** Karte, wie sie ein älterer Stand ohne Rückseite und mit dem früheren Typ `combat` enthält. */
const LEGACY_COMBAT: Card = {
  id: 'k',
  name: 'Keule',
  imagePath: 'k.svg',
  description: '',
  cardType: 'combat',
  attack: 4,
  defense: 1,
} as unknown as Card;

const withoutBack: <T extends Card>(card: T) => T = (card) => ({ ...card, backImagePath: '' });

describe('card-normalize.util', () => {
  it('gives a card without back the deck back and keeps an own back', () => {
    expect(normalizedCard(withoutBack(BASIC_CARD), TEST_BACK)).toEqual(BASIC_CARD);
    expect(normalizedCard(OWN_BACK_CARD, TEST_BACK)).toEqual(OWN_BACK_CARD);
  });

  it('loads a former combat card as basic card without its values', () => {
    expect(normalizedCard(LEGACY_COMBAT, 'b.svg')).toEqual({
      id: 'k',
      name: 'Keule',
      imagePath: 'k.svg',
      backImagePath: 'b.svg',
      description: '',
      cardType: 'basic',
    });
  });

  it('keeps slot and modifiers of equipment cards', () => {
    expect(normalizedCard(withoutBack(RUNE_ARMOR), TEST_BACK)).toEqual(RUNE_ARMOR);
  });

  it('fills the backs in every place from the deck of the card', () => {
    const deck: DeckInstance = createDeckInstance('deck-1', {
      drawPile: [LEGACY_COMBAT],
      discardPile: [withoutBack(BASIC_CARD)],
      bank: [OWN_BACK_CARD],
    });
    const state: DeckState = withNormalizedCards({
      decks: [{ ...deck, config: { ...deck.config, defaultCardType: 'combat' as 'basic' } }],
      hand: [{ deckId: 'deck-1', card: withoutBack(BASIC_CARD) }],
      assigned: [assignedCard(withoutBack(RUNE_ARMOR), 'a', 'body')],
      inventory: [inventoryCard(LEGACY_COMBAT, 'a'), inventoryCard(BASIC_CARD, 'b', 'gone')],
    });

    const [normalized] = state.decks;
    expect(normalized.config.defaultCardType).toBe('basic');
    expect(normalized.drawPile[0]).toMatchObject({ cardType: 'basic', backImagePath: TEST_BACK });
    expect(normalized.discardPile).toEqual([BASIC_CARD]);
    expect(normalized.bank).toEqual([OWN_BACK_CARD]);
    expect(state.hand[0].card).toEqual(BASIC_CARD);
    expect(state.assigned[0].card).toEqual(RUNE_ARMOR);
    expect(state.inventory[0].card.backImagePath).toBe(TEST_BACK);
    expect(state.inventory[1].card).toEqual(BASIC_CARD);
  });
});
