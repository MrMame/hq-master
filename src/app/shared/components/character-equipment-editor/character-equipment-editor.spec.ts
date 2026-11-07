import { TestBed } from '@angular/core/testing';

import { createTestCharacter } from '../../../core/testing/character.fixtures';
import { CardViewerService } from '../../services/card-viewer.service';
import {
  CharacterEditorDialogSetup,
  setupCharacterEditorDialog,
} from '../../testing/character-editor-dialog.fixtures';
import {
  discardInViewer,
  equipmentRows,
  renderCardViewer,
  setupEquippedEditor,
  statBonus,
  viewButton,
  viewerAction,
} from '../../testing/character-equipment.fixtures';

// Über den Editor gerendert; „Übernehmen“/„Abbrechen“ prüft character-editor-dialog-equipment.spec.ts.
describe('CharacterEquipmentEditor', () => {
  const location: (overlay: HTMLElement) => string | undefined = (overlay) =>
    overlay.querySelector('[data-testid="card-viewer-location"]')?.textContent?.trim();

  it('lists all slots with card name and image, empty ones as "frei"', async () => {
    const { host }: CharacterEditorDialogSetup = await setupEquippedEditor();

    expect(host.querySelector('fieldset legend')?.textContent).toContain('Ausrüstung');
    expect(equipmentRows(host)).toEqual([
      'Kopf frei',
      'Körper Runenrüstung',
      'Linke Hand Turmschild',
      'Rechte Hand frei',
      'Amulett frei',
    ]);
    expect(host.querySelector<HTMLImageElement>('.equipment-editor__image')?.src).toContain(
      'cards/e1.svg',
    );
    expect(host.textContent).not.toContain('Ablegen');
  });

  it('opens a card in the viewer in draft mode with only the draft action', async () => {
    const setup: CharacterEditorDialogSetup = await setupEquippedEditor();
    const overlay: HTMLElement = await renderCardViewer();

    await setup.click(viewButton(setup.host, 'Turmschild'));

    expect(TestBed.inject(CardViewerService).viewed()?.context.mode).toBe('draft');
    expect(location(overlay)).toBe('Testdeck · Barbar · Linke Hand');
    expect(
      Array.from(overlay.querySelectorAll('[role="menuitem"]')).map((item) =>
        item.textContent?.trim(),
      ),
    ).toEqual(['In den Ablagestapel legen']);
  });

  it('shows a card discarded in the viewer as pending and its slot as free', async () => {
    const setup: CharacterEditorDialogSetup = await setupEquippedEditor();
    const overlay: HTMLElement = await discardInViewer(setup, 'Runenrüstung');

    expect(location(overlay)).toBe('Testdeck · wird abgelegt');
    expect(viewerAction(overlay, 'In den Ablagestapel legen')).toBeUndefined();
    expect(equipmentRows(setup.host)[1]).toBe('Körper frei');
    expect(statBonus(setup.host, 'maxArmor')).toBeNull();
    expect(statBonus(setup.host, 'defense')?.textContent?.trim()).toBe('+2 = 6');
  });

  it('shows all slots as free for a character without equipment', async () => {
    const { host }: CharacterEditorDialogSetup = await setupCharacterEditorDialog(
      createTestCharacter('a'),
    );
    expect(equipmentRows(host).every((row) => row.endsWith('frei'))).toBe(true);
  });
});
