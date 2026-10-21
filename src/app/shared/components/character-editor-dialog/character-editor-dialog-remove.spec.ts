import { CharacterInfo } from '../../../core/models/character-info.model';
import { createTestCharacter } from '../../../core/testing/character.fixtures';
import {
  CharacterEditorDialogSetup,
  editorField,
  setupCharacterEditorDialog,
} from '../../testing/character-editor-dialog.fixtures';
import { ConfirmationDialog } from '../confirmation-dialog/confirmation-dialog';

const orc: CharacterInfo = createTestCharacter('orc');
const goblin: CharacterInfo = createTestCharacter('goblin');

describe('CharacterEditorDialog – remove', () => {
  async function editOrc(): Promise<CharacterEditorDialogSetup> {
    return setupCharacterEditorDialog({ ...orc }, [orc, goblin]);
  }

  async function pressRemove(editor: CharacterEditorDialogSetup): Promise<void> {
    await (await editor.button('Entfernen')).click();
  }

  it('offers "Entfernen" only when editing an existing character', async () => {
    const editor: CharacterEditorDialogSetup = await setupCharacterEditorDialog(null, [orc]);

    await expect(editor.button('Entfernen')).rejects.toThrow();
  });

  it('removes the character after confirmation and closes without a value', async () => {
    const editor: CharacterEditorDialogSetup = await editOrc();

    await pressRemove(editor);

    expect(editor.dialogOpen).toHaveBeenCalledExactlyOnceWith(ConfirmationDialog);
    expect(editor.characters()).toEqual([goblin]);
    expect(editor.close).toHaveBeenCalledExactlyOnceWith();
  });

  it('keeps the character and the open editor when the confirmation is cancelled', async () => {
    const editor: CharacterEditorDialogSetup = await editOrc();
    editor.confirmWith(false);
    await editor.enter('Name', 'Grimgor');

    await pressRemove(editor);

    expect(editor.dialogOpen).toHaveBeenCalledOnce();
    expect(editor.characters()).toEqual([orc, goblin]);
    expect(editor.close).not.toHaveBeenCalled();
    expect(editorField(editor.host, 'Name').value).toBe('Grimgor');
  });

  it('does not write unsaved changes when removing', async () => {
    const editor: CharacterEditorDialogSetup = await editOrc();
    await editor.enter('Name', 'Grimgor');
    await editor.enter('Leben', '99');

    await pressRemove(editor);

    expect(editor.characters()).toEqual([goblin]);
  });

  it('allows "Entfernen" while the form is invalid', async () => {
    const editor: CharacterEditorDialogSetup = await editOrc();
    await editor.enter('Name', '');

    expect(await (await editor.button('Übernehmen')).isDisabled()).toBe(true);
    expect(await (await editor.button('Entfernen')).isDisabled()).toBe(false);
    await pressRemove(editor);

    expect(editor.characters()).toEqual([goblin]);
  });
});
