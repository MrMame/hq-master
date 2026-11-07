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
import { CardRef, DeckState } from '../../../core/models/deck-state.model';
import { createTestCharacter } from '../../../core/testing/character.fixtures';
import {
  assignedCard,
  BUCKLER,
  createDeckState,
  createEquipmentDeckState,
  RUNE_ARMOR,
  TOWER_SHIELD,
} from '../../../core/testing/deck.fixtures';

const RUNE_ARMOR_REF: CardRef = { deckId: 'deck-1', cardId: 'e1' };

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
    await service.assignCard(RUNE_ARMOR_REF);

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
    await service.assignCard(RUNE_ARMOR_REF);
    expect(deck().activeCard?.card).toBe(RUNE_ARMOR);
  });

  it('asks before an occupied slot is replaced', async () => {
    const buckler: CardRef = { deckId: 'deck-1', cardId: 'e3' };
    cardManager.restore({
      ...createEquipmentDeckState('a'),
      activeCard: { deckId: 'deck-1', card: BUCKLER },
    });
    choice = { characterId: 'a', slot: 'leftHand' };
    confirm.mockResolvedValue(false);
    await service.assignCard(buckler);

    expect(confirm).toHaveBeenCalledWith(
      expect.objectContaining({ message: '„Turmschild“ in den Ablagestapel legen?' }),
    );
    expect(deck().activeCard?.card).toBe(BUCKLER);

    confirm.mockResolvedValue(true);
    await service.assignCard(buckler);
    expect(deck().decks[0].discardPile).toEqual([TOWER_SHIELD]);
  });

  it('moves an equipped card to another slot without asking about the card itself', async () => {
    const shield: CardRef = { deckId: 'deck-1', cardId: 'e2' };
    choice = { characterId: 'a', slot: 'leftHand' };
    await service.assignCard(shield);
    expect(open.mock.calls[0][1].data.card).toBe(TOWER_SHIELD);
    expect(deck().assigned).toEqual([assignedCard(TOWER_SHIELD, 'a', 'leftHand')]);

    choice = { characterId: 'a', slot: 'rightHand' };
    await service.assignCard(shield);
    expect(confirm).not.toHaveBeenCalled();
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
