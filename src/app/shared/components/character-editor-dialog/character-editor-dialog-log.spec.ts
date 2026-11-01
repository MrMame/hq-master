import { TestBed } from '@angular/core/testing';

import { CharacterInfo } from '../../../core/models/character-info.model';
import { GameLogService } from '../../../core/services/game-log/game-log.service';
import { SESSION_KEYS } from '../../../core/session-state/session-keys';
import { afterStart, createConditionedCharacter } from '../../../core/testing/condition.fixtures';
import {
  CharacterEditorDialogSetup,
  setupCharacterEditorDialog,
} from '../../testing/character-editor-dialog.fixtures';
import {
  conditionCheckbox,
  requireConditionField,
} from '../../testing/character-conditions-editor.fixtures';

const ork: (character: CharacterInfo) => CharacterInfo = (character) => ({
  ...character,
  name: 'Ork',
});

async function setup(character: CharacterInfo): Promise<CharacterEditorDialogSetup> {
  localStorage.setItem(SESSION_KEYS.gameTime, JSON.stringify(afterStart(30).toISOString()));
  return setupCharacterEditorDialog(character, [character]);
}

const logged: () => [string, string, string][] = () =>
  TestBed.inject(GameLogService)
    .entries()
    .map((entry) => [entry.type, entry.gameTime, entry.text]);

describe('CharacterEditorDialog – game log', () => {
  it('logs each set and removed condition at the current game time on "Übernehmen"', async () => {
    const { host, click, button }: CharacterEditorDialogSetup = await setup(
      ork(createConditionedCharacter('a')),
    );

    await click(conditionCheckbox(host, 'Gift'));
    await click(conditionCheckbox(host, 'Blind'));
    await (await button('Übernehmen')).click();

    const now: string = afterStart(30).toISOString();
    expect(logged()).toEqual([
      ['condition-set', now, 'Blind bei Ork gesetzt'],
      ['condition-removed', now, 'Gift bei Ork entfernt'],
    ]);
    expect(TestBed.inject(GameLogService).entries()[0]).toMatchObject({
      characterId: 'a',
      characterName: 'Ork',
      conditionId: 'blind',
    });
  });

  it('logs nothing when only the values of a condition change', async () => {
    const { host, fill, button }: CharacterEditorDialogSetup = await setup(
      ork(createConditionedCharacter('a')),
    );

    await fill(requireConditionField(host, 'Gift Schaden je Wirkmoment'), '3');
    await (await button('Übernehmen')).click();

    expect(logged()).toEqual([]);
  });

  it('logs nothing on "Abbrechen"', async () => {
    const { host, click, button }: CharacterEditorDialogSetup = await setup(
      ork(createConditionedCharacter('a', [])),
    );

    await click(conditionCheckbox(host, 'Gift'));
    await (await button('Abbrechen')).click();

    expect(logged()).toEqual([]);
  });

  it('logs the conditions of a new character as set', async () => {
    const { host, click, button, enter }: CharacterEditorDialogSetup =
      await setupCharacterEditorDialog(null);

    await enter('Name', 'Lyra');
    await click(host.querySelector<HTMLElement>('[aria-label="Bild 1"]')!);
    await click(conditionCheckbox(host, 'Gift'));
    await (await button('Übernehmen')).click();

    expect(logged().map(([, , text]) => text)).toEqual(['Gift bei Lyra gesetzt']);
  });
});
