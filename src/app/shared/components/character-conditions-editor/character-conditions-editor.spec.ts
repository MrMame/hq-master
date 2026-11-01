import { SESSION_KEYS } from '../../../core/session-state/session-keys';
import { CharacterInfo } from '../../../core/models/character-info.model';
import { afterStart, createConditionedCharacter } from '../../../core/testing/condition.fixtures';
import {
  CharacterEditorDialogSetup,
  setupCharacterEditorDialog,
} from '../../testing/character-editor-dialog.fixtures';
import {
  conditionCheckbox,
  conditionField,
  requireConditionField,
} from '../../testing/character-conditions-editor.fixtures';

/** Rendert den Editor (als Formular-Host) für `character` zur Spielzeit 12:00:00 + `elapsed`. */
function setup(character: CharacterInfo, elapsed: number = 0): Promise<CharacterEditorDialogSetup> {
  localStorage.setItem(SESSION_KEYS.gameTime, JSON.stringify(afterStart(elapsed).toISOString()));
  return setupCharacterEditorDialog(character, [character]);
}

const fieldValue: (host: HTMLElement, label: string) => string = (host, label) =>
  requireConditionField(host, label).value;

describe('CharacterConditionsEditor', () => {
  it('shows one unchecked checkbox per template without value fields', async () => {
    const { host }: CharacterEditorDialogSetup = await setup(createConditionedCharacter('a', []));

    for (const label of ['Gift', 'Benommen', 'Blind']) {
      expect(conditionCheckbox(host, label).checked).toBe(false);
    }
    expect(conditionField(host, 'Gift Dauer Minuten')).toBeNull();
  });

  it('copies the template values when a condition is checked', async () => {
    const { host, click }: CharacterEditorDialogSetup = await setup(
      createConditionedCharacter('a', []),
    );

    await click(conditionCheckbox(host, 'Gift'));

    expect(conditionCheckbox(host, 'Gift').checked).toBe(true);
    expect(fieldValue(host, 'Gift Intervall Minuten')).toBe('1');
    expect(fieldValue(host, 'Gift Intervall Sekunden')).toBe('0');
    expect(fieldValue(host, 'Gift Schaden je Wirkmoment')).toBe('1');
    expect(fieldValue(host, 'Gift Dauer Minuten')).toBe('10');
    expect(fieldValue(host, 'Gift Beschreibung')).toContain('jede Minute');
    // Noch nicht gestartet: keine Restdauer.
    expect(host.querySelector('[data-testid="condition-remaining"]')).toBeNull();
  });

  it('shows the remaining time of an active condition', async () => {
    const { host }: CharacterEditorDialogSetup = await setup(createConditionedCharacter('a'), 150);

    expect(conditionCheckbox(host, 'Gift').checked).toBe(true);
    expect(host.querySelector('[data-testid="condition-remaining"]')?.textContent?.trim()).toBe(
      'noch 7:30',
    );
  });

  it('shows "unbegrenzt" for a duration of 0', async () => {
    const { host, fill }: CharacterEditorDialogSetup = await setup(createConditionedCharacter('a'));

    await fill(requireConditionField(host, 'Gift Dauer Minuten'), '0');

    expect(host.querySelector('[data-testid="condition-remaining"]')?.textContent?.trim()).toBe(
      'noch unbegrenzt',
    );
  });

  it('removes the value fields when a condition is unchecked', async () => {
    const { host, click }: CharacterEditorDialogSetup = await setup(
      createConditionedCharacter('a'),
    );

    await click(conditionCheckbox(host, 'Gift'));

    expect(conditionCheckbox(host, 'Gift').checked).toBe(false);
    expect(conditionField(host, 'Gift Dauer Minuten')).toBeNull();
  });

  it('restarts with the template values when checked again', async () => {
    const { host, click, fill }: CharacterEditorDialogSetup = await setup(
      createConditionedCharacter('a'),
      60,
    );
    await fill(requireConditionField(host, 'Gift Schaden je Wirkmoment'), '5');

    await click(conditionCheckbox(host, 'Gift'));
    await click(conditionCheckbox(host, 'Gift'));

    expect(fieldValue(host, 'Gift Schaden je Wirkmoment')).toBe('1');
    expect(host.querySelector('[data-testid="condition-remaining"]')).toBeNull();
  });

  it.each<[string, string]>([
    ['seconds above 59', '75'],
    ['a negative value', '-1'],
    ['a fraction', '1.5'],
    ['an empty field', ''],
  ])('locks "Übernehmen" for %s', async (_case, value) => {
    const { host, fill, button }: CharacterEditorDialogSetup = await setup(
      createConditionedCharacter('a'),
    );

    await fill(requireConditionField(host, 'Gift Intervall Sekunden'), value);

    expect(await (await button('Übernehmen')).isDisabled()).toBe(true);
    // Die ungültige Eingabe bleibt sichtbar.
    expect(fieldValue(host, 'Gift Intervall Sekunden')).toBe(value);
  });

  it('keeps "Übernehmen" enabled with valid values', async () => {
    const { host, fill, button }: CharacterEditorDialogSetup = await setup(
      createConditionedCharacter('a'),
    );

    await fill(requireConditionField(host, 'Gift Intervall Sekunden'), '59');

    expect(await (await button('Übernehmen')).isDisabled()).toBe(false);
  });
});
