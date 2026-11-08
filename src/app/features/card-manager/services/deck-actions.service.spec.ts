import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { Observable, of } from 'rxjs';
import { Mock } from 'vitest';

import { DeckActionsService } from './deck-actions.service';
import { CardManagerService } from '../../../core/services/card-deck/card-manager.service';
import { ConfirmationService } from '../../../shared/services/confirmation.service';
import {
  assignedCard,
  createTwoDeckState,
  RUNE_ARMOR,
  TOWER_SHIELD,
} from '../../../core/testing/deck.fixtures';
import { CharactersDbService } from '../../../core/services/characters/characters-db.service';
import { createTestCharacter } from '../../../core/testing/character.fixtures';

describe('DeckActionsService', () => {
  let service: DeckActionsService;
  let cardManager: CardManagerService;
  let open: Mock;
  let confirm: Mock<() => Promise<boolean>>;
  let newName: string | undefined;

  beforeEach(() => {
    newName = 'Monster';
    open = vi.fn(() => ({ afterClosed: (): Observable<string | undefined> => of(newName) }));
    confirm = vi.fn().mockResolvedValue(true);
    TestBed.configureTestingModule({
      providers: [
        { provide: MatDialog, useValue: { open } },
        { provide: ConfirmationService, useValue: { confirm } },
      ],
    });
    service = TestBed.inject(DeckActionsService);
    cardManager = TestBed.inject(CardManagerService);
    cardManager.restore({
      ...createTwoDeckState(),
      assigned: [assignedCard(TOWER_SHIELD, 'a', 'leftHand', 'deck-2')],
    });
  });

  it('renames the deck with the name from the dialog', async () => {
    await service.rename(cardManager.decks()[1]);
    expect(open.mock.calls[0][1].data).toBe('Testdeck (2)');
    expect(cardManager.decks()[1].name).toBe('Monster');
  });

  it('keeps the name when the dialog is cancelled', async () => {
    newName = undefined;
    await service.rename(cardManager.decks()[1]);
    expect(cardManager.decks()[1].name).toBe('Testdeck (2)');
  });

  it('removes the deck with its equipped cards after confirmation', async () => {
    await service.remove(cardManager.decks()[1]);
    expect(confirm).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'Deck entfernen', confirmLabel: 'Entfernen' }),
    );
    expect(cardManager.decks().map((deck) => deck.id)).toEqual(['deck-1']);
    expect(cardManager.assigned()).toEqual([]);
  });

  it('lowers the wearer by the values of the removed cards', async () => {
    const charactersDb: CharactersDbService = TestBed.inject(CharactersDbService);
    charactersDb.writeCharacter({ ...createTestCharacter('a'), Ruestung: 6 });
    cardManager.restore({
      ...createTwoDeckState(),
      assigned: [assignedCard(RUNE_ARMOR, 'a', 'body', 'deck-2')],
    });
    await service.remove(cardManager.decks()[1]);
    expect(charactersDb.characters()[0].Ruestung).toBe(4);
  });

  it('keeps the deck when removal is declined', async () => {
    confirm.mockResolvedValue(false);
    await service.remove(cardManager.decks()[1]);
    expect(cardManager.decks()).toHaveLength(2);
  });
});
