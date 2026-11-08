import { CharacterInfo } from '../../../core/models/character-info.model';
import { CHARACTER_IMAGES } from '../../../core/models/character-images.model';
import { createTestCharacter } from '../../../core/testing/character.fixtures';
import {
  CharacterEditorDialogSetup,
  editorField,
  imageButton,
  setupCharacterEditorDialog,
} from '../../testing/character-editor-dialog.fixtures';

const orc: CharacterInfo = {
  id: 'orc-1',
  name: 'Orc',
  health: 42,
  maxHealth: 50,
  armor: 7,
  maxArmor: 7,
  attack: 3,
  defense: 4,
  speed: 5,
  image: './img/monster-icon-Orc.png',
  description: 'Grimmig',
  conditions: [],
  movedThisRound: false,
};

const STAT_CAPTIONS: string[] = ['Leben', 'Rüstung', 'Angriff', 'Abwehr', 'Tempo'];

describe('CharacterEditorDialog', () => {
  let data: CharacterInfo;
  let editor: CharacterEditorDialogSetup;

  beforeEach(async () => {
    data = { ...orc };
    editor = await setupCharacterEditorDialog(data, [orc]);
  });

  it('shows all values of the character to edit', async () => {
    const { host } = editor;

    expect(host.querySelector('h2')?.textContent?.trim()).toBe('Charakter bearbeiten');
    expect(editorField(host, 'Name').value).toBe('Orc');
    expect(STAT_CAPTIONS.map((caption) => editorField(host, caption).value)).toEqual([
      '42',
      '7',
      '3',
      '4',
      '5',
    ]);
    expect(editorField(host, 'Beschreibung').value).toBe('Grimmig');
    const orcImage: HTMLButtonElement = imageButton(host, CHARACTER_IMAGES.indexOf(orc.image) + 1);
    expect(orcImage.getAttribute('aria-pressed')).toBe('true');
    expect(await (await editor.button('Übernehmen')).isDisabled()).toBe(false);
  });

  it('offers neither a type nor abilities', () => {
    const captions: string[] = Array.from(
      editor.host.querySelectorAll('.character-editor__caption'),
      (caption) => caption.textContent?.trim() ?? '',
    );

    expect(captions).toContain('Name');
    expect(captions).not.toContain('Typ');
    expect(captions).not.toContain('Fähigkeiten');
    expect(editor.host.querySelector('select')).toBeNull();
  });

  it('writes every changed field to the session on "Übernehmen" and closes with it', async () => {
    await editor.enter('Name', 'Grimgor');
    for (const [index, caption] of STAT_CAPTIONS.entries()) {
      await editor.enter(caption, String(index + 1));
    }
    await editor.enter('Beschreibung', 'Neu im Dungeon');
    await editor.click(imageButton(editor.host, 1));
    await (await editor.button('Übernehmen')).click();

    const edited: CharacterInfo = {
      ...orc,
      name: 'Grimgor',
      health: 1,
      armor: 2,
      attack: 3,
      defense: 4,
      speed: 5,
      image: CHARACTER_IMAGES[0],
      description: 'Neu im Dungeon',
    };
    expect(editor.characters()).toEqual([edited]);
    expect(editor.close).toHaveBeenCalledExactlyOnceWith(edited);
    expect(data).toEqual(orc);
  });

  it('discards all changes on "Abbrechen"', async () => {
    await editor.enter('Name', 'Grimgor');
    await editor.enter('Leben', '1');
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
  it('keeps an image that is not offered as long as it is untouched', async () => {
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
