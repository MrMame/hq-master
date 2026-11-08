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

/** Bonus-Teil der Aufschlüsselung (`+2`), farbig je Vorzeichen. */
function bonusPart(host: HTMLElement, stat: string): Element | null | undefined {
  return statBonus(host, stat)?.querySelector('.character-editor__bonus');
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
    expect(bonusPart(host, 'Tempo')?.classList).not.toContain('character-editor__bonus--negative');
  });

  it('marks a negative bonus apart from the positive one', async () => {
    const { host }: CharacterEditorDialogSetup = await setupEquippedEditor();

    expect(statBonus(host, 'Tempo')?.textContent?.trim()).toBe('−1 = 4');
    expect(bonusPart(host, 'Tempo')?.classList).toContain('character-editor__bonus--negative');
  });

  it('shows the base value of Ruestung in the field and the card bonus with the stored total', async () => {
    const { host }: CharacterEditorDialogSetup = await setupEquippedEditor();

    expect((editorField(host, 'Ruestung') as HTMLInputElement).value).toBe('4');
    expect(editorField(host, 'Ruestung').classList).toContain('character-editor__input--base');
    expect(statBonus(host, 'Ruestung')?.textContent?.trim()).toBe('+2 = 6');
    expect(statBonus(host, 'Ruestung')?.title).toBe('Runenrüstung +2');
    expect(statBonus(host, 'Leben')).toBeNull();
    expect(editorField(host, 'Leben').classList).not.toContain('character-editor__input--base');
    expect(editorField(host, 'Tempo').closest('label')?.textContent?.trim()).toBe('Tempo');
  });

  it('marks the effective value and the bonus separately', async () => {
    const { host }: CharacterEditorDialogSetup = await setupEquippedEditor();
    const breakdown: HTMLElement = statBonus(host, 'Ruestung')!;

    expect(breakdown.querySelector('.character-editor__bonus')?.textContent).toBe('+2');
    expect(breakdown.querySelector('.character-editor__effective')?.textContent).toBe('6');
  });

  it('updates the total while the base value of Ruestung is edited', async () => {
    const { host, enter }: CharacterEditorDialogSetup = await setupEquippedEditor();

    await enter('Ruestung', '-2');

    expect(statBonus(host, 'Ruestung')?.textContent?.trim()).toBe('+2 = 0');
    expect(editorField(host, 'Ruestung').classList).toContain('ng-valid');
  });

  it('rejects a base value whose total would fall below 0', async () => {
    const { host, enter, button }: CharacterEditorDialogSetup = await setupEquippedEditor();

    await enter('Ruestung', '-3');

    expect(editorField(host, 'Ruestung').classList).toContain('ng-invalid');
    expect(await (await button('Übernehmen')).isDisabled()).toBe(true);
  });

  it('keeps an empty field empty instead of showing the bonus as base', async () => {
    const { host, enter }: CharacterEditorDialogSetup = await setupEquippedEditor();

    await enter('Ruestung', '');

    expect((editorField(host, 'Ruestung') as HTMLInputElement).value).toBe('');
    expect(statBonus(host, 'Ruestung')).toBeNull();
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
