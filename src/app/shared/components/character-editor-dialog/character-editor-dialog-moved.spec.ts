import { CharacterInfo } from '../../../core/models/character-info.model';
import { createTestCharacter } from '../../../core/testing/character.fixtures';
import {
  CharacterEditorDialogSetup,
  imageButton,
  setupCharacterEditorDialog,
} from '../../testing/character-editor-dialog.fixtures';

const movedCheckbox: (host: HTMLElement) => HTMLInputElement = (host) =>
  host.querySelector('input[name="movedThisRound"]') as HTMLInputElement;

describe('CharacterEditorDialog – moved this round', () => {
  it('labels the checkbox "In dieser Runde bewegt" and leaves it unchecked for a new character', async () => {
    const { host }: CharacterEditorDialogSetup = await setupCharacterEditorDialog(null);

    expect(movedCheckbox(host).closest('label')?.textContent?.trim()).toBe(
      'In dieser Runde bewegt',
    );
    expect(movedCheckbox(host).checked).toBe(false);
  });

  it('creates a new character as not moved', async () => {
    const editor: CharacterEditorDialogSetup = await setupCharacterEditorDialog(null);
    await editor.enter('Name', 'Neuling');
    await editor.click(imageButton(editor.host, 1));
    await (await editor.button('Übernehmen')).click();

    expect(editor.characters()[0].movedThisRound).toBe(false);
  });

  it('sets the flag on "Übernehmen"', async () => {
    const stored: CharacterInfo = createTestCharacter('a');
    const editor: CharacterEditorDialogSetup = await setupCharacterEditorDialog(stored, [stored]);
    await editor.click(movedCheckbox(editor.host));
    await (await editor.button('Übernehmen')).click();

    expect(editor.characters()[0].movedThisRound).toBe(true);
  });

  it('clears the flag on "Übernehmen"', async () => {
    const stored: CharacterInfo = { ...createTestCharacter('a'), movedThisRound: true };
    const editor: CharacterEditorDialogSetup = await setupCharacterEditorDialog(stored, [stored]);
    expect(movedCheckbox(editor.host).checked).toBe(true);

    await editor.click(movedCheckbox(editor.host));
    await (await editor.button('Übernehmen')).click();

    expect(editor.characters()[0].movedThisRound).toBe(false);
  });

  it('discards the change on "Abbrechen"', async () => {
    const stored: CharacterInfo = createTestCharacter('a');
    const editor: CharacterEditorDialogSetup = await setupCharacterEditorDialog(stored, [stored]);
    await editor.click(movedCheckbox(editor.host));
    await (await editor.button('Abbrechen')).click();

    expect(editor.characters()).toEqual([stored]);
  });
});
