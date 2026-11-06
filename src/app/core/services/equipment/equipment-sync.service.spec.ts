import { TestBed } from '@angular/core/testing';

import { EquipmentSyncService } from './equipment-sync.service';
import { CardManagerService } from '../card-deck/card-manager.service';
import { CharactersDbService } from '../characters/characters-db.service';
import { CharacterInfo } from '../../models/character-info.model';
import { DeckState } from '../../models/deck-state.model';
import { createTestCharacter } from '../../testing/character.fixtures';
import {
  assignedCard,
  createEquipmentDeckState,
  RUNE_ARMOR,
  TOWER_SHIELD,
} from '../../testing/deck.fixtures';

describe('EquipmentSyncService', () => {
  let cardManager: CardManagerService;
  let charactersDb: CharactersDbService;
  // Grundmaximum Rüstung 4; mit Runenrüstung 6.
  const owner: CharacterInfo = { ...createTestCharacter('a'), armor: 6 };

  const deck: () => DeckState = () => cardManager.state() as DeckState;
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
    expect(deck().discardPile).toEqual([TOWER_SHIELD]);
  });

  it('keeps current values within the effective maximum', () => {
    expect(charactersDb.characters()[0].armor).toBe(6);
  });

  it('discards all cards of a removed character', () => {
    charactersDb.removeCharacter(owner);
    sync();
    expect(deck().assigned).toEqual([]);
    expect(deck().discardPile).toEqual([TOWER_SHIELD, RUNE_ARMOR]);
  });

  it('lowers armor to the base maximum when a new deck drops the assignments', () => {
    cardManager.loadDeckConfig(deck().config);
    sync();
    expect(charactersDb.characters()[0].armor).toBe(4);
  });
});
