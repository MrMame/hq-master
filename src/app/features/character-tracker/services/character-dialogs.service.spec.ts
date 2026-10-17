import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { firstValueFrom, of } from 'rxjs';

import { CHARACTER_DIALOG_CONFIG, CharacterDialogsService } from './character-dialogs.service';
import { AddCharacterDialog } from '../components/add-character-dialog/add-character-dialog';
import { DamageTakenDialog } from '../components/damage-taken-dialog/damage-taken-dialog';

describe('CharacterDialogsService', () => {
  let service: CharacterDialogsService;
  const dialogOpen: ReturnType<typeof vi.fn> = vi.fn();

  beforeEach(() => {
    dialogOpen.mockReset();
    TestBed.configureTestingModule({
      providers: [{ provide: MatDialog, useValue: { open: dialogOpen } }],
    });
    service = TestBed.inject(CharacterDialogsService);
  });

  it('should open the add dialog with the shared config and pass its result through', async () => {
    dialogOpen.mockReturnValue({ afterClosed: () => of(undefined) });
    await expect(firstValueFrom(service.openAddCharacter())).resolves.toBeUndefined();
    expect(dialogOpen).toHaveBeenCalledWith(AddCharacterDialog, CHARACTER_DIALOG_CONFIG);
  });

  it('should open the damage dialog with the shared config and pass its result through', async () => {
    dialogOpen.mockReturnValue({ afterClosed: () => of(12) });
    await expect(firstValueFrom(service.openDamageTaken())).resolves.toBe(12);
    expect(dialogOpen).toHaveBeenCalledWith(DamageTakenDialog, CHARACTER_DIALOG_CONFIG);
  });
});
