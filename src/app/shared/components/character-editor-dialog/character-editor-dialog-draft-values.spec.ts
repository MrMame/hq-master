import { DeckState } from '../../../core/models/deck-state.model';
import { inventoryCard, RUNE_ARMOR } from '../../../core/testing/deck.fixtures';
import {
  CharacterEditorDialogSetup,
  editorField,
} from '../../testing/character-editor-dialog.fixtures';
import {
  discardInViewer,
  equippedDeck,
  renderCardViewer,
  setupEquippedEditor,
  statBonus,
  viewButton,
  viewerAction,
} from '../../testing/character-equipment.fixtures';

/** Barbar (Ruestung 6) mit der Runenrüstung (Ruestung +2) im Inventar statt am Körper. */
function inventoryDeck(): DeckState {
  const deck: DeckState = equippedDeck();
  return {
    ...deck,
    assigned: deck.assigned.filter((entry) => entry.card !== RUNE_ARMOR),
    inventory: [inventoryCard(RUNE_ARMOR, 'a')],
  };
}

async function equipInDraft(setup: CharacterEditorDialogSetup): Promise<void> {
  const overlay: HTMLElement = await renderCardViewer();
  await setup.click(viewButton(setup.host, 'Runenrüstung'));
  await setup.click(viewerAction(overlay, 'Anlegen›')!);
  await setup.click(viewerAction(overlay, 'Kopf')!);
}

describe('CharacterEditorDialog – draft values', () => {
  const ruestung: (setup: CharacterEditorDialogSetup) => string = (setup) =>
    (editorField(setup.host, 'Ruestung') as HTMLInputElement).value;

  it('shows the base value and the card bonus equipped in the draft and saves the total on apply (6 → 8)', async () => {
    const setup: CharacterEditorDialogSetup = await setupEquippedEditor(inventoryDeck());
    await equipInDraft(setup);

    expect(ruestung(setup)).toBe('6');
    expect(statBonus(setup.host, 'Ruestung')?.textContent?.trim()).toBe('+2 = 8');
    await (await setup.button('Übernehmen')).click();
    expect(setup.characters()[0].Ruestung).toBe(8);
  });

  it('saves the entered base value plus the bonus of a card equipped in the draft', async () => {
    const setup: CharacterEditorDialogSetup = await setupEquippedEditor(inventoryDeck());
    await equipInDraft(setup);
    await setup.enter('Ruestung', '5');
    expect(statBonus(setup.host, 'Ruestung')?.textContent?.trim()).toBe('+2 = 7');
    await (await setup.button('Übernehmen')).click();

    expect(setup.characters()[0].Ruestung).toBe(7);
  });

  it('shows Ruestung without a card discarded in the draft and keeps it on cancel', async () => {
    const setup: CharacterEditorDialogSetup = await setupEquippedEditor();
    await discardInViewer(setup, 'Runenrüstung');

    expect(ruestung(setup)).toBe('4');
    expect(statBonus(setup.host, 'Ruestung')).toBeNull();
    await (await setup.button('Abbrechen')).click();
    expect(setup.characters()[0].Ruestung).toBe(6);
  });
});
