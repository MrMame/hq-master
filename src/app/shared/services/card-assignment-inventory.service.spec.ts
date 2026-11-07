import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { Observable, of } from 'rxjs';
import { Mock, vi } from 'vitest';

import { CardAssignmentService } from './card-assignment.service';
import { CharactersDbService } from '../../core/services/characters/characters-db.service';
import { CharacterInfo } from '../../core/models/character-info.model';
import { createTestCharacter } from '../../core/testing/character.fixtures';

describe('CardAssignmentService – inventory', () => {
  let service: CardAssignmentService;
  let open: Mock;
  const barbarian: CharacterInfo = { ...createTestCharacter('a'), name: 'Barbar' };
  const dwarf: CharacterInfo = { ...createTestCharacter('b'), name: 'Zwerg' };

  beforeEach(() => {
    open = vi.fn(() => ({ afterClosed: (): Observable<undefined> => of(undefined) }));
    TestBed.configureTestingModule({ providers: [{ provide: MatDialog, useValue: { open } }] });
    service = TestBed.inject(CardAssignmentService);
    const charactersDb: CharactersDbService = TestBed.inject(CharactersDbService);
    charactersDb.writeCharacter(barbarian);
    charactersDb.writeCharacter(dwarf);
  });

  it('offers only other characters for a card that already is in an inventory', () => {
    expect(service.inventoryTargets({ kind: 'inventory', characterId: 'a' })).toEqual([dwarf]);
    expect(service.inventoryTargets({ kind: 'bank' })).toEqual([barbarian, dwarf]);
  });

  it('names an unknown owner in the question about an occupied slot', async () => {
    await service.chooseDisplaced('Turmschild', 'x');
    expect(open.mock.calls[0][1].data).toEqual({
      cardName: 'Turmschild',
      characterName: 'Unbekannt',
    });
  });
});
