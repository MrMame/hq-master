import { TestBed } from '@angular/core/testing';

import { EquipmentService } from './equipment.service';
import { CardManagerService } from '../card-deck/card-manager.service';
import { CharactersDbService } from '../characters/characters-db.service';
import { GameLogService } from '../game-log/game-log.service';
import { CharacterInfo } from '../../models/character-info.model';
import { CardRef, DeckState } from '../../models/deck-state.model';
import { GameLogEntryType } from '../../models/game-log-entry.model';
import { createTestCharacter } from '../../testing/character.fixtures';
import {
  assignedCard,
  BASIC_CARD,
  createEquipmentDeckState,
  inventoryCard,
  RUNE_ARMOR,
  TOWER_SHIELD,
} from '../../testing/deck.fixtures';

const RUNE_ARMOR_REF: CardRef = { deckId: 'deck-1', cardId: 'e1' };
const SHIELD_REF: CardRef = { deckId: 'deck-1', cardId: 'e2' };

describe('EquipmentService – inventory', () => {
  let service: EquipmentService;
  let cardManager: CardManagerService;
  let charactersDb: CharactersDbService;
  const barbarian: CharacterInfo = { ...createTestCharacter('a'), name: 'Barbar', armor: 4 };
  const dwarf: CharacterInfo = { ...createTestCharacter('b'), name: 'Zwerg', armor: 4 };

  const character: (id: string) => CharacterInfo = (id) =>
    charactersDb.characters().find((c) => c.id === id)!;
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
    // Runenrüstung in der Hand, Turmschild in der linken Hand von „a“; leerer Nachziehstapel, damit jede
    // Karte nur an einem Ort liegt.
    const s: DeckState = createEquipmentDeckState('a');
    cardManager.restore({ ...s, decks: [{ ...s.decks[0], drawPile: [] }] });
  });

  it('follows the example of REQUIREMENTS: 4/4 → inventory 4/4 → equip 6/6 → 3 damage 3/6 → stow 3/4', () => {
    service.moveCard(RUNE_ARMOR_REF, { kind: 'inventory', characterId: 'a' });
    expect(character('a').armor).toBe(4);
    expect(service.inventory()).toEqual([inventoryCard(RUNE_ARMOR, 'a')]);

    service.assignCard(RUNE_ARMOR_REF, 'a', 'body');
    expect(character('a').armor).toBe(6);
    charactersDb.writeCharacter({ ...character('a'), armor: 3 });

    service.moveCard(RUNE_ARMOR_REF, { kind: 'inventory', characterId: 'a' });
    expect(character('a').armor).toBe(3);
    expect(service.assigned()).toEqual([assignedCard(TOWER_SHIELD, 'a', 'leftHand')]);
    expect(log()).toEqual([
      ['inventory-added', 'Runenrüstung ins Inventar von Barbar'],
      ['inventory-removed', 'Runenrüstung von Barbar aus dem Inventar angelegt'],
      ['inventory-added', 'Runenrüstung ins Inventar von Barbar'],
    ]);
  });

  it('limits the owner to the new maximum when a slot card goes into an inventory', () => {
    charactersDb.writeCharacter({ ...barbarian, armor: 6 });
    cardManager.restore({
      ...deck(),
      hand: [],
      assigned: [assignedCard(RUNE_ARMOR, 'a', 'body')],
    });
    service.moveCard(RUNE_ARMOR_REF, { kind: 'inventory', characterId: 'b' });
    expect(character('a').armor).toBe(4);
    expect(character('b').armor).toBe(4);
    expect(log()).toEqual([['inventory-added', 'Runenrüstung von Barbar ins Inventar von Zwerg']]);
  });

  it('hands on an inventory card and takes it out of the inventory into other places', () => {
    cardManager.restore({ ...deck(), inventory: [inventoryCard(BASIC_CARD, 'a')] });
    const torch: CardRef = { deckId: 'deck-1', cardId: 'b1' };
    service.moveCard(torch, { kind: 'inventory', characterId: 'b' });
    service.moveCard(torch, { kind: 'hand' });
    service.moveCard(torch, { kind: 'inventory', characterId: 'a' });
    service.moveCard(torch, { kind: 'bank' });
    expect(deck().decks[0].bank).toEqual([BASIC_CARD]);
    expect(log().map(([, text]) => text)).toEqual([
      'Fackel von Barbar ins Inventar von Zwerg',
      'Fackel aus dem Inventar von Zwerg in die Hand',
      'Fackel ins Inventar von Barbar',
      'Fackel aus dem Inventar von Barbar in die Bank',
    ]);
  });

  it('equips an inventory card of one character to another and names both', () => {
    cardManager.restore({ ...deck(), hand: [], inventory: [inventoryCard(RUNE_ARMOR, 'a')] });
    service.assignCard(RUNE_ARMOR_REF, 'b', 'body');
    expect(character('b').armor).toBe(6);
    expect(character('a').armor).toBe(4);
    expect(log()).toEqual([
      ['inventory-removed', 'Runenrüstung aus dem Inventar von Barbar an Zwerg angelegt'],
    ]);
  });

  it('puts the card of an occupied slot into the inventory of the receiver on request', () => {
    cardManager.restore({
      ...deck(),
      hand: [{ deckId: 'deck-1', card: TOWER_SHIELD }],
      assigned: [],
    });
    service.assignCard(SHIELD_REF, 'a', 'leftHand');
    cardManager.restore({
      ...deck(),
      hand: [{ deckId: 'deck-1', card: RUNE_ARMOR }],
      assigned: [assignedCard(TOWER_SHIELD, 'a', 'body')],
    });
    TestBed.inject(GameLogService).clear();
    service.assignCard(RUNE_ARMOR_REF, 'a', 'body', 'inventory');
    expect(deck().inventory).toEqual([inventoryCard(TOWER_SHIELD, 'a')]);
    expect(deck().decks[0].discardPile).toEqual([]);
    expect(log().map(([type]) => type)).toEqual(['inventory-added', 'equipment-assigned']);
  });

  it('logs no inventory move of a character who is not in the session', () => {
    cardManager.restore({ ...deck(), inventory: [inventoryCard(BASIC_CARD, 'x')] });
    service.moveCard({ deckId: 'deck-1', cardId: 'b1' }, { kind: 'hand' });
    service.moveCard({ deckId: 'deck-1', cardId: 'b1' }, { kind: 'inventory', characterId: 'x' });
    // Die Karte bewegt sich, nur das Log fehlt ohne Charakter.
    expect(deck().inventory).toEqual([inventoryCard(BASIC_CARD, 'x')]);
    expect(deck().hand).toEqual([{ deckId: 'deck-1', card: RUNE_ARMOR }]);
    expect(log()).toEqual([]);
  });
});
