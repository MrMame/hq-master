import { TestBed } from '@angular/core/testing';

import { EquipmentSyncService } from './equipment-sync.service';
import { CardManagerService } from '../card-deck/card-manager.service';
import { CharactersDbService } from '../characters/characters-db.service';
import { CharacterInfo } from '../../models/character-info.model';
import { Card } from '../../models/card.model';
import { DeckState } from '../../models/deck-state.model';
import { createTestCharacter } from '../../testing/character.fixtures';
import {
  assignedCard,
  BASIC_CARD,
  SWORD_CARD,
  createEquipmentDeckState,
  inventoryCard,
  RUNE_ARMOR,
  TOWER_SHIELD,
} from '../../testing/deck.fixtures';

describe('EquipmentSyncService', () => {
  let cardManager: CardManagerService;
  let charactersDb: CharactersDbService;
  // Grundmaximum Rüstung 4; mit Runenrüstung 6.
  const owner: CharacterInfo = { ...createTestCharacter('a'), armor: 6 };

  const deck: () => DeckState = () => cardManager.state();
  const discardPile: () => Card[] = () => deck().decks[0].discardPile;
  const sync: () => void = () => TestBed.tick();

  beforeEach(() => {
    cardManager = TestBed.inject(CardManagerService);
    charactersDb = TestBed.inject(CharactersDbService);
    charactersDb.writeCharacter(owner);
    cardManager.restore({
      ...createEquipmentDeckState('a'),
      assigned: [
        assignedCard(RUNE_ARMOR, 'a', 'body'),
        assignedCard(TOWER_SHIELD, 'b', 'leftHand'),
      ],
    });
    TestBed.inject(EquipmentSyncService);
    sync();
  });

  it('moves cards of characters missing from the session onto the discard pile', () => {
    expect(deck().assigned.map((entry) => entry.card)).toEqual([RUNE_ARMOR]);
    expect(discardPile()).toEqual([TOWER_SHIELD]);
  });

  it('keeps current values within the effective maximum', () => {
    expect(charactersDb.characters()[0].armor).toBe(6);
  });

  it('discards the inventory cards of a removed or missing character', () => {
    cardManager.restore({
      ...deck(),
      inventory: [inventoryCard(BASIC_CARD, 'a'), inventoryCard(SWORD_CARD, 'x')],
    });
    sync();
    expect(deck().inventory).toEqual([inventoryCard(BASIC_CARD, 'a')]);
    charactersDb.removeCharacter(owner);
    sync();
    expect(deck().inventory).toEqual([]);
    expect(discardPile()).toEqual(expect.arrayContaining([BASIC_CARD, SWORD_CARD]));
  });

  it('discards all cards of a removed character', () => {
    charactersDb.removeCharacter(owner);
    sync();
    expect(deck().assigned).toEqual([]);
    expect(discardPile()).toEqual([TOWER_SHIELD, RUNE_ARMOR]);
  });

  it('lowers armor to the base maximum when the deck of the equipment is removed', () => {
    cardManager.removeDeck('deck-1');
    sync();
    expect(charactersDb.characters()[0].armor).toBe(4);
  });
});
