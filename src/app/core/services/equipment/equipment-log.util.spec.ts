import { equipmentEntry } from './equipment-log.util';
import { createTestCharacter } from '../../testing/character.fixtures';
import { RUNE_ARMOR } from '../../testing/deck.fixtures';
import { CharacterInfo } from '../../models/character-info.model';

describe('equipmentEntry', () => {
  const character: CharacterInfo = { ...createTestCharacter('a'), name: 'Barbar der Rote' };
  const now: Date = new Date(2381, 0, 1, 12, 0, 0);

  it('describes an assignment with the slot', () => {
    expect(equipmentEntry(character, RUNE_ARMOR, 'body', now)).toEqual({
      type: 'equipment-assigned',
      gameTime: now.toISOString(),
      characterId: 'a',
      characterName: 'Barbar der Rote',
      text: 'Barbar der Rote erhält Runenrüstung (Körper)',
    });
  });

  it('describes discarding a card', () => {
    expect(equipmentEntry(character, RUNE_ARMOR, null, now)).toMatchObject({
      type: 'equipment-removed',
      text: 'Barbar der Rote legt Runenrüstung ab',
    });
  });
});
