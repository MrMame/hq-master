import { TestBed } from '@angular/core/testing';

import { EquipmentService } from './equipment.service';
import { CardManagerService } from '../card-deck/card-manager.service';
import { CharactersDbService } from '../characters/characters-db.service';
import { GameLogService } from '../game-log/game-log.service';
import { CharacterInfo } from '../../models/character-info.model';
import { Card } from '../../models/card.model';
import { CardRef, DeckInstance } from '../../models/deck-state.model';
import { createTestCharacter } from '../../testing/character.fixtures';
import {
  assignedCard,
  createEquipmentDeckState,
  RUNE_ARMOR,
  TOWER_SHIELD,
} from '../../testing/deck.fixtures';

const RUNE_ARMOR_REF: CardRef = { deckId: 'deck-1', cardId: 'e1' };
const TOWER_SHIELD_REF: CardRef = { deckId: 'deck-1', cardId: 'e2' };

describe('EquipmentService – moveCard', () => {
  let service: EquipmentService;
  let cardManager: CardManagerService;
  let charactersDb: CharactersDbService;
  // Rüstung 6/6 durch die Runenrüstung (Grundmaximum 4), Turmschild in der linken Hand.
  const barbarian: CharacterInfo = {
    ...createTestCharacter('a'),
    name: 'Barbar',
    armor: 6,
    maxArmor: 4,
  };

  const character: () => CharacterInfo = () => charactersDb.characters()[0];
  const deck: () => DeckInstance = () => cardManager.state().decks[0];
  const logTexts: () => string[] = () =>
    TestBed.inject(GameLogService)
      .entries()
      .map((entry) => entry.text);

  beforeEach(() => {
    service = TestBed.inject(EquipmentService);
    cardManager = TestBed.inject(CardManagerService);
    charactersDb = TestBed.inject(CharactersDbService);
    charactersDb.writeCharacter(barbarian);
    cardManager.restore({
      ...createEquipmentDeckState('a'),
      hand: [],
      assigned: [
        assignedCard(RUNE_ARMOR, 'a', 'body'),
        assignedCard(TOWER_SHIELD, 'a', 'leftHand'),
      ],
    });
  });

  it.each([
    ['bank', { kind: 'bank' }, (d: DeckInstance): Card[] => d.bank],
    ['discard pile', { kind: 'discardPile' }, (d: DeckInstance): Card[] => d.discardPile],
  ] as const)(
    'takes an equipped card into the %s, lowers armor to the new maximum and logs it (6/6 → 4/4)',
    (_name, target, pile) => {
      service.moveCard(RUNE_ARMOR_REF, target);

      expect(pile(deck())).toEqual([RUNE_ARMOR]);
      expect(service.assigned().map((entry) => entry.card)).toEqual([TOWER_SHIELD]);
      expect(character().armor).toBe(4);
      expect(logTexts()).toEqual(['Barbar legt Runenrüstung ab']);
    },
  );

  it('takes an equipped card into the hand and logs it', () => {
    service.moveCard(TOWER_SHIELD_REF, { kind: 'hand' });
    expect(cardManager.hand()).toEqual([{ deckId: 'deck-1', card: TOWER_SHIELD }]);
    expect(character()).toEqual(barbarian);
    expect(logTexts()).toEqual(['Barbar legt Turmschild ab']);
  });

  it('moves a free card without touching characters or the log', () => {
    service.moveCard({ deckId: 'deck-1', cardId: 'b1' }, { kind: 'hand' });
    expect(cardManager.hand().map((entry) => entry.card.id)).toEqual(['b1']);
    expect(character()).toEqual(barbarian);
    expect(logTexts()).toEqual([]);
  });

  it('assigns the card for a slot as target', () => {
    service.moveCard(TOWER_SHIELD_REF, { kind: 'equipped', characterId: 'a', slot: 'rightHand' });
    expect(service.assigned().map((entry) => entry.slot)).toEqual(['body', 'rightHand']);
    expect(logTexts()).toEqual(['Barbar erhält Turmschild (Rechte Hand)']);
  });

  it('logs nothing for an unknown card or an owner who is no longer in the session', () => {
    service.moveCard({ deckId: 'deck-2', cardId: 'e1' }, { kind: 'bank' });
    charactersDb.removeCharacter(barbarian);
    service.moveCard(RUNE_ARMOR_REF, { kind: 'bank' });
    expect(deck().bank).toEqual([RUNE_ARMOR]);
    expect(logTexts()).toEqual([]);
  });
});
