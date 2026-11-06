import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { Observable, of } from 'rxjs';
import { Mock } from 'vitest';

import { CardAssignmentService } from './card-assignment.service';
import { AssignEquipmentChoice } from '../models/assign-equipment.model';
import { CardManagerService } from '../../../core/services/card-deck/card-manager.service';
import { CharactersDbService } from '../../../core/services/characters/characters-db.service';
import { ConfirmationService } from '../../../shared/services/confirmation.service';
import { CharacterInfo } from '../../../core/models/character-info.model';
import { DeckState } from '../../../core/models/deck-state.model';
import { createTestCharacter } from '../../../core/testing/character.fixtures';
import {
  assignedCard,
  createDeckState,
  createEquipmentDeckState,
  RUNE_ARMOR,
  TOWER_SHIELD,
} from '../../../core/testing/deck.fixtures';

describe('CardAssignmentService', () => {
  let service: CardAssignmentService;
  let cardManager: CardManagerService;
  let charactersDb: CharactersDbService;
  let open: Mock;
  let confirm: Mock<() => Promise<boolean>>;
  let choice: AssignEquipmentChoice | undefined;
  const barbarian: CharacterInfo = { ...createTestCharacter('a'), name: 'Barbar' };

  const deck: () => DeckState = () => cardManager.state();

  beforeEach(() => {
    choice = { characterId: 'a', slot: 'body' };
    open = vi.fn(() => ({
      afterClosed: (): Observable<AssignEquipmentChoice | undefined> => of(choice),
    }));
    confirm = vi.fn().mockResolvedValue(true);
    TestBed.configureTestingModule({
      providers: [
        { provide: MatDialog, useValue: { open } },
        { provide: ConfirmationService, useValue: { confirm } },
      ],
    });
    service = TestBed.inject(CardAssignmentService);
    cardManager = TestBed.inject(CardManagerService);
    charactersDb = TestBed.inject(CharactersDbService);
    charactersDb.writeCharacter(barbarian);
    // Runenrüstung aktiv, Turmschild in der linken Hand von „a“.
    cardManager.restore(createEquipmentDeckState('a'));
  });

  it('opens the dialog with card, characters and assignments and assigns the choice', async () => {
    await service.assignActiveCard();

    expect(open.mock.calls[0][1].data).toEqual({
      card: RUNE_ARMOR,
      characters: [barbarian],
      assigned: [assignedCard(TOWER_SHIELD, 'a', 'leftHand')],
    });
    expect(confirm).not.toHaveBeenCalled();
    expect(deck().activeCard).toBeNull();
    expect(deck().assigned.map((entry) => entry.card.id)).toEqual(['e2', 'e1']);
  });

  it('assigns nothing when the dialog is cancelled', async () => {
    choice = undefined;
    await service.assignActiveCard();
    expect(deck().activeCard?.card).toBe(RUNE_ARMOR);
  });

  it('asks before an occupied slot is replaced', async () => {
    choice = { characterId: 'a', slot: 'leftHand' };
    confirm.mockResolvedValue(false);
    await service.assignActiveCard();

    expect(confirm).toHaveBeenCalledWith(
      expect.objectContaining({ message: '„Turmschild“ in den Ablagestapel legen?' }),
    );
    expect(deck().activeCard?.card).toBe(RUNE_ARMOR);

    confirm.mockResolvedValue(true);
    await service.assignActiveCard();
    expect(deck().decks[0].discardPile).toEqual([TOWER_SHIELD]);
  });

  it('offers no assignment without characters or without an active equipment card', async () => {
    expect(service.assignDisabledReason()).toBeNull();
    charactersDb.reset();
    expect(service.assignDisabledReason()).toBe('Keine Charaktere in der Session');
    await service.assignActiveCard();

    charactersDb.writeCharacter(barbarian);
    cardManager.restore(createDeckState());
    await service.assignActiveCard();
    cardManager.reset();
    await service.assignActiveCard();
    expect(open).not.toHaveBeenCalled();
  });

  it('looks up owner names by id so renaming shows at once', () => {
    expect(service.ownerNames().get('a')).toBe('Barbar');
    charactersDb.writeCharacter({ ...barbarian, name: 'Barbar der Rote' });
    expect(service.ownerNames().get('a')).toBe('Barbar der Rote');
  });
});
