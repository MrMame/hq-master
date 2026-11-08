import { TestBed } from '@angular/core/testing';

import { EquipmentService } from './equipment.service';
import { CardManagerService } from '../card-deck/card-manager.service';
import { CharactersDbService } from '../characters/characters-db.service';
import { Card } from '../../models/card.model';
import { CharacterInfo } from '../../models/character-info.model';
import { CardRef } from '../../models/deck-state.model';
import { createTestCharacter } from '../../testing/character.fixtures';
import { createDeckInstance, createPropertyCard } from '../../testing/deck.fixtures';
import { applyDamage } from '../../../shared/utils/damage.util';
import { DamageTypes } from '../../models/damage-types.model';

const LIFE: Card = createPropertyCard('l1', 'Lebensamulett', [{ name: 'Leben', value: 30 }]);
const LIFE_REF: CardRef = { deckId: 'deck-1', cardId: 'l1' };

describe('EquipmentService – properties', () => {
  let service: EquipmentService;
  let charactersDb: CharactersDbService;
  const hero: CharacterInfo = { ...createTestCharacter('a'), name: 'Held', Leben: 20 };
  const leben: () => number = () => charactersDb.characters()[0].Leben;

  beforeEach(() => {
    service = TestBed.inject(EquipmentService);
    charactersDb = TestBed.inject(CharactersDbService);
    charactersDb.writeCharacter(hero);
    TestBed.inject(CardManagerService).restore({
      decks: [createDeckInstance('deck-1', { bank: [LIFE] })],
      hand: [],
      assigned: [],
      inventory: [],
      belt: [],
    });
  });

  it('raises Leben when equipping „Leben +30“ (20 → 50) and lowers it when discarding (50 → 20)', () => {
    service.assignCard(LIFE_REF, 'a', 'amulet');
    expect(leben()).toBe(50);
    service.moveCard(LIFE_REF, { kind: 'discardPile' });
    expect(leben()).toBe(20);
  });

  it('kills the character when the card is taken off after 40 damage', () => {
    service.assignCard(LIFE_REF, 'a', 'head');
    charactersDb.writeCharacter(
      applyDamage(charactersDb.characters()[0], DamageTypes.Critical, 40),
    );
    service.moveCard(LIFE_REF, { kind: 'bank' });
    expect(leben()).toBe(0);
  });

  it('keeps Leben when the card only changes the slot of the same character', () => {
    service.assignCard(LIFE_REF, 'a', 'head');
    service.assignCard(LIFE_REF, 'a', 'body');
    expect(leben()).toBe(50);
  });

  it('keeps Leben for a card in the inventory', () => {
    service.moveCard(LIFE_REF, { kind: 'inventory', characterId: 'a' });
    expect(leben()).toBe(20);
  });

  it('lowers Leben when the deck of a worn card is removed', () => {
    service.assignCard(LIFE_REF, 'a', 'amulet');
    service.removeDeck('deck-1');
    expect(leben()).toBe(20);
    expect(TestBed.inject(CardManagerService).decks()).toEqual([]);
  });
});
