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

  it('shows Ruestung including a card equipped in the draft and saves it on apply (6 → 8)', async () => {
    const setup: CharacterEditorDialogSetup = await setupEquippedEditor(inventoryDeck());
    await equipInDraft(setup);

    expect(ruestung(setup)).toBe('8');
    await (await setup.button('Übernehmen')).click();
    expect(setup.characters()[0].Ruestung).toBe(8);
  });

  it('saves exactly the value entered while a card is equipped in the draft', async () => {
    const setup: CharacterEditorDialogSetup = await setupEquippedEditor(inventoryDeck());
    await equipInDraft(setup);
    await setup.enter('Ruestung', '5');
    await (await setup.button('Übernehmen')).click();

    expect(setup.characters()[0].Ruestung).toBe(5);
  });

  it('shows Ruestung without a card discarded in the draft and keeps it on cancel', async () => {
    const setup: CharacterEditorDialogSetup = await setupEquippedEditor();
    await discardInViewer(setup, 'Runenrüstung');

    expect(ruestung(setup)).toBe('4');
    await (await setup.button('Abbrechen')).click();
    expect(setup.characters()[0].Ruestung).toBe(6);
  });
});
