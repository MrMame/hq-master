import { CharacterInfo } from '../../../features/character-tracker/models/character-info.model';
import { CHARACTER_IMAGES } from '../../../features/character-tracker/models/character-images.model';
import { createTestCharacter } from '../../../features/game-session/testing/session.fixtures';
import {
  abilityCheckbox,
  CharacterEditorDialogSetup,
  editorField,
  imageButton,
  setupCharacterEditorDialog,
} from '../../testing/character-editor-dialog.fixtures';

const existing: CharacterInfo = createTestCharacter('a');

describe('CharacterEditorDialog – create', () => {
  let editor: CharacterEditorDialogSetup;

  beforeEach(async () => {
    editor = await setupCharacterEditorDialog(null, [existing]);
  });

  it('shows the title "Neuer Charakter" with empty start values', () => {
    const { host } = editor;

    expect(host.querySelector('h2')?.textContent?.trim()).toBe('Neuer Charakter');
    expect(editorField(host, 'Name').value).toBe('');
    expect(editorField(host, 'Typ').value).toBe('Feuer');
    expect(editorField(host, 'Leben').value).toBe('0');
    expect(abilityCheckbox(host, 'Erdbeben').checked).toBe(false);
    expect(host.querySelector('[aria-pressed="true"]')).toBeNull();
    expect(host.querySelector('.character-editor__images--missing')).not.toBeNull();
  });

  it('enables "Übernehmen" only after a name is entered and an image is chosen', async () => {
    const isApplyDisabled: () => Promise<boolean> = async (): Promise<boolean> =>
      (await editor.button('Übernehmen')).isDisabled();
    expect(await isApplyDisabled()).toBe(true);

    await editor.enter('Name', 'Neuling');
    expect(await isApplyDisabled()).toBe(true);

    await editor.click(imageButton(editor.host, 3));
    expect(await isApplyDisabled()).toBe(false);
    expect(editor.host.querySelector('.character-editor__images--missing')).toBeNull();
  });

  it('adds a new character with its own id on "Übernehmen"', async () => {
    await editor.enter('Name', 'Neuling');
    await editor.click(imageButton(editor.host, 2));
    await (await editor.button('Übernehmen')).click();

    const [kept, created] = editor.characters();
    expect(kept).toEqual(existing);
    expect(created).toEqual({
      id: expect.any(String),
      name: 'Neuling',
      type: 'Feuer',
      health: 0,
      armor: 0,
      attack: 0,
      defense: 0,
      speed: 0,
      abilities: [],
      image: CHARACTER_IMAGES[1],
      description: '',
    });
    expect(created.id).not.toBe(existing.id);
    expect(editor.close).toHaveBeenCalledExactlyOnceWith(created);
  });

  it('creates nothing on "Abbrechen"', async () => {
    await editor.enter('Name', 'Neuling');
    await (await editor.button('Abbrechen')).click();

    expect(editor.characters()).toEqual([existing]);
    expect(editor.close).toHaveBeenCalledExactlyOnceWith();
  });
});
