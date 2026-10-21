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

const orc: CharacterInfo = {
  id: 'orc-1',
  name: 'Orc',
  type: 'Erde',
  health: 42,
  armor: 7,
  attack: 3,
  defense: 4,
  speed: 5,
  abilities: ['Erdbeben'],
  image: './img/monster-icon-Orc.png',
  description: 'Grimmig',
};

const STAT_CAPTIONS: string[] = ['Leben', 'Rüstung', 'Angriff', 'Abwehr', 'Tempo'];

describe('CharacterEditorDialog', () => {
  let data: CharacterInfo;
  let editor: CharacterEditorDialogSetup;

  beforeEach(async () => {
    data = { ...orc, abilities: [...orc.abilities] };
    editor = await setupCharacterEditorDialog(data, [orc]);
  });

  it('shows all values of the character to edit', async () => {
    const { host } = editor;

    expect(host.querySelector('h2')?.textContent?.trim()).toBe('Charakter bearbeiten');
    expect(editorField(host, 'Name').value).toBe('Orc');
    expect(editorField(host, 'Typ').value).toBe('Erde');
    expect(STAT_CAPTIONS.map((caption) => editorField(host, caption).value)).toEqual([
      '42',
      '7',
      '3',
      '4',
      '5',
    ]);
    expect(editorField(host, 'Beschreibung').value).toBe('Grimmig');
    expect(abilityCheckbox(host, 'Erdbeben').checked).toBe(true);
    expect(abilityCheckbox(host, 'Windstoß').checked).toBe(false);
    const orcImage: HTMLButtonElement = imageButton(host, CHARACTER_IMAGES.indexOf(orc.image) + 1);
    expect(orcImage.getAttribute('aria-pressed')).toBe('true');
    expect(await (await editor.button('Übernehmen')).isDisabled()).toBe(false);
  });

  it('writes every changed field to the session on "Übernehmen" and closes with it', async () => {
    await editor.enter('Name', 'Grimgor');
    await editor.enter('Typ', 'Luft');
    for (const [index, caption] of STAT_CAPTIONS.entries()) {
      await editor.enter(caption, String(index + 1));
    }
    await editor.enter('Beschreibung', 'Neu im Dungeon');
    await editor.click(abilityCheckbox(editor.host, 'Erdbeben'));
    await editor.click(abilityCheckbox(editor.host, 'Windstoß'));
    await editor.click(imageButton(editor.host, 1));
    await (await editor.button('Übernehmen')).click();

    const edited: CharacterInfo = {
      ...orc,
      name: 'Grimgor',
      type: 'Luft',
      health: 1,
      armor: 2,
      attack: 3,
      defense: 4,
      speed: 5,
      abilities: ['Windstoß'],
      image: CHARACTER_IMAGES[0],
      description: 'Neu im Dungeon',
    };
    expect(editor.characters()).toEqual([edited]);
    expect(editor.close).toHaveBeenCalledExactlyOnceWith(edited);
    expect(data).toEqual(orc);
  });

  it('discards all changes on "Abbrechen"', async () => {
    await editor.enter('Name', 'Grimgor');
    await editor.click(abilityCheckbox(editor.host, 'Windstoß'));
    await (await editor.button('Abbrechen')).click();

    expect(editor.characters()).toEqual([orc]);
    expect(editor.close).toHaveBeenCalledExactlyOnceWith();
    expect(data).toEqual(orc);
  });

  it.each<[string, string]>([
    ['Name', ''],
    ['Leben', ''],
    ['Tempo', '-1'],
  ])('disables "Übernehmen" when %s is "%s"', async (caption, value) => {
    await editor.enter(caption, value);

    expect(await (await editor.button('Übernehmen')).isDisabled()).toBe(true);
  });
});

describe('CharacterEditorDialog – legacy data', () => {
  it('keeps type, abilities and image that are not offered as long as they are untouched', async () => {
    const legacy: CharacterInfo = createTestCharacter('a');
    const editor: CharacterEditorDialogSetup = await setupCharacterEditorDialog(legacy, [legacy]);

    await editor.enter('Name', 'Umbenannt');
    await (await editor.button('Übernehmen')).click();

    expect(editor.characters()).toEqual([{ ...legacy, name: 'Umbenannt' }]);
  });

  it('requires an image before a character without one can be saved', async () => {
    const withoutImage: CharacterInfo = { ...orc, image: '' };
    const editor: CharacterEditorDialogSetup = await setupCharacterEditorDialog(withoutImage, [
      withoutImage,
    ]);
    expect(await (await editor.button('Übernehmen')).isDisabled()).toBe(true);

    await editor.click(imageButton(editor.host, 1));
    await (await editor.button('Übernehmen')).click();

    expect(editor.characters()).toEqual([{ ...orc, image: CHARACTER_IMAGES[0] }]);
  });
});
