import { MockInstance } from 'vitest';
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
  SWORD_CARD,
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

  it('loads a former combat card without type and values', () => {
    expect(normalizedCard(LEGACY_COMBAT, 'b.svg')).toEqual({
      id: 'k',
      name: 'Keule',
      imagePath: 'k.svg',
      backImagePath: 'b.svg',
      description: '',
      properties: [],
    });
  });

  it('drops type and slot of an old stored equipment card', () => {
    const old: Card = { ...RUNE_ARMOR, cardType: 'equipment', slot: 'body' } as Card;
    expect(normalizedCard(old, TEST_BACK)).toEqual(RUNE_ARMOR);
  });

  it('keeps slot and properties of equipment cards', () => {
    expect(normalizedCard(withoutBack(RUNE_ARMOR), TEST_BACK)).toEqual(RUNE_ARMOR);
  });

  it('drops old modifiers and invalid properties of stored cards', () => {
    const warn: MockInstance<(...data: unknown[]) => void> = vi
      .spyOn(console, 'warn')
      .mockImplementation(() => undefined);
    const stored: Card = {
      ...BASIC_CARD,
      modifiers: [{ stat: 'armor', value: 2 }],
      properties: [{ name: 'Angriff', value: 3 }, { name: '', value: 1 }, 'x'],
    } as unknown as Card;

    expect(normalizedCard(stored, TEST_BACK)).toEqual({
      ...BASIC_CARD,
      properties: [{ name: 'Angriff', value: 3 }],
    });
    expect(
      normalizedCard({ ...RUNE_ARMOR, properties: undefined } as unknown as Card, TEST_BACK),
    ).toEqual({ ...RUNE_ARMOR, properties: [] });
    expect(warn).toHaveBeenCalledTimes(2);
    warn.mockRestore();
  });

  it('fills the backs in every place from the deck of the card', () => {
    const deck: DeckInstance = createDeckInstance('deck-1', {
      drawPile: [{ ...LEGACY_COMBAT, id: 'k-2' }],
      discardPile: [withoutBack(BASIC_CARD)],
      bank: [OWN_BACK_CARD],
    });
    const state: DeckState = withNormalizedCards({
      decks: [
        { ...deck, config: { ...deck.config, defaultCardType: 'combat' } as typeof deck.config },
      ],
      hand: [{ deckId: 'deck-1', card: withoutBack(SWORD_CARD) }],
      assigned: [assignedCard(withoutBack(RUNE_ARMOR), 'a', 'body')],
      inventory: [inventoryCard(LEGACY_COMBAT, 'a'), inventoryCard(BASIC_CARD, 'b', 'gone')],
      belt: [inventoryCard(withoutBack(SWORD_CARD), 'a')],
    });

    const [normalized] = state.decks;
    expect(Object.keys(normalized.config)).not.toContain('defaultCardType');
    expect(normalized.drawPile[0]).toMatchObject({ backImagePath: TEST_BACK });
    expect(Object.keys(normalized.drawPile[0])).not.toContain('cardType');
    expect(normalized.discardPile).toEqual([BASIC_CARD]);
    expect(normalized.bank).toEqual([OWN_BACK_CARD]);
    expect(state.hand[0].card).toEqual(SWORD_CARD);
    expect(state.assigned[0].card).toEqual(RUNE_ARMOR);
    expect(state.inventory[0].card.backImagePath).toBe(TEST_BACK);
    expect(state.inventory[1].card).toEqual(BASIC_CARD);
    expect(state.belt[0].card).toEqual(SWORD_CARD);
  });
});
