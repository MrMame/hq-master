import { CharacterInfo } from '../../../core/models/character-info.model';
import { createTestCharacter } from '../../../core/testing/character.fixtures';
import {
  CharacterEditorDialogSetup,
  editorField,
  imageButton,
  setupCharacterEditorDialog,
} from '../../testing/character-editor-dialog.fixtures';

/** Leben 7 von 10, Rüstung 2 von 4. */
const hurt: CharacterInfo = { ...createTestCharacter('a'), health: 7, maxHealth: 10 };

describe('CharacterEditorDialog – maxima', () => {
  let editor: CharacterEditorDialogSetup;

  beforeEach(async () => {
    editor = await setupCharacterEditorDialog(hurt, [hurt]);
  });

  it('shows the maxima next to the current values', () => {
    expect(editorField(editor.host, 'Max. Leben').value).toBe('10');
    expect(editorField(editor.host, 'Max. Rüstung').value).toBe('4');
  });

  it('saves entered maxima without changing the current values', async () => {
    await editor.enter('Max. Leben', '15');
    await editor.enter('Max. Rüstung', '6');
    await (await editor.button('Übernehmen')).click();

    expect(editor.characters()).toEqual([{ ...hurt, maxHealth: 15, maxArmor: 6 }]);
  });

  it('lowers the current value to a maximum set below it', async () => {
    await editor.enter('Max. Leben', '5');
    await editor.enter('Max. Rüstung', '0');
    await (await editor.button('Übernehmen')).click();

    expect(editor.characters()).toEqual([
      { ...hurt, health: 5, maxHealth: 5, armor: 0, maxArmor: 0 },
    ]);
  });

  it('limits a current value entered above the maximum to the maximum', async () => {
    await editor.enter('Leben', '25');
    await (await editor.button('Übernehmen')).click();

    expect(editor.characters()).toEqual([hurt].map((c) => ({ ...c, health: 10 })));
    expect(editor.close).toHaveBeenCalledExactlyOnceWith({ ...hurt, health: 10 });
  });

  it('disables "Übernehmen" for an empty or negative maximum', async () => {
    await editor.enter('Max. Leben', '-1');
    expect(await (await editor.button('Übernehmen')).isDisabled()).toBe(true);

    await editor.enter('Max. Leben', '');
    expect(await (await editor.button('Übernehmen')).isDisabled()).toBe(true);
  });
});

describe('CharacterEditorDialog – maxima of a new character', () => {
  let editor: CharacterEditorDialogSetup;

  beforeEach(async () => {
    editor = await setupCharacterEditorDialog(null);
    await editor.enter('Name', 'Neuling');
    await editor.click(imageButton(editor.host, 1));
  });

  it('uses the entered start values as maxima', async () => {
    await editor.enter('Leben', '20');
    await editor.enter('Rüstung', '3');
    expect(editorField(editor.host, 'Max. Leben').value).toBe('20');
    await (await editor.button('Übernehmen')).click();

    expect(editor.characters()[0]).toMatchObject({
      health: 20,
      maxHealth: 20,
      armor: 3,
      maxArmor: 3,
    });
  });

  it('keeps a maximum entered after the start value', async () => {
    await editor.enter('Leben', '20');
    await editor.enter('Max. Leben', '30');
    await (await editor.button('Übernehmen')).click();

    expect(editor.characters()[0]).toMatchObject({ health: 20, maxHealth: 30 });
  });

  it('sets maxima equal to the current values for a random character', async () => {
    await (await editor.button('Zufälliger Charakter erstellen')).click();
    await (await editor.button('Übernehmen')).click();

    const [created] = editor.characters();
    expect(created.maxHealth).toBe(created.health);
    expect(created.maxArmor).toBe(created.armor);
    expect(editorField(editor.host, 'Max. Leben').value).toBe(String(created.health));
  });
});
