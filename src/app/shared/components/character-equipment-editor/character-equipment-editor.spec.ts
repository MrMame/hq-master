import { createTestCharacter } from '../../../core/testing/character.fixtures';
import {
  CharacterEditorDialogSetup,
  setupCharacterEditorDialog,
} from '../../testing/character-editor-dialog.fixtures';
import {
  discardButton,
  equipmentRows,
  setupEquippedEditor,
  statBonus,
} from '../../testing/character-equipment.fixtures';

// Über den Editor gerendert; „Übernehmen“/„Abbrechen“ prüft character-editor-dialog-equipment.spec.ts.
describe('CharacterEquipmentEditor', () => {
  it('lists all slots with card name and image, empty ones as "frei"', async () => {
    const { host }: CharacterEditorDialogSetup = await setupEquippedEditor();

    expect(host.querySelector('fieldset legend')?.textContent).toContain('Ausrüstung');
    expect(equipmentRows(host)).toEqual([
      'Kopf frei',
      'Körper Runenrüstung Ablegen',
      'Linke Hand Turmschild Ablegen',
      'Rechte Hand frei',
      'Amulett frei',
    ]);
    expect(host.querySelector<HTMLImageElement>('.equipment-editor__image')?.src).toContain(
      'cards/e1.svg',
    );
  });

  it('shows a discarded card as free and drops its bonus before applying', async () => {
    const { host, click }: CharacterEditorDialogSetup = await setupEquippedEditor();

    await click(discardButton(host, 'Runenrüstung'));

    expect(equipmentRows(host)[1]).toBe('Körper frei');
    expect(statBonus(host, 'maxArmor')).toBeNull();
    expect(statBonus(host, 'defense')?.textContent?.trim()).toBe('+2 = 6');
  });

  it('shows all slots as free for a character without equipment', async () => {
    const { host }: CharacterEditorDialogSetup = await setupCharacterEditorDialog(
      createTestCharacter('a'),
    );
    expect(equipmentRows(host).every((row) => row.endsWith('frei'))).toBe(true);
  });
});
