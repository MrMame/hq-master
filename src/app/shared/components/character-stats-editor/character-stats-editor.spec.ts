import { createTestCharacter } from '../../../core/testing/character.fixtures';
import {
  CharacterEditorDialogSetup,
  editorField,
  setupCharacterEditorDialog,
} from '../../testing/character-editor-dialog.fixtures';
import { setupEquippedEditor, statBonus } from '../../testing/character-equipment.fixtures';

// Über den Editor als Formular-Host gerendert, wie der Abschnitt „Zustände“.
describe('CharacterStatsEditor', () => {
  it('shows base value, bonus and effective value for stats changed by equipment', async () => {
    const { host }: CharacterEditorDialogSetup = await setupEquippedEditor();

    expect((editorField(host, 'Max. Rüstung') as HTMLInputElement).value).toBe('4');
    expect(statBonus(host, 'maxArmor')?.textContent?.trim()).toBe('+2 = 6');
    expect(statBonus(host, 'defense')?.textContent?.trim()).toBe('+2 = 6');
    expect(statBonus(host, 'defense')?.title).toBe('Turmschild +2');
  });

  it('colours a positive bonus green and a negative one red', async () => {
    const { host }: CharacterEditorDialogSetup = await setupEquippedEditor();

    expect(statBonus(host, 'defense')?.classList).not.toContain(
      'character-editor__bonus--negative',
    );
    expect(statBonus(host, 'speed')?.textContent?.trim()).toBe('−1 = 4');
    expect(statBonus(host, 'speed')?.classList).toContain('character-editor__bonus--negative');
  });

  it('shows no bonus for stats without equipment and keeps the field name plain', async () => {
    const { host }: CharacterEditorDialogSetup = await setupEquippedEditor();

    expect(statBonus(host, 'attack')).toBeNull();
    expect(statBonus(host, 'armor')).toBeNull();
    expect(editorField(host, 'Max. Rüstung').closest('label')?.textContent?.trim()).toBe(
      'Max. Rüstung',
    );
  });

  it('updates the effective value while the base value is edited', async () => {
    const { host, enter }: CharacterEditorDialogSetup = await setupEquippedEditor();

    await enter('Abwehr', '7');

    expect(statBonus(host, 'defense')?.textContent?.trim()).toBe('+2 = 9');
  });

  it('shows no bonus at all without equipment', async () => {
    const { host }: CharacterEditorDialogSetup = await setupCharacterEditorDialog(
      createTestCharacter('a'),
    );
    expect(host.querySelector('.character-editor__bonus')).toBeNull();
  });
});
