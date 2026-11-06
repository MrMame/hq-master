import { TestBed } from '@angular/core/testing';

import { EquipmentService } from './equipment.service';
import { CardManagerService } from '../card-deck/card-manager.service';
import { CharactersDbService } from '../characters/characters-db.service';
import { GameLogService } from '../game-log/game-log.service';
import { CharacterInfo } from '../../models/character-info.model';
import { DeckState } from '../../models/deck-state.model';
import { createTestCharacter } from '../../testing/character.fixtures';
import {
  createEquipmentCard,
  createEquipmentDeckState,
  RUNE_ARMOR,
  TOWER_SHIELD,
} from '../../testing/deck.fixtures';

describe('EquipmentService', () => {
  let service: EquipmentService;
  let cardManager: CardManagerService;
  let charactersDb: CharactersDbService;
  // Rüstung 4/4, Turmschild in der linken Hand, Runenrüstung aktiv.
  const barbarian: CharacterInfo = { ...createTestCharacter('a'), name: 'Barbar', armor: 4 };

  const character: () => CharacterInfo = () => charactersDb.characters()[0];
  const deck: () => DeckState = () => cardManager.state() as DeckState;
  const logTexts: () => string[] = () =>
    TestBed.inject(GameLogService)
      .entries()
      .map((entry) => entry.text);

  beforeEach(() => {
    service = TestBed.inject(EquipmentService);
    cardManager = TestBed.inject(CardManagerService);
    charactersDb = TestBed.inject(CharactersDbService);
    charactersDb.writeCharacter(barbarian);
    cardManager.restore(createEquipmentDeckState('a'));
  });

  it('assigns the active card, raises armor by its bonus and logs it (4/4 → 6/6)', () => {
    service.assignActiveCard('a', 'body');

    expect(deck().activeCard).toBeNull();
    expect(service.assigned().map((entry) => entry.card)).toEqual([TOWER_SHIELD, RUNE_ARMOR]);
    expect(character()).toEqual({ ...barbarian, armor: 6 });
    expect(logTexts()).toEqual(['Barbar erhält Runenrüstung (Körper)']);
  });

  it('discards the card of an occupied slot first and logs both', () => {
    const armor: CharacterInfo = { ...barbarian, armor: 6 };
    charactersDb.writeCharacter(armor);
    cardManager.restore({
      ...createEquipmentDeckState('a'),
      assigned: [{ card: RUNE_ARMOR, characterId: 'a', slot: 'body' }],
      activeCard: createEquipmentCard('e5', 'Kettenhemd', 'body', [{ stat: 'maxArmor', value: 1 }]),
    });

    service.assignActiveCard('a', 'body');

    // 6/6 → Runenrüstung ab → 4/4 → Kettenhemd +1 → 5/5
    expect(character().armor).toBe(5);
    expect(deck().discardPile).toEqual([RUNE_ARMOR]);
    expect(logTexts()).toEqual([
      'Barbar legt Runenrüstung ab',
      'Barbar erhält Kettenhemd (Körper)',
    ]);
  });

  it('ignores assigning without equipment card or unknown character', () => {
    service.assignActiveCard('x', 'body');
    cardManager.discardActiveCard();
    service.assignActiveCard('a', 'body');
    expect(service.assigned()).toHaveLength(1);
    expect(character()).toEqual(barbarian);
    expect(logTexts()).toEqual([]);
  });

  it('discards cards of a character onto the discard pile and logs it', () => {
    service.discardCards(barbarian, ['e2', 'e1']);

    expect(service.assigned()).toEqual([]);
    expect(deck().discardPile).toEqual([TOWER_SHIELD]);
    expect(logTexts()).toEqual(['Barbar legt Turmschild ab']);
  });

  it('does not discard cards of other characters', () => {
    service.discardCards({ ...barbarian, id: 'b' }, ['e2']);
    expect(service.assigned()).toHaveLength(1);
    expect(logTexts()).toEqual([]);
  });
});
