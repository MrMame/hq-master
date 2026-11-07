import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { Observable, of } from 'rxjs';
import { Mock } from 'vitest';

import { CardAssignmentService } from './card-assignment.service';
import { AssignEquipmentChoice } from '../models/assign-equipment.model';
import { CardManagerService } from '../../core/services/card-deck/card-manager.service';
import { CharactersDbService } from '../../core/services/characters/characters-db.service';
import { SlotOccupiedDialog } from '../components/slot-occupied-dialog/slot-occupied-dialog';
import { SlotOccupiedChoice } from '../models/slot-occupied.model';
import { CharacterInfo } from '../../core/models/character-info.model';
import { CardRef, DeckState } from '../../core/models/deck-state.model';
import { createTestCharacter } from '../../core/testing/character.fixtures';
import {
  assignedCard,
  BUCKLER,
  createDeckState,
  createEquipmentDeckState,
  inventoryCard,
  RUNE_ARMOR,
  TOWER_SHIELD,
} from '../../core/testing/deck.fixtures';

const RUNE_ARMOR_REF: CardRef = { deckId: 'deck-1', cardId: 'e1' };

describe('CardAssignmentService', () => {
  let service: CardAssignmentService;
  let cardManager: CardManagerService;
  let charactersDb: CharactersDbService;
  let open: Mock;
  let choice: AssignEquipmentChoice | undefined;
  let displaced: SlotOccupiedChoice | undefined;
  const barbarian: CharacterInfo = { ...createTestCharacter('a'), name: 'Barbar' };

  const deck: () => DeckState = () => cardManager.state();

  beforeEach(() => {
    choice = { characterId: 'a', slot: 'body' };
    displaced = 'discardPile';
    open = vi.fn((component: unknown) => ({
      afterClosed: (): Observable<unknown> =>
        of(component === SlotOccupiedDialog ? displaced : choice),
    }));
    TestBed.configureTestingModule({
      providers: [{ provide: MatDialog, useValue: { open } }],
    });
    service = TestBed.inject(CardAssignmentService);
    cardManager = TestBed.inject(CardManagerService);
    charactersDb = TestBed.inject(CharactersDbService);
    charactersDb.writeCharacter(barbarian);
    // Runenrüstung in der Hand, Turmschild in der linken Hand von „a“.
    cardManager.restore(createEquipmentDeckState('a'));
  });

  it('opens the dialog with card, characters and assignments and assigns the choice', async () => {
    await service.assignCard(RUNE_ARMOR_REF);

    expect(open.mock.calls[0][1].data).toEqual({
      card: RUNE_ARMOR,
      characters: [barbarian],
      assigned: [assignedCard(TOWER_SHIELD, 'a', 'leftHand')],
    });
    expect(open).toHaveBeenCalledTimes(1);
    expect(deck().hand).toEqual([]);
    expect(deck().assigned.map((entry) => entry.card.id)).toEqual(['e2', 'e1']);
  });

  it('assigns nothing when the dialog is cancelled', async () => {
    choice = undefined;
    await service.assignCard(RUNE_ARMOR_REF);
    expect(deck().hand.map((entry) => entry.card)).toEqual([RUNE_ARMOR]);
  });

  it('asks where the card of an occupied slot goes: cancel, discard pile or inventory', async () => {
    const buckler: CardRef = { deckId: 'deck-1', cardId: 'e3' };
    cardManager.restore({
      ...createEquipmentDeckState('a'),
      hand: [{ deckId: 'deck-1', card: BUCKLER }],
    });
    choice = { characterId: 'a', slot: 'leftHand' };
    displaced = undefined;
    await service.assignCard(buckler);

    expect(open.mock.calls[1]).toEqual([
      SlotOccupiedDialog,
      { data: { cardName: 'Turmschild', characterName: 'Barbar' } },
    ]);
    expect(deck().hand.map((entry) => entry.card)).toEqual([BUCKLER]);

    displaced = 'discardPile';
    await service.assignCard(buckler);
    expect(deck().decks[0].discardPile).toEqual([TOWER_SHIELD]);

    displaced = 'inventory';
    cardManager.restore({
      ...createEquipmentDeckState('a'),
      hand: [{ deckId: 'deck-1', card: BUCKLER }],
    });
    await service.assignCard(buckler);
    expect(deck().inventory).toEqual([inventoryCard(TOWER_SHIELD, 'a')]);
    expect(deck().assigned).toEqual([assignedCard(BUCKLER, 'a', 'leftHand')]);
  });

  it('moves an equipped card to another slot without asking about the card itself', async () => {
    const shield: CardRef = { deckId: 'deck-1', cardId: 'e2' };
    choice = { characterId: 'a', slot: 'leftHand' };
    await service.assignCard(shield);
    expect(open.mock.calls[0][1].data.card).toBe(TOWER_SHIELD);
    expect(deck().assigned).toEqual([assignedCard(TOWER_SHIELD, 'a', 'leftHand')]);

    choice = { characterId: 'a', slot: 'rightHand' };
    await service.assignCard(shield);
    expect(open).toHaveBeenCalledTimes(2);
    expect(deck().assigned).toEqual([assignedCard(TOWER_SHIELD, 'a', 'rightHand')]);
  });

  it('offers no assignment without characters, for a non-equipment card or an unknown card', async () => {
    expect(service.assignDisabledReason()).toBeNull();
    charactersDb.reset();
    expect(service.assignDisabledReason()).toBe('Keine Charaktere in der Session');
    await service.assignCard(RUNE_ARMOR_REF);

    charactersDb.writeCharacter(barbarian);
    cardManager.restore(createDeckState());
    await service.assignCard({ deckId: 'deck-1', cardId: 'c1' });
    cardManager.reset();
    await service.assignCard(RUNE_ARMOR_REF);
    expect(open).not.toHaveBeenCalled();
  });

  it('looks up owner names by id so renaming shows at once', () => {
    expect(service.ownerNames().get('a')).toBe('Barbar');
    charactersDb.writeCharacter({ ...barbarian, name: 'Barbar der Rote' });
    expect(service.ownerNames().get('a')).toBe('Barbar der Rote');
  });
});
