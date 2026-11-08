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
  // Rüstung 6, davon +2 durch die Runenrüstung.
  const owner: CharacterInfo = { ...createTestCharacter('a'), Ruestung: 6 };

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

  it('keeps current values without an upper limit', () => {
    expect(charactersDb.characters()[0].Ruestung).toBe(6);
  });

  it('turns Leben and Ruestung into whole numbers of at least 0', () => {
    charactersDb.writeCharacter({ ...owner, Leben: 4.5, Ruestung: -2 });
    sync();
    expect(charactersDb.characters()[0]).toMatchObject({ Leben: 4, Ruestung: 0 });
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
});
