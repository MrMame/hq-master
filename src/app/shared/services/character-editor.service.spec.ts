import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { firstValueFrom, of } from 'rxjs';

import { CHARACTER_EDITOR_DIALOG_CONFIG, CharacterEditorService } from './character-editor.service';
import { CharacterEditorDialog } from '../components/character-editor-dialog/character-editor-dialog';
import { CharacterInfo } from '../../core/models/character-info.model';
import { createTestCharacter } from '../../core/testing/character.fixtures';

describe('CharacterEditorService', () => {
  let service: CharacterEditorService;
  const dialogOpen: ReturnType<typeof vi.fn> = vi.fn();

  beforeEach(() => {
    dialogOpen.mockReset();
    TestBed.configureTestingModule({
      providers: [{ provide: MatDialog, useValue: { open: dialogOpen } }],
    });
    service = TestBed.inject(CharacterEditorService);
  });

  it('opens the editor without data for a new character and passes the saved one through', async () => {
    const saved: CharacterInfo = createTestCharacter('neu');
    dialogOpen.mockReturnValue({ afterClosed: () => of(saved) });

    await expect(firstValueFrom(service.openCreate())).resolves.toBe(saved);
    expect(dialogOpen).toHaveBeenCalledExactlyOnceWith(CharacterEditorDialog, {
      ...CHARACTER_EDITOR_DIALOG_CONFIG,
      data: null,
    });
  });

  it('opens the editor with the character to edit and passes a cancel through', async () => {
    const character: CharacterInfo = createTestCharacter('a');
    dialogOpen.mockReturnValue({ afterClosed: () => of(undefined) });

    await expect(firstValueFrom(service.openEdit(character))).resolves.toBeUndefined();
    expect(dialogOpen).toHaveBeenCalledExactlyOnceWith(CharacterEditorDialog, {
      ...CHARACTER_EDITOR_DIALOG_CONFIG,
      data: character,
    });
  });

  it('focuses the dialog instead of the first field so no on-screen keyboard pops up', () => {
    expect(CHARACTER_EDITOR_DIALOG_CONFIG.autoFocus).toBe('dialog');
  });
});
