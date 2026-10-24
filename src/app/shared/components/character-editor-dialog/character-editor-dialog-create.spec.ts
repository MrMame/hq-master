import { MatButtonHarness } from '@angular/material/button/testing';
import { CharacterInfo } from '../../../core/models/character-info.model';
import { CHARACTER_IMAGES } from '../../../core/models/character-images.model';
import { createTestCharacter } from '../../../core/testing/character.fixtures';
import {
  abilityCheckbox,
  CharacterEditorDialogSetup,
  editorField,
  imageButton,
  setupCharacterEditorDialog,
} from '../../testing/character-editor-dialog.fixtures';

const existing: CharacterInfo = createTestCharacter('a');
/** Zeitstempel in der ID der Arbeitskopie (`createNewCharacter`). */
const DRAFT_TIME: number = 1700000000000;

describe('CharacterEditorDialog – create', () => {
  let editor: CharacterEditorDialogSetup;

  beforeEach(async () => {
    vi.spyOn(Date, 'now').mockReturnValue(DRAFT_TIME);
    editor = await setupCharacterEditorDialog(null, [existing]);
  });

  afterEach(() => vi.restoreAllMocks());

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

  it('fills name and image with random values and saves them on "Übernehmen"', async () => {
    await editor.enter('Name', 'Überschrieben');
    await (await editor.button('Zufälliger Charakter erstellen')).click();

    const name: string = editorField(editor.host, 'Name').value;
    expect(name).not.toBe('Überschrieben');
    expect(name.length).toBeGreaterThanOrEqual(12);
    expect(editor.host.querySelectorAll('[aria-pressed="true"]')).toHaveLength(1);
    expect(Number(editorField(editor.host, 'Leben').value)).toBeGreaterThanOrEqual(50);

    const apply: MatButtonHarness = await editor.button('Übernehmen');
    expect(await apply.isDisabled()).toBe(false);
    await apply.click();

    const [, created] = editor.characters();
    expect(created.name).toBe(name);
    expect(CHARACTER_IMAGES).toContain(created.image);
    expect(editor.close).toHaveBeenCalledExactlyOnceWith(created);
  });

  it('keeps the id of the draft when randomizing repeatedly', async () => {
    await (await editor.button('Zufälliger Charakter erstellen')).click();
    await (await editor.button('Zufälliger Charakter erstellen')).click();
    await (await editor.button('Übernehmen')).click();

    expect(editor.characters()[1].id).toMatch(new RegExp(`^${DRAFT_TIME}-\\d+$`));
  });

  it('saves no random character on "Abbrechen"', async () => {
    await (await editor.button('Zufälliger Charakter erstellen')).click();
    await (await editor.button('Abbrechen')).click();

    expect(editor.characters()).toEqual([existing]);
    expect(editor.close).toHaveBeenCalledExactlyOnceWith();
  });
});
