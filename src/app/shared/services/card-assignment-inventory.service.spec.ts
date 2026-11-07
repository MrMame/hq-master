import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { Observable, of } from 'rxjs';
import { Mock, vi } from 'vitest';

import { CardAssignmentService } from './card-assignment.service';
import { GiveToInventoryDialog } from '../components/give-to-inventory-dialog/give-to-inventory-dialog';
import { CardManagerService } from '../../core/services/card-deck/card-manager.service';
import { CharactersDbService } from '../../core/services/characters/characters-db.service';
import { GameLogService } from '../../core/services/game-log/game-log.service';
import { CharacterInfo } from '../../core/models/character-info.model';
import { CardRef } from '../../core/models/deck-state.model';
import { createTestCharacter } from '../../core/testing/character.fixtures';
import {
  createEquipmentDeckState,
  inventoryCard,
  RUNE_ARMOR,
} from '../../core/testing/deck.fixtures';

const RUNE_ARMOR_REF: CardRef = { deckId: 'deck-1', cardId: 'e1' };

describe('CardAssignmentService – inventory', () => {
  let service: CardAssignmentService;
  let cardManager: CardManagerService;
  let charactersDb: CharactersDbService;
  let open: Mock;
  let chosen: string | undefined;
  const barbarian: CharacterInfo = { ...createTestCharacter('a'), name: 'Barbar' };
  const dwarf: CharacterInfo = { ...createTestCharacter('b'), name: 'Zwerg' };

  beforeEach(() => {
    chosen = 'b';
    open = vi.fn(() => ({ afterClosed: (): Observable<string | undefined> => of(chosen) }));
    TestBed.configureTestingModule({ providers: [{ provide: MatDialog, useValue: { open } }] });
    service = TestBed.inject(CardAssignmentService);
    cardManager = TestBed.inject(CardManagerService);
    charactersDb = TestBed.inject(CharactersDbService);
    charactersDb.writeCharacter(barbarian);
    charactersDb.writeCharacter(dwarf);
    // Runenrüstung in der Hand.
    cardManager.restore(createEquipmentDeckState('a'));
  });

  it('gives a hand card to the chosen inventory and logs it', async () => {
    await service.giveToInventory(RUNE_ARMOR_REF, { kind: 'hand' });

    expect(open.mock.calls[0][0]).toBe(GiveToInventoryDialog);
    expect(open.mock.calls[0][1].data).toEqual({
      card: RUNE_ARMOR,
      characters: [barbarian, dwarf],
    });
    expect(cardManager.state().inventory).toEqual([inventoryCard(RUNE_ARMOR, 'b')]);
    expect(TestBed.inject(GameLogService).entries()[0].text).toBe(
      'Runenrüstung ins Inventar von Zwerg',
    );
  });

  it('offers only other characters for a card that already is in an inventory', () => {
    expect(service.inventoryTargets({ kind: 'inventory', characterId: 'a' })).toEqual([dwarf]);
    expect(service.inventoryTargets({ kind: 'bank' })).toEqual([barbarian, dwarf]);
  });

  it('moves nothing when cancelled, for an unknown card or without characters', async () => {
    chosen = undefined;
    await service.giveToInventory(RUNE_ARMOR_REF, { kind: 'hand' });
    await service.giveToInventory({ deckId: 'deck-1', cardId: 'x' }, { kind: 'hand' });
    charactersDb.reset();
    await service.giveToInventory(RUNE_ARMOR_REF, { kind: 'hand' });
    expect(open).toHaveBeenCalledTimes(1);
    expect(cardManager.state().inventory).toEqual([]);
  });

  it('names an unknown owner in the question about an occupied slot', async () => {
    await service.chooseDisplaced('Turmschild', 'x');
    expect(open.mock.calls[0][1].data).toEqual({
      cardName: 'Turmschild',
      characterName: 'Unbekannt',
    });
  });
});
