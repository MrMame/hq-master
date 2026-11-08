import { TestBed } from '@angular/core/testing';

import { EquipmentService } from './equipment.service';
import { EquipmentSyncService } from './equipment-sync.service';
import { CardManagerService } from '../card-deck/card-manager.service';
import { CharactersDbService } from '../characters/characters-db.service';
import { GameLogService } from '../game-log/game-log.service';
import { Card } from '../../models/card.model';
import { CharacterInfo } from '../../models/character-info.model';
import { CardRef, DeckState } from '../../models/deck-state.model';
import { GameLogEntryType } from '../../models/game-log-entry.model';
import { createTestCharacter } from '../../testing/character.fixtures';
import { createDeckInstance, createPropertyCard, inventoryCard } from '../../testing/deck.fixtures';
import { locateCard } from '../card-deck/card-location.util';

const POTION: Card = createPropertyCard('p1', 'Heiltrank', [
  { name: 'Leben', value: 30 },
  { name: 'Blitzschaden', value: 2 },
]);
const POTION_REF: CardRef = { deckId: 'deck-1', cardId: 'p1' };

describe('EquipmentService – belt', () => {
  let service: EquipmentService;
  let cardManager: CardManagerService;
  let charactersDb: CharactersDbService;
  const barbarian: CharacterInfo = { ...createTestCharacter('a'), name: 'Barbar', Leben: 20 };
  const dwarf: CharacterInfo = { ...createTestCharacter('b'), name: 'Zwerg', Leben: 10 };

  const leben: (id: string) => number = (id) =>
    charactersDb.characters().find((c) => c.id === id)!.Leben;
  const deck: () => DeckState = () => cardManager.state();
  const log: () => [GameLogEntryType, string][] = () =>
    TestBed.inject(GameLogService)
      .entries()
      .map((entry) => [entry.type, entry.text]);

  beforeEach(() => {
    service = TestBed.inject(EquipmentService);
    cardManager = TestBed.inject(CardManagerService);
    charactersDb = TestBed.inject(CharactersDbService);
    charactersDb.writeCharacter(barbarian);
    charactersDb.writeCharacter(dwarf);
    cardManager.restore({
      decks: [createDeckInstance('deck-1', { bank: [POTION] })],
      hand: [],
      assigned: [],
      inventory: [],
      belt: [],
    });
  });

  it('puts any card into a belt, newest last, and raises Leben by its value', () => {
    service.moveCard(POTION_REF, { kind: 'belt', characterId: 'a' });
    expect(deck().belt).toEqual([inventoryCard(POTION, 'a')]);
    expect(service.belt()).toEqual([inventoryCard(POTION, 'a')]);
    expect(leben('a')).toBe(50);
    expect(log()).toEqual([['belt-added', 'Heiltrank in den Gürtel von Barbar']]);
  });

  it('keeps Leben between slot and belt of the same character', () => {
    service.assignCard(POTION_REF, 'a', 'head');
    service.moveCard(POTION_REF, { kind: 'belt', characterId: 'a' });
    expect(leben('a')).toBe(50);
    service.assignCard(POTION_REF, 'a', 'body');
    expect(leben('a')).toBe(50);
    expect(log().slice(-1)).toEqual([
      ['belt-removed', 'Heiltrank von Barbar aus dem Gürtel angelegt'],
    ]);
  });

  it('lowers Leben when the card goes into the inventory and moves it to another belt', () => {
    service.moveCard(POTION_REF, { kind: 'belt', characterId: 'a' });
    service.moveCard(POTION_REF, { kind: 'belt', characterId: 'b' });
    expect([leben('a'), leben('b')]).toEqual([20, 40]);
    expect(log().at(-1)).toEqual(['belt-added', 'Heiltrank von Barbar in den Gürtel von Zwerg']);

    service.moveCard(POTION_REF, { kind: 'inventory', characterId: 'b' });
    expect(leben('b')).toBe(10);
    service.moveCard(POTION_REF, { kind: 'belt', characterId: 'b' });
    service.moveCard(POTION_REF, { kind: 'hand' });
    expect(log().at(-1)).toEqual([
      'belt-removed',
      'Heiltrank aus dem Gürtel von Zwerg in die Hand',
    ]);
  });

  it('discards the belt cards of a removed character', () => {
    TestBed.inject(EquipmentSyncService);
    service.moveCard(POTION_REF, { kind: 'belt', characterId: 'b' });
    charactersDb.removeCharacter(dwarf);
    TestBed.tick();
    expect(locateCard(deck(), POTION_REF)).toEqual({ kind: 'discardPile' });
    expect(leben('a')).toBe(20);
  });

  it('drops belt cards when their deck is removed and lowers Leben', () => {
    service.moveCard(POTION_REF, { kind: 'belt', characterId: 'a' });
    service.removeDeck('deck-1');
    expect(deck().belt).toEqual([]);
    expect(leben('a')).toBe(20);
  });
});
