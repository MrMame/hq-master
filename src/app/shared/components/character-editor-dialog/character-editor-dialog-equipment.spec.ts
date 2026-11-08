import { TestBed } from '@angular/core/testing';

import { CardManagerService } from '../../../core/services/card-deck/card-manager.service';
import { GameLogService } from '../../../core/services/game-log/game-log.service';
import { DeckState } from '../../../core/models/deck-state.model';
import { RUNE_ARMOR } from '../../../core/testing/deck.fixtures';
import {
  CharacterEditorDialogSetup,
  editorField,
} from '../../testing/character-editor-dialog.fixtures';
import {
  discardInViewer,
  EQUIPPED_BARBARIAN,
  setupEquippedEditor,
} from '../../testing/character-equipment.fixtures';

describe('CharacterEditorDialog – equipment', () => {
  const deck: () => DeckState = () => TestBed.inject(CardManagerService).state();
  const logTexts: () => string[] = () =>
    TestBed.inject(GameLogService)
      .entries()
      .map((entry) => entry.text);

  it('discards the card from the viewer on apply, lowers Ruestung by its value and logs it (6 → 4)', async () => {
    const setup: CharacterEditorDialogSetup = await setupEquippedEditor();
    const { button, characters, close } = setup;

    await discardInViewer(setup, 'Runenrüstung');
    // Bis zum Übernehmen liegt die Karte noch am Charakter.
    expect(deck().assigned).toHaveLength(2);
    await (await button('Übernehmen')).click();

    expect(deck().decks[0].discardPile).toEqual([RUNE_ARMOR]);
    expect(deck().assigned.map((entry) => entry.card.name)).toEqual(['Turmschild']);
    expect(characters()[0]).toMatchObject({ Ruestung: 4, Tempo: 5 });
    expect(logTexts()).toEqual(['Barbar legt Runenrüstung ab']);
    expect(close).toHaveBeenCalledWith(characters()[0]);
  });

  it('keeps the card on cancel', async () => {
    const setup: CharacterEditorDialogSetup = await setupEquippedEditor();
    const { button, characters } = setup;

    await discardInViewer(setup, 'Runenrüstung');
    await (await button('Abbrechen')).click();

    expect(deck().assigned).toHaveLength(2);
    expect(deck().decks[0].discardPile).toEqual([]);
    expect(characters()[0]).toEqual(EQUIPPED_BARBARIAN);
  });

  it('saves an entered Ruestung value without upper limit while the card stays', async () => {
    const { host, enter, button, characters }: CharacterEditorDialogSetup =
      await setupEquippedEditor();

    await enter('Ruestung', '9');
    expect((editorField(host, 'Ruestung') as HTMLInputElement).value).toBe('9');
    await (await button('Übernehmen')).click();

    expect(characters()[0]).toMatchObject({ Ruestung: 9 });
    expect(logTexts()).toEqual([]);
  });
});
