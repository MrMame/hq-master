import { TestBed } from '@angular/core/testing';

import { EquipmentService } from './equipment.service';
import { CardManagerService } from '../card-deck/card-manager.service';
import { CharactersDbService } from '../characters/characters-db.service';
import { GameLogService } from '../game-log/game-log.service';
import { CharacterInfo } from '../../models/character-info.model';
import { Card } from '../../models/card.model';
import { CardRef, DeckState } from '../../models/deck-state.model';
import { createTestCharacter } from '../../testing/character.fixtures';
import {
  assignedCard,
  createEquipmentCard,
  createEquipmentDeckState,
  RUNE_ARMOR,
  TOWER_SHIELD,
} from '../../testing/deck.fixtures';

const RUNE_ARMOR_REF: CardRef = { deckId: 'deck-1', cardId: 'e1' };

describe('EquipmentService', () => {
  let service: EquipmentService;
  let cardManager: CardManagerService;
  let charactersDb: CharactersDbService;
  // Rüstung 4/4, Turmschild in der linken Hand, Runenrüstung in der Hand.
  const barbarian: CharacterInfo = { ...createTestCharacter('a'), name: 'Barbar', armor: 4 };

  const character: () => CharacterInfo = () => charactersDb.characters()[0];
  const deck: () => DeckState = () => cardManager.state();
  const discardPile: () => Card[] = () => deck().decks[0].discardPile;
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

  it('assigns a hand card, raises armor by its bonus and logs it (4/4 → 6/6)', () => {
    service.assignCard(RUNE_ARMOR_REF, 'a', 'body');

    expect(deck().hand).toEqual([]);
    expect(service.assigned().map((entry) => entry.card)).toEqual([TOWER_SHIELD, RUNE_ARMOR]);
    expect(character()).toEqual({ ...barbarian, armor: 6 });
    expect(logTexts()).toEqual(['Barbar erhält Runenrüstung (Körper)']);
  });

  it('discards the card of an occupied slot first and logs both', () => {
    const armor: CharacterInfo = { ...barbarian, armor: 6 };
    charactersDb.writeCharacter(armor);
    cardManager.restore({
      ...createEquipmentDeckState('a'),
      assigned: [assignedCard(RUNE_ARMOR, 'a', 'body')],
      hand: [
        {
          deckId: 'deck-1',
          card: createEquipmentCard('e5', 'Kettenhemd', 'body', [{ stat: 'maxArmor', value: 1 }]),
        },
      ],
    });

    service.assignCard({ deckId: 'deck-1', cardId: 'e5' }, 'a', 'body');

    // 6/6 → Runenrüstung ab → 4/4 → Kettenhemd +1 → 5/5
    expect(character().armor).toBe(5);
    expect(discardPile()).toEqual([RUNE_ARMOR]);
    expect(logTexts()).toEqual([
      'Barbar legt Runenrüstung ab',
      'Barbar erhält Kettenhemd (Körper)',
    ]);
  });

  it('ignores an unknown character, a non-equipment or unknown card and an unfitting slot', () => {
    service.assignCard(RUNE_ARMOR_REF, 'x', 'body');
    service.assignCard({ deckId: 'deck-1', cardId: 'b1' }, 'a', 'body');
    service.assignCard({ deckId: 'deck-2', cardId: 'e1' }, 'a', 'body');
    service.assignCard(RUNE_ARMOR_REF, 'a', 'head');
    expect(deck().hand.map((entry) => entry.card)).toEqual([RUNE_ARMOR]);
    expect(service.assigned()).toHaveLength(1);
    expect(character()).toEqual(barbarian);
    expect(logTexts()).toEqual([]);
  });
});
