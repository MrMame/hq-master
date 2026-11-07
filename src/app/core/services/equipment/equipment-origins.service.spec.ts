import { TestBed } from '@angular/core/testing';

import { EquipmentService } from './equipment.service';
import { CardManagerService } from '../card-deck/card-manager.service';
import { CharactersDbService } from '../characters/characters-db.service';
import { GameLogService } from '../game-log/game-log.service';
import { EquipmentCard } from '../../models/card.model';
import { CharacterInfo } from '../../models/character-info.model';
import { PileKind } from '../../models/card-location.model';
import { AssignedCard, CardRef, DeckInstance, DeckState } from '../../models/deck-state.model';
import { createTestCharacter } from '../../testing/character.fixtures';
import {
  assignedCard,
  createEquipmentCard,
  createEquipmentDeckState,
  RUNE_ARMOR,
} from '../../testing/deck.fixtures';

const RUNE_ARMOR_REF: CardRef = { deckId: 'deck-1', cardId: 'e1' };
// Handschuh: Hand, Rüstung +1.
const GAUNTLET: EquipmentCard = createEquipmentCard('e7', 'Handschuh', 'hand', [
  { stat: 'maxArmor', value: 1 },
]);

describe('EquipmentService – any origin', () => {
  let service: EquipmentService;
  let cardManager: CardManagerService;
  let charactersDb: CharactersDbService;
  // Rüstung 4/4; Zwerg 4/4 nur mit Runenrüstung (Grundwert 2).
  const barbarian: CharacterInfo = { ...createTestCharacter('a'), name: 'Barbar', armor: 4 };
  const dwarf: CharacterInfo = {
    ...createTestCharacter('b'),
    name: 'Zwerg',
    armor: 4,
    maxArmor: 2,
  };

  const armorOf: (id: string) => number = (id) =>
    charactersDb.characters().find((character) => character.id === id)!.armor;
  const logTexts: () => string[] = () =>
    TestBed.inject(GameLogService)
      .entries()
      .map((entry) => entry.text);

  /** Ohne aktive Karte, nur mit den übergebenen Zuweisungen; `pile` nimmt die Runenrüstung auf. */
  function restore(assigned: AssignedCard[], pile?: PileKind): void {
    const base: DeckState = createEquipmentDeckState('a');
    const deck: DeckInstance = base.decks[0];
    cardManager.restore({
      ...base,
      hand: [],
      assigned,
      decks: [pile ? { ...deck, [pile]: [...deck[pile], RUNE_ARMOR] } : deck],
    });
  }

  beforeEach(() => {
    service = TestBed.inject(EquipmentService);
    cardManager = TestBed.inject(CardManagerService);
    charactersDb = TestBed.inject(CharactersDbService);
    charactersDb.writeCharacter(barbarian);
    charactersDb.writeCharacter(dwarf);
  });

  it.each<PileKind>(['drawPile', 'discardPile', 'bank'])(
    'assigns from the %s, raises armor and logs it (4/4 → 6/6)',
    (pile) => {
      restore([], pile);
      service.assignCard(RUNE_ARMOR_REF, 'a', 'body');

      expect(cardManager.state().decks[0][pile]).not.toContain(RUNE_ARMOR);
      expect(service.assigned()).toEqual([assignedCard(RUNE_ARMOR, 'a', 'body')]);
      expect(armorOf('a')).toBe(6);
      expect(logTexts()).toEqual(['Barbar erhält Runenrüstung (Körper)']);
    },
  );

  it('takes the card from another character, limiting the giver to the new maximum', () => {
    restore([assignedCard(RUNE_ARMOR, 'b', 'body')]);
    service.assignCard(RUNE_ARMOR_REF, 'a', 'body');

    expect(service.assigned()).toEqual([assignedCard(RUNE_ARMOR, 'a', 'body')]);
    expect(armorOf('b')).toBe(2);
    expect(armorOf('a')).toBe(6);
    expect(logTexts()).toEqual([
      'Zwerg legt Runenrüstung ab',
      'Barbar erhält Runenrüstung (Körper)',
    ]);
  });

  it('keeps the values when a card only changes the hand of the same character', () => {
    charactersDb.writeCharacter({ ...barbarian, armor: 5 });
    restore([assignedCard(GAUNTLET, 'a', 'leftHand')]);
    service.assignCard({ deckId: 'deck-1', cardId: 'e7' }, 'a', 'rightHand');

    expect(service.assigned()).toEqual([assignedCard(GAUNTLET, 'a', 'rightHand')]);
    expect(armorOf('a')).toBe(5);
    expect(logTexts()).toEqual(['Barbar erhält Handschuh (Rechte Hand)']);
  });

  it('logs only the receiver when the previous owner is not in the session', () => {
    restore([assignedCard(RUNE_ARMOR, 'gone', 'body')]);
    service.assignCard(RUNE_ARMOR_REF, 'a', 'body');

    expect(armorOf('a')).toBe(6);
    expect(logTexts()).toEqual(['Barbar erhält Runenrüstung (Körper)']);
  });

  it('changes nothing when the card already lies in the chosen slot', () => {
    restore([assignedCard(RUNE_ARMOR, 'a', 'body')]);
    service.assignCard(RUNE_ARMOR_REF, 'a', 'body');

    expect(armorOf('a')).toBe(4);
    expect(logTexts()).toEqual([]);
  });
});
