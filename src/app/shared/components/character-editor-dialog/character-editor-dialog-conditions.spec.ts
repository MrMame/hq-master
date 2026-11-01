import { CharacterInfo } from '../../../core/models/character-info.model';
import { SESSION_KEYS } from '../../../core/session-state/session-keys';
import {
  afterStart,
  createConditionedCharacter,
  createTestCondition,
} from '../../../core/testing/condition.fixtures';
import {
  CharacterEditorDialogSetup,
  setupCharacterEditorDialog,
} from '../../testing/character-editor-dialog.fixtures';
import {
  conditionCheckbox,
  requireConditionField,
} from '../../testing/character-conditions-editor.fixtures';

function setup(character: CharacterInfo, elapsed: number): Promise<CharacterEditorDialogSetup> {
  localStorage.setItem(SESSION_KEYS.gameTime, JSON.stringify(afterStart(elapsed).toISOString()));
  return setupCharacterEditorDialog(character, [character]);
}

describe('CharacterEditorDialog – conditions', () => {
  it('starts a newly checked condition at the current game time on "Übernehmen"', async () => {
    const { host, click, button, characters, close }: CharacterEditorDialogSetup = await setup(
      createConditionedCharacter('a', []),
      30,
    );

    await click(conditionCheckbox(host, 'Gift'));
    await (await button('Übernehmen')).click();

    const [stored]: CharacterInfo[] = characters();
    expect(stored.conditions).toEqual([
      expect.objectContaining({
        id: 'poison',
        intervalSeconds: 60,
        damagePerTick: 1,
        durationSeconds: 600,
        startedAt: afterStart(30).toISOString(),
        lastTickAt: afterStart(30).toISOString(),
      }),
    ]);
    expect(close).toHaveBeenCalledExactlyOnceWith(stored);
  });

  it('keeps start and last tick of an active condition whose values changed', async () => {
    const active: CharacterInfo = createConditionedCharacter('a', [
      createTestCondition({ lastTickAt: afterStart(60).toISOString() }),
    ]);
    const { host, fill, button, characters }: CharacterEditorDialogSetup = await setup(active, 90);

    await fill(requireConditionField(host, 'Gift Schaden je Wirkmoment'), '3');
    await (await button('Übernehmen')).click();

    expect(characters()[0].conditions).toEqual([
      createTestCondition({ damagePerTick: 3, lastTickAt: afterStart(60).toISOString() }),
    ]);
  });

  it('removes an active condition that has already expired with its new duration', async () => {
    const { host, fill, button, characters }: CharacterEditorDialogSetup = await setup(
      createConditionedCharacter('a'),
      150,
    );

    await fill(requireConditionField(host, 'Gift Dauer Minuten'), '2');
    await (await button('Übernehmen')).click();

    expect(characters()[0].conditions).toEqual([]);
  });

  it('removes an unchecked condition on "Übernehmen"', async () => {
    const { host, click, button, characters }: CharacterEditorDialogSetup = await setup(
      createConditionedCharacter('a'),
      10,
    );

    await click(conditionCheckbox(host, 'Gift'));
    await (await button('Übernehmen')).click();

    expect(characters()[0].conditions).toEqual([]);
  });

  it('discards all condition changes on "Abbrechen"', async () => {
    const original: CharacterInfo = createConditionedCharacter('a');
    const { host, click, button, characters }: CharacterEditorDialogSetup = await setup(
      original,
      10,
    );

    await click(conditionCheckbox(host, 'Gift'));
    await click(conditionCheckbox(host, 'Blind'));
    await (await button('Abbrechen')).click();

    expect(characters()).toEqual([original]);
  });
});
