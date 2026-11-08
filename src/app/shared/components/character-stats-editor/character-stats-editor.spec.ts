import { Card } from '../../../core/models/card.model';
import { DeckState } from '../../../core/models/deck-state.model';
import { createTestCharacter } from '../../../core/testing/character.fixtures';
import { assignedCard, createPropertyCard } from '../../../core/testing/deck.fixtures';
import {
  CharacterEditorDialogSetup,
  editorField,
  setupCharacterEditorDialog,
} from '../../testing/character-editor-dialog.fixtures';
import {
  equippedDeck,
  setupEquippedEditor,
  statBonus,
} from '../../testing/character-equipment.fixtures';

/** Barbar mit Stiefeln (Tempo +2) statt der Ausrüstung aus `equippedDeck`. */
function bootsDeck(): DeckState {
  const boots: Card = createPropertyCard('e9', 'Stiefel', [{ name: 'Tempo', value: 2 }]);
  return { ...equippedDeck(), assigned: [assignedCard(boots, 'a', 'body')] };
}

// Über den Editor als Formular-Host gerendert, wie der Abschnitt „Zustände“.
describe('CharacterStatsEditor', () => {
  it('offers only Leben, Ruestung and Tempo as fields', async () => {
    const { host }: CharacterEditorDialogSetup = await setupEquippedEditor();
    const captions: string[] = Array.from(
      host.querySelectorAll('.character-editor__stats .character-editor__caption'),
      (caption) => caption.textContent?.trim() ?? '',
    );
    expect(captions).toEqual(['Leben', 'Ruestung', 'Tempo']);
  });

  it('shows base value, bonus and effective value for Tempo changed by equipment', async () => {
    const { host }: CharacterEditorDialogSetup = await setupEquippedEditor(bootsDeck());

    expect((editorField(host, 'Tempo') as HTMLInputElement).value).toBe('5');
    expect(statBonus(host, 'Tempo')?.textContent?.trim()).toBe('+2 = 7');
    expect(statBonus(host, 'Tempo')?.title).toBe('Stiefel +2');
    expect(statBonus(host, 'Tempo')?.classList).not.toContain('character-editor__bonus--negative');
  });

  it('colours a negative bonus red', async () => {
    const { host }: CharacterEditorDialogSetup = await setupEquippedEditor();

    expect(statBonus(host, 'Tempo')?.textContent?.trim()).toBe('−1 = 4');
    expect(statBonus(host, 'Tempo')?.classList).toContain('character-editor__bonus--negative');
  });

  it('shows no bonus for Leben and Ruestung and keeps the field name plain', async () => {
    const { host }: CharacterEditorDialogSetup = await setupEquippedEditor();

    expect(statBonus(host, 'Leben')).toBeNull();
    expect(statBonus(host, 'Ruestung')).toBeNull();
    expect(editorField(host, 'Tempo').closest('label')?.textContent?.trim()).toBe('Tempo');
  });

  it('updates the effective value while the base value is edited', async () => {
    const { host, enter }: CharacterEditorDialogSetup = await setupEquippedEditor(bootsDeck());

    await enter('Tempo', '7');

    expect(statBonus(host, 'Tempo')?.textContent?.trim()).toBe('+2 = 9');
  });

  it('shows no bonus at all without equipment', async () => {
    const { host }: CharacterEditorDialogSetup = await setupCharacterEditorDialog(
      createTestCharacter('a'),
    );
    expect(host.querySelector('.character-editor__bonus')).toBeNull();
  });
});
