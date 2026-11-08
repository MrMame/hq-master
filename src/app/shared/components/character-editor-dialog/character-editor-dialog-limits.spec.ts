import { CharacterInfo } from '../../../core/models/character-info.model';
import { createTestCharacter } from '../../../core/testing/character.fixtures';
import {
  CharacterEditorDialogSetup,
  editorField,
  setupCharacterEditorDialog,
} from '../../testing/character-editor-dialog.fixtures';

const hurt: CharacterInfo = { ...createTestCharacter('a'), Leben: 7 };

describe('CharacterEditorDialog – limits', () => {
  let editor: CharacterEditorDialogSetup;

  beforeEach(async () => {
    editor = await setupCharacterEditorDialog(hurt, [hurt]);
  });

  it('offers no maximum fields', () => {
    const captions: string[] = Array.from(
      editor.host.querySelectorAll('.character-editor__caption'),
      (caption) => caption.textContent?.trim() ?? '',
    );
    expect(captions.some((caption) => caption.startsWith('Max.'))).toBe(false);
  });

  it('saves any whole value of at least 0, without an upper limit', async () => {
    await editor.enter('Leben', '250');
    await (await editor.button('Übernehmen')).click();

    expect(editor.characters()).toEqual([{ ...hurt, Leben: 250 }]);
    expect(editor.close).toHaveBeenCalledExactlyOnceWith({ ...hurt, Leben: 250 });
  });

  it('cuts off fractions when saving', async () => {
    await editor.enter('Ruestung', '3.8');
    await (await editor.button('Übernehmen')).click();

    expect(editor.characters()[0].Ruestung).toBe(3);
  });

  it('disables "Übernehmen" for an empty or negative value', async () => {
    await editor.enter('Leben', '-1');
    expect(await (await editor.button('Übernehmen')).isDisabled()).toBe(true);

    await editor.enter('Leben', '');
    expect(await (await editor.button('Übernehmen')).isDisabled()).toBe(true);
    expect(editorField(editor.host, 'Leben').value).toBe('');
  });
});
